# Data Model: Commitlint & Git-Cliff Release Workflow

**Feature**: 003-commitlint-release-workflow
**Date**: 2026-03-06

This feature is primarily configuration-driven (config files, CI workflows, git hooks). There is no application data model. The entities below describe the configuration artifacts and their relationships.

## Configuration Artifacts

### Commit Message (validated by commitlint)

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Validation rules** (from @commitlint/config-conventional):

- `type` is required, must be one of: feat, fix, chore, refactor, docs, perf, style, test, build, ci, revert
- `scope` is optional, freeform
- `description` is required, lowercase first character
- Breaking changes indicated by `!` after type/scope or `BREAKING CHANGE:` footer

### Version Manifest (synchronized across files)

| File                        | Field     | Format        | Example   |
| --------------------------- | --------- | ------------- | --------- |
| `package.json` (root)       | `version` | semver string | `"0.1.0"` |
| `apps/forge/package.json`   | `version` | semver string | `"0.1.0"` |
| `src-tauri/Cargo.toml`      | `version` | semver string | `"0.1.0"` |
| `src-tauri/tauri.conf.json` | `version` | semver string | `"0.1.0"` |
| `Cargo.lock`                | derived   | regenerated   | N/A       |

**Constraint**: All four version fields MUST contain the same value at all times. The release-prepare workflow bumps all four atomically.

### Release Branch

- **Naming**: `release/v{version}` (e.g., `release/v0.2.0`)
- **Lifecycle**: Created by prepare workflow → PR merged → tag created → branch deleted
- **Constraint**: One active release branch at a time (by convention)

### Git Tag

- **Naming**: `v{version}` (e.g., `v0.2.0`)
- **Pattern**: `v[0-9].*` (used by git-cliff for changelog boundaries)
- **Created by**: Release workflow after PR merge

### Changelog Sections (git-cliff grouping)

| Commit Prefix         | Changelog Group |
| --------------------- | --------------- |
| `feat`                | Added           |
| `fix`                 | Fixed           |
| `perf`                | Performance     |
| `refactor`            | Refactored      |
| `docs`                | Documentation   |
| `*` (other)           | Other           |
| `chore: release`      | Skipped         |
| `chore: bump version` | Skipped         |
| `Merge pull request`  | Skipped         |
| `Merge branch`        | Skipped         |

## State Transitions

### Release Lifecycle

```
[No Release]
    │
    ▼ (maintainer triggers prepare workflow)
[Release Branch Created]
    │ release/v{version} branch + PR
    ▼ (maintainer reviews and merges PR)
[PR Merged]
    │
    ▼ (release workflow triggers)
[Tag Created] → [GitHub Release Published] → [Release Branch Deleted]
```
