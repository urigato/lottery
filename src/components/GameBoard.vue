<template>
  <div class="game-container">
    <!-- 게임 헤더 -->
    <div class="game-header">
      <div class="game-info">
        <h1 class="game-title">{{ gameState.config.title }}</h1>
        <div class="game-stats">
          <div class="stat-item">
            <span class="stat-label">진행률:</span>
            <span class="stat-value">{{ progress }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">공개:</span>
            <span class="stat-value">{{ gameState.revealedCount }}/{{ gameState.totalCells }}</span>
          </div>
        </div>
      </div>
      
      <div class="game-controls">
        <button @click="handleExportConfig" class="control-btn export-btn">
          📁 설정 내보내기
        </button>
        <button @click="showResetConfirm = true" class="control-btn reset-btn">
          🔄 새 게임
        </button>
        <button @click="showRestartConfirm = true" class="control-btn restart-btn">
          ↩️ 다시 시작
        </button>
      </div>
    </div>

    <!-- 진행률 바 -->
    <div class="progress-section">
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <div class="progress-text">{{ progress }}% 완료</div>
    </div>

    <!-- 게임 보드 -->
    <div class="board-container">
      <div 
        class="game-board" 
        :class="gridClass"
      >
        <BoardCell
          v-for="cell in gameState.board"
          :key="cell.number"
          :cell="cell"
          @reveal="handleCellReveal"
        />
      </div>
    </div>

    <!-- 게임 완료 모달 -->
    <div v-if="currentPhase === 'finished'" class="modal-overlay" @click="closeFinishModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">🎉 게임 완료!</h2>
        <p class="modal-message">모든 상품이 공개되었습니다.</p>
        <div class="modal-actions">
          <button @click="restartGame" class="modal-btn primary">
            다시 시작
          </button>
          <button @click="resetGame" class="modal-btn secondary">
            새 게임
          </button>
          <button @click="closeFinishModal" class="modal-btn">
            닫기
          </button>
        </div>
      </div>
    </div>

    <!-- 새 게임 확인 모달 -->
    <div v-if="showResetConfirm" class="modal-overlay" @click="showResetConfirm = false">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">⚠️ 새 게임</h2>
        <p class="modal-message">현재 게임을 종료하고 새 게임을 시작하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="confirmReset" class="modal-btn danger">
            확인
          </button>
          <button @click="showResetConfirm = false" class="modal-btn">
            취소
          </button>
        </div>
      </div>
    </div>

    <!-- 다시 시작 확인 모달 -->
    <div v-if="showRestartConfirm" class="modal-overlay" @click="showRestartConfirm = false">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">🔄 다시 시작</h2>
        <p class="modal-message">같은 설정으로 게임을 다시 시작하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="confirmRestart" class="modal-btn primary">
            확인
          </button>
          <button @click="showRestartConfirm = false" class="modal-btn">
            취소
          </button>
        </div>
      </div>
    </div>

    <!-- 상품 공개 알림 -->
    <Transition name="prize-reveal">
      <div v-if="revealedPrize" class="prize-notification">
        <div class="prize-content">
          <div class="prize-number">{{ revealedPrize.number }}번</div>
          <div class="prize-name">{{ revealedPrize.prize }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GameState, GamePhase } from '@/types/game'
import { getGridCols } from '@/utils/boardUtils'
import { useFileOperations } from '@/composables/useFileOperations'
import BoardCell from './BoardCell.vue'

interface Props {
  gameState: GameState
  currentPhase: GamePhase
  progress: number
}

interface Emits {
  (e: 'reveal-cell', cellNumber: number): void
  (e: 'reset-game'): void
  (e: 'restart-game'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { exportGameConfig } = useFileOperations()

const showResetConfirm = ref(false)
const showRestartConfirm = ref(false)
const showFinishModal = ref(true)
const revealedPrize = ref<{ number: number; prize: string } | null>(null)

const gridClass = computed(() => getGridCols(props.gameState.config.boardSize))

const handleCellReveal = (cellNumber: number) => {
  const cell = props.gameState.board.find(c => c.number === cellNumber)
  if (cell) {
    // 상품 공개 애니메이션
    revealedPrize.value = {
      number: cellNumber,
      prize: cell.prize
    }
    
    // 3초 후 알림 제거
    setTimeout(() => {
      revealedPrize.value = null
    }, 3000)
  }
  
  emit('reveal-cell', cellNumber)
}

const confirmReset = () => {
  showResetConfirm.value = false
  emit('reset-game')
}

const confirmRestart = () => {
  showRestartConfirm.value = false
  emit('restart-game')
}

const resetGame = () => {
  emit('reset-game')
}

const restartGame = () => {
  emit('restart-game')
}

const closeFinishModal = () => {
  showFinishModal.value = false
}

// 현재 게임 설정 내보내기
const handleExportConfig = () => {
  const result = exportGameConfig(props.gameState.config)
  
  // 간단한 알림 (실제로는 더 나은 사용자 피드백 구현 가능)
  if (result.success) {
    alert('설정이 성공적으로 내보내졌습니다.')
  } else {
    alert('파일 내보내기에 실패했습니다.')
  }
}
</script>

<style scoped>
.game-container {
  @apply min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4;
}

.game-header {
  @apply bg-white rounded-lg shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4;
}

.game-info {
  @apply flex-1;
}

.game-title {
  @apply text-2xl font-bold text-gray-800 mb-2;
}

.game-stats {
  @apply flex gap-4 text-sm;
}

.stat-item {
  @apply flex items-center gap-1;
}

.stat-label {
  @apply text-gray-600;
}

.stat-value {
  @apply font-semibold text-gray-800;
}

.game-controls {
  @apply flex gap-2;
}

.control-btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.reset-btn {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}

.restart-btn {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.export-btn {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}

.progress-section {
  @apply bg-white rounded-lg shadow-lg p-4 mb-6;
}

.progress-bar-container {
  @apply w-full bg-gray-200 rounded-full h-4 mb-2;
}

.progress-bar {
  @apply bg-blue-600 h-full rounded-full transition-all duration-300 ease-out;
}

.progress-text {
  @apply text-center text-sm font-medium text-gray-700;
}

.board-container {
  @apply bg-white rounded-lg shadow-lg p-6;
}

.game-board {
  @apply grid gap-2 max-w-4xl mx-auto;
}

/* 모달 스타일 */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl p-6 max-w-md w-full;
}

.modal-title {
  @apply text-xl font-bold text-gray-800 mb-4;
}

.modal-message {
  @apply text-gray-600 mb-6;
}

.modal-actions {
  @apply flex gap-2 justify-end;
}

.modal-btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.modal-btn.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.modal-btn.secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500;
}

.modal-btn.danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}

.modal-btn:not(.primary):not(.secondary):not(.danger) {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500;
}

/* 상품 공개 알림 */
.prize-notification {
  @apply fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-xl z-40;
}

.prize-content {
  @apply text-center;
}

.prize-number {
  @apply text-sm font-medium;
}

.prize-name {
  @apply text-lg font-bold;
}

/* 애니메이션 */
.prize-reveal-enter-active, .prize-reveal-leave-active {
  @apply transition-all duration-300;
}

.prize-reveal-enter-from, .prize-reveal-leave-to {
  @apply opacity-0 transform translate-x-full;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
  .game-header {
    @apply p-4;
  }
  
  .game-title {
    @apply text-xl;
  }
  
  .game-stats {
    @apply flex-col gap-2;
  }
  
  .control-btn {
    @apply px-3 py-2 text-sm;
  }
  
  .board-container {
    @apply p-4;
  }
  
  .game-board {
    @apply gap-1;
  }
}

@media (min-width: 1024px) {
  .game-container {
    @apply p-8;
  }
  
  .game-board {
    @apply gap-3;
  }
}
</style> 