/**
 * 페이지 이동 툴 구현
 */

import { ToolCallResult } from '../types';

interface PageNavigationParams {
  target: string;
  target_type?: 'menu_id' | 'menu_name' | 'url' | 'element_selector';
  open_in_new_tab?: boolean;
}

/**
 * 메뉴 ID로 요소를 찾는 함수
 */
function findElementById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

/**
 * 메뉴 이름으로 요소를 찾는 함수
 */
function findElementByMenuName(name: string): HTMLElement | null {
  const lowerName = name.toLowerCase();
  
  // 메뉴 항목 후보들
  const menuElements = document.querySelectorAll('a, button, [role="menuitem"]');
  
  for (let i = 0; i < menuElements.length; i++) {
    const element = menuElements[i];
    const text = element.textContent?.trim().toLowerCase() || '';
    
    if (text === lowerName || text.includes(lowerName)) {
      return element as HTMLElement;
    }
    
    // aria-label 확인
    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
    if (ariaLabel === lowerName || ariaLabel.includes(lowerName)) {
      return element as HTMLElement;
    }
    
    // title 속성 확인
    const title = element.getAttribute('title')?.toLowerCase() || '';
    if (title === lowerName || title.includes(lowerName)) {
      return element as HTMLElement;
    }
  }
  
  return null;
}

/**
 * CSS 선택자로 요소를 찾는 함수
 */
function findElementBySelector(selector: string): HTMLElement | null {
  try {
    return document.querySelector(selector) as HTMLElement;
  } catch (error) {
    console.error('잘못된 CSS 선택자:', error);
    return null;
  }
}

/**
 * 요소를 클릭하는 함수
 */
function clickElement(element: HTMLElement): Promise<boolean> {
  return new Promise<boolean>(resolve => {
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
        setTimeout(() => {
          try {
            element.click();
            resolve(true);
          } catch (error) {
            console.error('요소 클릭 중 오류 발생:', error);
            resolve(false);
          }
        }, 500);
      } else {
        // 요소 클릭
        element.click();
        resolve(true);
      }
    } catch (error) {
      console.error('요소 클릭 중 오류 발생:', error);
      resolve(false);
    }
  });
}

/**
 * URL로 페이지 이동하는 함수
 */
function navigateToUrl(url: string, openInNewTab: boolean = false): boolean {
  try {
    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
    return true;
  } catch (error) {
    console.error('URL 이동 중 오류 발생:', error);
    return false;
  }
}

/**
 * 페이지 이동 툴 실행 함수
 */
export async function executePageNavigation(params: PageNavigationParams): Promise<ToolCallResult> {
  try {
    const { 
      target,
      target_type = 'menu_name',
      open_in_new_tab = false
    } = params;
    
    const previousPage = {
      url: window.location.href,
      title: document.title
    };
    
    let navigated = false;
    let targetElement: HTMLElement | null = null;
    
    // 대상 유형에 따라 다른 방식으로 처리
    switch (target_type) {
      case 'menu_id':
        targetElement = findElementById(target);
        if (targetElement) {
          navigated = await clickElement(targetElement);
        }
        break;
        
      case 'menu_name':
        targetElement = findElementByMenuName(target);
        if (targetElement) {
          navigated = await clickElement(targetElement);
        }
        break;
        
      case 'element_selector':
        targetElement = findElementBySelector(target);
        if (targetElement) {
          navigated = await clickElement(targetElement);
        }
        break;
        
      case 'url':
        navigated = navigateToUrl(target, open_in_new_tab);
        break;
        
      default:
        return {
          status: 'error',
          error: {
            code: 'INVALID_TARGET_TYPE',
            message: `유효하지 않은 대상 유형: ${target_type}`
          }
        };
    }
    
    if (!navigated) {
      return {
        status: 'error',
        error: {
          code: 'NAVIGATION_FAILED',
          message: `'${target}'(으)로 이동하지 못했습니다.`
        }
      };
    }
    
    // 페이지 이동 후 약간의 지연을 두고 현재 페이지 정보 반환
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          status: 'success',
          data: {
            navigated_to: {
              url: window.location.href,
              title: document.title,
              element: targetElement ? {
                tag: targetElement.tagName.toLowerCase(),
                id: targetElement.id || undefined,
                text: targetElement.textContent?.trim() || undefined
              } : undefined
            },
            previous_page: previousPage,
            opened_in_new_tab: open_in_new_tab
          }
        });
      }, 1000); // 페이지 로드를 위한 1초 지연
    });
  } catch (error) {
    console.error('페이지 이동 중 오류 발생:', error);
    return {
      status: 'error',
      error: {
        code: 'NAVIGATION_ERROR',
        message: `페이지 이동 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
} 