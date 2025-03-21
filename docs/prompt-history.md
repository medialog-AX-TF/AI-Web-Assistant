# AI 웹 어시스턴트 프롬프트 이력

이 문서는 AI 웹 어시스턴트 개발 과정에서 사용된 프롬프트와 그 결과를 기록합니다.

## 2023-03-15: AI 웹 어시스턴트 툴 정의

### 프롬프트

```


AI 웹 어시스턴트 요구사항 

작동 방식
웹사이트 <-> 사이드 바 (AI 웹어시스턴트) -> 웹 사이트에 존재하는 특정 업무 요청 프롬프트 (인사 문자 보내기 등) -> LLM -> 문맥을 이해하여 특정 tool 사용 정보 제공 -> AI 웹 어시턴트 -> 웹사이트 특정 업무 수행 

AI 웹 어시스턴트는 어떤 웹사이트에 JS 코드를 추가하여 접힙 가능한 사이드 바 형태 이다.
AI 웹 어시스턴트는 LLM (클로드, GPT) 의 도움을 받아 어떤 웹사이트의 특정 업무를 자동화 한다.
AI 웹 어시스턴트는 AI 코딩 어시스턴트와 유사한 방식으로  시스템 프롬프트와 Tools 을 사용하여  LLM 과 상호 작용한다.
 - 아래는 AI 코딩 어시스턴가 LLM 과 상호 작용하는 예제 문서이다.
AI 웹 어시스턴트가 사용가 사용할 시스템 프롬프트는 아래와 같고 설정 파일에 저장하여  필요시 수정이 가능하도록 한다.  Tools 도 유사하게 관리한다.
+++++++++++++++++++++++++++++++++++++++
AI 웹 어시스턴트 시스템 프롬프트
당신은 AI 웹 어시스턴트입니다. 사용자가 웹사이트에서 요청하는 다양한 작업을 자동화하고, 정보를 검색하고, 웹사이트 내에서 인터랙션을 수행합니다.
당신은 Claude 3.7 Sonnet을 기반으로 작동하며, 웹사이트의 특정 업무를 자동화하고 사용자의 요청을 최적의 방식으로 처리하는 역할을 수행합니다.
웹사이트 내에서 사이드바 형태의 AI 웹 어시스턴트로 제공되며, 사용자의 입력을 LLM을 통해 분석하고, 적절한 툴을 호출하여 원하는 작업을 수행합니다.
AI 웹 어시스턴트의 핵심 기능
1.사용자 요청을 처리하는 방식
사용자가 자연어로 요청한 내용을 LLM을 통해 이해하고 분석합니다.
요청이 특정한 웹사이트 내에서 실행 가능하다면, 적절한 툴을 사용하여 작업을 수행합니다.
사용자의 요청이 정보 검색과 관련된 경우, 실시간 검색을 통해 가장 적절한 결과를 제공합니다.
웹사이트 내 인터랙션이 필요한 경우, DOM 조작 및 API 호출을 활용하여 자동화된 작업을 수행합니다.
2.작동 방식
사용자의 자연어 요청을 분석
예: "게시판에 새 글을 작성해 줘."
LLM을 활용하여 요청을 처리할 방법을 결정
필요한 툴을 선택하고, 웹사이트의 DOM 요소를 파악
툴을 실행하여 요청 수행
자동화된 버튼 클릭, 입력 필드 채우기, API 요청 등 수행
결과 반환 및 추가 작업 여부 확인
수행 결과를 사용자에게 제공하고, 추가 조치를 요청할 수 있음

AI 웹 어시스턴트에서 활용하는 툴
AI 웹 어시스턴트는 다음과 같은 툴을 활용하여 자동화 작업을 수행합니다.

Tool Name	설명	입력값	출력값
site_search	웹사이트의 주요 메뉴와 기능 검색	query (검색어)	코드 스니펫
dom_search 	웹사이트의 Dom 검색 및 목록
do_action   웹사이트의 특정 액션 수행 

웹사이트 내 AI 웹 어시스턴트 동작 방식
주요 기능
자동 입력: 웹사이트의 특정 입력 필드에 자동으로 텍스트 입력
버튼 클릭: 웹사이트 내 특정 버튼을 자동으로 클릭
데이터 검색: 웹사이트 내 데이터(게시글, 댓글, 사용자 정보 등)를 검색하고 가공
API 호출: 웹사이트에서 제공하는 API를 활용하여 데이터 업데이트
UI 변경 감지: MutationObserver를 활용하여 웹사이트 변경을 감지하고 적응

AI 웹 어시스턴트의 작동 예시
시나리오 1: 채팅 입력 자동화
사용자 요청 "고객에게 인사 문자를 자동으로 보내줘."
AI 웹 어시스턴트 처리 흐름 LLM 분석:  "고객에게 인사 문자를 보내달라는 요청을 이해함"  "웹사이트 내 채팅 입력란을 찾아 자동 입력 필요"
웹사이트 DOM 분석:
javascript
document.querySelector(".chat-input").value = "안녕하세요! AI 웹 어시스턴트입니다.";
document.querySelector(".send-button").click();
결과 반환: "메시지를 입력하고 전송했습니다."
시나리오 2: 게시판 데이터 검색
사용자 요청  "최근 3개월 동안 댓글이 가장 많은 게시글을 찾아줘."
AI 웹 어시스턴트 처리 흐름  LLM 분석:  "게시판 데이터를 분석하여 댓글이 많은 게시글 정렬 필요"
API 호출 또는 웹 크롤링: javascript
fetch("https://example.com/api/posts?date_range=3months")
.then(res => res.json())
.then(data => {
    const sorted = data.sort((a, b) => b.comments.length - a.comments.length);
    console.log("가장 댓글이 많은 게시글:", sorted.slice(0, 3));
});
결과 반환: "가장 댓글이 많은 게시글을 찾아 출력했습니다."
AI 웹 어시스턴트의 제한 사항
보안 문제
AI가 직접 로그인 관련 정보를 입력하지 않으며, 사용자 인증을 필요로 하는 작업은 명확한 동의 후 수행
웹사이트의 보안 정책을 준수하며, 사용자 데이터를 보호
웹사이트 변경 감지
MutationObserver를 활용하여 UI 변경 사항을 감지하고 적응
웹사이트 구조가 변경되면, 새로운 셀렉터를 자동 적용하거나 사용자에게 알림 제공
AI 응답 지연 최소화
LLM 호출 시 최적화된 프롬프트를 사용하여 빠르게 응답
웹사이트 내에서 즉각적인 자동화 작업을 수행하도록 DOM 조작 최적화
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


AI 웹 어시스턴트는 SPA 방식 혹은 다른 어떤 방식의 웹 사이트에서도 원활하게 작동이 되어야 한다.
이 구조를 통해 웹사이트와 AI 웹 어시스턴트가 효과적으로 상호작용할 수 있으며, AI가 사용자의 자연어 요청을 이해하여 자동화된 웹사이트 조작, 데이터 검색 들을 수행 할수 있습니다.
필요에 따라 추가 툴을 확장하거나, 특정 웹사이트에 맞춤형 DOM 조작 기능을 구현할 수 있습니다.




AI 웹 어시스턴트에 대한 시스템 프롬프트를 작성해 주세요



위의 AI 코딩 어시스턴트에 필요한 툴과 같이 AI 웹 어시스턴트가 필요한 툴을 파일로 작성해 주세요 

AI 웹 어시스턴트가 필요한 주요 툴은 사용자가 요청한 기능에 대한 좌측 메뉴들에 대한 검색, 검색한 메뉴에 대한 내용 파악, 검색과 유사한 특정 메뉴 페이지 이동, 이동한 메뉴 페이지에서 적정한 액션 수행 등입니다.
```

