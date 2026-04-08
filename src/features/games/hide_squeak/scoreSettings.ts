export interface HideSqueakScoreSettings {
  basePointsPerCorrectRound: number
  streakBonusStep: number
  maxStreakBonus: number
  hintPenaltyPerUse: number
  wrongAnswerPenalty: number
}

export const HIDE_SQUEAK_SCORE_SETTINGS: HideSqueakScoreSettings = {
  basePointsPerCorrectRound: 10,
  streakBonusStep: 2,
  maxStreakBonus: 10,
  hintPenaltyPerUse: 2,
  wrongAnswerPenalty: 0,
}
