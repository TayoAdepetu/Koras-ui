# Koras UI Release Process

## Overview

Koras UI uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate all publishing.

**This means:**

- No `npm version`
- No `npm publish`
- Versions are created automatically
- Releases are generated from commit messages
- Stable + beta + experimental channels are supported

---

## Branch Structure

| Branch | Purpose | npm Tag |
|--------|---------|---------|
| `master` | Stable production releases | `latest` |
| `beta` | Public beta testing | `beta` |
| `experimental` | Experimental / nightly builds | `experimental` |

---

## Commit Message Rules

Semantic-release uses [Conventional Commits](https://www.conventionalcommits.org/):

### Types

| Type | Meaning |
|------|---------|
| `feat:` | New feature → minor bump |
| `fix:` | Bug fix → patch bump |
| `perf:` | Performance fix → patch |
| `BREAKING CHANGE:` | Major release |
| `docs:` | Documentation only |
| `refactor:` | Code cleanup |

### Examples

```bash
feat(button): add loading state
fix(card): border radius mismatch
refactor(cli): simplify add() function
perf(utils): reduce bundle size
```

### Major release example:

```bash
feat: new API for components

BREAKING CHANGE: old API removed
```

---

## Release Channels

### Stable release (`master`)

When you merge to `master`, the CI will:

1. Bump version
2. Publish to `latest` tag
3. Create GitHub release
4. Update `CHANGELOG.md`

---

### Beta releases

Merge into `beta`:

```bash
git checkout beta
git merge feature/my-change
git push
```

This will publish to npm as:

```
1.5.0-beta.1
```

**Installable via:**

```bash
npm install koras-ui@beta
```

---

### Experimental / nightly releases

Push to `experimental`:

```bash
git checkout experimental
git merge feature/my-experiment
git push
```

**Publish as:**

```
1.6.0-experimental.1
```

**Installable via:**

```bash
npm install koras-ui@experimental
```

---

## Manual Testing Without Publishing

Install directly from GitHub:

```bash
npm install github:TayoAdepetu/Koras-ui#beta
```

---

## Creating a New Component Release

1. Make component changes
2. Commit using Conventional Commit format
3. Push to the appropriate branch
4. CI automatically publishes

**You do NOT run:**

```bash
✗ npm version
✗ npm publish
```

**All publishing is automated.**

---

## Viewing Release History

Semantic-release updates:

- `CHANGELOG.md`
- [GitHub Releases](https://github.com/TayoAdepetu/Koras-ui/releases)
- npm versions

---

## Workflow Diagram

```
feature branch
    ↓
    merge to master → semantic-release → npm publish (latest)
    ↓
    merge to beta → semantic-release → npm publish (beta)
    ↓
    merge to experimental → semantic-release → npm publish (experimental)
```

---

## Best Practices

1. **Always use conventional commits** - This determines the version bump
2. **Test in beta first** - Before promoting to stable
3. **Use `BREAKING CHANGE:`** - When making incompatible API changes
4. **Write clear commit messages** - They become your changelog
5. **Never manually publish** - Let CI handle it

---

## Troubleshooting

### My commit didn't trigger a release

Check if your commit message follows the conventional format:
- Must start with `feat:`, `fix:`, etc.
- Must have a scope or description

### How do I force a specific version?

You don't. Semantic-release determines versions automatically based on commits. If you need a major release, use `BREAKING CHANGE:` in your commit message.

### Can I skip CI for a commit?

Yes, add `[skip ci]` to your commit message:

```bash
docs: update README [skip ci]
```

---

## Links

- **Conventional Commits** → [https://www.conventionalcommits.org](https://www.conventionalcommits.org)
- **Semantic Release** → [https://github.com/semantic-release/semantic-release](https://github.com/semantic-release/semantic-release)
- **npm Package** → [https://www.npmjs.com/package/koras-ui](https://www.npmjs.com/package/koras-ui)
- **GitHub Repository** → [https://github.com/TayoAdepetu/Koras-ui](https://github.com/TayoAdepetu/Koras-ui)

---

<p align="center">Made with ❤️ by the Koras UI team</p>