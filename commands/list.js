import fetch from "node-fetch";
import chalk from "chalk";

export async function list(options = {}) {
  const owner = options.owner || "TayoAdepetu";
  const repo = options.repo || "Koras-ui";
  const branch = options.branch || "master";

  try {
    // If listing ShadCN components
    if (owner.toLowerCase() === "shadcn") {
      const registryUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/registry.json`;

      console.log(chalk.cyan("Fetching ShadCN registry..."));
      const res = await fetch(registryUrl);
      if (!res.ok) throw new Error("Cannot fetch ShadCN registry.json");

      const registry = await res.json();
      const components = Object.keys(registry);

      console.log(chalk.bold("\nAvailable ShadCN components:\n"));
      components.forEach((c) => console.log(`- ${chalk.green(c)}`));
      return;
    }

    // Normal Koras UI / GitHub listing
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/components/ui?ref=${branch}`;

    console.log(chalk.cyan(`Fetching component list from ${owner}/${repo}...`));

    const res = await fetch(url, { headers: { Accept: "application/vnd.github.v3+json" } });
    if (!res.ok) {
      console.error(chalk.red("Unable to fetch component list."));
      return;
    }

    const files = await res.json();
    const dirs = files.filter((f) => f.type === "dir");

    console.log(chalk.bold("\nAvailable components:\n"));
    dirs.forEach((d) => console.log(`- ${chalk.green(d.name)}`));
  } catch (err) {
    console.error(chalk.red("Error fetching list:"), err.message);
  }
}
