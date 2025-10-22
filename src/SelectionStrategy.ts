/**
 * SelectionStrategy
 *
 * Handles element selection strategies:
 * 1. CSS Selector (class/id) - Direct selection
 * 2. Data Attributes - Data-driven selection with ordering
 */

import { querySelectorSafe, sortByDataAttribute, is, logger } from './utils.js';
import { CharWrapperConfig } from './config.js';

/**
 * Options for selection strategies
 */
export interface SelectionOptions {
  ordered?: boolean;
}

/**
 * Base class for selection strategies
 */
class SelectionStrategy {
  /**
   * Selects elements based on strategy
   *
   * @param _target - Target selector or element (unused in base class)
   * @param _options - Selection options (unused in base class)
   * @returns Selected element(s)
   */
  select(_target: string | Element, _options?: SelectionOptions): Element | Element[] {
    throw new Error('select() must be implemented by subclass');
  }
}

/**
 * CSS Selector Strategy
 * Selects a single element by CSS selector
 */
export class CSSStrategy extends SelectionStrategy {
  select(target: string | Element): Element {
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
  #config: CharWrapperConfig;

  constructor(config: CharWrapperConfig) {
    super();
    this.#config = config;
  }

  /**
   * Selects elements based on data attributes
   *
   * @param rootElement - Root element or selector
   * @param options - Selection options
   * @returns Array of selected elements
   */
  select(rootElement: string | Element, options: SelectionOptions = {}): Element[] {
    // Use the ordered option from config if not explicitly passed in options
    const { ordered = this.#config.processing.ordered } = options;

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
      const name = (el as HTMLElement).dataset[dataAttrName];
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
   * @param str - CamelCase string
   * @returns kebab-case string
   */
  #camelToKebab(str: string): string {
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
   * @param target - Target element or selector
   * @param config - Configuration object
   * @returns Appropriate selection strategy
   */
  static create(target: string | Element, config: CharWrapperConfig): SelectionStrategy {
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
  #config: CharWrapperConfig;
  #strategy?: SelectionStrategy;

  /**
   * Creates a new Selector instance
   *
   * @param config - Configuration object
   */
  constructor(config: CharWrapperConfig) {
    this.#config = config;
  }

  /**
   * Selects element(s) based on target and options
   *
   * @param target - Target element or selector
   * @param options - Selection options
   * @returns Selected element(s)
   */
  select(target: string | Element, options: SelectionOptions = {}): Element | Element[] {
    this.#strategy = SelectionStrategyFactory.create(target, this.#config);
    return this.#strategy.select(target, options);
  }

  /**
   * Checks if a selector is valid
   *
   * @param target - Target to validate
   * @returns Whether the selector is valid
   */
  isValid(target: string | Element): boolean {
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
