export interface HideSqueakTimerSettings {
  defaultTimedDurationSeconds: number
  pauseDuringRules: boolean
  pauseDuringPreviousRoundReview: boolean
  pauseDuringRoundGeneration: boolean
  pauseDuringHintInspection: boolean
}

export const HIDE_SQUEAK_TIMER_SETTINGS: HideSqueakTimerSettings = {
  defaultTimedDurationSeconds: 120,
  pauseDuringRules: true,
  pauseDuringPreviousRoundReview: true,
  pauseDuringRoundGeneration: true,
  pauseDuringHintInspection: false,
}
