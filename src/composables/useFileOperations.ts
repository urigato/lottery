import type { GameConfig } from '@/types/game'

export function useFileOperations() {
  // 게임 설정을 JSON 파일로 내보내기
  const exportGameConfig = (config: GameConfig) => {
    try {
      const dataStr = JSON.stringify(config, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `게임설정_${config.title}_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      return { success: true, message: '설정이 성공적으로 내보내졌습니다.' }
    } catch (error) {
      console.error('파일 내보내기 실패:', error)
      return { success: false, message: '파일 내보내기에 실패했습니다.' }
    }
  }

  // JSON 파일에서 게임 설정 불러오기
  const importGameConfig = (): Promise<{ success: boolean; config?: GameConfig; message: string }> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = (event: any) => {
        const file = event.target.files?.[0]
        if (!file) {
          resolve({ success: false, message: '파일을 선택하지 않았습니다.' })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const config = JSON.parse(content) as GameConfig
            
            // 기본적인 유효성 검사
            if (!isValidGameConfig(config)) {
              resolve({ success: false, message: '올바르지 않은 게임 설정 파일입니다.' })
              return
            }
            
            resolve({ 
              success: true, 
              config, 
              message: '설정이 성공적으로 불러와졌습니다.' 
            })
          } catch (error) {
            console.error('파일 읽기 실패:', error)
            resolve({ success: false, message: '파일을 읽는 중 오류가 발생했습니다.' })
          }
        }
        
        reader.onerror = () => {
          resolve({ success: false, message: '파일을 읽는 중 오류가 발생했습니다.' })
        }
        
        reader.readAsText(file)
      }
      
      input.click()
    })
  }

  // 게임 설정 유효성 검사
  const isValidGameConfig = (config: any): config is GameConfig => {
    if (typeof config !== 'object' || !config) return false
    
    const requiredFields = ['title', 'boardSize', 'prizes', 'emptySlotText']
    for (const field of requiredFields) {
      if (!(field in config)) return false
    }
    
    // 상세 검증
    if (typeof config.title !== 'string' || config.title.trim() === '') return false
    if (typeof config.boardSize !== 'number' || config.boardSize < 1 || config.boardSize > 10) return false
    if (!Array.isArray(config.prizes) || config.prizes.length === 0) return false
    if (typeof config.emptySlotText !== 'string' || config.emptySlotText.trim() === '') return false
    
    // 상품 유효성 검사
    for (const prize of config.prizes) {
      if (typeof prize !== 'object' || !prize) return false
      if (typeof prize.name !== 'string' || prize.name.trim() === '') return false
      if (typeof prize.quantity !== 'number' || prize.quantity < 1) return false
    }
    
    return true
  }

  return {
    exportGameConfig,
    importGameConfig,
    isValidGameConfig
  }
} 