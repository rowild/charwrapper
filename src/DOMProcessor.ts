/**
 * DOMProcessor
 *
 * Handles DOM traversal, text extraction, data-attribute metadata, and
 * replacement operations. Processing is record-based so returned arrays can be
 * ordered independently from DOM layout.
 */

import {
  stripHTML,
  normalizeWhitespace,
  createFragment,
  is,
  logger,
  closestWithDataset,
  getDatasetValue,
} from './utils.js';
import { CharWrapperConfig, RootSet, TextSet } from './config.js';
import { WrapperFactory, WrapOptions } from './WrapperFactory.js';

/**
 * Result of processing text nodes
 */
export interface ProcessResult {
  words: HTMLElement[];
  chars: HTMLElement[];
  rootSet: RootSet;
  rootText: string;
  attributeSetTexts: Record<string, string>;
}

/**
 * Options for processing operations
 */
export interface ProcessOptions extends WrapOptions {
  rootSetName?: string | null;
}

interface TextNodeRecord {
  textNode: ChildNode;
  parentElement: HTMLElement;
  setElement: HTMLElement | null;
  setName?: string;
  setOrder?: number;
  setCharClass?: string;
  setWordClass?: string;
  domIndex: number;
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
    this.#cache = new WeakMap();
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

    if (this.#config.performance.cacheSelectors && this.#cache.has(element)) {
      return this.#cache.get(element)!;
    }

    let text = element.textContent || '';

    if (this.#config.processing.stripHTML) {
      text = stripHTML(text);
    }

    if (this.#config.processing.trimWhitespace) {
      text = normalizeWhitespace(text, true);
    }

    if (this.#config.performance.cacheSelectors) {
      this.#cache.set(element, text);
    }

