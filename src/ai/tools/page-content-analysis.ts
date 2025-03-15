/**
 * 페이지 내용 분석 툴 구현
 */

import { ToolCallResult } from '../types';

interface PageContentAnalysisParams {
  elements_to_analyze?: ('headings' | 'forms' | 'tables' | 'buttons' | 'links' | 'images' | 'all')[];
  include_text_content?: boolean;
}

interface HeadingElement {
  level: number;
  text: string;
  id?: string;
  selector: string;
}

interface FormElement {
  id?: string;
  name?: string;
  action?: string;
  method?: string;
  fields: FormFieldElement[];
  submitButton?: ButtonElement;
  selector: string;
}

interface FormFieldElement {
  type: string;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required: boolean;
  disabled: boolean;
  options?: { value: string; text: string; selected: boolean }[];
  selector: string;
}

interface TableElement {
  id?: string;
  caption?: string;
  headers: string[];
  rows: string[][];
  selector: string;
}

interface ButtonElement {
  text: string;
  id?: string;
  type?: string;
  disabled: boolean;
  selector: string;
}

interface LinkElement {
  text: string;
  url: string;
  id?: string;
  isExternal: boolean;
  selector: string;
}

interface ImageElement {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  id?: string;
  selector: string;
}

interface PageContentAnalysisResult {
  headings?: HeadingElement[];
  forms?: FormElement[];
  tables?: TableElement[];
  buttons?: ButtonElement[];
  links?: LinkElement[];
  images?: ImageElement[];
  main_content?: string;
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
 * 페이지의 제목 요소들을 추출하는 함수
 */
function extractHeadings(): HeadingElement[] {
  const headings: HeadingElement[] = [];
  
  try {
    // h1부터 h6까지의 모든 제목 요소 선택
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headingElements.forEach(element => {
      const level = parseInt(element.tagName.substring(1), 10);
      
      const heading: HeadingElement = {
        level,
        text: element.textContent?.trim() || '',
        id: element.id || undefined,
        selector: getCssSelector(element)
      };
      
      headings.push(heading);
    });
  } catch (error) {
    console.error('제목 요소 추출 중 오류 발생:', error);
  }
  
  return headings;
}

/**
 * 페이지의 폼 요소들을 추출하는 함수
 */
function extractForms(): FormElement[] {
  const forms: FormElement[] = [];
  
  try {
    const formElements = document.querySelectorAll('form');
    
    formElements.forEach(formElement => {
      const fields: FormFieldElement[] = [];
      
      // 폼 필드 추출
      const inputElements = formElement.querySelectorAll('input, select, textarea');
      inputElements.forEach(inputElement => {
        const input = inputElement as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        
        // 라벨 찾기
        let label = '';
        const labelElement = document.querySelector(`label[for="${input.id}"]`);
        if (labelElement) {
          label = labelElement.textContent?.trim() || '';
        }
        
        const field: FormFieldElement = {
          type: input.tagName.toLowerCase() === 'input' 
            ? (input as HTMLInputElement).type || 'text'
            : input.tagName.toLowerCase(),
          name: input.name || undefined,
          id: input.id || undefined,
          label: label || undefined,
          placeholder: 'placeholder' in input ? input.placeholder : undefined,
          value: 'value' in input ? input.value : undefined,
          required: input.required,
          disabled: input.disabled,
          selector: getCssSelector(input)
        };
        
        // select 요소의 옵션 추출
        if (input.tagName.toLowerCase() === 'select') {
          const selectElement = input as HTMLSelectElement;
          field.options = Array.from(selectElement.options).map(option => ({
            value: option.value,
            text: option.text,
            selected: option.selected
          }));
        }
        
        fields.push(field);
      });
      
      // 제출 버튼 찾기
      let submitButton: ButtonElement | undefined;
      const submitButtonElement = formElement.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButtonElement) {
        submitButton = {
          text: submitButtonElement.textContent?.trim() || 
                (submitButtonElement.tagName.toLowerCase() === 'input' 
                  ? (submitButtonElement as HTMLInputElement).value 
                  : ''),
          id: submitButtonElement.id || undefined,
          type: 'submit',
          disabled: (submitButtonElement as HTMLButtonElement | HTMLInputElement).disabled,
          selector: getCssSelector(submitButtonElement)
        };
      }
      
      const form: FormElement = {
        id: formElement.id || undefined,
        name: formElement.getAttribute('name') || undefined,
        action: formElement.action || undefined,
        method: formElement.method || undefined,
        fields,
        submitButton,
        selector: getCssSelector(formElement)
      };
      
      forms.push(form);
    });
  } catch (error) {
    console.error('폼 요소 추출 중 오류 발생:', error);
  }
  
  return forms;
}

/**
 * 페이지의 테이블 요소들을 추출하는 함수
 */
function extractTables(): TableElement[] {
  const tables: TableElement[] = [];
  
  try {
    const tableElements = document.querySelectorAll('table');
    
    tableElements.forEach(tableElement => {
      // 캡션 추출
      const captionElement = tableElement.querySelector('caption');
      const caption = captionElement ? captionElement.textContent?.trim() : undefined;
      
      // 헤더 추출
      const headers: string[] = [];
      const headerElements = tableElement.querySelectorAll('th');
      headerElements.forEach(headerElement => {
        headers.push(headerElement.textContent?.trim() || '');
      });
      
      // 행 추출
      const rows: string[][] = [];
      const rowElements = tableElement.querySelectorAll('tr');
      rowElements.forEach(rowElement => {
        const cellElements = rowElement.querySelectorAll('td');
        if (cellElements.length > 0) {
          const row: string[] = [];
          cellElements.forEach(cellElement => {
            row.push(cellElement.textContent?.trim() || '');
          });
          rows.push(row);
        }
      });
      
      const table: TableElement = {
        id: tableElement.id || undefined,
        caption,
        headers,
        rows,
        selector: getCssSelector(tableElement)
      };
      
      tables.push(table);
    });
  } catch (error) {
    console.error('테이블 요소 추출 중 오류 발생:', error);
  }
  
  return tables;
}

