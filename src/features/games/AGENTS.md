# AGENTS.md

## Scope

These instructions apply to all code inside `src/features/games`.

Follow higher-level instructions from the repo root and feature-level `AGENTS.md` files first.
Use this file for shared game UI, board structure, SVG, layering, and interaction rules.

---

## Goal

Build game features that are visually clear, structurally simple, accessible, and easy to extend.

Prefer small, low-risk improvements that preserve existing behavior unless a behavior change is explicitly requested.

---

## Core Principles

### 1. Keep the tree flat

- Prefer a flatter component tree over deep nesting.
- Avoid unnecessary wrapper elements.
- Consolidate related structure into parent components when that improves clarity.
- Do not create extra structural layers unless they serve a clear layout, accessibility, or interaction purpose.

### 2. Prefer clear layout ownership

- Each major board region should have a clear responsibility.
- Prefer non-overlapping layout sections where possible.
- Do not use large full-board wrappers for controls that only occupy a small visible area.
- Controls should only occupy the space they visually and interactively need.

### 3. Separate decoration from interaction

- Decorative layers should not capture pointer events.
- Interaction layers should contain only actionable elements.
- Avoid mixing decorative markup and interactive controls in the same layer unless there is a strong reason.

---

## Board Layout Rules

### Preferred board regions

When relevant, organize board UI into clearly owned regions such as:

- board background / frame
- game grid / item area
- scoreboard / status area
- controls
- overlays / transient UI

These regions should be siblings when possible instead of deeply nested overlapping containers.

### Overlays

- Avoid full-surface overlay containers unless the full area truly needs to be covered.
- Prefer panel-specific or purpose-specific overlays.
- Decorative overlays should use `pointer-events-none` when appropriate.
- Overlay size should match the actual visible panel or interaction area.

### Controls

- Place controls in narrow, purpose-specific containers instead of broad full-board wrappers.
- Corner controls should occupy only their own corner region.
- Left and right control groups should be separate when that reduces overlap and improves layout clarity.
- Actionable controls must remain easy to target and visually distinct.

---

## SVG Rules

### SVG usage

- Prefer SVG for board art and interactive game elements when it improves clarity, scalability, or asset reuse.
- Keep SVG structure readable and intentional.
- Do not over-fragment SVG markup without a clear reason.

### Grouping

- Group elements only when there is a practical reason, such as:
  - shared transform
  - shared styling
  - shared semantic meaning
- Do not wrap elements in extra groups that provide no structural benefit.

### Interactive vs decorative SVG parts

- Decorative SVG elements should remain non-interactive.
- Actionable elements should be isolated enough to support:
  - hover/focus states
  - clear hit areas
  - independent styling
- Avoid burying actionable shapes inside large decorative groups when separate interaction handling is needed.

### Visual integrity

- Avoid splitting shapes in ways that can create visible seams.
- Preserve clean joins and edge continuity.
- When refactoring SVG structure, check for rendering artifacts such as hairline gaps or misalignment.

---

## Interaction Rules

### General interaction

- Interactive regions should match visible affordances as closely as practical.
- Avoid oversized invisible click targets that spill across unrelated areas.
- Avoid interaction layers that cover the whole board unless required.

### Input behavior

- Preserve keyboard support wherever interaction exists.
- Use real buttons for actions and real links for navigation.
- Focus states must remain visible and intentional.
- Hover, focus, pressed, and disabled states should be consistent and calm.

### Hints, overlays, transient states

- Temporary UI should disappear when its purpose is complete or when the related interaction ends, unless the task explicitly requires persistence.
- Hint UI should not block unrelated controls unless necessary.
- Keep transient interaction logic localized and easy to reason about.

---

## State and Logic

- Keep state as local as practical.
- Lift state only when multiple parts of the game genuinely need shared ownership.
- Prefer derived state over duplicated state.
- Avoid unnecessary effects when computation or event-driven updates are sufficient.
- Keep game session logic explicit and predictable.

When possible, separate:

- rendering structure
- interaction wiring
- game/state logic

But do not split into extra files unless that actually improves readability or maintainability.

---

## Component Design

- Keep game components focused and readable.
- Prefer composition over premature abstraction.
- Reuse shared primitives and shared patterns before creating new ones.
- Do not create helper components that only wrap markup unless they improve clarity or reduce meaningful duplication.

When creating a new layer or wrapper, verify that it has a real purpose:

- layout ownership
- interaction boundary
- accessibility structure
- state responsibility

If it does not, do not add it.

---

## Styling

- Use existing design tokens and shared style conventions.
- Avoid one-off values unless truly necessary.
- Preserve the visual tone of the project.
- Keep motion and micro-interactions subtle and consistent.
- Maintain visual clarity between decorative and actionable elements.

---

## Accessibility

- Prefer semantic HTML first.
- Use ARIA only when necessary.
- Preserve keyboard navigation and visible focus treatment.
- Do not rely on pointer-only interaction.
- Ensure controls and interactive board elements remain understandable and operable.

---

## Refactoring Guidance

When editing game code:

- make the smallest change that solves the problem
- preserve behavior unless change is requested
- reduce unnecessary nesting
- reduce overlapping containers where practical
- avoid broad rewrites

If suggesting a structural refactor:

- explain the tradeoff briefly
- prefer incremental changes over full reorganization

---

## Verification

When changes affect behavior or layout:

- read nearby files first to understand the current pattern
- run the narrowest useful verification
- verify visual structure if SVG or layering was changed
- verify interaction behavior if controls, overlays, or hit areas were changed
- report what changed and what was verified

Useful checks may include:

- `npm run lint`
- `npm run build`
- relevant tests if available

---

## Communication

- Briefly explain the plan before non-trivial edits.
- State assumptions clearly.
- Ask before making broad structural changes.
- Do not continue into additional refactors unless explicitly asked.

---

## Summary Rule

Game code should feel intentional, flat, readable, and interaction-safe.

Prefer small, structurally clean changes over clever layered solutions.
