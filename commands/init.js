import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export async function init() {
  console.log(chalk.cyan("Checking for Tailwind setup..."));

  const hasTailwind = fs.existsSync("tailwind.config.js");
  const hasPostCSS = fs.existsSync("postcss.config.js");

  // 1. Install Tailwind if missing
  if (!hasTailwind) {
    console.log(chalk.yellow("Installing Tailwind CSS..."));
    execSync("npm install -D tailwindcss postcss autoprefixer", {
      stdio: "inherit",
    });

    console.log(chalk.yellow("Generating Tailwind config..."));
    execSync("npx tailwindcss init -p", { stdio: "inherit" });
  }

  // 2. Patch Tailwind content paths safely
  const configPath = path.resolve("tailwind.config.js");
  if (fs.existsSync(configPath)) {
    let config = fs.readFileSync(configPath, "utf8");

    const contentPaths = [
      `"./src/**/*.{js,ts,jsx,tsx}"`,
      `"./components/**/*.{js,ts,jsx,tsx}"`,
      `"./ui/**/*.{js,ts,jsx,tsx}"`,
    ];

    // Detect CJS or ESM
    const isESM = config.includes("export default");

    if (!config.includes("./src/") && !config.includes("./components/")) {
      const updated = config.replace(
        /content:\s*\[[^\]]*\]/,
        `content: [\n    ${contentPaths.join(",\n    ")}\n  ]`
      );

      fs.writeFileSync(configPath, updated);
      console.log(chalk.green("Updated Tailwind content paths"));
    }
  }

  // 3. Ensure globals.css exists
  const stylesDir = path.resolve("src/styles");
  fs.mkdirSync(stylesDir, { recursive: true });

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

  console.log(chalk.green("\n✔ Koras UI initialized successfully!\n"));
  console.log(chalk.white(`
Next steps:
1. Import global styles in your main file:
   import "@/styles/globals.css";

2. Add your first component:
   npx koras-ui add button
`));
}
