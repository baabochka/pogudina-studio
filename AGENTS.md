## Context Management & Checkpoints (CRITICAL)

Codex must actively manage context to maintain accuracy, clarity, and efficiency.

---

### Core Principle

Keep context **small, relevant, and high-signal**.

Do NOT carry forward unnecessary information.

---

### When to Compact Context

Trigger compaction when:

- working across multiple files
- the conversation becomes long
- repeated explanations appear
- logs or large outputs are included
- earlier exploration is no longer relevant

---

### How to Compact

Prefer **semantic compaction**, not arbitrary truncation.

Always keep:

- files directly relevant to the current task
- active components or features being edited
- constraints from AGENTS.md
- decisions that affect current implementation

Reduce or remove:

- repeated explanations
- stale or abandoned approaches
- logs, stack traces, and verbose output
- unrelated files or features
- unchanged code not needed for reasoning

---

### Compression Strategy

- Aim to reduce context significantly (**~30–70% when appropriate**)
- Do NOT blindly truncate important information
- Prefer summarizing over deleting when context is still relevant
- Prefer referencing files instead of inlining large code blocks

---

### File Selection Rules

- Include only files necessary for the current task
- Avoid loading entire directories unless required
- Prefer a small set of highly relevant files over many loosely related ones

---

### Checkpoint Workflow (IMPORTANT)

When a task spans multiple steps or begins to grow in scope:

1. **Pause after completing a logical unit of work**
2. Provide a short checkpoint summary:
   - what was changed
   - current state of the system
   - any important decisions made
   - what remains to be done

3. **Compact context before continuing**:
   - summarize prior steps
   - drop irrelevant exploration
   - retain only necessary constraints and active files

4. **Do NOT continue automatically**
   - wait for confirmation before proceeding to the next step

---

### When to Create a Checkpoint

Create a checkpoint when:

- a refactor step is completed
- structure/layout has changed
- moving from one feature/area to another
- context has noticeably grown
- before starting a new phase of work

---

### Anti-Patterns (Avoid)

- Including full files when only a small part is needed
- Repeating the same code or explanation multiple times
- Carrying forward irrelevant earlier attempts
- Expanding context “just in case”
- Continuing multi-step work without summarizing and pausing

---

### Summary Rule

👉 Keep signal, drop noise  
👉 Work in steps, checkpoint, then continue  
👉 Smaller, focused context is better than larger, unfocused context
