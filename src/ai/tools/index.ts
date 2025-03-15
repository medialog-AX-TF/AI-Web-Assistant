/**
 * AI 웹 어시스턴트 툴 인덱스
 * 
 * 모든 툴을 내보내는 인덱스 파일입니다.
 */

// 툴 정의 및 인터페이스
export * from './tools';

// 개별 툴 구현
export { executeMenuSearch } from './menu-search';
export { executePageContentAnalysis } from './page-content-analysis';
export { executePageNavigation } from './page-navigation';
export { executeElementHighlight } from './element-highlight';
export { executePerformAction } from './perform-action';

// 툴 실행 함수 매핑
import { WebAssistantTool } from './tools';
import { executeMenuSearch } from './menu-search';
import { executePageContentAnalysis } from './page-content-analysis';
import { executePageNavigation } from './page-navigation';
import { executeElementHighlight } from './element-highlight';
import { executePerformAction } from './perform-action';

/**
 * 툴 이름에 따른 실행 함수 매핑
 */
export const toolExecutors: Record<string, Function> = {
  'menu_search': executeMenuSearch,
  'page_content_analysis': executePageContentAnalysis,
  'page_navigation': executePageNavigation,
  'element_highlight': executeElementHighlight,
  'perform_action': executePerformAction,
};

/**
 * 툴 실행 함수
 * 
 * 툴 이름과 파라미터를 받아 해당 툴을 실행합니다.
 */
export async function executeTool(toolName: string, params: Record<string, any>) {
  const executor = toolExecutors[toolName];
  
  if (!executor) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  return await executor(params);
} 