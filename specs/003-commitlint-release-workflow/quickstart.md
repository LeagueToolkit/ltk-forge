# Quickstart: Commitlint & Git-Cliff Release Workflow

**Feature**: 003-commitlint-release-workflow

## Prerequisites

- Node.js 22+
- pnpm 9.x
- Rust stable toolchain
- Git

## Developer Setup

After cloning and running `pnpm install`, lefthook hooks are automatically installed via the `prepare` script.

### Verify hooks are active

```bash
# Should show commit-msg and pre-commit hooks
lefthook list
```

### Test commit validation

```bash
# This should succeed
git commit --allow-empty -m "feat: test conventional commit"

# This should fail with commitlint error
git commit --allow-empty -m "bad commit message"
```

### Generate changelog locally

```bash
# Requires git-cliff installed: cargo install git-cliff
git cliff --latest
```

## Configuration Files

| File                                    | Purpose                                           |
| --------------------------------------- | ------------------------------------------------- |
| `lefthook.yml`                          | Git hook configuration (commit-msg + pre-commit)  |
| `commitlint.config.js`                  | Conventional Commits validation rules             |
| `cliff.toml`                            | Changelog generation template and commit grouping |
| `.github/workflows/ci.yml`              | PR and push CI checks                             |
| `.github/workflows/release-prepare.yml` | Manual version bump + PR creation                 |
| `.github/workflows/release.yml`         | Build, tag, and publish on release PR merge       |

## Release Process (for maintainers)

1. Go to **Actions** → **Prepare Release** → **Run workflow**
2. Enter version bump: `patch`, `minor`, `major`, or explicit (e.g., `1.0.0`)
3. Review the auto-created PR (version bumps in package.json, Cargo.toml, tauri.conf.json)
4. Merge the PR
5. Release workflow automatically: creates tag → generates changelog → builds app → publishes GitHub Release

## Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `chore`, `refactor`, `docs`, `perf`, `style`, `test`, `build`, `ci`, `revert`

**Examples**:

- `feat: add map editor toolbar`
- `fix(renderer): correct texture UV mapping`
- `chore: update dependencies`
- `feat!: redesign project file format` (breaking change)
