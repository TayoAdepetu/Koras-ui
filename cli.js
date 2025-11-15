#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("koras-ui")
  .description("Koras UI component CLI")
  .version("1.3.0");

// koras-ui init
program
  .command("init")
  .description("Setup TailwindCSS for Koras UI")
  .action(async () => {
    await init();
  });

// koras-ui add <component>
program
  .command("add <component>")
  .description("Add a UI component to your project")
  .option("--from <source>", "get component from shadcn")
  .option("--owner <owner>", "GitHub repo owner")
  .option("--repo <repo>", "GitHub repo name")
  .option("--branch <branch>", "GitHub branch name")
  .option("--local <path>", "Local folder to import a component from")
  .action(async (component, options) => {
    await add(component, options);
  });

// koras-ui list
program
  .command("list")
  .description("List available components")
  .option("--from <source>", "get component from shadcn")
  .option("--owner <owner>", "GitHub repo owner")
  .option("--repo <repo>", "GitHub repo name")
  .option("--branch <branch>", "GitHub branch name")
  .action(async (options) => {
    await list(options);
  });

program.parse(process.argv);
