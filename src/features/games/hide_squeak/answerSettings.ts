import type { HideSqueakCoordinateRange } from './types'

export interface HideSqueakAnswerSettings {
  hardChoiceCountRange: HideSqueakCoordinateRange
  nearbyDistractorDistance: number
}

export const HIDE_SQUEAK_ANSWER_SETTINGS: HideSqueakAnswerSettings = {
  hardChoiceCountRange: {
    min: 4,
    max: 6,
  },
  nearbyDistractorDistance: 2,
}
