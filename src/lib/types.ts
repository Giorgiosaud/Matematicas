import type { TopicId } from './topics/types'

// El ejercicio y el contrato de tema viven en `./topics/types`; se reexportan
// aquí para que las pantallas sigan importando sus tipos desde un solo lugar.
export type { Exercise, TopicId } from './topics/types'

export type Screen = 'home' | 'game' | 'soloGame' | 'scoreboard'

export type PlayerKey = 'q' | 'p'

export type GameMode = 'multiplayer' | 'solo'

export interface GameConfig {
  mode: GameMode
  player1Name: string
  player2Name: string
  pointsToWin: number
  timerSeconds: number
  questionLimit: number
  topics: TopicId[]
}

export interface LeaderboardEntry {
  name: string
  bestStreak: number
  bestAccuracy: number
  bestScore: number
  bestTimerSeconds: number
  totalSessions: number
}

export interface SoloHighScore {
  bestStreak: number
  bestAccuracy: number   // percentage 0-100, only updated past a minimum sample size
  totalSessions: number
  updatedAt: string      // ISO date
}

export interface FractionValue {
  numerator: number
  denominator: number
}

export interface RoundResult {
  winner: PlayerKey | null
  correct: boolean
}

export interface Scores {
  q: number
  p: number
}
