/**
 * AI 웹 어시스턴트 툴 정의
 * 
 * 이 파일은 AI 웹 어시스턴트가 웹사이트와 상호작용하기 위해 필요한 
 * 다양한 툴을 정의합니다.
 */

import { type Tool, type ToolCallResult } from '../types';

/**
 * AI 웹 어시스턴트 툴 인터페이스
 */
export interface WebAssistantTool extends Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: Record<string, any>) => Promise<ToolCallResult>;
}

/**
 * 웹사이트 메뉴 검색 툴
 * 사용자가 요청한 기능에 대한 좌측 메뉴들을 검색합니다.
 */
export const menuSearchTool: WebAssistantTool = {
  name: 'menu_search',
  description: '웹사이트의 메뉴 항목을 검색합니다. 사용자가 찾고자 하는 기능이나 페이지와 관련된 메뉴 항목을 찾을 때 사용합니다.',
  parameters: {
    properties: {
      query: {
        type: 'string',
        description: '검색할 메뉴 항목 키워드나 기능 설명',
      },
      max_results: {
        type: 'integer',
        description: '반환할 최대 결과 수',
        default: 5,
      },
      include_hidden: {
        type: 'boolean',
        description: '숨겨진 메뉴 항목도 포함할지 여부',
        default: false,
      },
    },
    required: ['query'],
  },
  execute: async (params) => {
    // 실제 구현은 DOM 조작을 통해 메뉴 항목을 찾아 반환
    return {
      status: 'success',
      data: {
        results: [], // 검색된 메뉴 항목 목록
        total: 0,    // 총 검색 결과 수
      },
    };
  },
};

/**
 * 페이지 컨텐츠 분석 툴
 * 현재 페이지의 내용을 분석하여 중요 정보를 추출합니다.
 */
export const pageContentAnalysisTool: WebAssistantTool = {
  name: 'page_content_analysis',
  description: '현재 페이지의 내용을 분석하여 중요 정보, 주요 기능, 입력 필드 등을 식별합니다.',
  parameters: {
    properties: {
      elements_to_analyze: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['headings', 'forms', 'tables', 'buttons', 'links', 'images', 'all'],
        },
        description: '분석할 요소 유형',
        default: ['all'],
      },
      include_text_content: {
        type: 'boolean',
        description: '텍스트 내용을 포함할지 여부',
        default: true,
      },
    },
    required: [],
  },
  execute: async (params) => {
    // 실제 구현은 DOM 분석을 통해 페이지 내용 추출
    return {
      status: 'success',
      data: {
        headings: [],  // 페이지 제목 및 소제목
        forms: [],     // 폼 요소
        tables: [],    // 테이블 데이터
        buttons: [],   // 버튼 요소
        links: [],     // 링크 요소
        images: [],    // 이미지 요소
        main_content: '', // 주요 내용 텍스트
      },
    };
  },
};

/**
 * 페이지 이동 툴
 * 특정 메뉴나 링크로 페이지를 이동합니다.
 */
export const pageNavigationTool: WebAssistantTool = {
  name: 'page_navigation',
  description: '특정 메뉴 항목이나 링크로 페이지를 이동합니다.',
  parameters: {
    properties: {
      target: {
        type: 'string',
        description: '이동할 메뉴 항목 ID, 이름 또는 URL',
      },
      target_type: {
        type: 'string',
        enum: ['menu_id', 'menu_name', 'url', 'element_selector'],
        description: '대상 유형',
        default: 'menu_name',
      },
      open_in_new_tab: {
        type: 'boolean',
        description: '새 탭에서 열지 여부',
        default: false,
      },
    },
    required: ['target'],
  },
  execute: async (params) => {
    // 실제 구현은 해당 메뉴나 링크 클릭 또는 URL 이동
    return {
      status: 'success',
      data: {
        navigated_to: '', // 이동한 페이지 정보
        previous_page: '', // 이전 페이지 정보
      },
    };
  },
};

/**
 * 요소 하이라이트 툴
 * 특정 UI 요소를 강조 표시합니다.
 */
