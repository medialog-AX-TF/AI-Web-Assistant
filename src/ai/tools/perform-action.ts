/**
 * 액션 수행 툴 구현
 */

import { ToolCallResult } from '../types';

interface PerformActionParams {
  selector: string;
  action: 'click' | 'input' | 'select' | 'check' | 'uncheck' | 'hover' | 'focus' | 'blur';
  value?: string;
  wait_for_navigation?: boolean;
}

interface ElementInfo {
  tag: string;
  id?: string;
  classes?: string[];
  text?: string;
  attributes?: Record<string, string>;
}

/**
 * 요소 정보를 추출하는 함수
 */
function getElementInfo(element: HTMLElement): ElementInfo {
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
    attributes
  };
}

/**
 * 요소 클릭 액션 수행 함수
 */
async function performClickAction(element: HTMLElement): Promise<boolean> {
  try {
    // 요소가 화면에 보이는지 확인
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && 
                     rect.height > 0 && 
                     window.getComputedStyle(element).display !== 'none' &&
                     window.getComputedStyle(element).visibility !== 'hidden';
    
    if (!isVisible) {
      console.warn('요소가 화면에 보이지 않습니다.');
      // 필요한 경우 요소를 화면에 보이게 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 약간의 지연 후 클릭 시도
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            element.click();
            resolve(true);
          } catch (error) {
            console.error('요소 클릭 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      });
    }
    
    // 요소 클릭
    element.click();
    return true;
  } catch (error) {
    console.error('요소 클릭 중 오류 발생:', error);
    return false;
  }
}

/**
 * 입력 액션 수행 함수
 */
async function performInputAction(element: HTMLInputElement | HTMLTextAreaElement, value: string): Promise<boolean> {
  try {
    // 요소가 화면에 보이는지 확인
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && 
                     rect.height > 0 && 
                     window.getComputedStyle(element).display !== 'none' &&
                     window.getComputedStyle(element).visibility !== 'hidden';
    
    if (!isVisible) {
      console.warn('요소가 화면에 보이지 않습니다.');
      // 필요한 경우 요소를 화면에 보이게 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 약간의 지연 후 입력 시도
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            // 포커스 설정
            element.focus();
            
            // 기존 값 지우기
            element.value = '';
            
            // 새 값 입력
            element.value = value;
            
            // 입력 이벤트 발생
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
            
            // 변경 이벤트 발생
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(changeEvent);
            
            resolve(true);
          } catch (error) {
            console.error('입력 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      });
    }
    
    // 포커스 설정
    element.focus();
    
    // 기존 값 지우기
    element.value = '';
    
    // 새 값 입력
    element.value = value;
    
    // 입력 이벤트 발생
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
    
    // 변경 이벤트 발생
    const changeEvent = new Event('change', { bubbles: true });
    element.dispatchEvent(changeEvent);
    
    return true;
  } catch (error) {
    console.error('입력 중 오류 발생:', error);
    return false;
  }
}

/**
 * 선택 액션 수행 함수
 */
async function performSelectAction(element: HTMLSelectElement, value: string): Promise<boolean> {
  try {
    // 요소가 화면에 보이는지 확인
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && 
                     rect.height > 0 && 
                     window.getComputedStyle(element).display !== 'none' &&
                     window.getComputedStyle(element).visibility !== 'hidden';
    
    if (!isVisible) {
      console.warn('요소가 화면에 보이지 않습니다.');
      // 필요한 경우 요소를 화면에 보이게 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 약간의 지연 후 선택 시도
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            // 포커스 설정
            element.focus();
            
            // 값 선택
            element.value = value;
            
            // 변경 이벤트 발생
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(changeEvent);
            
            resolve(true);
          } catch (error) {
            console.error('선택 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      });
    }
    
    // 포커스 설정
    element.focus();
    
    // 값 선택
    element.value = value;
    
    // 변경 이벤트 발생
    const changeEvent = new Event('change', { bubbles: true });
    element.dispatchEvent(changeEvent);
    
    return true;
  } catch (error) {
    console.error('선택 중 오류 발생:', error);
    return false;
  }
}

/**
 * 체크박스 체크/해제 액션 수행 함수
 */
async function performCheckAction(element: HTMLInputElement, check: boolean): Promise<boolean> {
  try {
    // 요소가 화면에 보이는지 확인
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && 
                     rect.height > 0 && 
                     window.getComputedStyle(element).display !== 'none' &&
                     window.getComputedStyle(element).visibility !== 'hidden';
    
    if (!isVisible) {
      console.warn('요소가 화면에 보이지 않습니다.');
      // 필요한 경우 요소를 화면에 보이게 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 약간의 지연 후 체크 시도
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            // 포커스 설정
            element.focus();
            
            // 체크 상태 변경
            if (element.checked !== check) {
              element.checked = check;
              
              // 변경 이벤트 발생
              const changeEvent = new Event('change', { bubbles: true });
              element.dispatchEvent(changeEvent);
              
              // 클릭 이벤트 발생
              const clickEvent = new MouseEvent('click', { bubbles: true });
              element.dispatchEvent(clickEvent);
            }
            
            resolve(true);
          } catch (error) {
            console.error('체크 상태 변경 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      });
    }
    
    // 포커스 설정
    element.focus();
    
    // 체크 상태 변경
    if (element.checked !== check) {
      element.checked = check;
      
      // 변경 이벤트 발생
      const changeEvent = new Event('change', { bubbles: true });
      element.dispatchEvent(changeEvent);
      
      // 클릭 이벤트 발생
      const clickEvent = new MouseEvent('click', { bubbles: true });
      element.dispatchEvent(clickEvent);
    }
    
    return true;
  } catch (error) {
    console.error('체크 상태 변경 중 오류 발생:', error);
    return false;
  }
}

/**
 * 호버 액션 수행 함수
 */
async function performHoverAction(element: HTMLElement): Promise<boolean> {
  try {
    // 요소가 화면에 보이는지 확인
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && 
                     rect.height > 0 && 
                     window.getComputedStyle(element).display !== 'none' &&
                     window.getComputedStyle(element).visibility !== 'hidden';
    
    if (!isVisible) {
      console.warn('요소가 화면에 보이지 않습니다.');
      // 필요한 경우 요소를 화면에 보이게 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 약간의 지연 후 호버 시도
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            // 마우스 오버 이벤트 발생
            const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
            element.dispatchEvent(mouseoverEvent);
            
            // 마우스 엔터 이벤트 발생
            const mouseenterEvent = new MouseEvent('mouseenter', { bubbles: true });
            element.dispatchEvent(mouseenterEvent);
            
            resolve(true);
          } catch (error) {
            console.error('호버 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      });
    }
    
    // 마우스 오버 이벤트 발생
    const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
    element.dispatchEvent(mouseoverEvent);
    
    // 마우스 엔터 이벤트 발생
    const mouseenterEvent = new MouseEvent('mouseenter', { bubbles: true });
    element.dispatchEvent(mouseenterEvent);
    
    return true;
  } catch (error) {
    console.error('호버 중 오류 발생:', error);
    return false;
  }
}

/**
 * 포커스 액션 수행 함수
 */
async function performFocusAction(element: HTMLElement): Promise<boolean> {
  try {
    // 요소가 화면에 보이는지 확인
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && 
                     rect.height > 0 && 
                     window.getComputedStyle(element).display !== 'none' &&
                     window.getComputedStyle(element).visibility !== 'hidden';
    
    if (!isVisible) {
      console.warn('요소가 화면에 보이지 않습니다.');
      // 필요한 경우 요소를 화면에 보이게 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 약간의 지연 후 포커스 시도
      return new Promise<boolean>(resolve => {
        setTimeout(() => {
          try {
            // 포커스 설정
            element.focus();
            
            // 포커스 이벤트 발생
            const focusEvent = new FocusEvent('focus', { bubbles: true });
            element.dispatchEvent(focusEvent);
            
            resolve(true);
          } catch (error) {
            console.error('포커스 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      });
    }
    
    // 포커스 설정
    element.focus();
    
    // 포커스 이벤트 발생
    const focusEvent = new FocusEvent('focus', { bubbles: true });
    element.dispatchEvent(focusEvent);
    
    return true;
  } catch (error) {
    console.error('포커스 중 오류 발생:', error);
    return false;
  }
}

/**
 * 블러 액션 수행 함수
 */
async function performBlurAction(element: HTMLElement): Promise<boolean> {
  try {
    // 블러 설정
    element.blur();
    
    // 블러 이벤트 발생
    const blurEvent = new FocusEvent('blur', { bubbles: true });
    element.dispatchEvent(blurEvent);
    
    return true;
  } catch (error) {
    console.error('블러 중 오류 발생:', error);
    return false;
  }
}

/**
 * 페이지 이동 완료 대기 함수
 */
function waitForNavigation(): Promise<void> {
  return new Promise<void>(resolve => {
    // 현재 URL 저장
    const currentUrl = window.location.href;
    
    // 페이지 이동 감지를 위한 타임아웃 설정
    const navigationTimeout = setTimeout(() => {
      // 최대 5초 후에도 이동이 감지되지 않으면 완료로 간주
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      resolve();
    }, 5000);
    
    // beforeunload 이벤트 핸들러
    const beforeUnloadHandler = () => {
      clearTimeout(navigationTimeout);
      
      // 새 페이지 로드 완료 대기
      setTimeout(() => {
        resolve();
      }, 1000);
    };
    
    // beforeunload 이벤트 리스너 등록
    window.addEventListener('beforeunload', beforeUnloadHandler, { once: true });
    
    // URL 변경 감지를 위한 인터벌 설정
    const urlCheckInterval = setInterval(() => {
      if (window.location.href !== currentUrl) {
        clearInterval(urlCheckInterval);
        clearTimeout(navigationTimeout);
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        
        // 새 페이지 로드 완료 대기
        setTimeout(() => {
          resolve();
        }, 1000);
      }
    }, 100);
  });
}

/**
 * 액션 수행 툴 실행 함수
 */
export async function executePerformAction(params: PerformActionParams): Promise<ToolCallResult> {
  try {
    const { 
      selector,
      action,
      value,
      wait_for_navigation = false
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
    
    // 액션 수행 결과
    let actionResult = false;
    let actionValue: any = undefined;
    
    // 액션 유형에 따라 다른 처리
    switch (action) {
      case 'click':
        actionResult = await performClickAction(element);
        break;
        
      case 'input':
        if (!value) {
          return {
            status: 'error',
            error: {
              code: 'MISSING_VALUE',
              message: 'input 액션에는 value 파라미터가 필요합니다.'
            }
          };
        }
        
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          actionResult = await performInputAction(element, value);
          actionValue = value;
        } else {
          return {
            status: 'error',
            error: {
              code: 'INVALID_ELEMENT_TYPE',
              message: '선택한 요소는 입력 필드가 아닙니다.'
            }
          };
        }
        break;
        
      case 'select':
        if (!value) {
          return {
            status: 'error',
            error: {
              code: 'MISSING_VALUE',
              message: 'select 액션에는 value 파라미터가 필요합니다.'
            }
          };
        }
        
        if (element instanceof HTMLSelectElement) {
          actionResult = await performSelectAction(element, value);
          actionValue = value;
        } else {
          return {
            status: 'error',
            error: {
              code: 'INVALID_ELEMENT_TYPE',
              message: '선택한 요소는 select 요소가 아닙니다.'
            }
          };
        }
        break;
        
      case 'check':
        if (element instanceof HTMLInputElement && element.type === 'checkbox') {
          actionResult = await performCheckAction(element, true);
          actionValue = true;
        } else {
          return {
            status: 'error',
            error: {
              code: 'INVALID_ELEMENT_TYPE',
              message: '선택한 요소는 체크박스가 아닙니다.'
            }
          };
        }
        break;
        
      case 'uncheck':
        if (element instanceof HTMLInputElement && element.type === 'checkbox') {
          actionResult = await performCheckAction(element, false);
          actionValue = false;
        } else {
          return {
            status: 'error',
            error: {
              code: 'INVALID_ELEMENT_TYPE',
              message: '선택한 요소는 체크박스가 아닙니다.'
            }
          };
        }
        break;
        
      case 'hover':
        actionResult = await performHoverAction(element);
        break;
        
      case 'focus':
        actionResult = await performFocusAction(element);
        break;
        
      case 'blur':
        actionResult = await performBlurAction(element);
        break;
        
      default:
        return {
          status: 'error',
          error: {
            code: 'INVALID_ACTION',
            message: `유효하지 않은 액션: ${action}`
          }
        };
    }
    
    if (!actionResult) {
      return {
        status: 'error',
        error: {
          code: 'ACTION_FAILED',
          message: `'${action}' 액션 수행에 실패했습니다.`
        }
      };
    }
    
    // 페이지 이동 대기 (필요한 경우)
    if (wait_for_navigation) {
      await waitForNavigation();
    }
    
    return {
      status: 'success',
      data: {
        action_performed: true,
        action,
        element_info: elementInfo,
        result: {
          value: actionValue,
          waited_for_navigation: wait_for_navigation
        }
      }
    };
  } catch (error) {
    console.error('액션 수행 중 오류 발생:', error);
    return {
      status: 'error',
      error: {
        code: 'ACTION_ERROR',
        message: `액션 수행 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
} 