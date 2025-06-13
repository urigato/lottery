<template>
  <button
    @click="handleReveal"
    :disabled="cell.isRevealed"
    class="board-cell"
    :class="cellClasses"
    :aria-label="`셀 ${cell.number}${cell.isRevealed ? `, 상품: ${cell.prize}` : ''}`"
  >
    <div v-if="!cell.isRevealed" class="cell-number">
      {{ cell.number }}
    </div>
    <div v-else class="cell-prize">
      <div class="prize-text">{{ cell.prize }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BoardCell } from '@/types/game'

interface Props {
  cell: BoardCell
}

interface Emits {
  (e: 'reveal', cellNumber: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cellClasses = computed(() => ({
  'revealed': props.cell.isRevealed,
  'unrevealed': !props.cell.isRevealed,
  'empty-prize': props.cell.isRevealed && (props.cell.prize === '꽝' || props.cell.prize === '다음 기회에')
}))

const handleReveal = () => {
  if (!props.cell.isRevealed) {
    emit('reveal', props.cell.number)
  }
}
</script>

<style scoped>
.board-cell {
  @apply relative aspect-square bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  min-height: 80px;
}

.board-cell:not(:disabled):hover {
  @apply border-blue-400 bg-blue-50 transform scale-105;
}

.board-cell.unrevealed {
  @apply bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300;
}

.board-cell.revealed {
  @apply bg-gradient-to-br from-green-100 to-green-200 border-green-400 cursor-default;
}

.board-cell.revealed.empty-prize {
  @apply bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400;
}

.board-cell:disabled {
  @apply cursor-default;
}

.cell-number {
  @apply flex items-center justify-center h-full text-2xl font-bold text-blue-800;
}

.cell-prize {
  @apply flex flex-col items-center justify-center h-full p-2;
}

.prize-text {
  @apply text-sm font-semibold text-green-800 text-center break-words leading-tight;
}

.board-cell.revealed.empty-prize .prize-text {
  @apply text-gray-600;
}

/* 반응형 폰트 크기 */
@media (max-width: 640px) {
  .cell-number {
    @apply text-lg;
  }
  
  .prize-text {
    @apply text-xs;
  }
}

@media (min-width: 1024px) {
  .cell-number {
    @apply text-3xl;
  }
  
  .prize-text {
    @apply text-base;
  }
}
</style> 