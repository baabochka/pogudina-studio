export type HideSqueakAxis = 'row' | 'column'

export type HideSqueakDirection = 'up' | 'right' | 'down' | 'left'

export type HideSqueakDifficulty = 'easy' | 'medium' | 'hard' | 'super-hard'

export type HideSqueakPlayMode = 'endless' | 'timed'

export type HideSqueakValidationResult = 'idle' | 'correct' | 'wrong' | 'revealed'

export type HideSqueakCoordinateFormat = 'alpha-numeric' | 'tuple'

export type HideSqueakAnswerInput = 'board-click' | 'multiple-choice' | 'coordinate-entry'

export type HideSqueakReviewVisibility = 'step-by-step' | 'full-path'

export type HideSqueakCellKind = 'empty' | 'item' | 'blocked'

export type HideSqueakItemKind =
  | 'apple'
  | 'bagel'
  | 'book'
  | 'candy'
  | 'cheese'
  | 'comb'
  | 'mouse-trap'
  | 'mug'
  | 'shoe'
  | 'soap'
  | 'toothbrush'

export type HideSqueakItemFamily = 'classic'

export type HideSqueakBoardLayoutMode = 'random' | 'pinned'

export type HideSqueakBoardLayoutSource = 'generated' | 'preset'

export type HideSqueakRoundResult = 'correct' | 'wrong' | 'timed-out'

export type HideSqueakSessionPhase =
  | 'boot'
  | 'rules'
  | 'generating-round'
  | 'playing'
  | 'hint'
  | 'round-review'
  | 'paused'
  | 'finished'

export interface HideSqueakCoordinate {
  row: number
  column: number
}

export interface HideSqueakBoardSize {
  rows: number
  columns: number
}

export interface HideSqueakBoardBounds {
  minRow: number
  maxRow: number
  minColumn: number
  maxColumn: number
}

export interface HideSqueakCoordinateRange {
  min: number
  max: number
}

export interface HideSqueakCell {
  coordinate: HideSqueakCoordinate
  kind: HideSqueakCellKind
  itemId?: string
}

export interface HideSqueakItemDefinition {
  id: string
  kind: HideSqueakItemKind
  family: HideSqueakItemFamily
  colorVariant?: string | null
  detailVariant?: string | null
}

export interface HideSqueakItem extends HideSqueakItemDefinition {
  coordinate: HideSqueakCoordinate
}

export interface HideSqueakBoard {
  size: HideSqueakBoardSize
  cells: HideSqueakCell[]
  items: HideSqueakItem[]
  startingCoordinate: HideSqueakCoordinate | null
}

export interface HideSqueakBoardItemConstraints {
  minTotalItems: number
  maxItemsPerRow: number
  maxItemsPerColumn: number
}

export interface HideSqueakRandomBoardDefinition {
  mode: 'random'
  itemDefinitions: HideSqueakItemDefinition[]
}

export interface HideSqueakPinnedBoardDefinition {
  mode: 'pinned'
  items: HideSqueakItem[]
}

export type HideSqueakBoardDefinition =
  | HideSqueakRandomBoardDefinition
  | HideSqueakPinnedBoardDefinition

export interface HideSqueakBoardGenerationResult {
  board: HideSqueakBoard
  emptyCoordinates: HideSqueakCoordinate[]
  source: HideSqueakBoardLayoutSource
}

export interface HideSqueakCommand {
  direction: HideSqueakDirection
  steps: number
}

export interface HideSqueakCommandStep {
  index: number
  command: HideSqueakCommand
  from: HideSqueakCoordinate
  to: HideSqueakCoordinate
}

export interface HideSqueakRoundAnswerOption {
  id: string
  coordinate: HideSqueakCoordinate
  label: string
  isCorrect: boolean
}

export interface HideSqueakBoardCellAnswerModel {
  kind: 'board-cell'
  correctCoordinate: HideSqueakCoordinate
  correctLabel: string
}

export interface HideSqueakMultipleChoiceAnswerModel {
  kind: 'multiple-choice'
  correctCoordinate: HideSqueakCoordinate
  correctLabel: string
  options: HideSqueakRoundAnswerOption[]
}

export interface HideSqueakTypedCoordinateAnswerModel {
  kind: 'typed-coordinate'
  correctCoordinate: HideSqueakCoordinate
  correctLabel: string
}

export type HideSqueakAnswerModel =
  | HideSqueakBoardCellAnswerModel
  | HideSqueakMultipleChoiceAnswerModel
  | HideSqueakTypedCoordinateAnswerModel

export interface HideSqueakTypedAnswerValidation {
  input: string
  parsedCoordinate: HideSqueakCoordinate | null
  normalizedLabel: string | null
  isValidFormat: boolean
  isCorrect: boolean
}

export interface HideSqueakRoundRules {
  commandCount: HideSqueakCoordinateRange
  stepRange: HideSqueakCoordinateRange
  finalStepRangeExtension: number
  allowLoops: boolean
  preventImmediateReverse: boolean
  finalCommandMustLandOnItem: boolean
}

export interface HideSqueakGeneratedRound {
  id: string
  board: HideSqueakBoard
  difficulty: HideSqueakDifficulty
  startingCoordinate: HideSqueakCoordinate
  commands: HideSqueakCommand[]
  commandSteps: HideSqueakCommandStep[]
  intermediatePositions: HideSqueakCoordinate[]
  finalCoordinate: HideSqueakCoordinate
  answer: HideSqueakCoordinate
  answerModel: HideSqueakAnswerModel | null
  targetItem: HideSqueakItem
  answerOptions: HideSqueakRoundAnswerOption[]
}

export interface HideSqueakHintState {
  hintsUsedThisRound: number
  revealedStepIndex: number | null
  highlightedCommandIndex: number | null
  isOpen: boolean
}

export interface HideSqueakReviewState {
  isOpen: boolean
  visibility: HideSqueakReviewVisibility
  roundId: string | null
  selectedStepIndex: number | null
}

export interface HideSqueakPreviousRoundSnapshot {
  round: HideSqueakGeneratedRound
  result: HideSqueakRoundResult
  selectedAnswer: HideSqueakCoordinate | null
  revealedAnswerLabel: string
  scoreAfterRound: number
  streakAfterRound: number
}

export interface HideSqueakTimerState {
  isEnabled: boolean
  isPaused: boolean
  totalSeconds: number
  remainingSeconds: number
}

export interface HideSqueakRoundProgress {
  roundNumber: number
  score: number
  streak: number
  bestTimedScore: number
  validationResult: HideSqueakValidationResult
  selectedAnswer: HideSqueakCoordinate | null
}

export interface HideSqueakSessionState {
  phase: HideSqueakSessionPhase
  difficulty: HideSqueakDifficulty
  playMode: HideSqueakPlayMode
  currentRound: HideSqueakGeneratedRound | null
  previousRound: HideSqueakPreviousRoundSnapshot | null
  progress: HideSqueakRoundProgress
  hintState: HideSqueakHintState
  reviewState: HideSqueakReviewState
  timer: HideSqueakTimerState
}
