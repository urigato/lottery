<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <!-- 게임 헤더 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ gameState.config.title }}</h1>
        <div class="flex gap-4 text-sm">
          <div class="flex items-center gap-1">
            <span class="text-gray-600">진행률:</span>
            <span class="font-semibold text-gray-800">{{ progress }}%</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-gray-600">공개:</span>
            <span class="font-semibold text-gray-800">{{ gameState.revealedCount }}/{{ gameState.totalCells }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2">
        <button @click="handleExportConfig" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500">
          📁 설정 내보내기
        </button>
        <button @click="showResetConfirm = true" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
          🔄 새 게임
        </button>
        <button @click="showRestartConfirm = true" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
          ↩️ 다시 시작
        </button>
      </div>
    </div>

    <!-- 진행률 바 -->
    <div class="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          class="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" 
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <div class="text-center text-sm font-medium text-gray-700">{{ progress }}% 완료</div>
    </div>

    <!-- 게임 보드 -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div 
        class="grid gap-2 max-w-4xl mx-auto" 
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
    <div v-if="currentPhase === 'finished' && showFinishModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeFinishModal">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" @click.stop>
        <h2 class="text-xl font-bold text-gray-800 mb-4">🎉 게임 완료!</h2>
        <p class="text-gray-600 mb-6">모든 상품이 공개되었습니다.</p>
        <div class="flex gap-2 justify-end">
          <button @click="restartGame" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
            다시 시작
          </button>
          <button @click="resetGame" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500">
            새 게임
          </button>
          <button @click="closeFinishModal" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500">
            닫기
          </button>
        </div>
      </div>
    </div>

    <!-- 새 게임 확인 모달 -->
    <div v-if="showResetConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showResetConfirm = false">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" @click.stop>
        <h2 class="text-xl font-bold text-gray-800 mb-4">⚠️ 새 게임</h2>
        <p class="text-gray-600 mb-6">현재 게임을 종료하고 새 게임을 시작하시겠습니까?</p>
        <div class="flex gap-2 justify-end">
          <button @click="confirmReset" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
            확인
          </button>
          <button @click="showResetConfirm = false" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500">
            취소
          </button>
        </div>
      </div>
    </div>

    <!-- 다시 시작 확인 모달 -->
    <div v-if="showRestartConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showRestartConfirm = false">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" @click.stop>
        <h2 class="text-xl font-bold text-gray-800 mb-4">🔄 다시 시작</h2>
        <p class="text-gray-600 mb-6">같은 설정으로 게임을 다시 시작하시겠습니까?</p>
        <div class="flex gap-2 justify-end">
          <button @click="confirmRestart" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
            확인
          </button>
          <button @click="showRestartConfirm = false" class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500">
            취소
          </button>
        </div>
      </div>
    </div>

    <!-- 상품 공개 알림 -->
    <Transition name="prize-reveal">
      <div v-if="revealedPrize" class="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-xl z-40">
        <div class="text-center">
          <div class="text-sm font-medium">{{ revealedPrize.number }}번</div>
          <div class="text-lg font-bold">{{ revealedPrize.prize }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

// 게임이 완료되면 모달 표시
watch(() => props.currentPhase, (newPhase) => {
  if (newPhase === 'finished') {
    showFinishModal.value = true
  }
})

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
/* 애니메이션 */
.prize-reveal-enter-active, .prize-reveal-leave-active {
  transition: all 0.3s;
}

.prize-reveal-enter-from, .prize-reveal-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 