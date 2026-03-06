# Feature Specification: Commitlint & Git-Cliff Release Workflow

**Feature Branch**: `003-commitlint-release-workflow`
**Created**: 2026-03-06
**Status**: Draft
**Input**: User description: "We need to setup commitlint/git-cliff release workflow for the ltk forge application similar to what we have in ltk-manager https://github.com/LeagueToolkit/ltk-manager"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Enforce Conventional Commits on Every Commit (Priority: P1)

As a contributor, when I create a commit, the system validates that my commit message follows the Conventional Commits format (e.g., `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `perf:`). If my message does not conform, the commit is rejected with a clear error explaining the expected format.

**Why this priority**: Conventional commit messages are the foundation for automated changelog generation and release notes. Without enforced commit standards, the entire release workflow produces inconsistent or unusable output.

**Independent Test**: Can be fully tested by making commits with valid and invalid messages and verifying acceptance/rejection behavior.

**Acceptance Scenarios**:

1. **Given** a developer has staged changes, **When** they commit with message `feat: add new map editor panel`, **Then** the commit succeeds
2. **Given** a developer has staged changes, **When** they commit with message `added stuff`, **Then** the commit is rejected with a message explaining conventional commit format
3. **Given** a developer has staged changes, **When** they commit with message `fix(parser): handle empty input gracefully`, **Then** the commit succeeds (scoped commits are valid)
4. **Given** a developer has staged changes, **When** they commit with message `feat!: remove deprecated API`, **Then** the commit succeeds (breaking change indicator is valid)

---

### User Story 2 - Automated Changelog Generation (Priority: P2)

As a maintainer, I can generate a structured changelog from commit history using git-cliff. The changelog groups commits by type (Added, Fixed, Performance, Refactored, Documentation) and filters out noise commits (merge commits, release bumps). The changelog follows Keep a Changelog format.

**Why this priority**: A reliable changelog is essential for communicating changes to users and is a direct dependency of the release process.

**Independent Test**: Can be tested by running the changelog generator against a repository with conventional commits and verifying the output structure and grouping.

**Acceptance Scenarios**:

1. **Given** a repository with conventional commits, **When** a maintainer generates the changelog, **Then** commits are grouped by type (Added, Fixed, Performance, Refactored, Documentation, Other)
2. **Given** a repository with merge commits and release bump commits, **When** the changelog is generated, **Then** those commits are excluded from the output
3. **Given** a tagged release history, **When** the changelog is generated for the latest release, **Then** only commits since the previous tag are included

---

### User Story 3 - Prepare a Release via GitHub Actions (Priority: P2)

As a maintainer, I can trigger a "Prepare Release" workflow from the GitHub Actions UI by specifying a version bump type (patch, minor, major) or an explicit version number. The workflow creates a release branch, bumps version numbers in all relevant files (package.json, Cargo.toml), and opens a pull request to main.

**Why this priority**: Automating release preparation eliminates manual version bumping errors and ensures consistency across frontend and backend version numbers.

**Independent Test**: Can be tested by triggering the workflow with different version inputs and verifying the created PR contains correct version bumps.

**Acceptance Scenarios**:

1. **Given** the current version is 0.1.0, **When** a maintainer triggers the workflow with "patch", **Then** a PR is created with version 0.1.1 in package.json and Cargo.toml
2. **Given** the current version is 0.1.0, **When** a maintainer triggers the workflow with "minor", **Then** a PR is created with version 0.2.0
3. **Given** a maintainer provides an explicit version "1.0.0-beta.1", **When** the workflow runs, **Then** the PR reflects that exact version
4. **Given** a maintainer provides an invalid version string "abc", **When** the workflow runs, **Then** it fails with a clear error message

---

### User Story 4 - Build and Publish Release on Merge (Priority: P3)

As a maintainer, when a release PR is merged to main, the system automatically tags the release, generates a changelog for that version, builds the application, and publishes a GitHub Release with the built artifacts and changelog as release notes. The release branch is cleaned up after merge.

**Why this priority**: This completes the end-to-end release automation but depends on the prepare workflow being in place first.

**Independent Test**: Can be tested by merging a release PR and verifying tag creation, changelog content in the release, and branch cleanup.

**Acceptance Scenarios**:

1. **Given** a release PR for v0.2.0 is merged, **When** the release workflow runs, **Then** a git tag `v0.2.0` is created and pushed
2. **Given** a release PR is merged, **When** the release workflow completes, **Then** a GitHub Release is published with the generated changelog as the body
3. **Given** a release PR is merged, **When** the release workflow completes, **Then** the release branch (e.g., `release/v0.2.0`) is deleted
4. **Given** a version with a prerelease suffix (e.g., 1.0.0-beta.1), **When** the release is published, **Then** it is marked as a prerelease on GitHub

---

### User Story 5 - CI Validation on Pull Requests (Priority: P3)

As a contributor, when I open a pull request or push to main, CI runs frontend checks, Rust checks (cargo check, clippy, fmt), and tests. This ensures code quality before merging.

**Why this priority**: CI validation is important for project health but is supplementary to the core commit/release workflow.

**Independent Test**: Can be tested by opening a PR with passing and failing code and verifying CI results.

**Acceptance Scenarios**:

1. **Given** a PR with valid code, **When** CI runs, **Then** all checks pass (frontend lint/typecheck/test, cargo check, clippy, fmt, cargo test)
2. **Given** a PR with a clippy warning, **When** CI runs, **Then** the clippy job fails with `-D warnings`
3. **Given** a push to main, **When** CI triggers, **Then** the same checks run as for PRs

---

### Edge Cases

- What happens when a developer uses `--no-verify` to skip the commit hook? The hook is bypassed; CI should catch non-conventional commits at the PR level as a secondary safeguard.
- How does the release workflow handle concurrent release PRs? Only one release branch should be active at a time; the workflow does not enforce this but maintainers should coordinate.
- What happens if version in Cargo.toml and package.json are out of sync when a tag-based release is triggered? The release workflow validates version consistency and fails with a clear error if they don't match.
- What if the monorepo has multiple packages with independent versions? This spec assumes a single unified version across the application (one package.json at root, one Cargo.toml for the Tauri app). Monorepo package versioning is out of scope.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST validate commit messages against the Conventional Commits specification using commitlint with a commit-msg git hook
- **FR-002**: System MUST provide a git-cliff configuration that groups commits into categories: Added (feat), Fixed (fix), Performance (perf), Refactored (refactor), Documentation (docs), and Other
- **FR-003**: System MUST skip merge commits, release bump commits, and version chore commits in the generated changelog
- **FR-004**: System MUST provide a "Prepare Release" GitHub Actions workflow that accepts patch/minor/major or explicit semver as input
- **FR-005**: System MUST bump versions in both package.json (root) and src-tauri/Cargo.toml and regenerate Cargo.lock during release preparation
- **FR-006**: System MUST create a release PR from a `release/v{version}` branch targeting main
- **FR-007**: System MUST provide a "Release" GitHub Actions workflow triggered by merged release PRs or pushed version tags
- **FR-008**: System MUST create and push a git tag when a release PR is merged
- **FR-009**: System MUST generate changelog content for the release using git-cliff and include it in the GitHub Release body
- **FR-010**: System MUST delete the release branch after successful release
- **FR-011**: System MUST mark releases with prerelease suffixes (e.g., `-beta.1`) as prereleases on GitHub
- **FR-012**: System MUST provide a CI workflow that runs on PRs to main and pushes to main, executing frontend checks and Rust checks (check, test, clippy, fmt)
- **FR-013**: System MUST use lefthook to manage git hooks, including commit-msg validation and pre-commit linting of staged files
- **FR-014**: System MUST install necessary Linux dependencies (webkit2gtk, gtk3, appindicator, librsvg) in CI for Rust compilation on Ubuntu runners

### Key Entities

- **Commit Message**: A developer-authored message conforming to Conventional Commits format (`type(scope): description`)
- **Release Branch**: A branch named `release/v{version}` created by the prepare workflow, containing version bumps
- **Changelog**: A generated document grouping commits by type, following Keep a Changelog format
- **GitHub Release**: A published release on GitHub containing built artifacts and changelog notes

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of commits on the default branch follow Conventional Commits format (enforced by hook)
- **SC-002**: Maintainers can prepare a release in under 2 minutes by triggering a single workflow
- **SC-003**: Release notes are automatically generated and published with zero manual editing required
- **SC-004**: All PRs are validated by CI before merge, covering both frontend and backend code quality
- **SC-005**: The full release cycle (prepare PR, merge, build, publish) completes without manual intervention beyond the initial trigger and PR approval

## Assumptions

- The project uses pnpm as its package manager (consistent with ltk-manager and the monorepo setup)
- The Tauri application has a single Cargo.toml at `src-tauri/Cargo.toml` for version management
- The root `package.json` contains the frontend version number
- The project follows the same release workflow pattern as ltk-manager (prepare PR -> merge -> tag -> build -> publish)
- Windows is the primary build target for releases (consistent with ltk-manager's `windows-latest` runner)
- Tauri signing keys and Azure code signing credentials will be configured as repository secrets by maintainers
- The project will use the `@commitlint/config-conventional` preset for commit message validation
- The project uses lefthook (not husky) for git hook management, as it supports both frontend and Rust tooling natively without requiring Node.js for hook execution
