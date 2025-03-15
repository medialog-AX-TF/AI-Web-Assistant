# AI 웹 어시스턴트 POC

이 프로젝트는 웹사이트에 쉽게 통합할 수 있는 AI 기반 사이드바 어시스턴트의 POC(Proof of Concept) 구현입니다. 기존 웹사이트의 수정을 최소화하면서 사용자에게 컨텍스트 기반의 인터랙티브한 지원을 제공합니다.

## 특징

- 🔌 최소 침습적 통합
  - 스크립트 한 줄로 기존 웹사이트에 추가 가능
  - 기존 웹사이트 코드 수정 불필요
  - 성능 영향 최소화
  - Shadow DOM을 통한 완벽한 격리
- 🎯 인터랙티브 지원
  - 웹사이트 컨텍스트 이해
  - 실시간 사용자 액션 가이드
  - 복잡한 작업 단순화
  - 자동화 지원
- 🤖 강력한 AI 기능
  - 다중 LLM 지원 (GPT-4, Anthropic Claude, EXA-1)
  - 컨텍스트 기반 대화
  - 실시간 응답
  - 웹사이트 컨텐츠 이해 및 활용
  - 마크다운 및 코드 하이라이팅 지원
  - LLM 자동 폴백 및 로드밸런싱

## AI 웹 어시스턴트 툴

AI 웹 어시스턴트는 웹사이트와 상호작용하기 위한 다양한 툴을 제공합니다:

1. **메뉴 검색 툴 (menu_search)**
   - 웹사이트의 메뉴 항목을 검색하는 기능
   - 사용자가 찾고자 하는 기능이나 페이지와 관련된 메뉴 항목을 찾음
   - 메뉴 텍스트, 경로, 활성 상태 등을 기준으로 관련성 점수 부여

2. **페이지 내용 분석 툴 (page_content_analysis)**
   - 현재 페이지의 내용을 분석하여 중요 정보, 주요 기능, 입력 필드 등을 식별
   - 제목, 폼, 테이블, 버튼, 링크, 이미지 등 다양한 요소 추출
   - 페이지의 주요 내용 텍스트 추출

3. **페이지 이동 툴 (page_navigation)**
   - 특정 메뉴 항목이나 링크로 페이지를 이동
   - 메뉴 ID, 메뉴 이름, URL, 요소 선택자 등 다양한 방식으로 대상 지정
   - 새 탭에서 열기 옵션 지원

4. **요소 하이라이트 툴 (element_highlight)**
   - 특정 UI 요소를 강조 표시하여 사용자의 주의를 끔
   - 다양한 하이라이트 스타일(펄스, 아웃라인, 배경, 줌) 지원
   - 요소와 함께 메시지 표시 가능

5. **액션 수행 툴 (perform_action)**
   - 특정 UI 요소에 대한 액션(클릭, 입력, 선택, 체크/해제, 호버, 포커스, 블러) 수행
   - 요소가 화면에 보이지 않을 경우 스크롤 후 액션 수행
   - 페이지 이동 대기 옵션 지원

6. **작업 자동화 툴 (workflow_automation)**
   - 여러 단계의 작업을 순차적으로 자동 수행
   - 조건부 실행 지원
   - 오류 발생 시 중단 옵션

7. **스크린샷 캡처 툴 (screenshot)**
   - 현재 페이지나 특정 요소의 스크린샷을 캡처
   - 다양한 이미지 형식 지원
   - 하이라이트나 주석 포함 옵션

8. **웹사이트 상태 모니터링 툴 (state_monitoring)**
   - 웹사이트의 상태 변화(DOM 변경, URL 변경, 폼 상태 등)를 모니터링
   - 특정 요소의 변화 감지
   - 모니터링 지속 시간 설정

9. **사용자 가이드 툴 (user_guide)**
   - 특정 작업에 대한 단계별 사용자 가이드를 생성하고 표시
   - 관련 요소 하이라이트
   - 진행 상태 표시

## 기술 스택

- TypeScript 5.x
- Web Components (Custom Elements v1)
- Tailwind CSS (격리된 스코프)
- LLM 통합
  - OpenAI GPT-4
  - Anthropic Claude
  - EXA-1
- Shadow DOM
- Lit (웹 컴포넌트 라이브러리)
- Vite (번들링)

## 통합 방법

