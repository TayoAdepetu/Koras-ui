# 🌈 Koras UI CLI

A lightweight component scaffolding CLI, inspired by [shadcn/ui](https://ui.shadcn.com/), that lets you add prebuilt Koras UI components into your React or Next.js project instantly.

```bash
npx koras-ui add button
```

> 💡 Fetches component files directly from the Koras UI GitHub repository and installs them locally under your `components/ui/` or `src/components/ui/` folder.

---

## ✨ Features

- 🧱 **Add UI components instantly** via a single command
- ☁️ **Fetches files directly from GitHub** (always up to date)
- 📂 **Supports multi-file components** (TSX, CSS, TS, etc.)
- 🧩 **List all available components** dynamically
- 🛠️ **Developer-friendly structure** (open for contributions)

---

## 🚀 Getting Started

### 1. Install or use directly via NPX

You can use the CLI without installing globally (ensure you have created your React app):

```bash
npx koras-ui add button
```

Or install it globally:

```bash
npm install -g koras-ui
```

Then you can run:

```bash
koras-ui add button
```

---

## 🧭 CLI Commands

### 📦 `add <component>`

Add a Koras UI component into your project.

```bash
npx koras-ui add <component>
```

**Example:**

```bash
npx koras-ui add button
```

✅ **This will:**
- Fetch all files from `https://github.com/TayoAdepetu/Koras-ui/tree/master/components/ui/button`
- Detect if your project uses a src folder
- Create a folder: `components/ui/button/`
- If the project uses a src folder, put the created folder inside it
- Copy all `.tsx`, `.css`, and `.ts` files there

**Result (if your project uses no src folder):**

```
components/
  ui/
    button/
      index.tsx
      button.css
```

**Result (if your project uses a src folder):**

```
src/
  components/
    ui/
      button/
        index.tsx
        button.css
```

---

### 📋 `list`

List all available components from the Koras UI GitHub repository.

```bash
npx koras-ui list
```

**Output:**

```
📦 Fetching component list...

Available components:
- button
- card
- dialog
- input
```

---

## ⚙️ Options (Coming Soon)

| Option | Description | Example |
|--------|-------------|---------|
| `--branch` | Fetch component from a specific branch or tag | `npx koras-ui add button --branch dev` |
| `--dir` | Change output directory | `npx koras-ui add button --dir src/components/ui` |

> These will be available in future versions.

---

## 🧑‍💻 For Open-Source Contributors

### 🏗️ Project Setup

Clone the CLI project:

```bash
git clone https://github.com/TayoAdepetu/Koras-ui.git
cd koras-ui
npm install
```

Run the CLI locally:

```bash
node cli.js list
node cli.js add button
```

Or link it globally (for development testing):

```bash
npm link
koras-ui list
koras-ui add button
```

---

### 🧩 Component Repository Structure

The components are hosted in a separate repository:  
👉 [Koras UI Components Repo](https://github.com/TayoAdepetu/Koras-ui/tree/master/components)

Each component should live under `ui/` like so:

```
ui/
  button/
    index.tsx
    button.css
  card/
    index.tsx
  dialog/
    dialog.tsx
    dialog-content.tsx
```

When users run `npx koras-ui add button`, the CLI fetches all files inside `ui/button/` from this repository.

---

### 📁 CLI Project Structure

```
koras-ui/
├── cli.js            # Main CLI entry file
├── package.json      # NPM config and CLI binary
├── README.md         # Documentation
└── (optional) commands/
    ├── add.js        # Future modular command version
    └── list.js
```

---

## ⚡ Example Use Case

Developer runs:

```bash
npx koras-ui add card
```

CLI fetches:

```
https://github.com/TayoAdepetu/Koras-ui/tree/master/components/ui/card
```

It saves locally:

```
components/ui/card/index.tsx
```

Developer imports and uses it:

```tsx
import { Card } from "@/components/ui/card"

export default function Example() {
  return <Card>My Example Card</Card>
}
```

---

## 💡 Roadmap

- [ ] Add support for component dependencies (auto-install peer deps)
- [ ] Add config file (`koras.config.json`)
- [ ] Add support for custom output directories
- [ ] Add interactive setup (choose components from a list)
- [ ] Add version pinning (`koras-ui@v1.2.0`)
- [ ] Improve error handling and caching

---

## 🧑‍🤝‍🧑 Contributing

We welcome contributions! 🙌

### To add or update a component:

1. Fork the [components repository](https://github.com/TayoAdepetu/Koras-ui/tree/master/components)
2. Add your component under `ui/<component-name>/`
3. Submit a Pull Request

### To contribute to the CLI itself:

1. Fork this repository ([koras-ui](https://github.com/TayoAdepetu/Koras-ui))
2. Add or improve a command
3. Test with `npm link`
4. Submit a Pull Request

---

## ⚖️ License

**MIT © Koras UI**

You are free to use, modify, and distribute this CLI and its components with attribution.

---

## 📞 Links

- [Koras UI Components Repository](https://github.com/TayoAdepetu/Koras-ui/tree/master/components)
- [npm Package](https://www.npmjs.com/package/koras-ui)
- [Report Issues](https://github.com/TayoAdepetu/Koras-ui/issues)

---

<p align="center">Made with ❤️ by the Koras UI team</p>