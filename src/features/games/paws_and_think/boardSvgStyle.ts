import type { CSSProperties } from "react";

import { basePalettes, fixedDetails, neutrals } from "./palettes";

export const BOARD_ART_STYLE: CSSProperties = {
  "--white": neutrals.white,
  "--black": neutrals.black,
  "--outline": neutrals.black,
  "--board-light": fixedDetails.board.light,
  "--board-light-fill": fixedDetails.board.light,
  "--board-dark": fixedDetails.board.dark,
  "--cat-light": basePalettes.orange.light,
  "--cat-shade": basePalettes.orange.shade,
  "--mouse-light": basePalettes.grey.light,
  "--mouse-shade": basePalettes.grey.shade,
  "--cheese-light": basePalettes.yellow.light,
  "--cheese-shade": basePalettes.yellow.shade,
  "--ball-light": basePalettes.blue.light,
  "--ball-shade": basePalettes.blue.shade,
  "--pillow-light": basePalettes.red.light,
  "--pillow-shade": basePalettes.red.shade,
  "--accent-light": fixedDetails.accent.light,
  "--accent-shade": fixedDetails.accent.shade,
} as CSSProperties;
