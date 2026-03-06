# Research: Commitlint & Git-Cliff Release Workflow

**Feature**: 003-commitlint-release-workflow
**Date**: 2026-03-06

## R1: Git Hook Manager — Lefthook vs Husky + lint-staged

**Decision**: Lefthook (single binary, built-in file filtering)

**Rationale**:

- Lefthook is a single Go binary — no Node.js runtime needed for hook execution
- Built-in `glob` and `{staged_files}` templating replaces lint-staged entirely
- First-class support for non-JS commands (cargo fmt, clippy) alongside eslint/prettier
- `parallel: true` runs all pre-commit commands concurrently
- Single `lefthook.yml` config vs husky shell scripts + lint-staged config
- `stage_fixed: true` per command automatically re-stages fixed files

**Alternatives considered**:

- **Husky + lint-staged** (used in ltk-manager): Works but requires two packages, JS-focused, awkward for Rust tooling
- **simple-git-hooks**: Minimal but no file filtering, no parallelism

**Installation**: `pnpm add -D lefthook` + `"prepare": "lefthook install"` in root package.json

## R2: Commitlint Configuration

**Decision**: `@commitlint/cli` + `@commitlint/config-conventional` at monorepo root

**Rationale**:

- Standard preset covers all Conventional Commits types (feat, fix, chore, refactor, docs, perf, etc.)
- Config file at root (`commitlint.config.js`) applies to all commits in the monorepo
- Since root package.json has `"type": "module"`, use ESM: `export default { extends: ['@commitlint/config-conventional'] }`

**Lefthook integration**:

```yaml
commit-msg:
  commands:
    commitlint:
      run: pnpm exec commitlint --edit {1}
```

The `{1}` template expands to the commit message file path (git's `$1` argument to commit-msg hooks).

## R3: Pre-commit Hook Strategy

**Decision**: Lefthook pre-commit with parallel commands for TS/TSX (eslint + prettier) and Rust (cargo fmt)

**Rationale**:

- Lefthook's `glob` filter ensures commands only run when relevant files are staged
- `stage_fixed: true` re-stages files after eslint --fix / prettier --write
- `cargo fmt --all` is preferred over `rustfmt {staged_files}` because it respects workspace rustfmt.toml

**Configuration**:

```yaml
pre-commit:
  parallel: true
  commands:
    eslint:
      glob: "*.{ts,tsx}"
      run: pnpm exec eslint --fix {staged_files}
      stage_fixed: true
    prettier:
      glob: "*.{ts,tsx,json,css,md,yml,yaml}"
      run: pnpm exec prettier --write {staged_files}
      stage_fixed: true
    cargo-fmt:
      glob: "*.rs"
      run: cargo fmt --all
```

## R4: Git-Cliff Configuration

**Decision**: Adapt ltk-manager's `cliff.toml` for ltk-forge, updating the remote URL

**Rationale**:

- ltk-manager's config is proven and follows Keep a Changelog format
- Groups: Added (feat), Fixed (fix), Performance (perf), Refactored (refactor), Documentation (docs), Other (catch-all)
- Skips: merge commits, release bumps, version chore commits
- Tag pattern: `v[0-9].*` for semver tags

**Key adaptations**:

- Change remote URL macro to `https://github.com/LeagueToolkit/ltk-forge`
- Keep all commit parsers and grouping identical

## R5: Version Bump Strategy for Monorepo

**Decision**: Bump three files: root `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`

**Rationale**:

- ltk-manager bumps `package.json` + `src-tauri/Cargo.toml` (plus regenerates `Cargo.lock`)
- ltk-forge additionally has `version` in `src-tauri/tauri.conf.json` that must stay in sync
- ltk-manager patches tauri.conf.json version at build time in the release workflow; we should do the same OR bump it in the prepare step
- **Decision**: Bump in prepare step (simpler, keeps all version changes in one commit)
- `apps/forge/package.json` also has version `0.1.0` — this should be bumped too for consistency

**Files to bump**:

1. `package.json` (root) — `version` field
2. `apps/forge/package.json` — `version` field
3. `src-tauri/Cargo.toml` — `version` field
4. `src-tauri/tauri.conf.json` — `version` field
5. `Cargo.lock` — regenerated via `cargo generate-lockfile`

## R6: CI Workflow Adaptations

**Decision**: Adapt ltk-manager CI with monorepo-specific changes

**Rationale**:

- ltk-manager runs `pnpm check` which combines typecheck + lint + format:check + test
- ltk-forge uses Turborepo: `turbo run typecheck lint test` covers frontend
- Rust CI jobs (check, test, clippy, fmt) are identical to ltk-manager
- Need to build frontend before Rust CI (Tauri needs frontend dist)

**Key differences from ltk-manager**:

- Frontend check uses `pnpm turbo run typecheck lint test` instead of `pnpm check`
- Frontend build uses `pnpm turbo run build` (filtered to app package)
- Cargo workspace at root level, not just src-tauri

## R7: Release Workflow — Build & Publish

**Decision**: Adapt ltk-manager's release workflow, remove code signing initially

**Rationale**:

- ltk-manager uses Azure Trusted Signing + signtool for Windows code signing
- ltk-forge may not have signing certificates configured yet
- The workflow should support signing via secrets but not fail if secrets are missing
- Tauri updater integration (updater release with latest.json) should be included for parity

**Adaptations**:

- Same trigger: merged release PR or pushed version tag
- Same steps: tag creation, changelog generation, Tauri build, GitHub Release
- Code signing steps are conditional on secrets being present
- Updater release step included for future use
