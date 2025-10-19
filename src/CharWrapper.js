/**
 * CharWrapper - Modern ES6+ Text Character Wrapper
 *
 * Wraps text characters and words in HTML elements for animation purposes.
 * Designed to work seamlessly with GSAP and other animation libraries.
 *
 * @version 2.0.0
 * @author Robert Wildling
 * @license MIT
 *
 * @example
 * const wrapper = new CharWrapper('.my-text', {
 *   wrap: { chars: true, words: true },
 *   enumerate: { chars: true }
 * });
 *
 * const { chars, words } = wrapper.wrap();
 *
 * // Animate with GSAP
 * gsap.from(chars, { opacity: 0, stagger: 0.05 });
 *
 * // Clean up when done
 * wrapper.destroy();
 */

import { validateConfig } from './config.js';
import { WrapperFactory } from './WrapperFactory.js';
import { DOMProcessor } from './DOMProcessor.js';
import { Selector } from './SelectionStrategy.js';
import { logger, generateId, is } from './utils.js';

export class CharWrapper {
  // Private fields (ES2022+)
  #config;
  #selector;
  #processor;
  #factory;
  #rootElement;
  #originalContent;
  #wrappedElements;
  #isWrapped;
  #instanceId;

  /**
   * Creates a new CharWrapper instance
   *
   * @param {string|Element} target - CSS selector or DOM element to wrap
   * @param {Object} userConfig - Configuration options
   * @throws {Error} If target is invalid or not found
   */
  constructor(target, userConfig = {}) {
    // Validate and merge configuration
    this.#config = validateConfig(userConfig);

    // Generate unique instance ID
    this.#instanceId = generateId('charwrapper');

    // Initialize selector
    this.#selector = new Selector(this.#config);

    // Validate target
    if (!this.#selector.isValid(target)) {
      throw new Error(`Invalid target: ${target}`);
    }

    // Select root element
    this.#rootElement = this.#selector.select(target);

    // Store original content for potential restoration
    this.#originalContent = this.#rootElement.innerHTML;

    // Initialize processor and factory
    this.#processor = new DOMProcessor(this.#config);
    this.#factory = new WrapperFactory(this.#config);

    // Initialize state
    this.#wrappedElements = {
      chars: [],
      words: [],
    };
    this.#isWrapped = false;