/**
 * 페이지의 버튼 요소들을 추출하는 함수
 */
function extractButtons(): ButtonElement[] {
  const buttons: ButtonElement[] = [];
  
  try {
    // 버튼 요소와 버튼 역할을 하는 요소들 선택
    const buttonElements = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]');
    
    buttonElements.forEach(element => {
      const isInput = element.tagName.toLowerCase() === 'input';
      
      const button: ButtonElement = {
        text: isInput 
          ? (element as HTMLInputElement).value 
          : element.textContent?.trim() || '',
        id: element.id || undefined,
        type: isInput 
          ? (element as HTMLInputElement).type 
          : (element as HTMLButtonElement).type || undefined,
        disabled: (element as HTMLButtonElement | HTMLInputElement).disabled,
        selector: getCssSelector(element)
      };
      
      buttons.push(button);
    });
  } catch (error) {
    console.error('버튼 요소 추출 중 오류 발생:', error);
  }
  
  return buttons;
}

/**
 * 페이지의 링크 요소들을 추출하는 함수
 */
function extractLinks(): LinkElement[] {
  const links: LinkElement[] = [];
  
  try {
    const linkElements = document.querySelectorAll('a[href]');
    
    linkElements.forEach(element => {
      const linkElement = element as HTMLAnchorElement;
      const url = linkElement.href;
      
      // 외부 링크 여부 확인
      const isExternal = url.startsWith('http') && !url.includes(window.location.hostname);
      
      const link: LinkElement = {
        text: linkElement.textContent?.trim() || '',
        url,
        id: linkElement.id || undefined,
        isExternal,
        selector: getCssSelector(linkElement)
      };
      
      links.push(link);
    });
  } catch (error) {
    console.error('링크 요소 추출 중 오류 발생:', error);
  }
  
  return links;
}

/**
 * 페이지의 이미지 요소들을 추출하는 함수
 */
function extractImages(): ImageElement[] {
  const images: ImageElement[] = [];
  
  try {
    const imageElements = document.querySelectorAll('img');
    
    imageElements.forEach(element => {
      const imageElement = element as HTMLImageElement;
      
      const image: ImageElement = {
        src: imageElement.src,
        alt: imageElement.alt || undefined,
        title: imageElement.title || undefined,
        width: imageElement.width || undefined,
        height: imageElement.height || undefined,
        id: imageElement.id || undefined,
        selector: getCssSelector(imageElement)
      };
      
      images.push(image);
    });
  } catch (error) {
    console.error('이미지 요소 추출 중 오류 발생:', error);
  }
  
  return images;
}

/**
 * 페이지의 주요 내용 텍스트를 추출하는 함수
 */
function extractMainContent(): string {
  try {
    // 주요 내용 영역 후보들
    const mainContentSelectors = [
      'main',
      'article',
      '#content',
      '.content',
      '.main-content',
      '[role="main"]'
    ];
    
    // 후보 중 첫 번째로 발견된 요소 사용
    for (const selector of mainContentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.textContent?.trim() || '';
      }
    }
    
    // 후보가 없으면 body 내용에서 헤더, 푸터, 사이드바 등을 제외한 내용 추출
    const body = document.body;
    const excludeSelectors = [
      'header',
      'footer',
      'nav',
      'aside',
      '.sidebar',
      '.navigation',
      '.menu',
      '.ads',
      '.advertisement'
    ];
    
    let bodyContent = body.textContent || '';
    
    // 제외할 요소들의 내용 제거
    excludeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const content = element.textContent || '';
        bodyContent = bodyContent.replace(content, '');
      });
    });
    
    return bodyContent.trim();
  } catch (error) {
    console.error('주요 내용 추출 중 오류 발생:', error);
    return '';
  }
}

/**
 * 페이지 내용 분석 툴 실행 함수
 */
export async function executePageContentAnalysis(params: PageContentAnalysisParams): Promise<ToolCallResult> {
  try {
    const { 
      elements_to_analyze = ['all'],
      include_text_content = true
    } = params;
    
    const result: PageContentAnalysisResult = {};
    const analyzeAll = elements_to_analyze.includes('all');
    
    // 요청된 요소 유형에 따라 분석 수행
    if (analyzeAll || elements_to_analyze.includes('headings')) {
      result.headings = extractHeadings();
    }
    
    if (analyzeAll || elements_to_analyze.includes('forms')) {
      result.forms = extractForms();
    }
    
    if (analyzeAll || elements_to_analyze.includes('tables')) {
      result.tables = extractTables();
    }
    
    if (analyzeAll || elements_to_analyze.includes('buttons')) {
      result.buttons = extractButtons();
    }
    
    if (analyzeAll || elements_to_analyze.includes('links')) {
      result.links = extractLinks();
    }
    
    if (analyzeAll || elements_to_analyze.includes('images')) {
      result.images = extractImages();
    }
    
    // 텍스트 내용 포함 여부에 따라 주요 내용 추출
    if (include_text_content) {
      result.main_content = extractMainContent();
    }
    
    return {
      status: 'success',
      data: result
    };
  } catch (error) {
    console.error('페이지 내용 분석 중 오류 발생:', error);
    return {
      status: 'error',
      error: {
        code: 'PAGE_ANALYSIS_ERROR',
        message: `페이지 내용 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
} 