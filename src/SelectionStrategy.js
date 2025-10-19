/**
 * SelectionStrategy
 *
 * Handles element selection strategies:
 * 1. CSS Selector (class/id) - Direct selection
 * 2. Data Attributes - Data-driven selection with ordering
 */

import { querySelectorSafe, sortByDataAttribute, is, logger } from './utils.js';

/**
 * Base class for selection strategies
 */
class SelectionStrategy {
  /**
   * Selects elements based on strategy
   *
   * @param {string|Element} _target - Target selector or element (unused in base class)
   * @returns {Element|Array<Element>} Selected element(s)
   */
  select(_target) {
    throw new Error('select() must be implemented by subclass');
  }
}

/**
 * CSS Selector Strategy
 * Selects a single element by CSS selector
 */
export class CSSStrategy extends SelectionStrategy {
  select(target) {
    if (is.element(target)) {
      return target;
    }

    if (is.string(target)) {
      return querySelectorSafe(target);
    }

    throw new TypeError('Target must be a CSS selector string or DOM element');
  }
}

/**
 * Data Attribute Strategy
 * Selects multiple elements by data attributes with optional ordering
 */
export class DataAttributeStrategy extends SelectionStrategy {
  #config;

  constructor(config) {
    super();
    this.#config = config;
  }

  /**
   * Selects elements based on data attributes
   *
   * @param {string|Element} rootElement - Root element or selector
   * @param {Object} options - Selection options
   * @param {boolean} options.ordered - Whether to sort by data-custom-order
   * @returns {Array<Element>} Array of selected elements
   */
  select(rootElement, options = {}) {
    const { ordered = false } = options;

    // Get root element
    const root = is.element(rootElement)
      ? rootElement
      : querySelectorSafe(rootElement);

    // Find elements with data attributes
    const dataAttrName = this.#config.dataAttributes.subSetName;
    const selector = `[data-${this.#camelToKebab(dataAttrName)}]`;

    const elements = Array.from(root.querySelectorAll(selector));

    if (elements.length === 0) {
      logger.warn(`No elements found with attribute: ${selector}`);
      return [];
    }

    // Filter out excluded elements
    const filtered = elements.filter(el => {
      const name = el.dataset[dataAttrName];
      return name !== '_exclude_';
    });

    // Sort by custom order if requested
    if (ordered) {
      const orderAttr = this.#config.dataAttributes.customOrder;
      return sortByDataAttribute(filtered, orderAttr, 'asc');
    }

    return filtered;
  }

  /**
   * Converts camelCase to kebab-case for data attributes
   *
   * @param {string} str - CamelCase string
   * @returns {string} kebab-case string
   */
  #camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}

/**
 * Factory for creating selection strategies
 */
export class SelectionStrategyFactory {
  /**
   * Creates appropriate selection strategy based on input
   *
   * @param {string|Element} target - Target element or selector
   * @param {Object} config - Configuration object
   * @returns {SelectionStrategy} Appropriate selection strategy
   */
  static create(target, config) {
    // If target is an element, use CSS strategy
    if (is.element(target)) {
      return new CSSStrategy();
    }

    // If target is a string starting with '.', '#', or '[', use CSS strategy
    if (is.string(target) && /^[.#[]/.test(target)) {
      return new CSSStrategy();
    }

    // Otherwise, assume data attribute strategy
    logger.info('Using data attribute strategy');
    return new DataAttributeStrategy(config);
  }
}

/**
 * Selector Utility
 * Provides a simple interface for selecting elements
 */
export class Selector {
  #config;
  #strategy;

  /**
   * Creates a new Selector instance
   *
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Selects element(s) based on target and options
   *
   * @param {string|Element} target - Target element or selector
   * @param {Object} options - Selection options
   * @returns {Element|Array<Element>} Selected element(s)
   */
  select(target, options = {}) {
    this.#strategy = SelectionStrategyFactory.create(target, this.#config);
    return this.#strategy.select(target, options);
  }

  /**
   * Checks if a selector is valid
   *
   * @param {string|Element} target - Target to validate
   * @returns {boolean} Whether the selector is valid
   */
  isValid(target) {
    if (is.element(target)) {
      return true;
    }

    if (is.string(target) && target.trim() !== '') {
      try {
        // Try to query the selector
        document.querySelector(target);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }
}
