---
name: accessibility-pass
description: Use this skill when reviewing or editing UI for accessibility issues such as semantics, keyboard interaction, focus behavior, labels, heading structure, ARIA misuse, or screen reader clarity in React or TypeScript applications.
---

Use this skill for accessibility reviews and fixes in UI code.

Goals:

- improve accessibility without unnecessary structural churn
- prefer semantic HTML over ARIA
- preserve or improve keyboard usability
- keep fixes practical, specific, and low-risk

Apply this skill when the task involves:

- checking semantics
- improving labels or accessible names
- fixing heading hierarchy or landmark usage
- validating keyboard interaction
- preserving visible focus states
- removing unnecessary ARIA
- fixing button vs link misuse
- improving screen reader clarity

Do not use this skill when the task is mainly:

- purely visual restyling with no accessibility angle
- backend or business-logic work
- performance-only optimization with no user interaction impact

Workflow:

1. Read the relevant component(s) and nearby shared primitives first.
2. Identify the current interaction model:
   - button
   - link
   - form field
   - dialog
   - expandable region
   - list/grid/card interaction
3. Check semantics before adding ARIA.
4. Fix the smallest set of issues that produces a meaningful accessibility improvement.
5. Preserve existing UX unless it is causing an accessibility problem.
6. Summarize:
   - issues found
   - fixes made
   - anything that should be revisited later

Checklist:

- Are interactive elements real buttons or links?
- Is keyboard interaction supported?
- Is focus visible?
- Are labels or accessible names clear?
- Is heading structure logical?
- Are landmarks used appropriately?
- Is ARIA necessary, valid, and minimal?
- Are decorative elements hidden from assistive tech when appropriate?
- Are hover-only cues also available via focus or text?

Rules:

- Prefer native semantics first.
- Do not add ARIA where native HTML already solves the problem.
- Avoid positive tabindex unless absolutely required.
- Do not hide meaningful content from assistive technologies.
- Preserve focus behavior unless improving it intentionally.
- Avoid accessibility regressions caused by wrapper changes or custom controls.

React-specific guidance:

- Check component composition so semantics are not accidentally broken by wrappers.
- Ensure custom button/link components still render correct underlying elements.
- Ensure conditional rendering does not remove important labels or descriptions.

Verification:

- Run the narrowest useful verification.
- Typical checks:
  - npm run lint
  - npm run build
  - targeted tests if present
- If the task affects keyboard interaction, mentally or manually verify tab/focus flow and interactive roles.
- Report what was verified and what still needs manual testing.

Output style:

- Briefly explain the accessibility issues addressed
- Make focused fixes
- Summarize changes clearly without overstating confidence
