# Koras UI CLI

A flexible, lightweight CLI for scaffolding and reusing React/Next.js UI components — from Koras UI, ShadCN, any GitHub repo, or your local filesystem.

```bash
npx koras-ui add button
```

Instantly installs a component into:

```
src/components/ui/<component>/
```

or

```
components/ui/<component>/
```

Automatically:

- Creates `lib/utils.ts`
- Installs `clsx` + `tailwind-merge`
- Detects project structure
- Supports aliases
- Fetches from GitHub or local paths
- Works with ShadCN (`npx shadcn@latest` integration)

---

## Installation

### Option 1 — Use via NPX (Recommended)

```bash
npx koras-ui add button
```

### Option 2 — Install Globally

```bash
npm install -g koras-ui
koras-ui add button
```

---

## 1️⃣ Retrieve Components from Koras UI (Default)

Basic usage:

```bash
npx koras-ui add button
```

This fetches:

```
TayoAdepetu/Koras-ui/components/ui/button (master branch)
```

and installs it inside:

```
components/ui/button/
```

What happens automatically:

- Copies source files
- Creates `lib/utils.ts` if missing
- Installs missing deps (`clsx`, `tailwind-merge`)

---

## 2️⃣ Retrieve Components from ShadCN

Koras UI can install official ShadCN components with:

```bash
npx koras-ui add alert --from shadcn
```

Internally runs:

```bash
npx shadcn@latest add alert
```

- Works even if ShadCN is not installed globally
- Uses your local ShadCN installation if it exists

---

## 3️⃣ Retrieve Components from Local Paths

Use the `--local` flag with relative or absolute file/folder paths.

**Copy from a folder:**

```bash
npx koras-ui add Button --local ../my-app/src/components
```

**Copy from a single file:**

```bash
npx koras-ui add Card --local C:/Projects/ui
```

Features:

- Works with `/` or `\`
- Case-insensitive matching
- Works offline
- Supports file + folder imports from any folder on your device
- Automatically detects and append the file extension imported

---

## 4️⃣ Retrieve from Any GitHub Repository

You can fetch from any GitHub repo using:

```bash
npx koras-ui add button --owner JohnDoe --repo ui-kit
```

This fetches from:

```
https://github.com/JohnDoe/ui-kit/tree/master/components/ui/button
```

**Specify a branch (optional):**

```bash
npx koras-ui add card --owner JohnDoe --repo ui-kit --branch develop
```

If `--branch` is not specified, the CLI defaults to `master`.

---

## 5️⃣ Using Aliases (Local + GitHub)

Aliases let you define reusable shortcuts inside your `package.json`.

### Step 1 — Add aliases to `package.json`

```json
{
  "aliases": {
    "britmo": "../MyPortfolio/src/components",
    "timo": "./my/custom/ui",
    "remoto": "codingnninja/MyUIRepo/components"
  }
}
```

**Supported alias targets:**

| Alias Type | Example | Description |
|------------|---------|-------------|
| Local folder | `"britmo": "../MyPortfolio/src/components"` | Import from your computer |
| Relative path | `"timo": "./local/ui"` | Import folders inside your project |
| GitHub repo | `"remoto": "codingnninja/MyUIRepo/components"` | Import from GitHub |

### Step 2 — Use the alias when adding a component

**Local alias:**

```bash
npx koras-ui add Button --from britmo
```

**GitHub alias:**

```bash
npx koras-ui add Card --from remoto
```

**Relative project alias:**

```bash
npx koras-ui add Modal --from timo
```

### Alias Resolution Order

When you run:

```bash
npx koras-ui add Button --from britmo
```

Koras UI checks in this order:

1. Local path exists? → use it
2. GitHub repo format (`username/repo/...`)? → fetch from GitHub
3. Fallback to local fetch

This makes aliases:

- Flexible
- Cross-platform
- Portable
- Easy to manage

GitHub aliases also default to the `master` branch unless you provide `--branch`.

---

## Flags Summary

| Flag | Description | Example |
|------|-------------|---------|
| `--owner` | GitHub username | `--owner JohnDoe` |
| `--repo` | Repository name | `--repo ui-kit` |
| `--branch` | Branch name (defaults to `master`) | `--branch dev` |
| `--local` | Import from local filesystem | `--local ../components/button` |
| `--from` | Use alias or special source (`shadcn`) | `--from britmo` |

---

## Example Project Structure

**Before:**

```
src/
  components/
```

**After running:**

```bash
npx koras-ui add card
```

**You get:**

```
src/
  components/
    ui/
      card/
        index.tsx
```

---

## For Contributors

Clone:

```bash
git clone https://github.com/TayoAdepetu/Koras-ui.git
cd koras-ui
npm install
```

Run locally:

```bash
node cli.js add button
```

Link globally:

```bash
npm link
koras-ui add card
```

---

## Roadmap

- ShadCN deep integration
- Local + GitHub imports
- Alias system
- Global config file (`koras.config.json`)
- Interactive component picker
- Version pinning / caching
- Component dependency resolver

---

## 🤝 Contributing

We welcome contributions to:

- Add new components
- Improve the CLI
- Fix issues
- Propose ideas

---

## License

**MIT © Koras UI**

Free for personal & commercial use.

---

## 🌍 Links

- **Components Repo**: [TayoAdepetu/Koras-ui](https://github.com/TayoAdepetu/Koras-ui)
- **CLI Repo**: [TayoAdepetu/Koras-ui](https://github.com/TayoAdepetu/Koras-ui)
- **NPM Package**: [koras-ui](https://www.npmjs.com/package/koras-ui)

<p align="center">Made with ❤️ by the <b>Koras UI</b> team</p>