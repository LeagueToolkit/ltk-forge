# Tasks: Commitlint & Git-Cliff Release Workflow

**Input**: Design documents from `/specs/003-commitlint-release-workflow/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included (not requested in feature specification). Manual verification steps are documented in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create the `.github/workflows/` directory structure

- [x] T001 Install devDependencies (lefthook, @commitlint/cli, @commitlint/config-conventional) and add `"prepare": "lefthook install"` script in `package.json`
- [x] T002 Create `.github/workflows/` directory structure at repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational tasks — all configuration is self-contained within each user story. User stories can begin immediately after setup.

**Checkpoint**: Setup complete — user story implementation can now begin.

---

## Phase 3: User Story 1 — Enforce Conventional Commits (Priority: P1) 🎯 MVP

**Goal**: Every commit is validated against Conventional Commits format via a lefthook commit-msg hook running commitlint.

**Independent Test**: Make a commit with message `feat: test` (should succeed) and `bad message` (should be rejected).

### Implementation for User Story 1

- [x] T003 [P] [US1] Create commitlint configuration with @commitlint/config-conventional preset in `commitlint.config.js`
- [x] T004 [P] [US1] Create lefthook configuration with commit-msg hook (commitlint) and pre-commit hook (eslint, prettier, cargo fmt) in `lefthook.yml`
- [x] T005 [US1] Run `pnpm exec lefthook install` to activate git hooks and verify commit-msg hook rejects non-conventional messages

**Checkpoint**: Conventional commit enforcement is active. Invalid commit messages are rejected locally.

---

## Phase 4: User Story 2 — Automated Changelog Generation (Priority: P2)

**Goal**: git-cliff generates a structured changelog from conventional commits, grouping by type and filtering noise.

**Independent Test**: Run `git cliff` locally (or via GitHub Action) and verify output groups commits as Added/Fixed/Performance/etc. and skips merge/release commits.

### Implementation for User Story 2

- [x] T006 [US2] Create git-cliff configuration adapted from ltk-manager with ltk-forge remote URL in `cliff.toml`

**Checkpoint**: Changelog can be generated locally via `git cliff`. Commit grouping and filtering works correctly.

---

## Phase 5: User Story 3 — Prepare Release Workflow (Priority: P2)

**Goal**: Maintainers trigger a GitHub Actions workflow to bump versions across 4 files and open a release PR.

**Independent Test**: Trigger the workflow with `patch` input and verify the PR contains correct version bumps in all 4 files + regenerated Cargo.lock.

### Implementation for User Story 3

- [x] T007 [US3] Create release-prepare workflow with version resolution (patch/minor/major/explicit), version bumping in `package.json`, `apps/forge/package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, Cargo.lock regeneration, and PR creation in `.github/workflows/release-prepare.yml`

**Checkpoint**: Prepare Release workflow can be triggered from GitHub Actions UI. Version bumps are correct and PR is created automatically.

---

## Phase 6: User Story 4 — Build and Publish Release (Priority: P3)

**Goal**: Merged release PRs automatically tag, build, generate changelog, and publish a GitHub Release.

**Independent Test**: Merge a release PR and verify tag creation, changelog in release body, branch cleanup, and prerelease marking for `-beta` versions.

### Implementation for User Story 4

- [x] T008 [US4] Create release workflow with tag creation, version validation, changelog generation (git-cliff action), Tauri build (tauri-action), GitHub Release publishing, prerelease detection, branch cleanup, and updater release update in `.github/workflows/release.yml`

**Checkpoint**: End-to-end release pipeline works: prepare PR → merge → tag → build → publish GitHub Release with changelog.

---

## Phase 7: User Story 5 — CI Validation on Pull Requests (Priority: P3)

**Goal**: PRs and pushes to main run frontend checks (typecheck, lint, test via Turborepo) and Rust checks (check, test, clippy, fmt).

**Independent Test**: Open a PR with valid code (all checks pass) and a PR with a clippy warning (clippy job fails).

### Implementation for User Story 5

- [x] T009 [US5] Create CI workflow with frontend-check job (turbo typecheck lint test), cargo-check job, cargo-test job, clippy job (-D warnings), and rustfmt job, including Linux dependency installation for Tauri compilation in `.github/workflows/ci.yml`

**Checkpoint**: CI runs on all PRs and pushes to main. Frontend and Rust code quality is validated automatically.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T010 Verify all version fields are in sync across `package.json`, `apps/forge/package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`
- [x] T011 Run quickstart.md validation — confirm commit hook works, changelog generates, and all config files are present

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: N/A — no blocking prerequisites for this feature
- **US1 (Phase 3)**: Depends on T001 (dependencies installed)
- **US2 (Phase 4)**: No dependencies on other stories — can run in parallel with US1
- **US3 (Phase 5)**: No dependencies on other stories — can run in parallel with US1/US2
- **US4 (Phase 6)**: Depends on US2 (T006 — cliff.toml must exist for changelog generation in release workflow)
- **US5 (Phase 7)**: No dependencies on other stories — can run in parallel with US1–US4
- **Polish (Phase 8)**: Depends on all stories complete

### User Story Dependencies

- **US1 (P1)**: T001 → T003 ∥ T004 → T005
- **US2 (P2)**: T001 → T006 (independent of US1)
- **US3 (P2)**: T002 → T007 (independent of US1, US2)
- **US4 (P3)**: T002 + T006 → T008 (depends on cliff.toml from US2)
- **US5 (P3)**: T002 → T009 (independent of US1–US4)

### Parallel Opportunities

```
After T001 + T002 complete:
  ├── T003 + T004 (US1 — commitlint + lefthook configs)  ─→ T005
  ├── T006 (US2 — cliff.toml)  ─→ T008 (US4 — release.yml)
  ├── T007 (US3 — release-prepare.yml)
  └── T009 (US5 — ci.yml)
```

---

## Parallel Example: After Setup

```bash
# These can all run in parallel (different files, no dependencies):
Task T003: "Create commitlint.config.js"
Task T004: "Create lefthook.yml"
Task T006: "Create cliff.toml"
Task T007: "Create .github/workflows/release-prepare.yml"
Task T009: "Create .github/workflows/ci.yml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 3: US1 (T003, T004, T005)
3. **STOP and VALIDATE**: Test commit hook locally with valid/invalid messages
4. Conventional commits are now enforced — immediate value

### Incremental Delivery

1. Setup → US1 (commit enforcement) → **MVP delivered**
2. Add US2 (changelog) → Verify `git cliff` output
3. Add US3 (prepare release) + US5 (CI) → Workflows ready
4. Add US4 (release publish) → Full pipeline operational
5. Polish → Verify end-to-end

### Parallel Strategy

With the setup complete, US1/US2/US3/US5 can all proceed in parallel since they create independent files. US4 depends only on US2's `cliff.toml`.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- All tasks create new files — no merge conflicts between parallel tasks
- Reference ltk-manager (https://github.com/LeagueToolkit/ltk-manager) for workflow patterns
- The release workflow (T008) should make code signing conditional on secrets being present
