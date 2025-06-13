import type { BoardCell, GameConfig } from '@/types/game'
import { distributePrizes } from './prizeUtils'

export function createBoard(config: GameConfig): BoardCell[] {
  const { boardSize } = config
  const totalCells = boardSize * boardSize
  const distributedPrizes = distributePrizes(config.prizes, boardSize, config.emptySlotText)
  
  const board: BoardCell[] = []
  
  for (let i = 0; i < totalCells; i++) {
    board.push({
      number: i + 1,
      prize: distributedPrizes[i],
      isRevealed: false
    })
  }
  
  return board
}

export function getGridCols(boardSize: number): string {
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10'
  }
  
  return gridColsMap[boardSize] || 'grid-cols-5'
}

export function calculateProgress(revealedCount: number, totalCells: number): number {
  return Math.round((revealedCount / totalCells) * 100)
} 