/**
 * DOMProcessor
 *
 * Handles DOM traversal, text extraction, and replacement operations.
 * Optimized for performance with DocumentFragment batching.
 */

import { stripHTML, normalizeWhitespace, createFragment, is, logger } from './utils.js';
import { CharWrapperConfig } from './config.js';
import { WrapperFactory, WrapOptions } from './WrapperFactory.js';

/**
 * Result of processing text nodes
 */
export interface ProcessResult {
  words: HTMLElement[];
  chars: HTMLElement[];
}

/**
 * Options for processing operations
 */
export interface ProcessOptions extends WrapOptions {
  // Additional processing-specific options can be added here
}

export class DOMProcessor {
  #config: CharWrapperConfig;
  #cache: WeakMap<Element, string>;

  /**
   * Creates a new DOMProcessor instance
   *
   * @param config - Validated configuration object
   */
  constructor(config: CharWrapperConfig) {
    this.#config = config;
    this.#cache = new WeakMap(); // Prevents memory leaks
  }

  /**
   * Extracts and processes text from a DOM element
   *
   * @param element - DOM element to process
   * @returns Processed text content
   */
  extractText(element: Element): string {
    if (!is.element(element)) {
      throw new TypeError('extractText requires a valid DOM element');
    }

    // Check cache first
    if (this.#config.performance.cacheSelectors && this.#cache.has(element)) {
      return this.#cache.get(element)!;
    }

    let text = element.textContent || '';

    // Strip HTML if configured
    if (this.#config.processing.stripHTML) {
      text = stripHTML(text);
    }

    // Normalize whitespace if configured
    if (this.#config.processing.trimWhitespace) {
      text = normalizeWhitespace(text, true);
    }

    // Cache result
    if (this.#config.performance.cacheSelectors) {
      this.#cache.set(element, text);
    }

    return text;
  }

  /**
   * Finds all text nodes within an element (recursive)
   *
   * @param element - Root element to search
   * @param textNodes - Accumulator for text nodes
   * @returns Array of text nodes
   */
  findTextNodes(element: Element | Node, textNodes: Node[] = []): Node[] {
    if (!element || !('childNodes' in element)) {
      return textNodes;
    }

    for (const node of Array.from(element.childNodes)) {
      if (is.textNode(node)) {
        // Only include non-empty text nodes
        const text = normalizeWhitespace(node.textContent, true);
        if (text.length > 0) {
          textNodes.push(node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip excluded elements
        const isExcluded = (node as HTMLElement).dataset?.subSetName === '_exclude_';
        if (!isExcluded) {
          this.findTextNodes(node, textNodes);
        }
      }
    }

    return textNodes;
  }

  /**
   * Replaces element content with wrapped elements
   * Uses DocumentFragment for optimal performance
   *
   * @param element - Element to replace content in
   * @param wrappedElements - Array of wrapped elements
   */
  replaceContent(element: Element, wrappedElements: HTMLElement[]): void {
    if (!is.element(element)) {
      throw new TypeError('replaceContent requires a valid DOM element');
    }

    if (!is.array(wrappedElements)) {
      throw new TypeError('wrappedElements must be an array');
    }

    // Clear existing content (single operation, not three!)
    element.textContent = '';

    // Use DocumentFragment for batching if enabled
    if (this.#config.performance.useBatching) {
      const fragment = createFragment(wrappedElements);
      element.appendChild(fragment);
    } else {
      // Direct append (useful for debugging or specific use cases)
      wrappedElements.forEach(el => element.appendChild(el));
    }
  }

  /**
   * Processes a single text node and replaces it with wrapped content
   *
   * @param textNode - Text node to process
   * @param wrapperFactory - Factory for creating wrapped elements
   * @param options - Processing options
   * @returns Object containing wrapped elements and metadata
   */
  processTextNode(textNode: Node, wrapperFactory: WrapperFactory, options: ProcessOptions = {}): ProcessResult | null {
    if (!is.textNode(textNode)) {
      logger.warn('processTextNode called with non-text node', textNode);
      return null;
    }

    // Extract and normalize text
    const text = normalizeWhitespace(textNode.textContent, this.#config.processing.trimWhitespace);

    if (!text) {
      return null;
    }

    // Determine wrapping mode
    const wrapWords = this.#config.wrap.words;
    const wrapChars = this.#config.wrap.chars;

    let result: ProcessResult = { words: [], chars: [] };

    if (wrapWords) {
      // Wrap as words (with nested characters if chars is also enabled)
      if (wrapChars) {
        result = wrapperFactory.wrapWords(text, options);
      } else {
        // Just words, no character wrapping
        const words = text.split(' ');
        result.words = words.map((word, index) => {
          const wordEl = document.createElement(this.#config.tags.word);
          wordEl.className = this.#config.classes.word;
          wordEl.textContent = word;

          // Add space after each word except the last
          if (index < words.length - 1) {
            const spaceEl = wrapperFactory.createSpaceElement();
            return [wordEl, spaceEl];
          }
          return wordEl;
        }).flat();
      }
    } else if (wrapChars) {
      // Wrap as characters only
      result.chars = wrapperFactory.wrapChars(text, options);
    } else {
      logger.warn('No wrapping mode enabled (neither chars nor words)');
      return null;
    }

    return result;
  }

  /**
   * Processes an entire element and all its text nodes
   *
   * @param element - Root element to process
   * @param wrapperFactory - Factory for creating wrapped elements
   * @param options - Processing options
   * @returns Object containing all wrapped elements
   */
  processElement(element: Element, wrapperFactory: WrapperFactory, options: ProcessOptions = {}): ProcessResult {
    const textNodes = this.findTextNodes(element);

    if (textNodes.length === 0) {
      logger.warn('No text nodes found in element', element);
      return { words: [], chars: [] };
    }

    const allWords: HTMLElement[] = [];
    const allChars: HTMLElement[] = [];

    // Process each text node
    textNodes.forEach(textNode => {
      const result = this.processTextNode(textNode, wrapperFactory, {
        ...options,
        subSetClass: (textNode.parentElement as HTMLElement)?.dataset?.[this.#config.dataAttributes.subSetClass],
      });

      if (result) {
        if (result.words.length > 0) {
          allWords.push(...result.words);
        }
        if (result.chars.length > 0) {
          allChars.push(...result.chars);
        }

        // Replace the text node with wrapped content
        const parent = textNode.parentElement;
        if (parent) {
          // Determine which elements to insert
          const elementsToInsert = result.words.length > 0 ? result.words : result.chars;

          if (this.#config.performance.useBatching) {
            const fragment = createFragment(elementsToInsert);
            parent.replaceChild(fragment, textNode);
          } else {
            // Insert each element before the text node
            elementsToInsert.forEach(el => {
              parent.insertBefore(el, textNode);
            });
            // Remove the original text node
            parent.removeChild(textNode);
          }
        }
      }
    });

    return {
      words: allWords,
      chars: allChars,
    };
  }

  /**
   * Clears the internal cache
   */
  clearCache(): void {
    // WeakMap doesn't have a clear method, but entries are automatically
    // garbage collected when elements are removed from DOM
    this.#cache = new WeakMap();
  }
}
