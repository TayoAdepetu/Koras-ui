// init.js
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

function getPackageManager() {
    if (fs.existsSync("yarn.lock")) return "yarn";
    if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
    return "npm";
}

function run(cmd) {
    try {
        execSync(cmd, { stdio: "inherit" });
        return true;
    } catch (err) {
        return false;
    }
}

export async function init() {
    console.log(chalk.cyan("Checking project Tailwind setup..."));

    const hasTW = fs.existsSync("tailwind.config.js");
    const hasPostCSS = fs.existsSync("postcss.config.js");
    const pm = getPackageManager();

    /* ----------------------------
       INSTALL TAILWIND (ShadCN style)
    ---------------------------- */
    if (!hasTW || !hasPostCSS) {
        console.log(chalk.yellow("Installing Tailwind CSS (ShadCN style)..."));

        const installCmd =
            pm === "yarn"
                ? `yarn add -D tailwindcss postcss autoprefixer`
                : pm === "pnpm"
                    ? `pnpm add -D tailwindcss postcss autoprefixer`
                    : `npm install -D tailwindcss postcss autoprefixer`;

        run(installCmd);

        console.log(chalk.yellow("Initializing Tailwind config..."));

        // Attempt normal initialization first
        const tailwindInitOk = run(`${pm} exec tailwindcss init -p`);

        if (!tailwindInitOk) {
            console.log(
                chalk.red("⚠ Failed to run 'tailwindcss init -p'. Creating config manually...")
            );

            // Write fallback tailwind.config.js
            fs.writeFileSync(
                "tailwind.config.js",
                `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`
            );

            // Write fallback postcss.config.js
            fs.writeFileSync(
                "postcss.config.js",
                `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
            );

            console.log(chalk.green("Created fallback Tailwind + PostCSS configs."));
        }
    }

    /* ----------------------------
       ENSURE CORRECT CONTENT PATHS
    ---------------------------- */
    const twPath = path.resolve("tailwind.config.js");
    let tw = fs.readFileSync(twPath, "utf8");

    const requiredContent = `
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  `;

    if (!tw.includes("./src/**/*")) {
        tw = tw.replace(
            /content:\s*\[[\s\S]*?\]/,
            `content: [${requiredContent}]`
        );
        fs.writeFileSync(twPath, tw);
        console.log(chalk.green("Updated Tailwind content paths (ShadCN-compatible)."));
    }

    /* ----------------------------
       CREATE global.css THE SHADCN WAY
    ---------------------------- */
    const stylesDir = "src/styles";
    const globals = path.join(stylesDir, "globals.css");

    await fs.ensureDir(stylesDir);

    if (!fs.existsSync(globals)) {
        fs.writeFileSync(
            globals,
            `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base design tokens */
:root {
  --radius: 0.5rem;
}`
        );

        console.log(chalk.green("Created src/styles/globals.css"));
    }

    console.log(chalk.green("\nKoras UI initialized successfully!"));
    console.log(
        chalk.white(`
Import styles in your app root:
  import "@/styles/globals.css"

You can now run:
  npx koras-ui add alert --from shadcn
`)
    );
}
