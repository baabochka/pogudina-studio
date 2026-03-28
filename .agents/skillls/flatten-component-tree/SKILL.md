---
name: flatten-component-tree
description: Use this skill when React UI code has unnecessary wrapper elements, deep nesting, overlapping structural layers, or helper components that add markup without clear layout, accessibility, or interaction value.
---

Use this skill to simplify UI structure.

Goals:

- reduce unnecessary nesting
- remove wrapper noise
- improve readability and layout ownership
- preserve behavior and styling intent
- keep the DOM structure intentional

Apply this skill when the task involves:

- flattening deeply nested component trees
- removing extra wrapper divs
- consolidating structural layers
- simplifying helper components that mostly wrap markup
- improving layout ownership between sibling regions
- reducing overlapping containers where simpler siblings would work

Do not use this skill when:

- the current nesting is required for accessibility, positioning, clipping, transforms, or interaction boundaries
- the task is primarily about visual styling only
- the task would require a broad redesign rather than a targeted simplification

Workflow:

1. Read the full local structure before editing.
2. Identify which wrappers have real responsibilities:
   - layout
   - semantics
   - state ownership
   - interaction boundary
   - styling/clipping/positioning
3. Remove or merge only wrappers that do not provide meaningful value.
4. Prefer sibling regions with clear ownership over nested overlapping regions where practical.
5. Preserve CSS behavior; do not flatten structure in ways that break positioning, stacking, or hit areas.
6. Summarize:
   - what wrappers were removed or merged
   - why the new structure is simpler
   - what constraints prevented further flattening

Rules:

- Keep the tree flatter rather than deeper.
- Avoid helper components that only wrap markup unless they improve clarity.
- Consolidate into parent wrappers when that makes ownership clearer.
- Do not create new wrapper layers while trying to remove old ones.
- Preserve semantics and keyboard behavior.
- Be careful with absolute positioning, stacking context, overflow clipping, and pointer events.

React guidance:

- Prefer readable JSX structure.
- Preserve component boundaries that reflect real responsibilities.
- Avoid splitting one coherent region into many tiny components unless reuse or clarity truly improves.

Verification:

- Run the narrowest useful verification.
- Typical checks:
  - npm run lint
  - npm run build
- If flattening affected layout or interaction, verify that:
  - visuals still align
  - pointer behavior still works
  - focus order still makes sense

Output style:

- Explain the structural simplification briefly
- Keep changes scoped
- Call out any wrappers intentionally kept and why
