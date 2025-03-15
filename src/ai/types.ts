/**
 * AI 웹 어시스턴트 타입 정의
 */

/**
 * 기본 툴 인터페이스
 */
export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameters;
}

/**
 * 툴 파라미터 타입
 */
export interface ToolParameters {
  type?: string;
  properties: Record<string, ToolParameterProperty>;
  required?: string[];
}

/**
 * 툴 파라미터 속성 타입
 */
export interface ToolParameterProperty {
  type: string;
  description: string;
  enum?: string[];
  default?: any;
  items?: {
    type: string;
    enum?: string[];
    properties?: Record<string, ToolParameterProperty>;
    required?: string[];
  };
}

/**
 * 툴 호출 결과 타입
 */
export interface ToolCallResult {
  status: 'success' | 'error';
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * LLM 제공자 타입
 */
export type LLMProvider = 'openai' | 'anthropic' | 'exaone';

/**
 * LLM 모델 설정 타입
 */
export interface LLMModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

/**
 * LLM 설정 타입
 */
export interface LLMConfig {
  default: string;
  providers: Record<string, LLMModelConfig>;
  fallback: string[];
  loadBalancing: {
    enabled: boolean;
    strategy: 'round-robin' | 'random' | 'performance';
  };
}

/**
 * 테마 설정 타입
 */
export interface ThemeConfig {
  primary: string;
  background: string;
  text: string;
  accent: string;
  mode?: 'light' | 'dark' | 'system';
}

/**
 * 프롬프트 설정 타입
 */
export interface PromptConfig {
  context: string;
  system: string;
  actionGuide: string;
}

/**
 * 국제화 설정 타입
 */
export interface I18nConfig {
  locale: string;
  messages: Record<string, string>;
}

/**
 * 훅 설정 타입
 */
export interface HooksConfig {
  onInit?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;
  onLLMSwitch?: (from: string, to: string) => void;
  onActionGuide?: (step: any) => void;
  onElementHighlight?: (element: HTMLElement) => void;
}

/**
 * AI 웹 어시스턴트 설정 타입
 */
export interface WebAssistantConfig {
  llm: LLMConfig;
  theme: ThemeConfig;
  prompts: PromptConfig;
  i18n: I18nConfig;
  hooks: HooksConfig;
}

/**
 * 메시지 타입
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
}

/**
 * 툴 호출 타입
 */
export interface ToolCall {
  id: string;
  toolName: string;
  parameters: Record<string, any>;
  result?: ToolCallResult;
  timestamp: number;
}

/**
 * 대화 컨텍스트 타입
 */
export interface ConversationContext {
  url: string;
  title: string;
  metadata: Record<string, any>;
  domSnapshot?: any;
  userActions?: UserAction[];
}

/**
 * 사용자 액션 타입
 */
export interface UserAction {
  type: 'click' | 'input' | 'navigation' | 'scroll' | 'other';
  target?: {
    selector: string;
    text?: string;
    attributes?: Record<string, string>;
  };
  value?: any;
  timestamp: number;
} 