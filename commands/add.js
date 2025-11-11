import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";

/* ----------------------------
 Ensure clsx + tailwind-merge
---------------------------- */
async function ensureDeps() {
  const deps = ["clsx", "tailwind-merge"];
  const missing = deps.filter((d) => {
    try {
      require.resolve(d, { paths: [process.cwd()] });
      return false;
    } catch {
      return true;
    }
  });

  if (!missing.length) return;

  console.log(chalk.yellow(`Installing dependencies: ${missing.join(", ")}`));

  const useYarn = fs.existsSync("yarn.lock");
  const usePnpm = fs.existsSync("pnpm-lock.yaml");

  const cmd = useYarn
    ? `yarn add ${missing.join(" ")}`
    : usePnpm
    ? `pnpm add ${missing.join(" ")}`
    : `npm install ${missing.join(" ")}`;

  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(chalk.green("Installed dependencies"));
  } catch {
    console.log(chalk.red("Failed automatic install. Run manually:"));
    console.log(chalk.white(`   ${cmd}`));
  }
}

/* ----------------------------
 ✅ Ensure lib/utils.ts exists
---------------------------- */
async function ensureUtils(baseDir) {
  const utilsPath = path.resolve(`${baseDir}/lib/utils.ts`);
  if (fs.existsSync(utilsPath)) return;

  const content = `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

  await fs.outputFile(utilsPath, content);
  console.log(chalk.green("Added lib/utils.ts"));
}

/* ----------------------------
 Fetch ShadCN registry.json
---------------------------- */
async function fetchShadcnPath(component, owner, repo, branch) {
  const registryUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/registry.json`;

  console.log(chalk.cyan("Fetching ShadCN registry..."));
  console.log(chalk.dim(registryUrl));

  const res = await fetch(registryUrl);
  if (!res.ok) throw new Error("Cannot fetch registry.json");

  const registry = await res.json();
  if (!registry[component])
    throw new Error(`Component "${component}" not found in ShadCN registry`);

  return registry[component].path;
}

/* ----------------------------
 ADD COMMAND (supports ShadCN)
---------------------------- */
export async function add(component, options = {}) {
  // Local override
  if (options.local) {
    const sourcePath = path.resolve(options.local);
    const baseDir = fs.existsSync("src") ? "src" : ".";
    const destPath = path.resolve(`${baseDir}/components/ui/${component}`);

    console.log(chalk.cyan(`Importing from local folder: ${options.local}`));

    if (!fs.existsSync(sourcePath)) {
      console.error(chalk.red(`Local path not found:`));
      console.error(chalk.red(`   ${sourcePath}`));
      process.exit(1);
    }

    await fs.copy(sourcePath, destPath);
    await ensureUtils(baseDir);
    await ensureDeps();

    console.log(chalk.green(`Imported "${component}" from local folder.`));
    return;
  }

  // GitHub-based fetching
  const owner = options.owner || "TayoAdepetu";
  const repo = options.repo || "Koras-ui";
  const branch = options.branch || "master";

  let componentPath = `components/ui/${component}`;

  // If owner=shadcn, use registry.json
  if (owner.toLowerCase() === "shadcn") {
    try {
      componentPath = await fetchShadcnPath(component, owner, repo, branch);
    } catch (err) {
      console.error(chalk.red("ShadCN Error:"), err.message);
      process.exit(1);
    }
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${componentPath}?ref=${branch}`;

  console.log(chalk.cyan(`Fetching "${component}" from GitHub...`));
  console.log(chalk.dim(apiUrl));

  const baseDir = fs.existsSync("src") ? "src" : ".";
  const destinationDir = path.resolve(`${baseDir}/components/ui/${component}`);

  try {
    const res = await fetch(apiUrl, { headers: { Accept: "application/vnd.github.v3+json" } });
    if (!res.ok) {
      console.error(chalk.red(`Component "${component}" not found in:`));
      console.error(chalk.red(`   ${owner}/${repo}@${branch}`));
      process.exit(1);
    }

    const files = await res.json();
    await fs.ensureDir(destinationDir);

    for (const file of files) {
      if (file.type === "file") {
        const content = await (await fetch(file.download_url)).text();
        await fs.outputFile(path.join(destinationDir, file.name), content);
        console.log(chalk.green(`Added ${file.name}`));
      }
    }

    await ensureUtils(baseDir);
    await ensureDeps();

    console.log(
      chalk.bold.green(`\nInstalled "${component}" into ${baseDir}/components/ui/${component}/`)
    );
  } catch (err) {
    console.error(chalk.red("Error fetching component:"), err.message);
  }
}
