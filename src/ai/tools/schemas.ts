/**
 * AI 웹 어시스턴트 툴 스키마
 * 
 * 이 파일은 LLM에 전달할 툴 스키마를 정의합니다.
 */

/**
 * 메뉴 검색 툴 스키마
 */
export const menuSearchSchema = {
  name: 'menu_search',
  description: '웹사이트의 메뉴 항목을 검색합니다. 사용자가 찾고자 하는 기능이나 페이지와 관련된 메뉴 항목을 찾을 때 사용합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 페이지 내용 분석 툴 스키마
 */
export const pageContentAnalysisSchema = {
  name: 'page_content_analysis',
  description: '현재 페이지의 내용을 분석하여 중요 정보, 주요 기능, 입력 필드 등을 식별합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 페이지 이동 툴 스키마
 */
export const pageNavigationSchema = {
  name: 'page_navigation',
  description: '특정 메뉴 항목이나 링크로 페이지를 이동합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 요소 하이라이트 툴 스키마
 */
export const elementHighlightSchema = {
  name: 'element_highlight',
  description: '특정 UI 요소를 강조 표시하여 사용자의 주의를 끕니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 액션 수행 툴 스키마
 */
export const performActionSchema = {
  name: 'perform_action',
  description: '특정 UI 요소에 대한 액션(클릭, 입력 등)을 수행합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 작업 자동화 툴 스키마
 */
export const workflowAutomationSchema = {
  name: 'workflow_automation',
  description: '여러 단계의 작업을 순차적으로 자동 수행합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 스크린샷 캡처 툴 스키마
 */
export const screenshotSchema = {
  name: 'screenshot',
  description: '현재 페이지나 특정 요소의 스크린샷을 캡처합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 웹사이트 상태 모니터링 툴 스키마
 */
export const stateMonitoringSchema = {
  name: 'state_monitoring',
  description: '웹사이트의 상태 변화(DOM 변경, URL 변경, 폼 상태 등)를 모니터링합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 사용자 가이드 툴 스키마
 */
export const userGuideSchema = {
  name: 'user_guide',
  description: '특정 작업에 대한 단계별 사용자 가이드를 생성하고 표시합니다.',
  parameters: {
    type: 'object',
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
};

/**
 * 모든 툴 스키마 목록
 */
export const webAssistantToolSchemas = [
  menuSearchSchema,
  pageContentAnalysisSchema,
  pageNavigationSchema,
  elementHighlightSchema,
  performActionSchema,
  workflowAutomationSchema,
  screenshotSchema,
  stateMonitoringSchema,
  userGuideSchema,
];

/**
 * LLM에 전달할 형식으로 툴 스키마 가져오기
 */
export function getToolSchemasForLLM() {
  return webAssistantToolSchemas.map(schema => ({
    type: 'function',
    function: {
      name: schema.name,
      description: schema.description,
      parameters: schema.parameters,
    },
  }));
} 