export const elementHighlightTool: WebAssistantTool = {
  name: 'element_highlight',
  description: '특정 UI 요소를 강조 표시하여 사용자의 주의를 끕니다.',
  parameters: {
    properties: {
      selector: {
        type: 'string',
        description: '하이라이트할 요소의 CSS 선택자',
      },
      highlight_style: {
        type: 'string',
        enum: ['pulse', 'outline', 'background', 'zoom'],
        description: '하이라이트 스타일',
        default: 'pulse',
      },
      duration: {
        type: 'integer',
        description: '하이라이트 지속 시간(밀리초)',
        default: 3000,
      },
      message: {
        type: 'string',
        description: '요소와 함께 표시할 메시지',
      },
    },
    required: ['selector'],
  },
  execute: async (params) => {
    // 실제 구현은 DOM 요소에 하이라이트 효과 적용
    return {
      status: 'success',
      data: {
        highlighted: true,
        element_info: {}, // 하이라이트된 요소 정보
      },
    };
  },
};

/**
 * 액션 수행 툴
 * 특정 UI 요소에 대한 액션을 수행합니다.
 */
export const performActionTool: WebAssistantTool = {
  name: 'perform_action',
  description: '특정 UI 요소에 대한 액션(클릭, 입력 등)을 수행합니다.',
  parameters: {
    properties: {
      selector: {
        type: 'string',
        description: '액션을 수행할 요소의 CSS 선택자',
      },
      action: {
        type: 'string',
        enum: ['click', 'input', 'select', 'check', 'uncheck', 'hover', 'focus', 'blur'],
        description: '수행할 액션 유형',
      },
      value: {
        type: 'string',
        description: '입력 또는 선택할 값 (input, select 액션에 필요)',
      },
      wait_for_navigation: {
        type: 'boolean',
        description: '액션 후 페이지 이동을 기다릴지 여부',
        default: false,
      },
    },
    required: ['selector', 'action'],
  },
  execute: async (params) => {
    // 실제 구현은 DOM 요소에 액션 수행
    return {
      status: 'success',
      data: {
        action_performed: true,
        element_info: {}, // 액션이 수행된 요소 정보
        result: {},       // 액션 결과 (예: 입력된 값, 선택된 옵션 등)
      },
    };
  },
};

/**
 * 작업 자동화 툴
 * 여러 단계의 작업을 자동으로 수행합니다.
 */
export const workflowAutomationTool: WebAssistantTool = {
  name: 'workflow_automation',
  description: '여러 단계의 작업을 순차적으로 자동 수행합니다.',
  parameters: {
    properties: {
      steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            tool: {
              type: 'string',
              description: '사용할 툴 이름',
            },
            parameters: {
              type: 'object',
              description: '툴에 전달할 파라미터',
            },
            condition: {
              type: 'object',
              description: '이 단계를 실행할 조건',
            },
            delay: {
              type: 'integer',
              description: '이전 단계 후 대기 시간(밀리초)',
              default: 0,
            },
          },
          required: ['tool', 'parameters'],
        },
        description: '수행할 작업 단계',
      },
      stop_on_error: {
        type: 'boolean',
        description: '오류 발생 시 중단할지 여부',
        default: true,
      },
    },
    required: ['steps'],
  },
  execute: async (params) => {
    // 실제 구현은 각 단계별 툴 실행 및 결과 수집
    return {
      status: 'success',
      data: {
        completed: true,
        steps_executed: 0,   // 실행된 단계 수
        steps_succeeded: 0,  // 성공한 단계 수
        steps_failed: 0,     // 실패한 단계 수
        results: [],         // 각 단계별 결과
      },
    };
  },
};

/**
 * 스크린샷 캡처 툴
 * 현재 페이지나 특정 요소의 스크린샷을 캡처합니다.
 */
