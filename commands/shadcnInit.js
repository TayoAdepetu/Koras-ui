// commands/shadcnInit.js
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";

/* ----------------------------
   Detect package manager
---------------------------- */
function getPM() {
  if (fs.existsSync("yarn.lock")) return "yarn";
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  return "npm";
}

function run(command) {
  try {
    execSync(command, { stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}

/* ----------------------------
  Add text once (safe append)
---------------------------- */
function appendIfMissing(file, content) {
  let current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (!current.includes(content.trim())) {
    fs.ensureFileSync(file);
    fs.appendFileSync(file, "\n" + content + "\n");
  }
}

/* ----------------------------
  Update JSON safely
---------------------------- */
function mergeJSON(filepath, data) {
  let existing = {};

  if (fs.existsSync(filepath)) {
    existing = JSON.parse(fs.readFileSync(filepath, "utf8"));
  }

  const merged = { ...existing, ...data };
  fs.writeFileSync(filepath, JSON.stringify(merged, null, 2));
}

/* ----------------------------
      MAIN INIT
---------------------------- */
export async function shadcnInit() {
  console.log(chalk.cyan("\n⚙ Setting up ShadCN UI (manual mode)…\n"));

  const pm = getPM();

  /* ----------------------------
     1. Install ShadCN dependencies
  ---------------------------- */
  const deps = [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "tw-animate-css",
  ];

  console.log(chalk.yellow("Installing ShadCN dependencies…"));

  const installCmd =
    pm === "yarn"
      ? `yarn add ${deps.join(" ")}`
      : pm === "pnpm"
      ? `pnpm add ${deps.join(" ")}`
      : `npm install ${deps.join(" ")}`;

  run(installCmd);

  /* ----------------------------
     2. Ensure tsconfig/jsconfig path aliases
  ---------------------------- */
  const tsconfig = fs.existsSync("tsconfig.json")
    ? "tsconfig.json"
    : fs.existsSync("jsconfig.json")
    ? "jsconfig.json"
    : "tsconfig.json";

  mergeJSON(tsconfig, {
    compilerOptions: {
      baseUrl: ".",
      paths: {
        "@/*": ["./*"],
      },
    },
  });

  console.log(chalk.green("✔ Added ShadCN path aliases"));

  /* ----------------------------
     3. Update globals.css
  ---------------------------- */
  const globalsPath = "src/styles/globals.css";
  fs.ensureFileSync(globalsPath);

  const shadcnStyles = `
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* SHADCN CSS TOKENS */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}
`;

  appendIfMissing(globalsPath, shadcnStyles);
  console.log(chalk.green("✔ Updated globals.css"));

  /* ----------------------------
     4. lib/utils.ts (cn helper)
  ---------------------------- */
  const utilsPath = "src/lib/utils.ts";
  const cnHelper = `
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

  appendIfMissing(utilsPath, cnHelper);
  console.log(chalk.green("✔ Created cn() helper"));

  /* ----------------------------
     5. components.json
  ---------------------------- */
  const componentsJson = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: "src/styles/globals.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    iconLibrary: "lucide",
  };

  mergeJSON("components.json", componentsJson);
  console.log(chalk.green("✔ Created components.json"));

  console.log(chalk.green("\n🎉 ShadCN setup complete!\n"));
  console.log(chalk.white("You can now run:\n  npx koras-ui add alert --from shadcn\n"));
}
