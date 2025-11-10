import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export async function init() {
    console.log(chalk.cyan("Checking for Tailwind setup..."));

    const hasTailwind = fs.existsSync("tailwind.config.js");
    const hasPostCSS = fs.existsSync("postcss.config.js");

    // Install Tailwind and dependencies if missing
    if (!hasTailwind) {
        console.log(chalk.yellow("Installing Tailwind CSS..."));
        execSync("npm install -D tailwindcss postcss autoprefixer", {
            stdio: "inherit",
        });

        console.log(chalk.yellow("Generating Tailwind config..."));
        execSync("npx tailwindcss init -p", { stdio: "inherit" });
    }

    // Modify tailwind.config.js content paths
    const configPath = path.resolve("tailwind.config.js");
    if (fs.existsSync(configPath)) {
        let content = fs.readFileSync(configPath, "utf8");

        if (!content.includes("content:")) {
            content = content.replace(
                /module\.exports\s*=\s*{?/,
                `module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],`
            );
            fs.writeFileSync(configPath, content);
            console.log(chalk.green("Added content paths to tailwind.config.js"));
        }
    }

    // Add globals.css if missing
    const stylesDir = path.resolve("src/styles");
    if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });

    const cssFile = path.join(stylesDir, "globals.css");
    if (!fs.existsSync(cssFile)) {
        fs.writeFileSync(
            cssFile,
            `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Koras UI base styles */
:root {
  --radius: 0.5rem;
}`
        );
        console.log(chalk.green("Created src/styles/globals.css"));
    }

    console.log(chalk.green("\n Koras UI initialized successfully!"));
    console.log(chalk.white(`
Next steps:
1. Import your styles in your app:
   import "@/styles/globals.css"

2. Start adding components:
   npx koras-ui add button
`));
}
