/**
 * 메뉴 검색 툴 구현
 */

import { WebAssistantTool } from './tools';
import { ToolCallResult } from '../types';

interface MenuSearchParams {
  query: string;
  max_results?: number;
  include_hidden?: boolean;
}

interface MenuItem {
  id: string;
  text: string;
  path: string;
  url?: string;
  parent?: string;
  level: number;
  isActive: boolean;
  isHidden: boolean;
  selector: string;
}

/**
 * DOM에서 메뉴 항목을 추출하는 함수
 */
function extractMenuItems(includeHidden: boolean = false): MenuItem[] {
  const menuItems: MenuItem[] = [];
  
  // 일반적인 메뉴 선택자들
  const menuSelectors = [
    'nav a', 
    '.menu a', 
    '.navigation a', 
    '.sidebar a', 
    '.nav-item a',
    'aside a',
    '.side-menu a',
    '.main-menu a',
    'ul.menu li a',
    '.dropdown-menu a'
  ];
  
  try {
    // 모든 가능한 메뉴 요소 선택
    const menuElements = document.querySelectorAll(menuSelectors.join(', '));
    
    menuElements.forEach((element, index) => {
      const linkElement = element as HTMLAnchorElement;
      const rect = linkElement.getBoundingClientRect();
      const isHidden = rect.width === 0 || 
                       rect.height === 0 || 
                       window.getComputedStyle(linkElement).display === 'none' ||
                       window.getComputedStyle(linkElement).visibility === 'hidden';
      
      // 숨겨진 항목은 설정에 따라 포함 여부 결정
      if (isHidden && !includeHidden) {
        return;
      }
      
      // 부모 요소 찾기
      let parentElement = linkElement.parentElement;
      let level = 0;
      let parentId = '';
      
      while (parentElement) {
        if (parentElement.tagName === 'LI' || 
            parentElement.tagName === 'NAV' || 
            parentElement.classList.contains('menu-item')) {
          level++;
          if (parentElement.id) {
            parentId = parentElement.id;
            break;
          }
        }
        parentElement = parentElement.parentElement;
      }
      
      // 메뉴 항목 정보 추출
      const menuItem: MenuItem = {
        id: linkElement.id || `menu-item-${index}`,
        text: linkElement.textContent?.trim() || '',
        path: linkElement.pathname || '',
        url: linkElement.href || '',
        parent: parentId || undefined,
        level,
        isActive: linkElement.classList.contains('active') || 
                 linkElement.getAttribute('aria-current') === 'page',
        isHidden,
        selector: getCssSelector(linkElement)
      };
      
      menuItems.push(menuItem);
    });
  } catch (error) {
    console.error('메뉴 항목 추출 중 오류 발생:', error);
  }
  
  return menuItems;
}

/**
 * 요소의 CSS 선택자를 생성하는 함수
 */
function getCssSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`;
  }
  
  let selector = element.tagName.toLowerCase();
  
  if (element.classList.length > 0) {
    selector += `.${Array.from(element.classList).join('.')}`;
  }
  
  return selector;
}

/**
 * 메뉴 항목을 검색하는 함수
 */
function searchMenuItems(items: MenuItem[], query: string, maxResults: number = 5): MenuItem[] {
  if (!query) {
    return items.slice(0, maxResults);
  }
  
  const lowerQuery = query.toLowerCase();
  
  // 검색어와 관련성에 따라 점수 부여
  const scoredItems = items.map(item => {
    const textMatch = item.text.toLowerCase().includes(lowerQuery);
    const pathMatch = item.path.toLowerCase().includes(lowerQuery);
    const exactTextMatch = item.text.toLowerCase() === lowerQuery;
    
    let score = 0;
    if (exactTextMatch) score += 100;
    if (textMatch) score += 50;
    if (pathMatch) score += 30;
    if (item.isActive) score += 10;
    
    return { item, score };
  });
  
  // 점수에 따라 정렬하고 상위 결과 반환
  return scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, maxResults);
}

/**
 * 메뉴 검색 툴 실행 함수
 */
export async function executeMenuSearch(params: MenuSearchParams): Promise<ToolCallResult> {
  try {
    const { query, max_results = 5, include_hidden = false } = params;
    
    // 메뉴 항목 추출
    const allMenuItems = extractMenuItems(include_hidden);
    
    // 검색 수행
    const searchResults = searchMenuItems(allMenuItems, query, max_results);
    
    return {
      status: 'success',
      data: {
        results: searchResults,
        total: searchResults.length,
        query
      }
    };
  } catch (error) {
    console.error('메뉴 검색 중 오류 발생:', error);
    return {
      status: 'error',
      error: {
        code: 'MENU_SEARCH_ERROR',
        message: `메뉴 검색 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
} 