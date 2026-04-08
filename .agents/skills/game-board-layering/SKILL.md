---
name: game-board-layering
description: Use this skill when editing interactive game-board UI with layered regions, SVG board art, overlays, controls, grid areas, scoreboards, or hit targets, especially when the goal is to simplify layering, reduce overlap, and keep decorative and interactive elements clearly separated.
---

Use this skill for board-style game UI with layered structure.

Goals:

- keep board structure flat and intentional
- separate decorative layers from interaction layers
- reduce oversized overlap regions
- preserve visual clarity, keyboard access, and predictable hit areas
- support reusable game-board conventions across multiple games

Apply this skill when the task involves:

- board layout structure
- overlays or panel overlays
- scoreboards, grids, and control placement
- corner controls
- SVG grouping and interactive elements
- hit targets and pointer event boundaries
- simplifying overlapping board layers
- reorganizing decorative vs actionable regions

Do not use this skill when the task is unrelated to board-style UI or layered interactive game views.

Preferred board organization:
When practical, structure the board into clear sibling regions such as:

- board background or frame
- grid or item area
- scoreboard or status area
- controls
- overlays or transient UI

Prefer sibling ownership over deeply nested overlapping full-board containers.

Layering rules:

- Avoid full-board wrappers for controls that only occupy a small area.
- Avoid full-surface overlays unless the whole surface truly needs coverage.
- Decorative layers should not capture pointer events.
- Interaction layers should contain only actionable elements where possible.
- Overlay size should match the visible or interactive panel it belongs to.

Controls:

- Controls should occupy only the area they visually need.
- Corner controls should live in narrow, purpose-specific regions rather than broad spanning wrappers.
- Keep actionable elements easy to target and visually distinct.
- Preserve keyboard interaction and visible focus treatment.

SVG rules:

- Prefer SVG for board art and interactive elements when it improves scalability and reuse.
- Group SVG elements only for real reasons:
  - shared transform
  - shared styling
  - shared semantic meaning
- Keep decorative and actionable SVG parts separate enough to support independent styling and interaction states.
- Avoid path splitting that creates visible seams or hairline gaps.
- Preserve visual integrity when reorganizing groups.

Interaction rules:

- Interactive regions should match visible affordances as closely as practical.
- Avoid oversized invisible click areas that spill into unrelated board regions.
- Temporary hint or overlay UI should not block unrelated interactions unless necessary.
- Keep transient interaction logic easy to reason about and localized.

Structural rules:

- Prefer a flatter component tree.
- Avoid unnecessary wrappers.
- Consolidate into parent ownership when that reduces structural noise.
- Do not introduce helper layers unless they have a clear layout, interaction, or accessibility purpose.

Workflow:

1. Read the relevant board structure, styling, and nearby shared game patterns first.
2. Identify major visual and interaction regions.
3. Map which layers are decorative vs actionable.
4. Simplify the structure with the smallest effective change.
5. Preserve current gameplay behavior unless explicitly asked to change it.
6. Summarize:
   - which layers or wrappers changed
   - how overlap was reduced or responsibilities clarified
   - any SVG grouping or hit-area tradeoffs

Verification:

- Run the narrowest useful verification.
- Typical checks:
  - npm run lint
  - npm run build
- Verify:
  - visual alignment
  - stacking behavior
  - pointer behavior
  - focus behavior
  - no obvious SVG seam artifacts after changes

Output style:

- Briefly explain the layering plan before non-trivial edits
- Make small structural changes
- Be explicit about interaction and visual tradeoffs
- Do not continue into broader board refactors unless explicitly asked
