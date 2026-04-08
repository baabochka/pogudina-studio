# Hide & Squeak

Grid-based puzzle game feature notes for developers.

## Folder Structure

- `types.ts`: domain types for board, rounds, answers, hints, review, and session state
- `boardConstraints.ts`: board size, item definitions, and board-level limits
- `difficultyPresets.ts`: easy/medium/hard/super-hard round rules
- `scoreSettings.ts` / `timerSettings.ts`: tuneable scoring and timer behavior
- `boardGeneration.ts`: item placement and board creation
- `roundGeneration.ts`: start selection and command sequence generation
- `answerGeneration.ts`: multiple choice and typed answer helpers
- `sessionState.ts`: reducer and session state transitions
- `HideSqueakGame.tsx`: feature entry and gameplay wiring
- `HideSqueakBoardSurface.tsx`: board/grid/coordinate surface
- `HideSqueakCommandPanel.tsx`: command list and hint actions
- `HideSqueakAnswerPanel.tsx`: easy/medium/hard/super-hard answer region
- `HideSqueakReviewPanel.tsx`: previous-round review UI
- `itemAssets/`: item SVG registry, token config, and family renderers

## Core Architecture

- Pure generation/config lives in plain TypeScript modules.
- Session flow lives in `sessionState.ts` as explicit phases, not scattered booleans.
- UI components stay fairly flat:
  - game shell
  - board surface
  - command panel
  - answer panel
  - review panel

## Generation Logic

- Board item placement: `boardGeneration.ts`
- Puzzle path generation and backtracking: `roundGeneration.ts`
- Answer model generation: `answerGeneration.ts`

## UI State

- Shared game/session state: `sessionState.ts`
- Local presentational state:
  - command display mode
  - board focus
  - typed input value

## Difficulty Presets

- Edit `difficultyPresets.ts`
- Each preset controls:
  - answer input mode
  - mouse visibility
  - supported play modes
  - command count range
  - step range
  - final-step extension

## Hints, Review, Timer

- Hints:
  - state in `sessionState.ts`
  - UI trigger/highlight in `HideSqueakCommandPanel.tsx`
  - revealed mouse position uses precomputed `commandSteps`
- Review:
  - previous round snapshot stored in session state
  - UI in `HideSqueakReviewPanel.tsx`
  - supports step-by-step and full-path modes
- Timer:
  - config in `timerSettings.ts`
  - ticking wired in `HideSqueakGame.tsx`
  - pause behavior derived from session phase in `sessionState.ts`

## Add A Recolor

1. Open `itemAssets/registry.ts`.
2. Add a new entry under the family `colorVariants`.
3. Override only the token values that should change.
4. Reference that `colorVariant` from an item definition or pinned item.

## Add A New Family

1. Add a new SVG renderer in `itemAssets/families/`.
2. Define its default tokens, optional color variants, and detail variants in `itemAssets/registry.ts`.
3. Register it in `HIDE_SQUEAK_ITEM_ASSET_REGISTRY`.
4. Point item definitions at the new `family`.

## Codex Prompt Template

```text
Extend Hide & Squeak in src/features/games/hide_squeak.

Goal:
- [describe the feature]

Constraints:
- preserve the flat component structure
- keep generation logic pure
- keep session flow in sessionState.ts
- avoid oversized overlays

Touch these areas if needed:
- generation: boardGeneration.ts / roundGeneration.ts / answerGeneration.ts
- state: sessionState.ts
- UI: HideSqueakGame.tsx and focused panel components
- assets: itemAssets/

After changes:
- summarize what changed
- report build/lint results
```
