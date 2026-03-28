---
name: refactor-ui-patterns
description: Use this skill when editing React or TypeScript UI code to improve consistency, reuse existing design patterns, standardize styling, or align components with the project’s shared UI conventions without changing product behavior.
---

Use this skill for UI-focused refactors in React + TypeScript projects.

Goals:

- improve consistency
- reduce duplication
- reuse existing patterns before adding new abstractions
- preserve behavior unless the task explicitly requests behavioral change
- keep diffs small and low-risk

Apply this skill when the task involves:

- standardizing component structure
- aligning spacing, typography, or interaction patterns
- extracting repeated UI patterns only when duplication is meaningful
- replacing ad hoc UI code with existing shared primitives
- making component APIs more consistent
- cleaning up visual inconsistency across similar components

Do not use this skill when the primary task is:

- debugging runtime logic unrelated to UI structure
- implementing a brand-new feature with no existing pattern to match
- broad architecture redesign across the whole app
- data/model/backend refactoring

Workflow:

1. Read the relevant files first.
2. Identify the existing local pattern before proposing a new one.
3. Prefer the narrowest refactor that improves consistency.
4. Reuse shared primitives, utilities, tokens, and component conventions before creating new abstractions.
5. Avoid introducing helper wrappers or micro-abstractions unless they clearly reduce meaningful duplication or improve readability.
6. Preserve existing behavior, markup meaning, and interaction behavior unless explicitly asked to change them.
7. After editing, summarize:
   - what changed
   - which patterns were aligned
   - what was intentionally left unchanged

Refactor rules:

- Prefer composition over abstraction.
- Prefer explicit naming over cleverness.
- Keep component APIs simple and predictable.
- Avoid one-off visual values when an existing token or scale value works.
- Do not rename or move files unless necessary for the requested task.

React + TypeScript guidance:

- Keep props readable and focused.
- Avoid over-generic abstractions.
- Prefer local clarity over “future-proof” indirection.
- If extracting shared code, ensure the extraction reflects a real repeated pattern rather than a one-time convenience.

Verification:

- Run the narrowest useful verification for the affected UI.
- Typical checks:
  - npm run lint
  - npm run build
  - targeted tests if the affected area has them
- Report what was verified and any remaining uncertainty.

Output style:

- Brief plan before non-trivial edits
- Small scoped change
- Exact summary of the diff afterward
- Do not continue into adjacent refactors unless explicitly asked
