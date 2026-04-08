---
name: react-state-integrity
description: Use this skill when editing React components that manage state, derive values from props or other state, synchronize local state, or risk redundant, stale, or conflicting state, to keep state minimal, correct, and easy to reason about.
---

Use this skill to enforce correct, minimal, and intentional React state management.

---

## Goals

- keep state minimal and non-redundant
- avoid stale, duplicated, or conflicting state
- prevent prop-to-state syncing bugs
- ensure derived values are computed rather than stored when possible
- keep state ownership clear and predictable

---

## When to Use

Apply this skill when:

- adding or editing `useState`, `useReducer`, or custom state hooks
- syncing props into local state
- managing form state, UI state, or game/session state
- debugging stale UI, inconsistent renders, or state drift
- reviewing components with many state variables
- deciding whether state should be local, lifted, or derived

---

## Core Principle

👉 Store the minimum state necessary

If a value can be derived from props, existing state, or constants during render, it should usually NOT be stored as state.

---

## Core Rules

### 1. Do not store derived state unless there is a clear reason

🚫 Avoid storing values that can be computed from:

- props
- other state
- constants
- selectors or simple transformations

Examples of usually-derived values:

- filtered lists
- sorted lists
- counts
- booleans like `hasItems`
- selected object looked up by `selectedId`

✅ Prefer:

- inline computation
- `useMemo` only when computation is meaningfully expensive or reference stability is required

---

### 2. Avoid prop-to-state syncing unless the state must intentionally diverge

🚫 Risky pattern:

- copying props into local state and trying to keep them in sync

This often creates:

- stale UI
- double sources of truth
- reset bugs
- unnecessary effects

✅ Only sync props into state when there is a clear product reason, such as:

- editable draft state
- temporary local override
- controlled reset behavior

If syncing is required:

- document why
- keep the sync narrow
- define which source of truth wins

---

### 3. Keep a single source of truth

For any piece of information, one owner should be authoritative.

Avoid:

- storing the same concept in multiple places
- mirrored booleans and objects representing the same thing
- separate state that can drift out of sync

Examples:

- prefer `selectedId` over storing both `selectedId` and `selectedItem`
- prefer deriving `isComplete` from real data instead of toggling it separately when possible

---

### 4. Keep state local unless multiple siblings truly need it

✅ Prefer local state when ownership is isolated

Lift state only when:

- multiple siblings need shared access
- parent orchestration is required
- persistence across component boundaries is needed

Do NOT lift state prematurely.

---

### 5. Group or split state based on change patterns

Use separate state variables when values:

- change independently
- have different ownership
- should update separately for clarity

Use grouped state objects when values:

- are conceptually one unit
- are updated together
- benefit from one transition path

Avoid giant generic state objects that make updates noisy and fragile.

---

### 6. Use functional updates when next state depends on previous state

When state updates depend on prior state, prefer functional updates.

```tsx
setCount((prev) => prev + 1);
```

This avoids stale state bugs during batched or rapid updates.

---

### 7. Reset state intentionally

When state should reset because identity changed:

- prefer keying by stable identity when appropriate
- or reset in a focused, explicit way

Do NOT rely on incidental rerenders or unrelated effects to reset state.

---

### 8. Avoid state that only exists to drive effects

🚫 Avoid patterns like:

- storing temporary flags only to trigger a `useEffect`
- creating state solely to mirror another value

Prefer:

- direct event-driven logic
- derived values
- reducer transitions when state is truly event-based

---

### 9. Prefer reducers for complex transitions, not for simple values

Use `useReducer` when:

- state transitions are complex
- many actions affect the same state domain
- logic benefits from explicit event-based transitions

Do NOT switch simple local state to reducers without a real complexity benefit.

---

## Refactoring Guidance

When reviewing existing code:

- remove redundant state
- replace derived state with inline computation or `useMemo`
- reduce multiple sources of truth to one owner
- remove prop-sync effects unless clearly justified
- replace mirrored state with IDs or canonical values
- simplify complex state shapes
- move state closer to where it is used when possible
- introduce a reducer only if transitions are genuinely complex

---

## Anti-Patterns (Avoid)

- copying props into state by default
- storing filtered/sorted/mapped data in state without a strong reason
- keeping both object and ID when one can derive the other
- storing booleans that can be derived from existing state
- duplicating the same state across parent and child
- using effects to keep two pieces of state in sync
- giant catch-all state objects
- lifting state too early
- state that exists only to trigger another state update

---

## Decision Checklist

Before adding state, ask:

1. Can this be derived during render?
2. Is there already a source of truth for this?
3. Does this state need to persist across renders, or is it just a computed value?
4. Should this state live closer to where it is used?
5. Will this state drift out of sync with props or other state?
6. Would an ID or smaller canonical value be enough instead of storing a full object?
7. Is a reducer actually warranted, or is simple state clearer?

If the answer suggests derivation or simplification, do not add more state.

---

## Workflow

1. Read the entire component or state domain
2. Identify all state variables and their owners
3. Mark which values are canonical vs derived
4. Check for duplicated or mirrored state
5. Check for prop-to-state syncing
6. Simplify to the minimum necessary state
7. Verify update paths remain correct
8. Preserve behavior unless a behavior change is explicitly requested

---

## Verification

Run:

- npm run lint
- npm run build

Manually verify:

- no stale UI after updates
- no state drift between parent and child
- no broken resets
- no conflicting state after rapid interactions
- derived values still update correctly

---

## Output Style

- Briefly explain state integrity issues found
- Apply minimal, safe fixes
- Preserve existing behavior unless change is required

Summarize:

- what state was removed, simplified, or consolidated
- why the new structure is safer or easier to reason about

Do NOT introduce unrelated refactors.

---

## Summary Rule

👉 Store the minimum state necessary  
👉 Derive whenever possible  
👉 Keep one source of truth for each concept
