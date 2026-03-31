# AGENTS.md

## Read this first
- Read `README.md` before starting any task.
- Treat `README.md` as the source of truth for:
    - MVP scope
    - constraints
    - definition of done
- Do not add features, mechanics, or technical improvements that are not explicitly required.
- If requirements are unclear, ask before implementing.

## Working principles
- Keep changes small, incremental, and easy to review.
- Prefer simple, explicit solutions over abstractions.
- Do not overengineer.
- Do not add dependencies unless they are strictly necessary to complete the task.
- Keep files focused and reasonably small.
- Reuse existing code patterns and conventions where possible.
- Preserve the core game loop exactly as described in `README.md`.

## Planning
Before coding, always provide an implementation plan and wait for approval unless the user explicitly asks you to proceed immediately.
Structure the plan using these sections:
- Goal
- Scope
- Approach
- Validation

When writing the plan:
- Stay within the MVP scope.
- Call out assumptions explicitly.
- Do not include optional stretch improvements unless the user asks for them.

## Implementation rules
After approval:
- Implement only the agreed scope.
- Keep the diff as small as possible.
- Avoid unrelated refactors or cleanup.
- Avoid introducing new abstractions unless they clearly reduce complexity.
- Prefer clarity and responsiveness over visual polish or extra features.
- Do not change gameplay behavior unless required by the task.

## Git workflow
- Use Conventional Commits for all commit messages.
- Keep branch names descriptive and scoped to the task.
- Commit only the changes relevant to the task.
- Commit after validation succeeds, unless the user explicitly asks otherwise.
- When work is complete, commit the changes and open a pull request if the current environment supports it.
- If commit, push, or PR creation is not possible, report the blocker clearly and do not claim it was done.

## Validation
Before finishing, run the relevant validation commands and report only what was actually run.

Use:
- `pnpm build`

If relevant and available, also run:
- `pnpm test`
- `pnpm lint`

Rules:
- Do not claim a command passed unless it was actually run successfully.
- If a command fails, report the failure briefly and accurately.
- If a command is unavailable or not applicable, say so explicitly.

## Final output
When work is complete, always provide, in order:
- Summary of changes 
- Files changed 
- Validation performed
- Git actions performed
  - branch name
  - commit message
  - PR link
- Remaining risks, assumptions, or follow-ups

## Non-goals
Unless explicitly requested, do not:
- add new features
- add new game systems or mechanics
- introduce new dependencies
- refactor unrelated parts of the codebase
- optimize prematurely
- polish UI beyond what is needed for a clear MVP
 