/**
 * Utility Functions for CharWrapper
 *
 * Pure helper functions with no side effects.
 */

/**
 * Pads a number with leading zeros to ensure 3 digits
 *
 * @param {number} num - Number to pad
 * @returns {string} Zero-padded number (e.g., 5 → "005", 42 → "042", 123 → "123")
 *
 * @example
 * padNumber(5)   // "005"
 * padNumber(42)  // "042"
 * padNumber(123) // "123"
 */
export function padNumber(num) {
  return String(num).padStart(3, '0');
}

/**
 * Strips HTML tags from text content
 *
 * @param {string} text - Text potentially containing HTML
 * @returns {string} Text with HTML tags removed
 *
 * @example
 * stripHTML('Hello <strong>world</strong>!') // "Hello world!"
 */
export function stripHTML(text) {
  const temp = document.createElement('div');
  temp.innerHTML = text;
  return temp.textContent || temp.innerText || '';
}

/**
 * Normalizes whitespace (removes line breaks, tabs, extra spaces)
 *
 * @param {string} text - Text to normalize
 * @param {boolean} trim - Whether to trim leading/trailing whitespace
 * @returns {string} Normalized text
 *
 * @example
 * normalizeWhitespace('Hello\n\t  world  ') // "Hello world"
 */
export function normalizeWhitespace(text, trim = true) {
  let normalized = text.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');
  return trim ? normalized.trim() : normalized;
}

/**
 * Checks if a string contains only whitespace
 *
 * @param {string} str - String to check
 * @returns {boolean}
 */
export function isWhitespace(str) {
  return /^\s*$/.test(str);
}

/**
 * Generates a unique ID for an element
 *
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'cw') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a DocumentFragment from an array of nodes
 * (Performance optimization for batch DOM updates)
 *
 * @param {Array<Node>} nodes - Array of DOM nodes
 * @returns {DocumentFragment}
 */
export function createFragment(nodes) {
  const fragment = document.createDocumentFragment();
  nodes.forEach(node => fragment.appendChild(node));
  return fragment;
}

/**
 * Safely queries a selector and throws if not found
 *
 * @param {string} selector - CSS selector
 * @param {Element} context - Context to query within (default: document)
 * @returns {Element} Found element
 * @throws {Error} If element not found
 */
export function querySelectorSafe(selector, context = document) {
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
 * @param {Array<Element>} elements - Elements to sort
 * @param {string} dataAttribute - Data attribute name (camelCase)
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array<Element>} Sorted elements
 *
 * @example
 * sortByDataAttribute(elements, 'customOrder', 'asc')
 */
export function sortByDataAttribute(elements, dataAttribute, order = 'asc') {
  return Array.from(elements).sort((a, b) => {
    const aValue = Number(a.dataset[dataAttribute]) || 0;
    const bValue = Number(b.dataset[dataAttribute]) || 0;

    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });
}

/**
 * Builds a class string from multiple parts
 *
 * @param {Array<string|null|undefined|false>} classes - Array of class names
 * @returns {string} Space-separated class string
 *
 * @example
 * buildClassString(['char', null, 'char-001', false, 'special'])
 * // "char char-001 special"
 */
export function buildClassString(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Debounces a function call
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
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
  string: val => typeof val === 'string',
  number: val => typeof val === 'number' && !isNaN(val),
  boolean: val => typeof val === 'boolean',
  function: val => typeof val === 'function',
  object: val => val !== null && typeof val === 'object' && !Array.isArray(val),
  array: val => Array.isArray(val),
  element: val => val instanceof Element,
  textNode: val => val?.nodeType === Node.TEXT_NODE,
};

/**
 * Logger utility (can be extended for different log levels)
 */
export const logger = {
  error: (...args) => console.error('[CharWrapper Error]', ...args),
  warn: (...args) => console.warn('[CharWrapper Warning]', ...args),
  info: (...args) => console.info('[CharWrapper]', ...args),
  debug: (...args) => {
    if (typeof DEBUG !== 'undefined' && DEBUG) {
      console.log('[CharWrapper Debug]', ...args);
    }
  },
};
