# Implementation Plan: Commitlint & Git-Cliff Release Workflow

**Branch**: `003-commitlint-release-workflow` | **Date**: 2026-03-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-commitlint-release-workflow/spec.md`

## Summary

Set up conventional commit enforcement (commitlint + lefthook), automated changelog generation (git-cliff), and a complete GitHub Actions release pipeline (CI, prepare release, build & publish) for ltk-forge, modeled after the ltk-manager release workflow but adapted for the pnpm + Turborepo monorepo structure.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Rust 2021 edition (backend), YAML (CI workflows)
**Primary Dependencies**: lefthook (git hooks), @commitlint/cli + @commitlint/config-conventional (commit validation), git-cliff (changelog generation via GitHub Action), Tauri v2 (build/release)
**Storage**: N/A (configuration-only feature)
**Testing**: Manual verification of hooks; CI workflows tested via GitHub Actions
**Target Platform**: GitHub Actions (ubuntu-latest for CI, windows-latest for release builds)
**Project Type**: Desktop app (Tauri) — this feature adds DevOps tooling
**Performance Goals**: N/A
**Constraints**: Must work with pnpm monorepo (Turborepo), must keep version in sync across 4 files
**Scale/Scope**: 3 GitHub Actions workflows, 3 config files at repo root, 1 npm script addition

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is not yet ratified (template only). No gates to enforce. Proceeding.

**Post-Phase 1 re-check**: No violations. This feature adds tooling configuration only — no application code, no new abstractions, no architectural changes.

## Project Structure

### Documentation (this feature)

```text
specs/003-commitlint-release-workflow/
├── plan.md              # This file
├── research.md          # Lefthook, commitlint, git-cliff, CI research
├── data-model.md        # Configuration artifacts and version manifest
├── quickstart.md        # Developer setup and release process guide
├── contracts/
│   └── github-workflows.md  # CI, prepare release, release workflow contracts
└── tasks.md             # (Phase 2 — /speckit.tasks)
```

### Source Code (repository root)

```text
# New files added by this feature
lefthook.yml                          # Git hook configuration
commitlint.config.js                  # Conventional Commits validation
cliff.toml                            # Git-cliff changelog template
.github/
├── workflows/
│   ├── ci.yml                        # PR/push CI checks
│   ├── release-prepare.yml           # Manual version bump + PR
│   └── release.yml                   # Build, tag, publish on merge

# Modified files
package.json                          # Add "prepare" script, devDependencies
```

**Structure Decision**: This feature is entirely configuration — no source code directories are created. All new files live at the repository root (config files) or in `.github/workflows/` (CI/CD). The existing monorepo structure (`apps/`, `packages/`, `src-tauri/`) is unchanged.

## Key Design Decisions

### D1: Lefthook replaces Husky + lint-staged

Lefthook provides built-in file filtering (`glob`, `{staged_files}`) and parallel command execution, eliminating the need for lint-staged as a separate dependency. A single `lefthook.yml` handles both the `commit-msg` hook (commitlint) and `pre-commit` hook (eslint, prettier, cargo fmt).

See: [research.md#R1](research.md)

### D2: Version synchronized across 4 files

The release-prepare workflow bumps version in `package.json` (root), `apps/forge/package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json` atomically in a single commit. This differs from ltk-manager which patches tauri.conf.json at build time — we prefer explicit bumping for transparency.

See: [research.md#R5](research.md), [data-model.md](data-model.md)

### D3: CI uses Turborepo for frontend, direct cargo for Rust

Frontend checks run via `turbo run typecheck lint test` (leveraging Turborepo caching). Rust checks run via direct cargo commands since the Cargo workspace is independent of Turborepo. Rust jobs that need Tauri compilation require a frontend build first.

See: [research.md#R6](research.md)

### D4: Code signing is optional (secret-gated)

The release workflow includes code signing steps but they are conditional on secrets being configured. This allows the workflow to function without signing for initial setup, with signing enabled later when certificates are provisioned.

See: [research.md#R7](research.md)

## Complexity Tracking

No constitution violations to justify — this feature adds standard DevOps configuration with no architectural complexity.
