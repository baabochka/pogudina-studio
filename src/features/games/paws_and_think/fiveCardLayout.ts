export type FiveCardSlot = {
  height: number
  width: number
  x: number
  y: number
}

export const FIVE_CARD_LAYOUT_VIEWBOX = {
  width: 494.68,
  height: 458.26,
} as const

const ALL_FIVE_CARD_SLOTS: FiveCardSlot[] = [
  { x: 49.16, y: 51.47, width: 114.24, height: 171.33 },
  { x: 176.19, y: 51.47, width: 114.24, height: 171.33 },
  { x: 303.22, y: 51.47, width: 114.24, height: 171.33 },
  { x: 49.16, y: 235.69, width: 114.24, height: 171.33 },
  { x: 176.19, y: 235.69, width: 114.24, height: 171.33 },
  { x: 303.22, y: 235.69, width: 114.24, height: 171.33 },
]

// The current five-card mode uses the top row and the two lower outer slots,
// leaving the lower middle slot open to keep the layout visually balanced.
export const FIVE_CARD_SLOTS: FiveCardSlot[] = [
  ALL_FIVE_CARD_SLOTS[0],
  ALL_FIVE_CARD_SLOTS[1],
  ALL_FIVE_CARD_SLOTS[2],
  ALL_FIVE_CARD_SLOTS[3],
  ALL_FIVE_CARD_SLOTS[5],
]

