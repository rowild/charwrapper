/**
 * Utility Functions for CharWrapper
 *
 * Pure helper functions with no side effects.
 */

/**
 * Pads a number with leading zeros to ensure 3 digits
 *
 * @example
 * padNumber(5)   // "005"
 * padNumber(42)  // "042"
 * padNumber(123) // "123"
 */
export function padNumber(num: number): string {
  return String(num).padStart(3, '0');
}

/**
 * Strips HTML tags from text content
 *
 * @example
 * stripHTML('Hello <strong>world</strong>!') // "Hello world!"
 */
export function stripHTML(text: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = text;
  return temp.textContent || temp.innerText || '';
}

/**
 * Normalizes whitespace (removes line breaks, tabs, extra spaces)
 *
 * @example
 * normalizeWhitespace('Hello\n\t  world  ') // "Hello world"
 */
export function normalizeWhitespace(text: string, trim = true): string {
  let normalized = text.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');
  return trim ? normalized.trim() : normalized;
}

/**
 * Checks if a string contains only whitespace
 */
export function isWhitespace(str: string): boolean {
  return /^\s*$/.test(str);
}

/**
 * Generates a unique ID for an element
 */
export function generateId(prefix = 'cw'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a DocumentFragment from an array of nodes
 * (Performance optimization for batch DOM updates)
 */
export function createFragment(nodes: Node[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  nodes.forEach(node => fragment.appendChild(node));
  return fragment;
}

/**
 * Safely queries a selector and throws if not found
 *
 * @throws {Error} If element not found
 */
export function querySelectorSafe(selector: string, context: Document | Element = document): Element {
  const element = context.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}

/**
 * Sorts an array of elements by a data attribute value
 * (Replaces lodash _orderBy for our specific use case)
 *
 * @example
 * sortByDataAttribute(elements, 'customOrder', 'asc')
 */
export function sortByDataAttribute(
  elements: Element[] | NodeListOf<Element>,
  dataAttribute: string,
  order: 'asc' | 'desc' = 'asc'
): Element[] {
  return Array.from(elements).sort((a, b) => {
    const aValue = Number((a as HTMLElement).dataset[dataAttribute]) || 0;
    const bValue = Number((b as HTMLElement).dataset[dataAttribute]) || 0;

    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

/**
 * Builds a class string from multiple parts
 *
 * @example
 * buildClassString('char', null, 'char-001', false, 'special')
 * // "char char-001 special"
 */
export function buildClassString(...classes: (string | null | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 100
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Type checking utilities
 */
export const is = {
  string: (val: any): val is string => typeof val === 'string',
  number: (val: any): val is number => typeof val === 'number' && !isNaN(val),
  boolean: (val: any): val is boolean => typeof val === 'boolean',
  function: (val: any): val is Function => typeof val === 'function',
  object: (val: any): val is object => val !== null && typeof val === 'object' && !Array.isArray(val),
  array: (val: any): val is any[] => Array.isArray(val),
  element: (val: any): val is Element => val instanceof Element,
  textNode: (val: any): val is Text => val?.nodeType === Node.TEXT_NODE,
};

/**
 * Logger interface
 */
export interface Logger {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

/**
 * Logger utility (can be extended for different log levels)
 */
export const logger: Logger = {
  error: (...args: any[]) => console.error('[CharWrapper Error]', ...args),
  warn: (...args: any[]) => console.warn('[CharWrapper Warning]', ...args),
  info: (...args: any[]) => console.info('[CharWrapper]', ...args),
  debug: (...args: any[]) => {
    if (typeof DEBUG !== 'undefined' && DEBUG) {
      console.log('[CharWrapper Debug]', ...args);
    }
  },
};

// Declare global DEBUG variable for TypeScript
declare const DEBUG: boolean | undefined;