1. 스크립트 추가
```html
<!-- 프로덕션 버전 -->
<script src="https://cdn.ai-assistant.com/v1/ai-assistant.min.js"></script>

<!-- 개발 버전 -->
<script src="https://cdn.ai-assistant.com/v1/ai-assistant.js"></script>
```

2. 요소 추가
```html
<ai-web-assistant
  default-llm="gpt4"
  api-keys='{
    "openai": "your-openai-key",
    "anthropic": "your-anthropic-key",
    "exaone": "your-exaone-key"
  }'
  theme="light"
  position="right"
  language="ko"
  initial-state="minimized"
></ai-web-assistant>
```

3. 설정 커스터마이징 (선택사항)
```javascript
window.aiAssistantConfig = {
  llm: {
    default: 'gpt4',
    providers: {
      gpt4: {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 2000
      },
      claude: {
        model: 'claude-3-opus',
        temperature: 0.7,
        maxTokens: 2000
      },
      exaone: {
        model: 'exa-1',
        temperature: 0.7,
        maxTokens: 2000
      }
    },
    fallback: ['gpt4', 'claude', 'exaone'],
    loadBalancing: {
      enabled: true,
      strategy: 'round-robin'
    }
  },
  theme: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
    accent: '#FF9500'
  },
  prompts: {
    context: '현재 웹사이트의 컨텍스트를 이해하고 사용자를 돕습니다.',
    system: '사용자의 웹사이트 사용을 돕는 친절한 어시스턴트입니다.',
    actionGuide: '단계별로 사용자를 안내하고 필요한 요소를 하이라이트합니다.'
  },
  i18n: {
    locale: 'ko',
    messages: {
      placeholder: '무엇을 도와드릴까요?',
      // ... 기타 번역
    }
  },
  hooks: {
    onInit: () => console.log('Assistant initialized'),
    onMessage: (msg) => console.log('New message:', msg),
    onError: (err) => console.error('Error:', err),
    onLLMSwitch: (from, to) => console.log(`Switched from ${from} to ${to}`),
    onActionGuide: (step) => console.log(`Action guide step: ${step}`),
    onElementHighlight: (element) => console.log(`Highlighted element:`, element)
  }
}
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정합니다:

```env
# OpenAI 설정
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000

# Anthropic 설정
ANTHROPIC_API_KEY=your-anthropic-key
ANTHROPIC_MODEL=claude-3-opus
ANTHROPIC_TEMPERATURE=0.7
ANTHROPIC_MAX_TOKENS=2000

# EXA-1 설정
EXAONE_API_KEY=your-exaone-key
EXAONE_MODEL=exa-1
EXAONE_TEMPERATURE=0.7
EXAONE_MAX_TOKENS=2000

# LLM 설정
DEFAULT_LLM=gpt4
ENABLE_LOAD_BALANCING=true
LOAD_BALANCING_STRATEGY=round-robin
FALLBACK_ORDER=gpt4,claude,exaone

# 기타 설정
NODE_ENV=development
API_TIMEOUT=30000
ENABLE_DEBUG_LOGGING=true
```

## 개발 환경 설정

1. 저장소 클론
```bash
git clone https://github.com/your-org/ai-web-assistant.git
cd ai-web-assistant
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 프로덕션 빌드
```bash
npm run build
```

## 프로젝트 구조

```
AI-Web-Assistant/
├── src/               # 소스 코드
│   ├── components/    # Web Components
│   │   ├── assistant/    # 메인 어시스턴트 컴포넌트
│   │   ├── chat/        # 채팅 관련 컴포넌트
│   │   └── ui/          # 공통 UI 컴포넌트
│   ├── styles/        # 스타일
│   │   ├── themes/      # 테마 정의
│   │   └── base.css    # 기본 스타일
│   ├── ai/           # AI 통합 로직
│   │   ├── llm/        # LLM 통합
│   │   │   ├── openai/   # OpenAI 통합
│   │   │   ├── anthropic/ # Anthropic 통합
│   │   │   └── exaone/   # EXA-1 통합
│   │   └── stream/     # 스트리밍 처리
│   ├── i18n/         # 다국어 지원
│   └── utils/        # 유틸리티
├── public/           # 정적 파일
├── docs/             # 문서
├── examples/         # 사용 예시
└── tests/            # 테스트 코드

## 기여 가이드라인

1. 이슈 생성
2. 브랜치 생성 (`feature/기능명` 또는 `fix/버그명`)
3. 커밋 (`feat: 새로운 기능 추가` 또는 `fix: 버그 수정`)
4. PR 생성

## 라이선스

MIT License 