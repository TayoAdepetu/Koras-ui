import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";

export async function add(component) {
    const GITHUB_OWNER = "TayoAdepetu";
    const GITHUB_REPO = "Koras-ui";
    const BRANCH = "master";

    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/components/src/${component}?ref=${BRANCH}`;

    // Detect if the project uses a src folder
    const hasSrcFolder = fs.existsSync(path.resolve("src"));
    const baseDir = hasSrcFolder ? "src" : ".";
    const destinationDir = path.resolve(`${baseDir}/components/ui/${component}`);

    console.log(chalk.cyan(`📦 Fetching "${component}" from Koras UI...`));

    try {
        const res = await fetch(apiUrl, {
            headers: { Accept: "application/vnd.github.v3+json" },
        });

        if (!res.ok) {
            console.error(chalk.red(`❌ Component "${component}" not found in repository.`));
            process.exit(1);
        }

        const files = await res.json();

        if (!Array.isArray(files)) {
            console.error(chalk.red(`❌ "${component}" is not a valid component folder.`));
            process.exit(1);
        }

        await fs.ensureDir(destinationDir);

        // --- Copy all component files ---
        for (const file of files) {
            if (file.type === "file") {
                const fileRes = await fetch(file.download_url);
                const content = await fileRes.text();

                const localPath = path.join(destinationDir, file.name);
                await fs.outputFile(localPath, content);

                console.log(chalk.green(`✅ Added ${file.name}`));
            }
        }

        // --- Add lib/utils.ts if missing ---
        const utilsPath = path.resolve(`${baseDir}/lib/utils.ts`);
        if (!fs.existsSync(utilsPath)) {
            console.log(chalk.cyan(`📦 Adding helper: ${baseDir}/lib/utils.ts`));

            const utilsContent = `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

            await fs.outputFile(utilsPath, utilsContent);
            console.log(chalk.green(`✅ Added ${baseDir}/lib/utils.ts`));
        }

        // --- Ensure dependencies are installed ---
        const deps = ["clsx", "tailwind-merge"];
        const missingDeps = deps.filter((dep) => {
            try {
                require.resolve(dep, { paths: [process.cwd()] });
                return false;
            } catch {
                return true;
            }
        });

        if (missingDeps.length > 0) {
            console.log(chalk.yellow(`⚙️  Installing missing dependencies: ${missingDeps.join(", ")}`));

            // Detect user's package manager
            const useYarn = fs.existsSync("yarn.lock");
            const usePnpm = fs.existsSync("pnpm-lock.yaml");

            let installCmd;
            if (useYarn) installCmd = `yarn add ${missingDeps.join(" ")}`;
            else if (usePnpm) installCmd = `pnpm add ${missingDeps.join(" ")}`;
            else installCmd = `npm install ${missingDeps.join(" ")}`;

            try {
                execSync(installCmd, { stdio: "inherit" });
                console.log(chalk.green(`✅ Installed ${missingDeps.join(", ")}`));
            } catch (err) {
                console.error(chalk.red("❌ Failed to install dependencies automatically. Please run:"));
                console.error(chalk.white(`   ${installCmd}`));
            }
        }

        // --- Done! ---
        console.log(
            chalk.bold.green(`\n✨ "${component}" installed successfully in ${baseDir}/components/ui/${component}/`)
        );

        console.log(chalk.white(`
Next steps:
  1. Make sure Tailwind is configured.
  2. Import and use your component:
     import { Button } from "@/components/ui/button"

  ${chalk.dim("(If your project doesn’t use @ paths, use a relative import instead.)")}
`));

    } catch (err) {
        console.error(chalk.red("Error:"), err);
    }
}
