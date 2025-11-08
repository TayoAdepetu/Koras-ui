import fetch from "node-fetch";
import chalk from "chalk";

export async function list(options = {}) {
  const GITHUB_OWNER = options.owner || "TayoAdepetu";
  const GITHUB_REPO = options.repo || "Koras-ui";
  const BRANCH = options.branch || "master";

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/components/ui?ref=${BRANCH}`;
  console.log(chalk.cyan("📦 Fetching component list..."));

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/vnd.github.v3+json" },
    });

    if (!res.ok) {
      console.error(chalk.red("❌ Unable to fetch component list."));
      return;
    }

    const files = await res.json();
    const dirs = files.filter((f) => f.type === "dir");

    console.log(chalk.bold("\nAvailable components:\n"));
    dirs.forEach((d) => console.log(`- ${chalk.green(d.name)}`));
  } catch (err) {
    console.error(chalk.red("Error fetching list:"), err);
  }
}