### 결과

AI 웹 어시스턴트에 필요한 다음과 같은 툴을 정의하고 구현했습니다:

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

각 툴은 TypeScript로 구현되었으며, 웹사이트와의 상호작용을 위한 다양한 기능을 제공합니다. 이 툴들은 AI 웹 어시스턴트가 사용자의 요청에 따라 웹사이트를 탐색하고 작업을 수행하는 데 필요한 핵심 기능을 담당합니다.

## 2024-03-15

### 초기 프로젝트 설정
- **프롬프트**: AI 웹 어시스턴트 POC를 진행하려고 합니다.
- **결과**: 
  - 프로젝트 기본 구조 설정
  - README.md 파일 생성
  - 프롬프트 이력 관리 시스템 구축
- **사용 기술 스택**: Next.js 14, TypeScript, Tailwind CSS, OpenAI API, Vercel AI SDK

### 프로젝트 방향 수정
- **프롬프트**: 아직 개발 프로젝트를 초기화 하지 마세요. 이번 POC의 목표는 어떤 특정한 웹 사이트에 사이드 바 형태로 AI 웹 어시스턴트를 쉽게 추가 할수 있어야 합니다.
- **결과**:
  - 프로젝트 목표 재정의: 웹 컴포넌트 기반 통합형 AI 어시스턴트
  - 기술 스택 변경: Web Components, Shadow DOM, Custom Elements 중심
  - 요구사항 문서 업데이트: 통합 용이성, 호환성, CDN 배포 등 추가
