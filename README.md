# 🎲 경품추첨 보드판

> 사회자 전용 경품추첨 보드판 애플리케이션  
> Vue3 + Vite + TailwindCSS + TypeScript로 구성된 로컬 전용 추첨 시스템

## ✨ 주요 기능

- 🎯 **커스터마이징 가능한 보드**: 1x1부터 10x10까지 자유로운 크기 설정
- 🎁 **경품 관리**: 상품명과 수량을 자유롭게 설정
- 🎪 **실시간 공개**: 클릭 시 즉시 상품 공개 (되돌릴 수 없음)
- 💾 **로컬 저장**: 모든 데이터는 브라우저 로컬스토리지에만 저장
- 📱 **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- ♿ **접근성 지원**: 키보드 네비게이션 및 스크린 리더 호환

## 🎮 게임 규칙

### 기본 규칙
1. **보드 생성**: N×N 크기의 보드에 1부터 N²까지 번호 표시
2. **상품 배치**: 각 번호마다 상품이 무작위로 할당 (숨겨진 상태)
3. **상품 공개**: 번호 클릭 시 해당 칸의 상품 공개
4. **게임 진행**: 한 번 공개된 칸은 다시 숨길 수 없음

### 게임 설정 옵션
- **게임 타이틀**: 추첨 이벤트명
- **보드 크기**: 1×1 ~ 10×10 (최대 100칸)
- **경품 목록**: 상품명 + 수량 조합
- **빈칸 처리**: 남는 칸에 들어갈 값 (예: "꽝", "다음 기회에")

## 🚀 빠른 시작

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 사용법
1. **게임 설정**: 타이틀, 보드 크기, 경품 정보 입력
2. **게임 시작**: 설정 완료 후 보드 생성
3. **추첨 진행**: 번호를 클릭하여 상품 공개
4. **게임 관리**: 새 게임 생성 또는 현재 게임 계속

## 🏗️ 기술 스택

- **Frontend**: Vue 3 (Composition API)
- **빌드 도구**: Vite
- **스타일링**: TailwindCSS
- **타입 시스템**: TypeScript
- **상태 관리**: Composables + LocalStorage

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── GameBoard.vue   # 메인 게임 보드
│   ├── GameSetup.vue   # 게임 설정 폼
│   ├── BoardCell.vue   # 개별 셀 컴포넌트
│   └── PrizeReveal.vue # 상품 공개 모달
├── composables/        # 비즈니스 로직
│   ├── useGameBoard.ts # 게임 보드 상태 관리
│   ├── useLocalStorage.ts # 로컬스토리지 동기화
│   └── usePrizeDistribution.ts # 상품 배치 로직
├── types/              # TypeScript 타입 정의
│   └── game.ts         # 게임 관련 타입들
├── utils/              # 유틸리티 함수
│   ├── boardUtils.ts   # 보드 관련 헬퍼
│   └── prizeUtils.ts   # 상품 관련 헬퍼
├── App.vue             # 루트 컴포넌트
└── main.ts             # 애플리케이션 진입점
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: Blue-600 (메인 액션)
- **Secondary**: Gray-600 (보조 요소)
- **Success**: Green-600 (성공/완료)
- **Warning**: Yellow-600 (경고)
- **Danger**: Red-600 (위험/삭제)

### 반응형 브레이크포인트
- **모바일**: < 640px
- **태블릿**: 640px ~ 1024px  
- **데스크톱**: > 1024px

## 🔧 개발 가이드

### 코딩 표준
- **Vue3 Composition API**: `<script setup>` 문법 사용
- **TypeScript**: 엄격한 타입 정의
- **TailwindCSS**: 유틸리티 클래스 우선 사용
- **Composables**: 재사용 가능한 로직 분리

### 상태 관리 패턴
```typescript
// Composable 예시
export function useGameBoard() {
  const gameState = ref<GameState | null>(null)
  const isGameActive = computed(() => gameState.value !== null)
  
  const createGame = (config: GameConfig) => {
    // 게임 생성 로직
  }
  
  const revealCell = (cellNumber: number) => {
    // 셀 공개 로직
  }
  
  return {
    gameState: readonly(gameState),
    isGameActive,
    createGame,
    revealCell
  }
}
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 [Issues](../../issues)를 통해 알려주세요.

---

**Made with ❤️ for event organizers** 