    return text;
  }

  /**
   * Finds all text nodes within an element (recursive), respecting configured
   * `_exclude_` attribute-set markers.
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
        const text = normalizeWhitespace(node.textContent, true);
        if (text.length > 0) {
          textNodes.push(node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const setName = getDatasetValue(node as HTMLElement, this.#config.dataAttributes.setName);
        if (setName !== '_exclude_') {
          this.findTextNodes(node, textNodes);
        }
      }
    }

    return textNodes;
  }

  /**
   * Replaces element content with wrapped elements.
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

    element.textContent = '';

    if (this.#config.performance.useBatching) {
      const fragment = createFragment(wrappedElements);
      element.appendChild(fragment);
    } else {
      wrappedElements.forEach(el => element.appendChild(el));
    }
  }

  /**
   * Processes a single text node and replaces it with wrapped content.
   *
   * @param textNode - Text node to process
   * @param wrapperFactory - Factory for creating wrapped elements
   * @param options - Processing options
   * @returns Object containing wrapped elements and metadata
   */
  processTextNode(textNode: Node, wrapperFactory: WrapperFactory, options: ProcessOptions = {}): Pick<ProcessResult, 'words' | 'chars'> | null {
    if (!is.textNode(textNode)) {
      logger.warn('processTextNode called with non-text node', textNode);
      return null;
    }

    const parentElement = textNode.parentElement;
    let shouldPreserveAdjacentWhitespace = false;

    if (parentElement) {
      const siblings = Array.from(parentElement.childNodes);
      const textNodeIndex = siblings.indexOf(textNode);

      if (textNodeIndex !== -1) {
        const prevSibling = siblings[textNodeIndex - 1];
        const nextSibling = siblings[textNodeIndex + 1];

        if ((prevSibling && prevSibling.nodeType === Node.ELEMENT_NODE) ||
            (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE)) {
          shouldPreserveAdjacentWhitespace = true;
        }
      }
    }

    const shouldTrim = this.#config.processing.trimWhitespace && !shouldPreserveAdjacentWhitespace;
    const text = normalizeWhitespace(textNode.textContent, shouldTrim);

    if (!text) {
      return null;
    }

    const wrapWords = this.#config.wrap.words;
    const wrapChars = this.#config.wrap.chars;

    let result: Pick<ProcessResult, 'words' | 'chars'> = { words: [], chars: [] };

    if (wrapWords) {
      if (wrapChars) {
        result = wrapperFactory.wrapWords(text, options);
      } else {
        const words = text.split(' ');
        result.words = words.map((word, index) => {
          const wordEl = wrapperFactory.createWordElement(word, [], options);
          wordEl.textContent = word;

          if (index < words.length - 1) {
            const spaceEl = wrapperFactory.createSpaceElement();
            return [wordEl, spaceEl];
          }

          return wordEl;
        }).flat();
      }
    } else if (wrapChars) {
      result.chars = wrapperFactory.wrapChars(text, options);
    } else {
      logger.warn('No wrapping mode enabled (neither chars nor words)');
      return null;
    }

    return result;
  }

  /**
   * Processes an entire element and all its text nodes.
   *
   * @param element - Root element to process
   * @param wrapperFactory - Factory for creating wrapped elements
   * @param options - Processing options
   * @returns Object containing all wrapped elements and root-set state
   */
  processElement(element: Element, wrapperFactory: WrapperFactory, options: ProcessOptions = {}): ProcessResult {
    const records = this.#collectTextNodeRecords(element);
    const rootSetName = options.rootSetName || getDatasetValue(element, this.#config.dataAttributes.rootSet) || '';

    const rootSet: RootSet = {
      name: rootSetName,
      element,
      chars: [],
      words: [],
      groups: {},
      attributeSets: {},
      customSets: {},
    };

    if (records.length === 0) {
      logger.warn('No text nodes found in element', element);
      return {
        words: [],
        chars: [],
        rootSet,
        rootText: '',
        attributeSetTexts: {},
      };
    }

    const orderedRecords = this.#orderRecords(records);
    const attributeSetTexts: Record<string, string> = {};
    const rootTextParts: string[] = [];

    orderedRecords.forEach(record => {
      const processOptions: ProcessOptions = {
        ...options,
        rootSetName,
        setName: record.setName,
        setCharClass: record.setCharClass,
        setWordClass: record.setWordClass,
      };

      const result = this.processTextNode(record.textNode, wrapperFactory, processOptions);

      if (!result) {
        return;
      }

      const text = this.#getNormalizedText(record.textNode);
      if (text) {
        rootTextParts.push(text);
        if (record.setName) {
          attributeSetTexts[record.setName] = `${attributeSetTexts[record.setName] || ''}${text}`;
        }
      }

      if (result.words.length > 0) {
        rootSet.words.push(...result.words);
      }
      if (result.chars.length > 0) {
        rootSet.chars.push(...result.chars);
      }

      if (record.setName) {
        const attributeSet = this.#ensureAttributeSet(rootSet, record);
        if (result.words.length > 0) {
          attributeSet.words.push(...result.words);
        }
        if (result.chars.length > 0) {
          attributeSet.chars.push(...result.chars);
        }
      }

      this.#replaceTextNode(record, result);
    });

    return {
      words: rootSet.words,
      chars: rootSet.chars,
      rootSet,
      rootText: rootTextParts.join(''),
      attributeSetTexts,
    };
  }

  #collectTextNodeRecords(root: Element): TextNodeRecord[] {
    const records: TextNodeRecord[] = [];
    let domIndex = 0;

    const walk = (node: Element | Node): void => {
      if (!node || !('childNodes' in node)) {
        return;
      }

      for (const child of Array.from(node.childNodes)) {
        if (is.textNode(child)) {
          const text = normalizeWhitespace(child.textContent, true);
          if (text.length > 0 && child.parentElement) {
            const setElement = closestWithDataset(
              child.parentElement,
              root,
              this.#config.dataAttributes.setName
            );
            const setName = getDatasetValue(setElement, this.#config.dataAttributes.setName);

            if (setName !== '_exclude_') {
              records.push({
                textNode: child,
                parentElement: child.parentElement,
                setElement,
                setName,
                setOrder: this.#parseOrder(getDatasetValue(setElement, this.#config.dataAttributes.setOrder)),
                setCharClass: getDatasetValue(setElement, this.#config.dataAttributes.setCharClass),
                setWordClass: getDatasetValue(setElement, this.#config.dataAttributes.setWordClass),
                domIndex: domIndex++,
              });
            }
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childElement = child as HTMLElement;
          const setName = getDatasetValue(childElement, this.#config.dataAttributes.setName);
          if (setName !== '_exclude_') {
            walk(childElement);
          }
        }
      }
    };

    walk(root);
    return records;
  }

  #orderRecords(records: TextNodeRecord[]): TextNodeRecord[] {
    if (!this.#config.processing.ordered) {
      return records;
    }

    return [...records].sort((a, b) => {
      const aHasOrder = typeof a.setOrder === 'number';
      const bHasOrder = typeof b.setOrder === 'number';

      if (aHasOrder && bHasOrder && a.setOrder !== b.setOrder) {
        return a.setOrder! - b.setOrder!;
      }

      if (aHasOrder !== bHasOrder) {
        return aHasOrder ? -1 : 1;
      }

      return a.domIndex - b.domIndex;
    });
  }

  #ensureAttributeSet(rootSet: RootSet, record: TextNodeRecord): TextSet {
    const name = record.setName!;

    if (!rootSet.attributeSets[name]) {
      rootSet.attributeSets[name] = {
        name,
        element: record.setElement || record.parentElement,
        chars: [],
        words: [],
        groups: {},
      };
    }

    return rootSet.attributeSets[name];
  }

  #replaceTextNode(record: TextNodeRecord, result: Pick<ProcessResult, 'words' | 'chars'>): void {
    const parent = record.textNode.parentElement;
    if (!parent) {
      return;
    }

    const elementsToInsert = result.words.length > 0 ? result.words : result.chars;

    if (this.#config.performance.useBatching) {
      const fragment = createFragment(elementsToInsert);
      parent.replaceChild(fragment, record.textNode);
    } else {
      elementsToInsert.forEach(el => {
        parent.insertBefore(el, record.textNode);
      });
      parent.removeChild(record.textNode);
    }
  }

  #getNormalizedText(textNode: ChildNode): string {
    const parentElement = textNode.parentElement;
    let shouldPreserveAdjacentWhitespace = false;

    if (parentElement) {
      const siblings = Array.from(parentElement.childNodes);
      const textNodeIndex = siblings.indexOf(textNode);
      const prevSibling = siblings[textNodeIndex - 1];
      const nextSibling = siblings[textNodeIndex + 1];
      shouldPreserveAdjacentWhitespace = Boolean(
        (prevSibling && prevSibling.nodeType === Node.ELEMENT_NODE) ||
        (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE)
      );
    }

    const shouldTrim = this.#config.processing.trimWhitespace && !shouldPreserveAdjacentWhitespace;
    return normalizeWhitespace(textNode.textContent, shouldTrim);
  }

  #parseOrder(value: string | undefined): number | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  /**
   * Clears the internal cache
   */
  clearCache(): void {
    this.#cache = new WeakMap();
  }
}
