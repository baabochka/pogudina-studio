---
name: react-effect-safety
description: Use this skill when editing React components that use useEffect, async logic, event listeners, timers, or subscriptions, to ensure correct dependencies, cleanup, and avoidance of memory leaks, stale data, or unnecessary effects.
---

Use this skill to enforce correct, minimal, and safe usage of React `useEffect`.

---

## Goals

- prevent memory leaks
- avoid stale closures and race conditions
- ensure correct dependency usage
- avoid unnecessary or misused effects
- keep effects minimal and intentional

---

## When to Use

Apply this skill when:

- editing or adding `useEffect`
- working with:
  - API calls
  - timers (`setTimeout`, `setInterval`)
  - event listeners
  - subscriptions
- debugging unexpected re-renders or stale state
- reviewing React component logic

---

## Core Rules

### 1. Only use useEffect when necessary

`useEffect` is for **side effects**, not calculations.

🚫 Do NOT use for:

- derived state
- filtering or mapping data
- simple value computation

✅ Prefer:

- inline calculation
- `useMemo` when needed

---

### 2. Always validate dependencies

- Include all variables used inside the effect
- Do NOT omit dependencies to “control execution”
- Do NOT disable lint rules for dependencies

Watch for:

- infinite loops
- stale values
- missing dependencies

---

### 3. Always clean up side effects (CRITICAL)

If an effect creates something persistent, it MUST clean it up.

---

## Common Side Effects That Require Cleanup

### Event listeners

```tsx
useEffect(() => {
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);
```

### Timers

```tsx
useEffect(() => {
  const id = setInterval(fn, 1000);
  return () => clearInterval(id);
}, []);
```

### Async requests

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(() => {})
    .catch(() => {});

  return () => controller.abort();
}, [url]);
```

Rules:

- cancel or ignore outdated requests
- ensure only the latest result is used
- avoid setting state after unmount

---

### 4. Avoid stale closures

- Do not rely on outdated state inside effects

Prefer:

- functional state updates
- stable references
- memoized callbacks when needed

---

### 5. Avoid race conditions

- Multiple async calls must not overwrite each other incorrectly
- Ensure latest request wins
- Cancel or ignore stale responses

---

### 6. Split concerns

👉 One effect = one responsibility

🚫 Avoid:

- large “do everything” effects
- mixing unrelated logic

✅ Prefer:

- multiple small, focused effects

---

## Refactoring Guidance

When reviewing existing code:

- remove unnecessary `useEffect`
- replace derived state with inline logic or `useMemo`
- fix dependency arrays
- add missing cleanup
- simplify effect logic
- split overly complex effects

---

## Anti-Patterns (Avoid)

- useEffect for derived values
- missing cleanup for timers/listeners
- empty dependency arrays hiding bugs
- disabling ESLint rules for hooks
- updating state after unmount
- large multi-purpose effects

---

## Workflow

1. Read the entire component
2. Identify all side effects
3. Validate necessity of each effect
4. Fix dependencies
5. Add or verify cleanup
6. Check for stale closures
7. Check for race conditions
8. Simplify or split effects if needed

---

## Verification

Run:

- npm run lint (react-hooks rules)
- npm run build

Manually verify:

- no duplicate listeners
- no memory leaks
- no infinite loops
- no stale data behavior

---

## Output Style

- Briefly explain issues found
- Apply minimal, safe fixes
- Preserve existing behavior unless change is required

Summarize:

- what changed
- why it was needed

Do NOT introduce unrelated refactors.

---

## Summary Rule

👉 Effects should be rare, minimal, and correct  
👉 If it creates something → it must clean it up  
👉 If it can be computed → it should NOT be an effect
