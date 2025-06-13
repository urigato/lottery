import type { Prize } from '@/types/game'

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function expandPrizes(prizes: Prize[]): string[] {
  const expandedPrizes: string[] = []
  
  prizes.forEach(prize => {
    for (let i = 0; i < prize.quantity; i++) {
      expandedPrizes.push(prize.name)
    }
  })
  
  return expandedPrizes
}

export function fillEmptySlots(prizes: string[], totalSlots: number, emptySlotText: string): string[] {
  const filledPrizes = [...prizes]
  
  while (filledPrizes.length < totalSlots) {
    filledPrizes.push(emptySlotText)
  }
  
  return filledPrizes.slice(0, totalSlots)
}

export function distributePrizes(prizes: Prize[], boardSize: number, emptySlotText: string): string[] {
  const totalSlots = boardSize * boardSize
  const expandedPrizes = expandPrizes(prizes)
  const filledPrizes = fillEmptySlots(expandedPrizes, totalSlots, emptySlotText)
  
  return shuffleArray(filledPrizes)
} 