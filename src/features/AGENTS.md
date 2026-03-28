# AGENTS.md

## Scope

These instructions apply to code inside `src/features`.

Follow the root `AGENTS.md` first, then use these rules for feature-level implementation details.

## Feature Development Goals

- Keep features self-contained and easy to understand.
- Prefer small, low-risk changes over broad rewrites.
- Preserve existing behavior unless the task explicitly asks for a behavior change.
- Match existing feature patterns before introducing new ones.

## Structure

- Prefer a flatter component tree over deep nesting.
- Avoid unnecessary wrapper elements.
- Consolidate related functionality into a parent component when that reduces structural noise.
- Do not split logic into extra files unless it clearly improves readability, reuse, or maintainability.

## Components

- Keep components focused and readable.
- Prefer composition over premature abstraction.
- Reuse shared primitives and utilities before creating new ones.
- Do not introduce “helper” components that only wrap markup without improving clarity.

## State and Logic

- Keep state as local as practical.
- Lift state only when multiple siblings truly need it.
- Prefer clear derived state over duplicated state.
- Avoid unnecessary effects when derived values or event handlers are enough.
- Keep business logic predictable and explicit.

## Styling

- Use existing design tokens and shared styling patterns.
- Avoid one-off spacing, sizing, or visual values unless necessary.
- Preserve the existing visual language and interaction feel.
- Keep hover and focus behavior consistent with the rest of the app.

## Accessibility

- Prefer semantic HTML first.
- Use ARIA only when necessary.
- Preserve keyboard access and visible focus states.
- Ensure buttons are real buttons and navigation is done with real links where appropriate.

## Verification

When editing a feature:

- Read the nearby files first to understand the existing pattern.
- Make the smallest change that solves the problem.
- Run the narrowest useful verification for the affected work.
- Report what changed, what was verified, and any remaining uncertainty.

## Communication

- Briefly explain the plan before non-trivial edits.
- Call out tradeoffs when there are multiple valid approaches.
- Ask before making broader structural changes.
- Do not continue into additional refactors unless explicitly asked.

## For interactive/game-like features

- Keep visual layers and interaction layers clearly separated.
- Avoid oversized overlay containers when a smaller interaction region will do.
- Decorative layers should not capture pointer events.
- Controls should only occupy the space they visually need.
- Prefer non-overlapping layout regions where possible.

## Summary Rule

Small, intentional, pattern-matching feature changes are preferred over clever refactors.