    logger.info(`CharWrapper instance created: ${this.#instanceId}`, {
      target,
      config: this.#config,
    });
  }

  /**
   * Wraps the text content
   *
   * @param {Object} options - Additional wrapping options
   * @returns {Object} Object containing wrapped elements { chars, words }
   */
  wrap(options = {}) {
    if (this.#isWrapped) {
      logger.warn('Element already wrapped. Call unwrap() first or use rewrap()');
      return this.#wrappedElements;
    }

    try {
      // Apply accessibility features BEFORE wrapping
      if (this.#config.accessibility.enabled) {
        this.#applyAccessibility();
      }

      // Reset factory counters
      this.#factory.resetCounters();

      // Process the element
      const result = this.#processor.processElement(
        this.#rootElement,
        this.#factory,
        options
      );

      // Store wrapped elements
      this.#wrappedElements = {
        chars: result.chars,
        words: result.words,
      };

      this.#isWrapped = true;

      logger.info(`Text wrapped successfully: ${this.#instanceId}`, {
        charCount: result.chars.length,
        wordCount: result.words.length,
      });

      return this.#wrappedElements;
    } catch (error) {
      logger.error('Failed to wrap text:', error);
      throw error;
    }
  }

  /**
   * Applies accessibility attributes to root element
   * @private
   */
  #applyAccessibility() {
    const { ariaLabel, addTitle } = this.#config.accessibility;

    // Get original text content
    const originalText = this.#rootElement.textContent?.trim() || '';

    // Add aria-label if configured
    if (ariaLabel === 'auto' && originalText) {
      this.#rootElement.setAttribute('aria-label', originalText);
    } else if (ariaLabel && ariaLabel !== 'auto' && ariaLabel !== 'none') {
      this.#rootElement.setAttribute('aria-label', ariaLabel);
    }

    // Add title attribute if not present and configured
    if (addTitle && !this.#rootElement.hasAttribute('title') && originalText) {
      this.#rootElement.setAttribute('title', originalText);
    }
  }

  /**
   * Unwraps the text content (restores original)
   */
  unwrap() {
    if (!this.#isWrapped) {
      logger.warn('Element is not wrapped');
      return;
    }

    try {
      // Restore original content
      this.#rootElement.innerHTML = this.#originalContent;

      // Reset state
      this.#wrappedElements = { chars: [], words: [] };
      this.#isWrapped = false;

      logger.info(`Text unwrapped: ${this.#instanceId}`);
    } catch (error) {
      logger.error('Failed to unwrap text:', error);
      throw error;
    }
  }

  /**
   * Rewraps the text content (unwrap + wrap)
   *
   * @param {Object} options - Additional wrapping options
   * @returns {Object} Object containing wrapped elements { chars, words }
   */
  rewrap(options = {}) {
    this.unwrap();
    return this.wrap(options);
  }

  /**
   * Destroys the wrapper instance and cleans up resources
   */
  destroy() {
    // Unwrap if currently wrapped
    if (this.#isWrapped) {
      this.unwrap();
    }

    // Clear processor cache
    this.#processor.clearCache();

    // Clear references
    this.#wrappedElements = null;
    this.#rootElement = null;
    this.#processor = null;
    this.#factory = null;
    this.#selector = null;

    logger.info(`CharWrapper instance destroyed: ${this.#instanceId}`);
  }

  /**
   * Gets the wrapped character elements
   *
   * @returns {Array<HTMLElement>} Array of wrapped character elements
   */
  getChars() {
    return [...this.#wrappedElements.chars];
  }

  /**
   * Gets the wrapped word elements
   *
   * @returns {Array<HTMLElement>} Array of wrapped word elements
   */
  getWords() {
    return [...this.#wrappedElements.words];
  }

  /**
   * Gets a specific character element by index
   *
   * @param {number} index - Character index
   * @returns {HTMLElement|undefined} Character element
   */
  getChar(index) {
    return this.#wrappedElements.chars[index];
  }

  /**
   * Gets a specific word element by index
   *
   * @param {number} index - Word index
   * @returns {HTMLElement|undefined} Word element
   */
  getWord(index) {
    return this.#wrappedElements.words[index];
  }

  /**
   * Checks if the element is currently wrapped
   *
   * @returns {boolean}
   */
  isWrapped() {
    return this.#isWrapped;
  }

  /**
   * Gets the root element
   *
   * @returns {Element} Root DOM element
   */
  getRootElement() {
    return this.#rootElement;
  }

  /**
   * Gets the current configuration
   *
   * @returns {Object} Current configuration (read-only copy)
   */
  getConfig() {
    return JSON.parse(JSON.stringify(this.#config));
  }

  /**
   * Gets instance metadata
   *
   * @returns {Object} Instance metadata
   */
  getMetadata() {
    return {
      id: this.#instanceId,
      isWrapped: this.#isWrapped,
      charCount: this.#wrappedElements.chars.length,
      wordCount: this.#wrappedElements.words.length,
      rootElement: this.#rootElement?.tagName,
    };
  }

  /**
   * Filters wrapped characters by class name
   *
   * @param {string} className - Class name to filter by
   * @returns {Array<HTMLElement>} Filtered character elements
   */
  filterCharsByClass(className) {
    return this.#wrappedElements.chars.filter(el =>
      el.classList.contains(className)
    );
  }

  /**
   * Gets all characters matching a pattern (e.g., only regular chars, only spaces)
   *
   * @param {string} type - Type to filter ('regular', 'space', 'special')
   * @returns {Array<HTMLElement>} Filtered elements
   */
  getCharsByType(type) {
    const typeMap = {
      regular: this.#config.classes.regular,
      space: this.#config.classes.space,
      special: this.#config.classes.special,
    };

    const className = typeMap[type];
    if (!className) {
      logger.warn(`Unknown type: ${type}. Use 'regular', 'space', or 'special'`);
      return [];
    }

    return this.filterCharsByClass(className);
  }

  /**
   * Static factory method for quick usage
   *
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} config - Configuration options
   * @returns {CharWrapper} New CharWrapper instance
   */
  static create(target, config = {}) {
    const wrapper = new CharWrapper(target, config);
    wrapper.wrap();
    return wrapper;
  }

  /**
   * Static method to wrap multiple elements at once
   *
   * @param {Array<string|Element>} targets - Array of targets
   * @param {Object} config - Configuration options
   * @returns {Array<CharWrapper>} Array of CharWrapper instances
   */
  static wrapMultiple(targets, config = {}) {
    if (!is.array(targets)) {
      throw new TypeError('targets must be an array');
    }

    return targets.map(target => CharWrapper.create(target, config));
  }
}

// Export as default for convenience
export default CharWrapper;
