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