export const screenshotTool: WebAssistantTool = {
  name: 'screenshot',
  description: '현재 페이지나 특정 요소의 스크린샷을 캡처합니다.',
  parameters: {
    properties: {
      selector: {
        type: 'string',
        description: '캡처할 요소의 CSS 선택자 (비워두면 전체 페이지)',
      },
      format: {
        type: 'string',
        enum: ['png', 'jpeg', 'webp'],
        description: '이미지 형식',
        default: 'png',
      },
      quality: {
        type: 'integer',
        description: '이미지 품질 (1-100, jpeg/webp에만 적용)',
        default: 90,
      },
      include_annotations: {
        type: 'boolean',
        description: '하이라이트나 주석을 포함할지 여부',
        default: false,
      },
    },
    required: [],
  },
  execute: async (params) => {
    // 실제 구현은 html2canvas 등을 사용하여 스크린샷 캡처
    return {
      status: 'success',
      data: {
        image_data: '', // base64 인코딩된 이미지 데이터
        format: '',     // 이미지 형식
        dimensions: {}, // 이미지 크기
      },
    };
  },
};

/**
 * 웹사이트 상태 모니터링 툴
 * 웹사이트의 상태 변화를 모니터링합니다.
 */
export const stateMonitoringTool: WebAssistantTool = {
  name: 'state_monitoring',
  description: '웹사이트의 상태 변화(DOM 변경, URL 변경, 폼 상태 등)를 모니터링합니다.',
  parameters: {
    properties: {
      monitor_types: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['dom_changes', 'url_changes', 'form_state', 'network_requests', 'errors'],
        },
        description: '모니터링할 상태 유형',
        default: ['dom_changes', 'url_changes'],
      },
      selectors: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: '모니터링할 특정 요소의 CSS 선택자 목록',
      },
      duration: {
        type: 'integer',
        description: '모니터링 지속 시간(밀리초, 0은 무제한)',
        default: 10000,
      },
    },
    required: ['monitor_types'],
  },
  execute: async (params) => {
    // 실제 구현은 MutationObserver 등을 사용하여 상태 변화 모니터링
    return {
      status: 'success',
      data: {
        changes_detected: 0,  // 감지된 변경 수
        changes: [],          // 변경 내용 목록
        duration_actual: 0,   // 실제 모니터링 지속 시간
      },
    };
  },
};

/**
 * 사용자 가이드 툴
 * 단계별 사용자 가이드를 제공합니다.
 */
export const userGuideTool: WebAssistantTool = {
  name: 'user_guide',
  description: '특정 작업에 대한 단계별 사용자 가이드를 생성하고 표시합니다.',
  parameters: {
    properties: {
      task: {
        type: 'string',
        description: '안내할 작업 설명',
      },
      steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: '단계 설명',
            },
            selector: {
              type: 'string',
              description: '관련 요소의 CSS 선택자',
            },
            action: {
              type: 'string',
              description: '수행할 액션 설명',
            },
            highlight: {
              type: 'boolean',
              description: '요소를 하이라이트할지 여부',
              default: true,
            },
          },
          required: ['description'],
        },
        description: '가이드 단계',
      },
      interactive: {
        type: 'boolean',
        description: '사용자 액션을 기다리며 진행할지 여부',
        default: true,
      },
      show_progress: {
        type: 'boolean',
        description: '진행 상태를 표시할지 여부',
        default: true,
      },
    },
    required: ['task', 'steps'],
  },
  execute: async (params) => {
    // 실제 구현은 단계별 가이드 UI 표시 및 사용자 상호작용 처리
    return {
      status: 'success',
      data: {
        guide_id: '',      // 생성된 가이드 ID
        steps_total: 0,    // 총 단계 수
        current_step: 0,   // 현재 단계
        completed: false,  // 완료 여부
      },
    };
  },
};

/**
 * 사용 가능한 모든 툴 목록
 */
export const webAssistantTools: WebAssistantTool[] = [
  menuSearchTool,
  pageContentAnalysisTool,
  pageNavigationTool,
  elementHighlightTool,
  performActionTool,
  workflowAutomationTool,
  screenshotTool,
  stateMonitoringTool,
  userGuideTool,
];

/**
 * 툴 이름으로 툴 객체 찾기
 */
export function getToolByName(name: string): WebAssistantTool | undefined {
  return webAssistantTools.find(tool => tool.name === name);
}

/**
 * 모든 툴의 스키마 정보 가져오기 (LLM에 전달용)
 */
export function getToolSchemas() {
  return webAssistantTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
} 