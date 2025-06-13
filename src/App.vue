<template>
  <div id="app">
    <!-- 게임 설정 화면 -->
    <GameSetup
      v-if="currentPhase === 'setup'"
      :has-saved-game="isGameActive"
      @create-game="handleCreateGame"
      @load-saved="handleLoadSaved"
    />
    
    <!-- 게임 보드 화면 -->
    <GameBoard
      v-else-if="gameState && (currentPhase === 'playing' || currentPhase === 'finished')"
      :game-state="gameState"
      :current-phase="currentPhase"
      :progress="progress"
      @reveal-cell="handleRevealCell"
      @reset-game="handleResetGame"
      @restart-game="handleRestartGame"
    />
  </div>
</template>

<script setup lang="ts">
import { useGameBoard } from '@/composables/useGameBoard'
import GameSetup from '@/components/GameSetup.vue'
import GameBoard from '@/components/GameBoard.vue'
import type { GameConfig } from '@/types/game'

const {
  gameState,
  isGameActive,
  currentPhase,
  progress,
  createGame,
  revealCell,
  resetGame,
  restartGame
} = useGameBoard()

const handleCreateGame = (config: GameConfig) => {
  createGame(config)
}

const handleLoadSaved = () => {
  // 이미 저장된 게임이 있으므로 별도 처리 불필요
  // gameState가 이미 로드되어 있음
}

const handleRevealCell = (cellNumber: number) => {
  revealCell(cellNumber)
}

const handleResetGame = () => {
  resetGame()
}

const handleRestartGame = () => {
  restartGame()
}
</script>

<style>
/* 전역 스타일 */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 접근성을 위한 포커스 스타일 */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 버튼의 기본 스타일 리셋 */
button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

/* 입력 필드의 기본 스타일 */
input, select, textarea {
  font-family: inherit;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 