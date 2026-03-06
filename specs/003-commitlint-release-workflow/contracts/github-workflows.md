# Contract: GitHub Actions Workflows

**Feature**: 003-commitlint-release-workflow

## Workflow: CI (`ci.yml`)

**Trigger**: `pull_request` to main, `push` to main

### Jobs

| Job              | Runner        | Purpose                        | Key Steps                                                                        |
| ---------------- | ------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| `frontend-check` | ubuntu-latest | Lint, typecheck, test frontend | pnpm install → turbo typecheck lint test                                         |
| `cargo-check`    | ubuntu-latest | Compile check all targets      | Install Linux deps → pnpm install → turbo build (app) → cargo check              |
| `cargo-test`     | ubuntu-latest | Run Rust tests                 | Install Linux deps → pnpm install → turbo build (app) → cargo test               |
| `clippy`         | ubuntu-latest | Lint Rust code                 | Install Linux deps → pnpm install → turbo build (app) → cargo clippy -D warnings |
| `rustfmt`        | ubuntu-latest | Check Rust formatting          | cargo fmt --all -- --check                                                       |

**Linux dependencies** (for webkit2gtk/Tauri compilation):

```
libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

**Note**: Rust jobs that require Tauri compilation need the frontend built first (`turbo build` filtered to app package).

---

## Workflow: Prepare Release (`release-prepare.yml`)

**Trigger**: `workflow_dispatch` with `version` input (string: patch | minor | major | explicit semver)

### Input Validation

| Input          | Valid | Example                |
| -------------- | ----- | ---------------------- |
| `patch`        | Yes   | 0.1.0 → 0.1.1          |
| `minor`        | Yes   | 0.1.0 → 0.2.0          |
| `major`        | Yes   | 0.1.0 → 1.0.0          |
| `1.2.3`        | Yes   | Explicit version       |
| `1.0.0-beta.1` | Yes   | Prerelease version     |
| `abc`          | No    | Error: invalid version |

### Steps

1. Checkout repository
2. Resolve version from input (parse current version, compute new)
3. Bump version in:
   - `package.json` (root)
   - `apps/forge/package.json`
   - `src-tauri/Cargo.toml`
   - `src-tauri/tauri.conf.json`
4. Regenerate `Cargo.lock` via `cargo generate-lockfile`
5. Create branch `release/v{version}`
6. Commit: `chore: release v{version}`
7. Push branch
8. Create PR: title `chore: release v{version}`, base `main`

### Permissions

- `contents: write` (push branch)
- `pull-requests: write` (create PR)

---

## Workflow: Release (`release.yml`)

**Trigger**:

- `pull_request` closed (merged) on main, where head branch starts with `release/v`
- `push` tags matching `v*`

### Steps

1. Checkout with `fetch-depth: 0` (full history for git-cliff)
2. Resolve version from branch name or tag
3. Create and push tag `v{version}` (if triggered by PR merge)
4. Delete release branch (if triggered by PR merge)
5. Validate version consistency (if triggered by tag push): Cargo.toml version matches tag
6. Generate changelog via `git-cliff --latest --strip header`
7. Setup Node.js + pnpm, install dependencies
8. Setup Rust toolchain
9. Build with `tauri-apps/tauri-action@v0`
10. Publish GitHub Release with changelog body
11. Mark as prerelease if version contains `-` suffix
12. Update updater release (upload latest.json to pinned "updater" release)

### Secrets Required

| Secret                               | Purpose                         | Required            |
| ------------------------------------ | ------------------------------- | ------------------- |
| `GITHUB_TOKEN`                       | PR creation, release publishing | Yes (automatic)     |
| `TAURI_SIGNING_PRIVATE_KEY`          | Tauri updater signing           | For updater support |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Signing key password            | For updater support |
| `AZURE_CLIENT_ID`                    | Azure Trusted Signing           | For code signing    |
| `AZURE_CLIENT_SECRET`                | Azure Trusted Signing           | For code signing    |
| `AZURE_TENANT_ID`                    | Azure Trusted Signing           | For code signing    |

### Permissions

- `contents: write` (create tag, publish release)
