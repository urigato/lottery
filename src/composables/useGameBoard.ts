import { computed } from 'vue'
import type { GameState, GameConfig, GamePhase } from '@/types/game'
import { createBoard } from '@/utils/boardUtils'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'lottery-game-state'

export function useGameBoard() {
  const [gameState, setGameState] = useLocalStorage<GameState | null>(STORAGE_KEY, null)
  
  const isGameActive = computed(() => gameState.value !== null)
  const currentPhase = computed<GamePhase>(() => {
    if (!gameState.value) return 'setup'
    if (gameState.value.revealedCount === gameState.value.totalCells) return 'finished'
    return 'playing'
  })
  
  const progress = computed(() => {
    if (!gameState.value) return 0
    return Math.round((gameState.value.revealedCount / gameState.value.totalCells) * 100)
  })
  
  const createGame = (config: GameConfig) => {
    const board = createBoard(config)
    const totalCells = config.boardSize * config.boardSize
    
    const newGameState: GameState = {
      config,
      board,
      revealedCount: 0,
      totalCells
    }
    
    setGameState(newGameState)
  }
  
  const revealCell = (cellNumber: number) => {
    if (!gameState.value) return
    
    const cellIndex = cellNumber - 1
    const cell = gameState.value.board[cellIndex]
    
    if (cell && !cell.isRevealed) {
      cell.isRevealed = true
      gameState.value.revealedCount++
      
      // 상태 업데이트를 트리거하기 위해 새 객체로 설정
      setGameState({ ...gameState.value })
    }
  }
  
  const resetGame = () => {
    setGameState(null)
  }
  
  const restartGame = () => {
    if (gameState.value) {
      createGame(gameState.value.config)
    }
  }
  
  return {
    gameState,
    isGameActive,
    currentPhase,
    progress,
    createGame,
    revealCell,
    resetGame,
    restartGame
  }
} 