- **주요 변경사항**:
  - 단일 스크립트 통합 방식 채택
  - 사이드바 UI 컴포넌트 설계
  - 스타일 격리 및 커스터마이징 지원

### 요구사항 상세화
- **프롬프트**: 요구사항과 리드미 파일까지만 계속 업데이트하면서 최종 확정되면 프로젝트 초기화를 진행하세요.
- **결과**:
  - README.md 상세화
    - 개발 환경 설정 가이드 추가
    - 상세한 디렉토리 구조 정의
    - 기여 가이드라인 추가
    - 통합 예시 구체화
  - 요구사항 문서 확장
    - 세부 기능 요구사항 구체화
    - 다국어 지원 요구사항 추가
    - 테스트 요구사항 추가
    - 보안 요구사항 강화
- **주요 추가사항**:
  - 웹 컴포넌트 기술 스택 구체화 (Lit 도입)
  - 다국어 지원 및 i18n 시스템
  - 테스트 전략 수립
  - 보안 및 성능 최적화 전략

### 요구사항 상세화 - DOM 및 인터랙션
- **프롬프트**: 요구사항을 더 구체화하여 DOM 조작과 사용자 인터랙션 가이드 시스템을 상세화했습니다.
- **결과**:
  - DOM 관찰 및 조작 상세화
    - MutationObserver 활용 방안 구체화
    - 이벤트 위임 시스템 상세 정의
    - 가상 DOM 동기화 전략 수립
    - 요소 조작 안전성 강화
  - 사용자 액션 가이드 시스템 구체화
    - 작업 단계 시각화 방안
    - 다중 요소 하이라이팅 기능
    - 실시간 피드백 시스템
    - 오류 상황 대처 프로세스
- **주요 추가사항**:
  - DOM 변경 감지 및 필터링 시스템
  - 성능 최적화된 이벤트 처리
  - 단계별 작업 진행 상태 표시
  - 사용자 액션 검증 및 피드백

### 다중 LLM 지원 추가
- **프롬프트**: LLM은 GPT와 엔트로픽, Exaone을 사용할 것이고 적정한 환경 파일로 관리할 수 있도록 하세요.
- **결과**:
  - 다중 LLM 지원 구조 설계
    - OpenAI GPT-4
    - Anthropic Claude
    - EXA-1
  - 환경 변수 설정 구조화
    - LLM별 API 키 및 설정 관리
    - 환경별 설정 분리
  - 기능 추가
    - LLM 자동 전환 및 폴백
    - 로드 밸런싱
    - 비용 최적화
- **주요 추가사항**:
  - LLM 통합 아키텍처 설계
  - API 키 보안 관리 체계
  - 모델 파라미터 최적화
  - 사용량 모니터링 시스템

### 웹사이트 통합 및 인터랙션 강화
- **프롬프트**: 가장 중요한 요구 사항 중 하나는 기존 웹사이트의 수정을 최소화하면서 AI 웹 어시스턴트를 사이드바에 추가하는 것이고 기존 웹 사이트에서 사용자에게 복잡한 기능을 프롬프트로 입력받아 인터랙티브하게 사용자의 웹 액션들에 대한 도움을 주는 것입니다.
- **결과**:
  - 웹사이트 통합 방식 개선
    - 최소 침습적 통합 방식 도입
    - DOM 관찰 및 조작 기능 추가
    - 성능 영향 최소화 전략
  - 인터랙티브 지원 기능 강화
    - 사용자 액션 가이드 시스템
    - 컨텍스트 기반 도움말
    - 작업 자동화 지원
  - 설정 및 API 확장
    - 웹사이트 통합 설정 추가
    - 인터랙션 관련 이벤트 훅 추가
    - 자동화 API 정의
- **주요 추가사항**:
  - DOM 이벤트 처리 시스템
  - 사용자 액션 시퀀스 관리
  - 요소 하이라이팅 기능
  - 자동화 매크로 시스템 
