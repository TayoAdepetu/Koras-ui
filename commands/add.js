import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";

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

  if (missing.length === 0) return;

  console.log(chalk.yellow(`Installing dependencies: ${missing.join(", ")}`));

  const useYarn = fs.existsSync("yarn.lock");
  const usePnpm = fs.existsSync("pnpm-lock.yaml");

  let cmd = useYarn
    ? `yarn add ${missing.join(" ")}`
    : usePnpm
    ? `pnpm add ${missing.join(" ")}`
    : `npm install ${missing.join(" ")}`;

  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(chalk.green("Dependencies installed."));
  } catch {
    console.log(chalk.red("Failed automatic install. Run manually:"));
    console.log(chalk.white(`   ${cmd}`));
  }
}

async function ensureUtils(baseDir) {
  const utilsPath = path.resolve(`${baseDir}/lib/utils.ts`);

  if (fs.existsSync(utilsPath)) return;

  console.log(chalk.cyan(`Adding helper: ${baseDir}/lib/utils.ts`));

  const content = `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

  await fs.outputFile(utilsPath, content);
  console.log(chalk.green("Added utils.ts helper"));
}


export async function add(component, options = {}) {
  // 1. LOCAL OVERRIDE
  if (options.local) {
    const sourcePath = path.resolve(options.local);
    const hasSrc = fs.existsSync(path.resolve("src"));
    const baseDir = hasSrc ? "src" : ".";
    const destPath = path.resolve(`${baseDir}/components/ui/${component}`);

    console.log(chalk.cyan(`📦 Importing "${component}" from local folder...`));

    if (!fs.existsSync(sourcePath)) {
      console.error(chalk.red(`Local path does not exist:`));
      console.error(chalk.red(`   ${sourcePath}`));
      process.exit(1);
    }

    await fs.copy(sourcePath, destPath);
    console.log(chalk.green(`Imported component from ${sourcePath}`));

    await ensureUtils(baseDir);
    await ensureDeps();
    return;
  }

  // 2. GITHUB FETCH MODE
  const GITHUB_OWNER = options.owner || "TayoAdepetu";
  const GITHUB_REPO = options.repo || "Koras-ui";
  const BRANCH = options.branch || "master";

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/components/ui/${component}?ref=${BRANCH}`;

  console.log(chalk.cyan(`Fetching "${component}" from GitHub...`));
  console.log(chalk.dim(apiUrl));

  const hasSrcFolder = fs.existsSync(path.resolve("src"));
  const baseDir = hasSrcFolder ? "src" : ".";
  const destinationDir = path.resolve(`${baseDir}/components/ui/${component}`);

  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!res.ok) {
      console.error(chalk.red(` Component "${component}" not found in:`));
      console.error(chalk.red(`   ${GITHUB_OWNER}/${GITHUB_REPO}@${BRANCH}`));
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
