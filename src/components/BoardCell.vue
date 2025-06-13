<template>
  <div class="cell-container">
    <!-- 폭발 효과 -->
    <div v-if="showExplosion" class="explosion-container">
      <!-- 메인 폭발 파티클 (큰 원) -->
      <div v-for="i in 16" :key="`explosion-${i}`" class="explosion-particle large" :style="getExplosionStyle(i)"></div>
      <!-- 작은 폭발 파티클 -->
      <div v-for="i in 20" :key="`explosion-small-${i}`" class="explosion-particle small" :style="getSmallExplosionStyle(i)"></div>
      <!-- 스파크 효과 -->
      <div v-for="i in 12" :key="`spark-${i}`" class="explosion-particle spark" :style="getSparkStyle(i)"></div>
    </div>

    <!-- 메인 카드 -->
    <button
      @click="handleReveal"
      :disabled="cell.isRevealed || isAnimating"
      class="board-cell"
      :class="{
        'revealed': cell.isRevealed,
        'unrevealed': !cell.isRevealed,
        'animating': isAnimating
      }"
      :aria-label="`셀 ${cell.number}${cell.isRevealed ? `, 상품: ${cell.prize}` : ''}`"
    >
      <!-- 숫자 표시 (미오픈 시) -->
      <div v-if="!cell.isRevealed" class="cell-number">
        {{ cell.number }}
      </div>

      <!-- 상품 표시 (오픈 시) -->
      <div v-else class="cell-prize">
        <div class="prize-circle" :class="prizeColorClass">
          <div class="prize-text">{{ cell.prize }}</div>
        </div>
      </div>

      <!-- 애니메이션 효과들 -->
      <div v-if="!cell.isRevealed" class="hover-effect"></div>
      <div v-if="isAnimating" class="reveal-animation"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BoardCell } from '@/types/game'

interface Props {
  cell: BoardCell
}

