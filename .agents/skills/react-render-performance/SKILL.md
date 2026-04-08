---
name: react-render-performance
description: Use this skill when editing React components that may re-render too often, pass unstable props, perform expensive work during render, render large lists, or need memoization decisions, to improve performance without adding unnecessary complexity.
---

Use this skill to enforce practical, low-risk React render performance improvements.

---

## Goals

- reduce unnecessary re-renders
- avoid premature or noisy optimization
- keep render paths cheap and predictable
- stabilize props and callbacks only when it matters
- improve performance while preserving readability and behavior

---

## When to Use

Apply this skill when:

- a component re-renders more often than necessary
- props or callbacks are recreated and passed deeply
- expensive computation happens during render
- large lists or grids are rendered
- `React.memo`, `useMemo`, or `useCallback` are being added or reviewed
- debugging sluggish UI, interaction lag, or avoidable render churn
- reviewing performance-sensitive UI such as game boards, dashboards, or interactive controls

---

## Core Principle

👉 Optimize only where there is real render cost or unstable identity causing unnecessary work

Do NOT add memoization everywhere by default.

---

## Core Rules

### 1. Measure or identify the actual source of render cost first

Before optimizing, determine what is actually expensive:

- repeated parent renders
- unstable object/array/function props
- expensive calculations in render
- large list rendering
- unnecessary child re-renders
- layout-heavy interaction paths

Avoid speculative optimization.

---

### 2. Prefer structural fixes before memoization

✅ Prefer:

- moving state closer to where it is used
- reducing prop drilling
- splitting expensive regions from frequently changing regions
- deriving smaller props
- passing stable primitive values when possible

🚫 Avoid reaching for `useMemo` or `useCallback` before checking whether a simpler structural change solves the problem.

---

### 3. Memoize only when identity stability or repeated computation matters

Use `useMemo` when:

- a calculation is meaningfully expensive
- reference stability is needed for a memoized child
- recomputation causes real cost

Use `useCallback` when:

- callback identity materially affects child rendering or subscriptions
- a stable callback is needed for dependency correctness

Do NOT use memoization for trivial computations or purely by habit.

---

### 4. Use React.memo intentionally

Use `React.memo` when:

- a component is expensive enough to benefit
- it often receives the same props
- parent re-renders are frequent
- prop identity can be kept stable

Do NOT wrap everything in `React.memo`.
Do NOT use `React.memo` when props change every render anyway.

---

### 5. Keep render work cheap

Avoid doing expensive work directly in render when it can be:

- derived once with `useMemo`
- moved outside the component
- precomputed earlier
- represented with smaller data

Examples of costly render work:

- repeated sorting/filtering of large arrays
- rebuilding complex lookup maps every render
- allocating many derived objects for children
- repeated SVG-heavy transformations without need

---

### 6. Stabilize props thoughtfully

Prefer passing:

- primitives
- IDs
- canonical values
- already-derived minimal data

Avoid passing freshly created:

- object literals
- array literals
- inline callbacks
  when that causes avoidable child re-renders in performance-sensitive paths.

This does NOT mean all inline values are bad.
Only optimize unstable identities when they are part of an actual render problem.

---

### 7. Treat lists and grids as performance-sensitive by default

For lists, boards, and grids:

- use stable keys
- avoid re-rendering every item when only one item changed
- keep item props minimal
- avoid recreating per-item handlers if it meaningfully affects performance
- isolate highly interactive cells from unrelated parent updates

Do NOT use index as key unless the list is static and order never changes.

---

### 8. Keep state changes as narrow as possible

Frequent updates should affect the smallest possible subtree.

Prefer:

- localized state
- focused updates
- separate components for fast-changing and slow-changing regions

Avoid:

- placing hot interaction state too high in the tree
- re-rendering the entire board/page for one small interaction when avoidable

---

### 9. Avoid performance “fixes” that reduce clarity without real benefit

🚫 Avoid:

- blanket `useMemo` / `useCallback`
- complex custom comparison functions without strong justification
- deep equality checks during render
- premature virtualization for modest lists
- unreadable optimization code with no demonstrated value

✅ Prefer optimizations that are:

- obvious
- local
- reversible
- easy to reason about

---

## Refactoring Guidance

When reviewing existing code:

- remove memoization that adds complexity without benefit
- move expensive derivations out of hot render paths
- stabilize only the props that matter
- split expensive UI regions from frequently updating ones
- reduce avoidable child re-renders
- simplify oversized parent ownership when it causes broad re-render cascades
- preserve behavior and keep the diff small

---

## Anti-Patterns (Avoid)

- wrapping most components in `React.memo` by default
- using `useMemo` for trivial values
- using `useCallback` when callback identity does not matter
- passing large objects when a small primitive would do
- recalculating large derived collections every render without reason
- using unstable keys in lists
- optimizing without identifying the actual bottleneck
- introducing opaque performance code that harms maintainability

---

## Decision Checklist

Before adding a performance optimization, ask:

1. What is actually re-rendering too often?
2. Is the problem computation cost, identity churn, list size, or state ownership?
3. Can a structural change solve this more cleanly than memoization?
4. Does this memoization protect a real expensive path?
5. Will this change keep the code understandable?
6. Are props stable enough for `React.memo` to help?
7. Would moving state lower in the tree reduce the problem more effectively?

If the benefit is unclear, prefer the simpler implementation.

---

## Workflow

1. Read the component tree and identify hot paths
2. Find the actual source of render cost or identity churn
3. Prefer structural simplification first
4. Add targeted memoization only where justified
5. Keep props minimal and stable where it matters
6. Re-check list rendering, keys, and child boundaries
7. Preserve behavior and readability
8. Summarize what was optimized and why

---

## Verification

Run:

- `npm run lint`
- `npm run build`

Manually verify:

- no broken behavior from stale memoized values
- no missed updates due to incorrect memoization
- improved render isolation in the affected path
- stable list behavior and correct keys
- no readability regression from unnecessary optimization

If profiling tools are available, confirm the optimization affected the intended render path.

---

## Output Style

- Briefly explain the performance issue addressed
- Prefer the smallest effective optimization
- Preserve existing behavior unless change is required

Summarize:

- what was optimized
- why that optimization was chosen
- what broader optimizations were intentionally not added

Do NOT introduce unrelated refactors.

---

## Summary Rule

👉 Fix the real render bottleneck, not the imagined one  
👉 Prefer structural simplification before memoization  
👉 Optimize only where the benefit is clear
