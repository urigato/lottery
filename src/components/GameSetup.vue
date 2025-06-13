<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">🎲 국민대 경품추첨 보드판</h1>
      <p class="text-gray-600 text-center mb-8">새로운 게임을 설정하세요</p>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 게임 타이틀 -->
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium text-gray-700">게임 타이틀</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="예: 신년 경품 추첨"
            required
          >
        </div>

        <!-- 보드 크기 -->
        <div class="space-y-2">
          <label for="boardSize" class="block text-sm font-medium text-gray-700">보드 크기</label>
          <select
            id="boardSize"
            v-model="form.boardSize"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>크기를 선택하세요</option>
            <option v-for="size in boardSizes" :key="size" :value="size">
              {{ size }}×{{ size }} ({{ size * size }}칸)
            </option>
          </select>
        </div>

        <!-- 경품 목록 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">경품 목록</label>
          <div class="space-y-3">
            <div v-for="(prize, index) in form.prizes" :key="index" class="prize-item flex gap-2 items-center">
              <input
                v-model="prize.name"
                type="text"
                class="prize-name-input flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="상품명"
                required
              >
              <div class="prize-controls flex gap-2 items-center">
                <input
                  v-model.number="prize.quantity"
                  type="number"
                  min="1"
                  class="prize-quantity-input w-16 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="수량"
                  required
                >
                <button
                  type="button"
                  @click="removePrize(index)"
                  class="px-2 py-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  :disabled="form.prizes.length <= 1"
                >
                  ❌
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addPrize"
              class="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + 경품 추가
            </button>
          </div>
        </div>

        <!-- 빈칸 텍스트 -->
        <div class="space-y-2">
          <label for="emptySlotText" class="block text-sm font-medium text-gray-700">빈칸 텍스트</label>
          <input
            id="emptySlotText"
            v-model="form.emptySlotText"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="예: 꽝, 다음 기회에"
            required
          >
        </div>

        <!-- 총 경품 수량 표시 -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">총 경품 수량:</span>
            <span class="text-sm font-semibold text-gray-800">{{ totalPrizes }}개</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">보드 칸 수:</span>
            <span class="text-sm font-semibold text-gray-800">{{ totalSlots }}칸</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">빈칸 수:</span>
            <span class="text-sm font-semibold text-gray-800">{{ emptySlots }}칸</span>
          </div>
        </div>

        <!-- 파일 작업 버튼들 -->
        <div class="flex gap-4 mb-6">
          <button
            type="button"
            @click="handleExportConfig"
            class="flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!isFormValid"
          >
            📁 설정 내보내기
          </button>
          <button
            type="button"
            @click="handleImportConfig"
            class="flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          >
            📂 설정 불러오기
          </button>
        </div>

        <!-- 제출 버튼 -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="!isFormValid"
        >
          게임 시작하기
        </button>
      </form>

      <!-- 저장된 게임이 있는 경우 -->
      <div v-if="hasSavedGame" class="mt-6 pt-6 border-t border-gray-200 text-center">
        <p class="text-sm text-gray-600 mb-3">저장된 게임이 있습니다</p>
        <button @click="loadSavedGame" class="bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
          이어서 하기
        </button>
      </div>

      <!-- 알림 메시지 -->
      <div v-if="notification" class="mt-6 p-4 rounded-lg font-medium text-center" :class="{
        'bg-green-100 text-green-800': notification.type === 'success',
        'bg-red-100 text-red-800': notification.type === 'error',
        'bg-blue-100 text-blue-800': notification.type === 'info'
      }">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Prize, GameConfig } from '@/types/game'
import { useFileOperations } from '@/composables/useFileOperations'

interface Emits {
  (e: 'create-game', config: GameConfig): void
  (e: 'load-saved'): void
}

interface Props {
  hasSavedGame?: boolean
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { exportGameConfig, importGameConfig } = useFileOperations()

const boardSizes = [2, 3, 4, 5, 6, 7, 8, 9, 10]

// 알림 메시지 상태
const notification = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

const form = ref<{
  title: string
  boardSize: number | ''
  prizes: Prize[]
  emptySlotText: string
}>({
  title: '',
  boardSize: '',
  prizes: [{ name: '', quantity: 1 }],
  emptySlotText: '꽝'
})

const totalPrizes = computed(() => {
  return form.value.prizes.reduce((sum, prize) => sum + (prize.quantity || 0), 0)
})

const totalSlots = computed(() => {
  const size = form.value.boardSize
  return typeof size === 'number' ? size * size : 0
})

const emptySlots = computed(() => {
  return Math.max(0, totalSlots.value - totalPrizes.value)
})

const isFormValid = computed(() => {
  return (
    form.value.title.trim() !== '' &&
    typeof form.value.boardSize === 'number' &&
    form.value.prizes.length > 0 &&
    form.value.prizes.every(prize => prize.name.trim() !== '' && prize.quantity > 0) &&
    form.value.emptySlotText.trim() !== ''
  )
})

const addPrize = () => {
  form.value.prizes.push({ name: '', quantity: 1 })
}

const removePrize = (index: number) => {
  if (form.value.prizes.length > 1) {
    form.value.prizes.splice(index, 1)
  }
}

const handleSubmit = () => {
  if (isFormValid.value && typeof form.value.boardSize === 'number') {
    const config: GameConfig = {
      title: form.value.title.trim(),
      boardSize: form.value.boardSize,
      prizes: form.value.prizes.map(prize => ({
        name: prize.name.trim(),
        quantity: prize.quantity
      })),
      emptySlotText: form.value.emptySlotText.trim()
    }
    
    emit('create-game', config)
  }
}

const loadSavedGame = () => {
  emit('load-saved')
}

// 알림 메시지 표시 및 자동 숨김
const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// 설정 내보내기
const handleExportConfig = () => {
  if (isFormValid.value && typeof form.value.boardSize === 'number') {
    const config: GameConfig = {
      title: form.value.title.trim(),
      boardSize: form.value.boardSize,
      prizes: form.value.prizes.map(prize => ({
        name: prize.name.trim(),
        quantity: prize.quantity
      })),
      emptySlotText: form.value.emptySlotText.trim()
    }
    
    const result = exportGameConfig(config)
    showNotification(result.message, result.success ? 'success' : 'error')
  }
}

// 설정 불러오기
const handleImportConfig = async () => {
  const result = await importGameConfig()
  
  if (result.success && result.config) {
    // 폼에 불러온 설정 적용
    form.value.title = result.config.title
    form.value.boardSize = result.config.boardSize
    form.value.emptySlotText = result.config.emptySlotText
    form.value.prizes = result.config.prizes.map(prize => ({
      name: prize.name,
      quantity: prize.quantity
    }))
    
    showNotification(result.message, 'success')
  } else {
    showNotification(result.message, 'error')
  }
}
</script>

<style scoped>
/* 반응형 디자인 */
@media (max-width: 640px) {
  .setup-card {
    padding: 1.5rem;
  }
  
  .setup-title {
    font-size: 1.5rem;
  }
  
  .prize-item {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .prize-name-input {
    width: 100%;
  }
  
  .prize-controls {
    justify-content: end;
    width: 100%;
  }
  
  .prize-quantity-input {
    width: 80px;
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .prize-quantity-input {
    width: 70px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style> 