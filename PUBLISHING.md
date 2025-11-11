✅ Overview

Koras UI uses semantic-release to automate all publishing.

This means:

✅ No npm version
✅ No npm publish
✅ Versions are created automatically
✅ Releases are generated from commit messages
✅ Stable + beta + next channels are supported

✅ Branch Structure
Branch	        Purpose	npm Tag
master	        Stable production releases	latest
beta	        Public beta testing	beta
experimental	Experimental / nightly builds	next

✅ Commit Message Rules

Semantic-release uses Conventional Commits:

Types
Type	Meaning
feat:	new feature → minor bump
fix:	bug fix → patch bump
perf:	performance fix → patch
BREAKING CHANGE:	major release
docs:	documentation only
refactor:	code cleanup

Examples
feat(button): add loading state
fix(card): border radius mismatch
refactor(cli): simplify add() function
perf(utils): reduce bundle size


Major release example:

feat: new API for components

BREAKING CHANGE: old API removed

✅ Release Channels
✅ Stable release (master)

When you merge to master, the CI will:

bump version

publish to latest tag

create GitHub release

update CHANGELOG.md

✅ Beta releases

Merge into beta:

git checkout beta
git merge feature/my-change
git push


This will publish to npm as:

1.5.0-beta.1


Installable via:

npm install koras-ui@beta

✅ Next / nightly releases

Push to next:

git checkout experimental
git merge feature/my-experiment
git push


Publish as:

1.6.0-next.1


Installable via:

npm install koras-ui@next

✅ Manual Testing Without Publishing

Install directly from GitHub:

npm install github:TayoAdepetu/Koras-ui#beta

✅ Creating a New Component Release

Make component changes

Commit using Conventional Commit format

Push to the appropriate branch

CI automatically publishes

You do NOT run:

✗ npm version
✗ npm publish

All publishing is automated.

✅ Viewing Release History

Semantic-release updates:

CHANGELOG.md

GitHub Releases

npm versions