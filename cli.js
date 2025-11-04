#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("koras-ui")
  .description("Koras UI component CLI")
  .version("1.1.0");

// --- Register commands ---
program
  .command("init")
  .description("Setup Tailwind for Koras UI")
  .action(async () => {
    await init();
  });

program
  .command("add <component>")
  .description("Add a Koras UI component to your project")
  .action(async (component) => {
    await add(component);
  });

program
  .command("list")
  .description("List all available components")
  .action(async () => {
    await list();
  });

// --- Parse CLI args ---
program.parse(process.argv);
