# Codex Skills Library

This directory contains reusable **Codex skills** for working in this repository.

Each skill defines a focused workflow (e.g. refactoring UI, improving accessibility, simplifying structure, or working with game board layering).

Codex may automatically select a skill based on the task, or you can explicitly guide it by phrasing your request.

---

## How Skills Are Used

- Skills are **not always active** — Codex loads them when relevant.
- The `description` field in each `SKILL.md` determines when a skill is selected.
- Skills work together with:
  - root `AGENTS.md` (global behavior)
  - folder-level `AGENTS.md` (local rules)

👉 Think of it as:

- `AGENTS.md` → _how to behave_
- `skills/` → _how to do specific kinds of work_

---

## Available Skills

### 1. refactor-ui-patterns

Use when:

- improving UI consistency
- aligning components with existing patterns
- reducing duplication
- standardizing styling or component structure

Focus:

- reuse existing primitives and patterns
- keep diffs small and safe
- avoid introducing unnecessary abstractions

---

### 2. accessibility-pass

Use when:

- reviewing or fixing accessibility
- improving semantics, labels, or structure
- validating keyboard interaction and focus behavior

Focus:

- semantic HTML first
- minimal and correct ARIA usage
- preserving keyboard and screen reader usability

---

### 3. flatten-component-tree

Use when:

- components are deeply nested
- there are unnecessary wrapper elements
- layout structure feels overly complex

Focus:

- reduce nesting
- remove wrapper noise
- keep structure readable and intentional
- preserve layout, interaction, and semantics

---

### 4. game-board-layering

Use when:

- working on game board UI
- adjusting overlays, controls, or grid structure
- editing SVG board elements or interaction regions

Focus:

- flat, non-overlapping layout where possible
- clear separation of decorative vs interactive layers
- precise hit areas and interaction boundaries
- clean SVG grouping and visual integrity

---

## How to Trigger a Skill

Codex will often pick the correct skill automatically, but you can make it explicit:

Examples:

- "Refactor this to match existing UI patterns"
- "Do an accessibility pass on this component"
- "Flatten this component tree"
- "Fix board layering and interaction regions"

You can also combine intent:

- "Flatten this component tree and align it with existing UI patterns"
- "Accessibility pass with minimal structural changes"

---

## Guidelines for Using Skills

- Prefer **one skill at a time** for clearer, safer changes
- Combine skills only when the task clearly spans multiple concerns
- Keep changes **small and scoped**
- Preserve behavior unless explicitly asked to change it
- Ask before making broad structural refactors

---

## Adding New Skills

When adding a new skill:

1. Create a folder:
   ```txt
   .agents/skills/<skill-name>/SKILL.md
   ```

---

## Context Management & Compaction

Codex should actively manage context size to maintain performance, accuracy, and efficiency.

### Goals

- Keep context **lean and relevant**
- Reduce token usage without losing important information
- Avoid context bloat from repeated or irrelevant data

### When to Compact

Trigger compaction when:

- working across many files
- conversation becomes long
- large diffs or logs are included
- repeated context appears
- irrelevant files are being carried forward

### How to Compact

Prefer **semantic compaction**, not arbitrary truncation.

Keep:

- relevant files for the current task
- active component or feature being edited
- constraints from AGENTS.md
- decisions that affect current implementation

Remove or reduce:

- previously explored but unused approaches
- logs, stack traces, and verbose output
- repeated explanations
- unrelated files or features
- unchanged code not needed for reasoning

### Compression Strategy

- Aim to reduce context by **~30–70% when possible**
- Do NOT blindly truncate important sections
- Prefer summarizing over deleting when context is still relevant
- Prefer referencing files instead of inlining full content when possible

### File Selection Rules

- Include only files directly relevant to the task
- Avoid loading entire directories unless necessary
- Prefer:
  - 1–5 key files over 20 loosely related ones

### Summary Rule

👉 Keep context small, focused, and high-signal  
👉 Remove noise before removing meaning
