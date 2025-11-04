import fetch from "node-fetch";
import chalk from "chalk";

export async function list() {
  const GITHUB_OWNER = "TayoAdepetu";
  const GITHUB_REPO = "Koras-ui";
  const BRANCH = "master";

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/components/src?ref=${BRANCH}`;
  console.log(chalk.cyan("📦 Fetching component list..."));

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/vnd.github.v3+json" },
    });

    if (!res.ok) {
      console.error(chalk.red("❌ Unable to fetch component list."));
      process.exit(1);
    }

    const files = await res.json();
    const dirs = files.filter((f) => f.type === "dir");

    if (dirs.length === 0) {
      console.log(chalk.yellow("No components found."));
      return;
    }

    console.log(chalk.bold("\nAvailable components:\n"));
    dirs.forEach((dir) => console.log(`- ${chalk.green(dir.name)}`));
    console.log("");
  } catch (err) {
    console.error(chalk.red("Error fetching list:"), err);
  }
}
