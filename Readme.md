# 🌈 Koras UI CLI

A lightweight component scaffolding CLI, inspired by [shadcn/ui](https://ui.shadcn.com/), that lets you add prebuilt Koras UI components—or even your own components—into your React or Next.js project instantly.

```bash
npx koras-ui add button
```

> Fetches component files directly from GitHub, ShadCN UI, or from a local directory and installs them into your project under `components/ui/` or `src/components/ui/`.

---

## Features

- **Add UI components instantly** via a single command
- **Fetch Koras UI components** from the default GitHub repo
- **Fetch ShadCN components** via `registry.json` (`--owner shadcn --repo ui`)
- **Fetch components** from any public GitHub repository (`--owner`, `--repo`, `--branch`)
- **Import components** from a local folder (`--local`)
- **Supports multi-file components** (TSX, CSS, TS, etc.)
- **Automatic creation** of helper utilities (`lib/utils.ts`)
- **Auto-installs** required dependencies (`clsx`, `tailwind-merge`)
- **Dynamic listing** of available components from Koras UI, ShadCN UI, or any GitHub repo

---

## 🚀 Getting Started

### 1. Use directly via NPX

You can use the CLI without installing it globally:

```bash
npx koras-ui add button
```

### 2. Install globally (optional)

```bash
npm install -g koras-ui
```

Then run:

```bash
koras-ui add button
```

---

## CLI Commands

### `add <component>`

Add a component to your project.

```bash
npx koras-ui add <component>
```

#### Default Example (Koras UI repo)

```bash
npx koras-ui add button
```

**This will:**
- Fetch all files from: `https://github.com/TayoAdepetu/Koras-ui/tree/master/components/ui/button`
- Detect if your project uses a `src` folder
- Copy files into the correct location
- Create `lib/utils.ts` if missing
- Install missing dependencies automatically

**Result (no src folder):**

```
components/
  ui/
    button/
      index.tsx
      button.css
```

**Result (with src folder):**

```
src/
  components/
    ui/
      button/
        index.tsx
        button.css
```

---

### Fetching ShadCN Components

Koras UI now supports importing official ShadCN components using their `registry.json`.

**Fetch a ShadCN component:**

```bash
npx koras-ui add alert --owner shadcn --repo ui --branch main
```

This uses ShadCN's `registry.json` to resolve the actual file paths.

- No need to know where ShadCN stores files
- Supports multi-file ShadCN components
- Works with any ShadCN fork

---

### Fetching from ANY GitHub Repo

You are **not limited to Koras UI or ShadCN**.

#### Example: Fetch from someone else's library

```bash
npx koras-ui add button --owner JohnDoe --repo my-ui-library
```

Fetches from:

```
https://github.com/JohnDoe/my-ui-library/tree/main/components/ui/button
```

#### Example: Use a different branch

```bash
npx koras-ui add card --branch dev
```

#### Example: Use owner, repo, and branch at once

```bash
npx koras-ui add modal --owner coder123 --repo awesome-ui --branch next
```

#### Use Case

You can reuse components from past projects, starter kits, open-source libraries, etc.

---

### Import Components From a Local Directory (`--local`)

You can import a file directly from your computer:

```bash

# Works with forward slashes
npx koras-ui add NeutralButton.tsx --local C:/Users/User/projects/old-app/src/components/Common/Buttons/NeutralButton.tsx

# Works with backslashes too
npx koras-ui add NeutralButton.js --local C:\Users\User\projects\old-app\src\components\Common\Buttons\NeutralButton.js

```

You can import a folder directly from your computer:

```bash

# Works with forward slashes
npx koras-ui add Buttons --local C:/Users/User/projects/old-app/src/components/Common/Buttons

# Works with backslashes too
npx koras-ui add Buttons --local C:\Users\User\projects\old-app\src\components\Common\Buttons

```

- Works offline
- Copies the entire folder
- Perfect for reusing personal components

**Example:**

```bash
npx koras-ui add card --local ../MyPortfolio2024/src/components/card
```

---

### `list`

List available components.

```bash
npx koras-ui list
```

#### List from Koras UI (default)

```
Available components:
- button
- card
- dialog
- input
```

#### List ShadCN components

```bash
npx koras-ui list --owner shadcn --repo ui
```

This lists all components found in ShadCN's `registry.json`.

#### List from ANY GitHub repo

```bash
npx koras-ui list --owner JohnDoe --repo my-ui-library
```

---

## Options Summary

| Option | Description | Example |
|--------|-------------|---------|
| `--owner` | GitHub username or org | `--owner shadcn` |
| `--repo` | GitHub repository name | `--repo ui` |
| `--branch` | Branch to fetch from | `--branch main` |
| `--local` | Import from local folder | `--local ../components/button` |

---

## 🧑‍💻 For Open-Source Contributors

### Project Setup

Clone the CLI:

```bash
git clone https://github.com/TayoAdepetu/Koras-ui.git
cd koras-ui
npm install
```

Run locally:

```bash
node cli.js list
node cli.js add button
```

Link globally:

```bash
npm link
koras-ui list
koras-ui add button
```

---

### Component Repository Structure

```
components/
  ui/
    button/
      index.tsx
      styles.css
    card/
      index.tsx
```

When you run:

```bash
npx koras-ui add button
```

Koras UI fetches:

```
components/ui/button/*
```

---

### CLI Project Structure

```
koras-ui/
├── cli.js
├── commands/
│   ├── add.js
│   ├── list.js
│   └── init.js
├── package.json
└── README.md
```

---

## Example Workflow

```bash
npx koras-ui add card
npx koras-ui add dialog --branch dev
npx koras-ui add alert --owner shadcn --repo ui
npx koras-ui add input --owner Someone --repo their-ui-library
npx koras-ui add table --local ../my-old-project/src/components/table
```

---

## Roadmap

- [ ] Component dependency support
- [ ] `koras.config.json` for global defaults
- [ ] Custom output directories
- [ ] Interactive component picker (UI)
- [ ] Version pinning (`koras-ui@1.3.0`)
- [ ] Local caching for faster installs

---

## 🧑‍🤝‍🧑 Contributing

We welcome contributions!

### For component development:

1. Fork the [components repo](https://github.com/TayoAdepetu/Koras-ui)
2. Add a new folder inside `components/ui/<component>`
3. Submit a PR

### For CLI development:

1. Fork [this repo](https://github.com/TayoAdepetu/Koras-ui)
2. Add or improve commands
3. Test using `npm link`
4. Submit a PR

---

## License

**MIT © Koras UI**

You may copy, modify, and distribute this software with attribution.

---

## Links

- **GitHub Components Repo** → [https://github.com/TayoAdepetu/Koras-ui/tree/master/components/ui](https://github.com/TayoAdepetu/Koras-ui/tree/master/components/ui)
- **CLI GitHub Repo** → [https://github.com/TayoAdepetu/Koras-ui](https://github.com/TayoAdepetu/Koras-ui)
- **NPM Package** → [https://www.npmjs.com/package/koras-ui](https://www.npmjs.com/package/koras-ui)

---

<p align="center">Made with ❤️ by the Koras UI team</p>