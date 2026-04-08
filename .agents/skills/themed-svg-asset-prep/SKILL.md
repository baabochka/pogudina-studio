# Themed SVG Asset Prep

## Purpose

Clean and standardize SVG assets exported from Illustrator so they are:

- lightweight and readable
- consistent across the project
- safe for theming and recoloring
- easy to extend into item families

This skill is designed for **game item assets**, not complex illustrations or decorative artwork.

---

## When to Use

Use this skill when:

- importing new SVG assets from Illustrator
- preparing assets for the game item system
- converting assets into reusable, themeable components
- cleaning up `.cls-*` styles and `<defs>` noise

Do NOT use this skill for:

- complex scene illustrations
- decorative backgrounds
- already-clean, tokenized SVGs

---

## Core Principles

1. Preserve visual appearance.
2. Remove Illustrator export noise.
3. Keep meaningful structure only.
4. Enable semantic theming via CSS variables.
5. Keep assets readable and maintainable.
6. Avoid over-optimization or destructive flattening.

---

## Naming Conventions

Use semantic, consistent naming:

- `<Item>_light`
- `<Item>_shade`
- `<Item>_details`
- `<Item>_leaf`
- `<Item>_stem`
- `<Item>_highlight`

Examples:

- `Apple_light`
- `Apple_details`
- `Shoe_shade`

### `_details`

Use `_details` for:

- accents
- highlights
- small decorative parts
- elements not intended for recoloring

Do NOT place major color regions inside `_details`.

---

## Theming System (Matches Paws and Think)

Use semantic CSS variables instead of hardcoded colors.

### Pattern

- `--outline`
- `--apple-light`
- `--apple-shade`
- `--apple-leaf`
- `--apple-stem`
- `--shoe-light`
- `--shoe-shade`

### Rules

- Tokens describe **parts**, not colors
- Avoid raw color names like `--red`, `--green`
- Use fallback values if helpful:
  - `fill="var(--apple-detail, #f8aba6)"`

---

## Cleanup Rules

### 1. Remove Illustrator Noise

Remove:

- XML header (if not required)
- `id="Layer_1"`
- `data-name="Layer 1"`
- `<defs>` blocks with `.cls-*`
- unused styles
- generic class names (`cls-1`, `cls-2`, etc.)

---

### 2. Replace Classes with Inline or Grouped Attributes

- Remove `.cls-*` usage
- Apply attributes directly to elements or meaningful groups
- Do not keep class indirection unless necessary

---

### 3. Preserve Meaningful Structure

Keep groups only if they represent:

- visual parts
- theming boundaries
- reusable segments

Remove groups that:

- are redundant
- have no semantic meaning
- contain a single child without purpose

---

### 4. Move Shared Attributes Carefully

Move attributes (fill, stroke, etc.) to a parent `<g>` ONLY if:

- all children share the attribute
- it does not change rendering
- it does not affect future theming
- it does not interfere with layering

Be careful with:

- fill inheritance
- stroke inheritance
- opacity
- transforms
- stacking order

---

### 5. Preserve Layer Order

Do NOT reorder elements.

Always maintain:

- visual stacking
- highlight overlays
- shading order

This is critical.

---

### 6. Replace Hardcoded Colors

Convert:

```svg
fill="#d2212f"
```

Into:

```svg
fill="var(--apple-light)"
```

Use semantic tokens for all recolorable parts.

---

### 7. Normalize Stroke Usage

- Use `--outline` for strokes where possible
- Move shared stroke props to group level only when safe
- Keep stroke settings if they affect appearance

Example:

```svg
stroke="var(--outline)"
stroke-width="2"
stroke-miterlimit="10"
```

---

### 8. Do Not Over-Flatten

Do NOT:

- merge paths unnecessarily
- remove important structure
- reduce editability
- collapse meaningful parts

Goal: **clean, not minimal**

---

## Expected Output Style

Clean, semantic, readable:

```svg
<svg viewBox="0 0 56.3 51.73">
  <g stroke="var(--outline)" stroke-miterlimit="10">
    <path
      id="Apple_light"
      fill="var(--apple-light)"
      stroke-width="2"
      d="..."
    />
    <g id="Apple_details">
      <path fill="var(--apple-leaf)" d="..." />
      <path fill="var(--apple-stem)" d="..." />
      <path fill="var(--apple-detail, #f8aba6)" stroke="none" d="..." />
    </g>
  </g>
</svg>
```

---

## Decision Rules

### Keep a group if:

- it represents a meaningful part
- it enables recoloring
- it improves readability

### Remove a group if:

- it has no semantic purpose
- it only wraps one element unnecessarily
- it is export noise

---

## Batch Workflow

1. Clean 1–2 representative assets first
2. Confirm naming + token pattern
3. Apply consistently to all assets
4. Avoid inventing new conventions mid-batch

---

## Prompt Template (Single Asset)

Use this skill to clean a single SVG:

- preserve appearance
- remove Illustrator noise
- replace `.cls-*` with semantic structure
- keep `_details` for accents
- apply CSS variable tokens
- preserve layer order
- avoid over-flattening

Then summarize:

1. structure decisions
2. token mapping
3. group changes

---

## Prompt Template (Batch)

Use this skill to clean multiple SVG assets:

- standardize naming
- remove export noise
- apply semantic tokens
- preserve structure and layering
- keep assets readable

Start with 2 assets, confirm pattern, then apply to all.

---

## Final Notes

- Follow Paws and Think theming philosophy
- Prefer clarity over cleverness
- Do not introduce unnecessary abstraction
- Keep assets easy to extend into families

---