interface Emits {
  (e: 'reveal', cellNumber: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 상태 관리
const isAnimating = ref(false)
const showExplosion = ref(false)

// 상품별 고유 색상 결정
const prizeColorIndex = computed(() => {
  if (!props.cell.isRevealed) return 'unrevealed'
  
  const prize = props.cell.prize
  
  // 꽝 또는 빈 상품
  if (prize === '꽝' || prize === '다음 기회에' || prize === '') {
    return 'empty'
  }
  
  // 상품명을 기반으로 해시값 생성하여 색상 인덱스 결정
  let hash = 0
  for (let i = 0; i < prize.length; i++) {
    const char = prize.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit 정수로 변환
  }
  
  // 8가지 색상 중 선택
  const colorIndex = Math.abs(hash) % 8
  return colorIndex
})

const prizeColorClass = computed(() => {
  if (prizeColorIndex.value === 'empty') return 'circle-empty'
  if (prizeColorIndex.value === 'unrevealed') return ''
  return `circle-color-${prizeColorIndex.value}`
})

// 메인 폭발 파티클 스타일 (큰 원)
const getExplosionStyle = (index: number) => {
  const angle = (index * 22.5) % 360 // 16개로 나누어 더 촘촘하게
  const distance = 60 + Math.random() * 50 // 더 멀리 퍼지도록
  const delay = Math.random() * 0.05 // 더 빠르게 시작
  const duration = 1.2 + Math.random() * 0.6 // 더 오래 지속
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#a855f7', '#10b981']
  
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance
  
  return {
    backgroundColor: colors[index % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--end-x': `${x}px`,
    '--end-y': `${y}px`
  }
}

// 작은 폭발 파티클 스타일
const getSmallExplosionStyle = (index: number) => {
  const angle = Math.random() * 360 // 완전 랜덤 각도
  const distance = 30 + Math.random() * 80 // 다양한 거리
  const delay = Math.random() * 0.15
  const duration = 0.8 + Math.random() * 0.8
  const colors = ['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24', '#0abde3']
  
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance
  
  return {
    backgroundColor: colors[index % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--end-x': `${x}px`,
    '--end-y': `${y}px`
  }
}

// 스파크 효과 스타일
const getSparkStyle = (index: number) => {
  const angle = (index * 30) % 360
  const distance = 80 + Math.random() * 40 // 가장 멀리 퍼짐
  const delay = Math.random() * 0.08
  const duration = 1.5 + Math.random() * 0.5
  const colors = ['#ffd700', '#ffff00', '#ff6347', '#ff1493', '#00ff00', '#00bfff']
  
  const x = Math.cos(angle * Math.PI / 180) * distance
  const y = Math.sin(angle * Math.PI / 180) * distance
  
  return {
    backgroundColor: colors[index % colors.length],
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--end-x': `${x}px`,
    '--end-y': `${y}px`
  }
}

const handleReveal = async () => {
  if (props.cell.isRevealed || isAnimating.value) return

  isAnimating.value = true

  // 미리 당첨 여부 확인 (카드 오픈 전)
  const prize = props.cell.prize
  const willWin = prize !== '꽝' && prize !== '다음 기회에' && prize !== ''

  // 즉시 폭발 효과 시작 (당첨일 경우)
  if (willWin) {
    showExplosion.value = true
    setTimeout(() => {
      showExplosion.value = false
    }, 2000) // 더 오래 지속
  }

  // 카드 오픈 처리
  emit('reveal', props.cell.number)

  // 애니메이션 대기
  await new Promise(resolve => setTimeout(resolve, 600))

  isAnimating.value = false
}
</script>

<style scoped>
.cell-container {
  position: relative;
  aspect-ratio: 1;
  min-height: 80px;
}

.board-cell {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
  overflow: hidden;
  cursor: pointer;
}

.board-cell:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 미오픈 카드 스타일 */
.board-cell.unrevealed {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-color: #93c5fd;
}

.board-cell.unrevealed:not(:disabled):hover {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* 오픈된 카드 스타일 */
.board-cell.revealed {
  background-color: white;
  border-color: #d1d5db;
  cursor: default;
  border-style: dashed;
}

/* 애니메이션 중 스타일 */
.board-cell.animating {
  animation: revealPulse 0.6s ease-out;
}

@keyframes revealPulse {
  0% { 
    transform: scale(1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}

/* 호버 효과 */
.hover-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.6s;
  opacity: 0;
  pointer-events: none;
}

.board-cell.unrevealed:hover .hover-effect {
  opacity: 1;
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

/* 리빌 애니메이션 */
.reveal-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
  animation: revealExpand 0.6s ease-out;
  pointer-events: none;
}

@keyframes revealExpand {
  0% {
    width: 0;
    height: 0;
    transform: translate(-50%, -50%);
  }
  100% {
    width: 200%;
    height: 200%;
    transform: translate(-50%, -50%);
    opacity: 0;
  }
}

/* 숫자 스타일 */
.cell-number {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.875rem;
  font-weight: bold;
  color: #1e40af;
  position: relative;
  z-index: 2;
}

/* 상품 스타일 */
.cell-prize {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0.75rem;
  position: relative;
  z-index: 2;
}

.prize-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  margin: auto;
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.prize-circle.circle-color-0 {
  background: linear-gradient(135deg, #4ade80, #16a34a);
}

.prize-circle.circle-color-1 {
  background: linear-gradient(135deg, #facc15, #ca8a04);
}

.prize-circle.circle-color-2 {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
}

.prize-circle.circle-color-3 {
  background: linear-gradient(135deg, #f472b6, #ec4899);
}

.prize-circle.circle-color-4 {
  background: linear-gradient(135deg, #f87171, #dc2626);
}

.prize-circle.circle-color-5 {
  background: linear-gradient(135deg, #fb923c, #ea580c);
}

.prize-circle.circle-color-6 {
  background: linear-gradient(135deg, #2dd4bf, #0d9488);
}

.prize-circle.circle-color-7 {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.prize-circle.circle-empty {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.prize-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
  word-break: break-words;
  line-height: 1.25;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 폭발 효과 */
.explosion-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 15;
}

.explosion-particle {
  position: absolute;
  border-radius: 50%;
  animation: explode ease-out forwards;
}

.explosion-particle.large {
  width: 10px;
  height: 10px;
  box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
}

.explosion-particle.small {
  width: 6px;
  height: 6px;
  box-shadow: 0 0 12px currentColor;
}

.explosion-particle.spark {
  width: 4px;
  height: 4px;
  box-shadow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor;
}

@keyframes explode {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  30% {
    transform: translate(calc(var(--end-x) - 50%), calc(var(--end-y) - 50%)) scale(1.5);
    opacity: 0.9;
  }
  100% {
    transform: translate(calc(var(--end-x) - 50%), calc(var(--end-y) - 50%)) scale(0.2);
    opacity: 0;
  }
}

/* 반응형 폰트 크기 */
@media (max-width: 640px) {
  .cell-number {
    font-size: 1.25rem;
  }
  
  .prize-text {
    font-size: 1.25rem;
  }
  
  .prize-circle {
    padding: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .cell-number {
    font-size: 2.25rem;
  }
  
  .prize-text {
    font-size: 1.75rem;
  }
  
  .prize-circle {
    padding: 1rem;
  }
}
</style> 