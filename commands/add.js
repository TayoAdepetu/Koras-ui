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
 Ensure lib/utils.ts exists
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
 Case-insensitive path resolver
---------------------------- */
function resolveCaseInsensitive(targetPath) {
  const normalized = path.normalize(targetPath);
  const parts = normalized.split(path.sep);

  let currentPath = parts[0] + path.sep;
  for (let i = 1; i < parts.length; i++) {
    const segment = parts[i];
    if (!fs.existsSync(currentPath)) return null;

    const entries = fs.readdirSync(currentPath);
    const match = entries.find(
      (entry) => entry.toLowerCase() === segment.toLowerCase()
    );

    if (!match) return null;
    currentPath = path.join(currentPath, match);
  }
  return currentPath;
}

/* ----------------------------
 Resolve alias (from package.json)
---------------------------- */
function resolveAlias(aliasName) {
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const aliases = pkg.aliases || {};

    if (!aliases[aliasName]) return null;

    const aliasValue = aliases[aliasName].trim();

    // Detect local paths (start with ., /, or Windows drive letter)
    if (
      aliasValue.startsWith(".") ||
      aliasValue.startsWith("/") ||
      /^[A-Za-z]:[\\/]/.test(aliasValue)
    ) {
      return { type: "local", value: aliasValue };
    }

    // Detect GitHub aliases (pattern: user/repo[/optional/path])
    const githubPattern = /^[\w-]+\/[\w.-]+(\/.*)?$/;
    if (githubPattern.test(aliasValue)) {
      return { type: "github", value: aliasValue };
    }

    // Otherwise fallback to local
    return { type: "local", value: aliasValue };
  } catch {
    return null;
  }
}

/* ----------------------------
 ADD COMMAND (supports ShadCN, Aliases, Local, GitHub)
---------------------------- */
export async function add(component, options = {}) {
  const fromSource = options.from || options.local;

  /* --- Handle alias first --- */
  if (fromSource && !options.local && !options.owner) {
    const aliasTarget = resolveAlias(fromSource);
    if (aliasTarget) {
      if (aliasTarget.type === "github") {
        const parts = aliasTarget.value.split("/");
        const [owner, repo, ...rest] = parts;
        const repoPath = rest.join("/");
        options.owner = owner;
        options.repo = repo;
        options.path = repoPath;
        console.log(chalk.cyan(`Using alias "${fromSource}" → GitHub repo ${owner}/${repo}/${repoPath}`));
      } else if (aliasTarget.type === "local") {
        options.local = aliasTarget.value;
        console.log(chalk.cyan(`Using alias "${fromSource}" → local path ${aliasTarget.value}`));
      }
    }
  }

  /* --- Handle ShadCN --- */

  // If owner=shadcn, use registry.json 
  // if (owner.toLowerCase() === "shadcn") { 
  // try { 
  // componentPath = await fetchShadcnPath(component, owner, repo, branch); 
  // } 
  // catch (err) { 
  //   console.error(chalk.red("ShadCN Error:"), err.message); process.exit(1);
  //  } 
  // }

  // async function fetchShadcnPath(component, owner, repo, branch) { 
  // const registryUrl = https://raw.githubusercontent.com/${owner}/${repo}/${branch}/registry.json; 
  // console.log(chalk.cyan("Fetching ShadCN registry...")); 
  // console.log(chalk.dim(registryUrl)); 
  // const res = await fetch(registryUrl); 
  // if (!res.ok) throw new Error("Cannot fetch registry.json"); 
  // const registry = await res.json(); 
  // if (!registry[component]) throw new Error(Component "${component}" not found in ShadCN registry); 
  // return registry[component].path; 
  // }

  if (fromSource && fromSource.toLowerCase() === "shadcn") {
    console.log(chalk.cyan(`Fetching "${component}" from ShadCN via npx...`));

    try {
      // Ensure a minimal components.json exists
      const componentsJsonPath = path.resolve(process.cwd(), "components.json");
      if (!fs.existsSync(componentsJsonPath)) {
        await fs.outputJson(componentsJsonPath, { components: [] }, { spaces: 2 });
        console.log(chalk.green("Created components.json for ShadCN CLI"));
      }

      // Run the ShadCN CLI to add the component
      console.log(chalk.dim(`> npx shadcn@latest add ${component}`));
      execSync(`npx shadcn@latest add ${component}`, { stdio: "inherit" });

      console.log(chalk.green(`Successfully added "${component}" from ShadCN.`));
    } catch (err) {
      console.error(chalk.red(`Failed to add "${component}" from ShadCN.`));
      console.error(chalk.red(err.message));
      console.error(
        chalk.yellow(
          `Tip: Make sure your project is initialized for ShadCN (Tailwind + React). See https://ui.shadcn.com/docs/installation/manual`
        )
      );
    }

    return;
  }

  /* --- Handle local import --- */
  if (options.local) {
    const inputPath = path.normalize(options.local);
    const baseComponentName = component.toLowerCase();

    console.log(chalk.cyan(`Importing from local source: ${inputPath}`));

    let potentialFolder = path.join(inputPath, baseComponentName);
    let resolvedFolder = resolveCaseInsensitive(potentialFolder);

    const extensions = [".tsx", ".ts", ".jsx", ".js"];
    let resolvedFile = null;

    if (!resolvedFolder) {
      for (const ext of extensions) {
        const potentialFile = path.join(inputPath, `${baseComponentName}${ext}`);
        const candidate = resolveCaseInsensitive(potentialFile);
        if (candidate && fs.existsSync(candidate)) {
          resolvedFile = candidate;
          break;
        }
      }
    }

    if (!resolvedFolder && !resolvedFile) {
      console.error(chalk.red("Component not found in the given path."));
      console.error(chalk.red(`   Tried: ${potentialFolder} and file variants`));
      process.exit(1);
    }

    const baseDir = fs.existsSync("src") ? "src" : ".";
    const destDir = path.resolve(`${baseDir}/components/ui/${component}`);

    await fs.ensureDir(destDir);
    if (resolvedFolder) {
      await fs.copy(resolvedFolder, destDir);
    } else if (resolvedFile) {
      const fileName = path.basename(resolvedFile);
      await fs.copy(resolvedFile, path.join(destDir, fileName));
    }

    await ensureUtils(baseDir);
    await ensureDeps();
    console.log(chalk.bold.green(`\nImported "${component}" from local alias into ${destDir}`));
    return;
  }

  /* --- GitHub fetching --- */
  const owner = options.owner || "TayoAdepetu";
  const repo = options.repo || "Koras-ui";
  const branch = options.branch || "master";
  const basePath = options.path || "components/ui";
  const componentPath = `${basePath}/${component}`;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${componentPath}?ref=${branch}`;
  console.log(chalk.cyan(`Fetching "${component}" from GitHub...`));
  console.log(chalk.dim(apiUrl));

  const baseDir = fs.existsSync("src") ? "src" : ".";
  const destinationDir = path.resolve(`${baseDir}/components/ui/${component}`);

  try {
    const res = await fetch(apiUrl, { headers: { Accept: "application/vnd.github.v3+json" } });
    if (!res.ok) {
      console.error(chalk.red(`Component "${component}" not found in:`));
      console.error(chalk.red(`   ${owner}/${repo}@${branch}/${basePath}`));
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
