/**
 * 요소 하이라이트 툴 구현
 */

import { ToolCallResult } from '../types';

interface ElementHighlightParams {
  selector: string;
  highlight_style?: 'pulse' | 'outline' | 'background' | 'zoom';
  duration?: number;
  message?: string;
}

interface ElementInfo {
  tag: string;
  id?: string;
  classes?: string[];
  text?: string;
  attributes?: Record<string, string>;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// 하이라이트 스타일 정의
const highlightStyles = {
  pulse: `
    @keyframes pulse-animation {
      0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
      100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
    }
    animation: pulse-animation 1.5s infinite;
    position: relative;
    z-index: 9999;
  `,
  outline: `
    outline: 3px solid #4285F4 !important;
    outline-offset: 2px !important;
    position: relative;
    z-index: 9999;
  `,
  background: `
    background-color: rgba(66, 133, 244, 0.2) !important;
    position: relative;
    z-index: 9999;
  `,
  zoom: `
    transform: scale(1.05);
    transition: transform 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 9999;
  `
};

// 메시지 스타일 정의
const messageStyle = `
  position: absolute;
  background-color: #4285F4;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 250px;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`;

/**
 * 요소 정보를 추출하는 함수
 */
function getElementInfo(element: HTMLElement): ElementInfo {
  const rect = element.getBoundingClientRect();
  const attributes: Record<string, string> = {};
  
  // 주요 속성 추출
  Array.from(element.attributes).forEach(attr => {
    attributes[attr.name] = attr.value;
  });
  
  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || undefined,
    classes: element.classList.length > 0 ? Array.from(element.classList) : undefined,
    text: element.textContent?.trim() || undefined,
    attributes,
    position: {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    }
  };
}

/**
 * 요소에 스타일을 적용하는 함수
 */
function applyHighlightStyle(element: HTMLElement, style: string): void {
  // 기존 스타일 저장
  const originalStyle = element.getAttribute('style') || '';
  element.setAttribute('data-original-style', originalStyle);
  
  // 새 스타일 적용
  element.setAttribute('style', `${originalStyle}; ${style}`);
}

/**
 * 요소에 메시지를 표시하는 함수
 */
function showMessage(element: HTMLElement, message: string): HTMLElement {
  const rect = element.getBoundingClientRect();
  
  // 메시지 요소 생성
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.setAttribute('style', messageStyle);
  messageElement.classList.add('ai-assistant-highlight-message');
  
  // 메시지 위치 설정 (요소 위)
  const top = rect.top + window.scrollY - messageElement.offsetHeight - 10;
  const left = rect.left + window.scrollX + (rect.width / 2);
  
  messageElement.style.top = `${top}px`;
  messageElement.style.left = `${left}px`;
  messageElement.style.transform = 'translateX(-50%)';
  
  // 문서에 추가
  document.body.appendChild(messageElement);
  
  return messageElement;
}

/**
 * 하이라이트 제거 함수
 */
function removeHighlight(element: HTMLElement, messageElement?: HTMLElement): void {
  // 원래 스타일 복원
  const originalStyle = element.getAttribute('data-original-style');
  if (originalStyle !== null) {
    element.setAttribute('style', originalStyle);
    element.removeAttribute('data-original-style');
  } else {
    element.removeAttribute('style');
  }
  
  // 메시지 요소 제거
  if (messageElement && document.body.contains(messageElement)) {
    document.body.removeChild(messageElement);
  }
}

/**
 * 요소 하이라이트 툴 실행 함수
 */
export async function executeElementHighlight(params: ElementHighlightParams): Promise<ToolCallResult> {
  try {
    const { 
      selector,
      highlight_style = 'pulse',
      duration = 3000,
      message
    } = params;
    
    // 요소 찾기
    const element = document.querySelector(selector) as HTMLElement;
    
    if (!element) {
      return {
        status: 'error',
        error: {
          code: 'ELEMENT_NOT_FOUND',
          message: `선택자 '${selector}'에 해당하는 요소를 찾을 수 없습니다.`
        }
      };
    }
    
    // 요소 정보 추출
    const elementInfo = getElementInfo(element);
    
    // 스타일 적용
    const style = highlightStyles[highlight_style];
    applyHighlightStyle(element, style);
    
    // 메시지 표시 (있는 경우)
    let messageElement: HTMLElement | undefined;
    if (message) {
      messageElement = showMessage(element, message);
    }
    
    // 요소가 보이도록 스크롤
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 지정된 시간 후 하이라이트 제거
    setTimeout(() => {
      removeHighlight(element, messageElement);
    }, duration);
    
    return {
      status: 'success',
      data: {
        highlighted: true,
        element_info: elementInfo,
        style: highlight_style,
        duration,
        message
      }
    };
  } catch (error) {
    console.error('요소 하이라이트 중 오류 발생:', error);
    return {
      status: 'error',
      error: {
        code: 'HIGHLIGHT_ERROR',
        message: `요소 하이라이트 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
} 