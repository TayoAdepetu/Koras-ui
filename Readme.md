# 🌈 Koras UI CLI

A lightweight component scaffolding CLI, inspired by [shadcn/ui](https://ui.shadcn.com/), that lets you add prebuilt Koras UI components—or even your own components—into your React or Next.js project instantly.

```bash
npx koras-ui add button
```

> Fetches component files directly from GitHub or from a local directory and installs them into your project under `components/ui/` or `src/components/ui/`.

---

## ✨ Features

- **Add UI components instantly** via a single command
- **Fetch components** from any public GitHub repository
- **Import components** from a local folder (`--local`)
- **Supports multi-file components** (TSX, CSS, TS, etc.)
- **Customizable source repo** (`--owner`, `--repo`, `--branch`)
- **List available components** dynamically
- **Automatic creation** of helper utilities (`cn`)
- **Auto-installs** required dependencies (`clsx`, `tailwind-merge`)

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

## 🧭 CLI Commands

### `add <component>`

Add a component into your project.

```bash
npx koras-ui add <component>
```

#### Default Example (Koras UI repo)

```bash
npx koras-ui add button
```

**This will:**
- Fetch all files from: `https://github.com/TayoAdepetu/Koras-ui/tree/main/components/src/button`
- Detect if your project uses a `src` folder
- Copy files into the correct location
- Ensure `lib/utils.ts` exists
- Install missing dependencies

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

### Advanced: Fetch from ANY GitHub repo

You are **not limited to Koras UI**.  
You can fetch components from any public GitHub repository.

#### Example: Use someone else's component repo

```bash
npx koras-ui add button --owner JohnDoe --repo my-ui-library
```

This fetches from:

```
https://github.com/JohnDoe/my-ui-library/tree/main/components/src/button
```

#### Example: Use a different branch

```bash
npx koras-ui add card --branch dev
```

#### Example: Different owner + repo + branch at once

```bash
npx koras-ui add modal --owner coder123 --repo awesome-ui --branch next
```

#### Use Case

You already have UI components from previous projects or other OSS libraries—you can reuse them instantly without copy/paste.

---

### Import Components From a Local Directory (`--local`)

If you have components stored on your machine, import them directly:

```bash
npx koras-ui add navbar --local C:/projects/old-app/src/components/navbar
```

**Works with:**
- Absolute paths
- Relative paths
- Multi-file directories
- No GitHub
- No internet
- No constraints
- Perfect for reusing personal components

#### Example Use Case

You have a project named "MyPortfolio2024" containing a nice card component:

```bash
npx koras-ui add card --local ../MyPortfolio2024/src/components/card
```

That's it.

---

### `list`

List available components from any GitHub repository:

```bash
npx koras-ui list
```

**From Koras UI (default repo):**

```
Available components:
- button
- card
- dialog
- input
```

**From another repo:**

```bash
npx koras-ui list --owner JohnDoe --repo my-ui-library
```

---

## ⚙️ Options Summary

| Option | Description | Example |
|--------|-------------|---------|
| `--owner` | GitHub username or org | `--owner JohnDoe` |
| `--repo` | GitHub repository name | `--repo my-ui` |
| `--branch` | Branch to fetch from | `--branch dev` |
| `--local` | Import from local folder instead of GitHub | `--local ./path/to/component` |

---

## 🧑‍💻 For Open-Source Contributors

### Project Setup

Clone the CLI project:

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

Components live under:

```
components/
  src/
    button/
      index.tsx
      styles.css
    card/
      index.tsx
```

When running:

```bash
npx koras-ui add button
```

The CLI fetches:

```
components/src/button/*
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

## ⚡ Example Workflow

```bash
npx koras-ui add card
npx koras-ui add dialog --branch dev
npx koras-ui add input --owner Someone --repo their-ui-library
npx koras-ui add table --local ../my-old-project/src/components/table
```

---

## 💡 Roadmap

- [ ] Component dependency support
- [ ] `koras.config.json` for global defaults
- [ ] Custom output directories
- [ ] Interactive UI (pick components from a menu)
- [ ] Version pinning (`koras-ui@1.3.0`)
- [ ] Local caching for faster installs

---

## 🧑‍🤝‍🧑 Contributing

We welcome contributions!

### For components:

1. Fork the [components repo](https://github.com/TayoAdepetu/Koras-ui)
2. Add a new folder inside `components/src/<component>`
3. Submit a PR

### For CLI development:

1. Fork [this repo](https://github.com/TayoAdepetu/Koras-ui)
2. Add/improve commands
3. Test using `npm link`
4. Submit a PR

---

## ⚖️ License

**MIT © Koras UI**

You may copy, modify, and distribute this software with attribution.

---

## 📞 Links

- **GitHub Components Repo** → [https://github.com/TayoAdepetu/Koras-ui/tree/main/components/src](https://github.com/TayoAdepetu/Koras-ui/tree/main/components/src)
- **CLI GitHub Repo** → [https://github.com/TayoAdepetu/Koras-ui](https://github.com/TayoAdepetu/Koras-ui)
- **NPM Package** → [https://www.npmjs.com/package/koras-ui](https://www.npmjs.com/package/koras-ui)

---

<p align="center">Made with ❤️ by the Koras UI team</p>