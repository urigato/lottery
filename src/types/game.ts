export interface Prize {
  name: string
  quantity: number
}

export interface GameConfig {
  title: string
  boardSize: number
  prizes: Prize[]
  emptySlotText: string
}

export interface BoardCell {
  number: number
  prize: string
  isRevealed: boolean
}

export interface GameState {
  config: GameConfig
  board: BoardCell[]
  revealedCount: number
  totalCells: number
}

export type GamePhase = 'setup' | 'playing' | 'finished' 