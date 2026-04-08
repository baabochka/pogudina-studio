import type {
  HideSqueakDifficulty,
  HideSqueakPlayMode,
  HideSqueakRoundRules,
} from './types'

export interface HideSqueakDifficultyPreset {
  difficulty: HideSqueakDifficulty
  answerInput: 'board-click' | 'multiple-choice' | 'coordinate-entry'
  showMouseOnBoard: boolean
  showStartingCoordinateText: boolean
  choiceCount: number
  allowsHints: boolean
  supportedPlayModes: HideSqueakPlayMode[]
  rules: HideSqueakRoundRules
}

export const HIDE_SQUEAK_DIFFICULTY_PRESETS: Record<
  HideSqueakDifficulty,
  HideSqueakDifficultyPreset
> = {
  easy: {
    difficulty: 'easy',
    answerInput: 'board-click',
    showMouseOnBoard: true,
    showStartingCoordinateText: false,
    choiceCount: 0,
    allowsHints: true,
    supportedPlayModes: ['endless', 'timed'],
    rules: {
      commandCount: { min: 3, max: 4 },
      stepRange: { min: 1, max: 2 },
      finalStepRangeExtension: 1,
      allowLoops: true,
      preventImmediateReverse: true,
      finalCommandMustLandOnItem: true,
    },
  },
  medium: {
    difficulty: 'medium',
    answerInput: 'board-click',
    showMouseOnBoard: true,
    showStartingCoordinateText: false,
    choiceCount: 0,
    allowsHints: true,
    supportedPlayModes: ['endless', 'timed'],
    rules: {
      commandCount: { min: 4, max: 6 },
      stepRange: { min: 1, max: 3 },
      finalStepRangeExtension: 1,
      allowLoops: true,
      preventImmediateReverse: true,
      finalCommandMustLandOnItem: true,
    },
  },
  hard: {
    difficulty: 'hard',
    answerInput: 'multiple-choice',
    showMouseOnBoard: false,
    showStartingCoordinateText: true,
    choiceCount: 4,
    allowsHints: true,
    supportedPlayModes: ['endless', 'timed'],
    rules: {
      commandCount: { min: 8, max: 12 },
      stepRange: { min: 1, max: 3 },
      finalStepRangeExtension: 2,
      allowLoops: true,
      preventImmediateReverse: true,
      finalCommandMustLandOnItem: true,
    },
  },
  'super-hard': {
    difficulty: 'super-hard',
    answerInput: 'coordinate-entry',
    showMouseOnBoard: false,
    showStartingCoordinateText: true,
    choiceCount: 0,
    allowsHints: true,
    supportedPlayModes: ['endless', 'timed'],
    rules: {
      commandCount: { min: 10, max: 12 },
      stepRange: { min: 1, max: 4 },
      finalStepRangeExtension: 2,
      allowLoops: true,
      preventImmediateReverse: true,
      finalCommandMustLandOnItem: true,
    },
  },
}
