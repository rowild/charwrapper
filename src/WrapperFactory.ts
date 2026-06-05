/**
 * WrapperFactory
 *
 * Responsible for creating wrapped character and word elements.
 * This class handles all the logic for determining which classes to apply
 * and how to structure the wrapped elements.
 */

import { PATTERNS, CharWrapperConfig, EnumerationRule } from './config.js';
import { padNumber, buildClassString } from './utils.js';

/**
 * Options for creating character/word elements
 */
export interface WrapOptions {
  rootSetName?: string | null;
  setName?: string | null;
  setCharClass?: string | null;
  setWordClass?: string | null;
}

/**
 * Result of wrapping text into words
 */
export interface WrapWordsResult {
  words: HTMLElement[];
  chars: HTMLElement[];
}

/**
 * Counter object for enumeration
 */
interface Counters {
  rootSet: number;
  char: number;
  word: number;
  attributeSets: Record<string, number>;
  attributeSetWords: Record<string, number>;
}

export class WrapperFactory {
  #config: CharWrapperConfig;
  #counters: Counters;

  /**
   * Creates a new WrapperFactory instance
   *
   * @param config - Validated configuration object
   */
  constructor(config: CharWrapperConfig) {
    this.#config = config;
    this.#counters = {
      rootSet: 0,
      char: 0,
      word: 0,
      attributeSets: {},
      attributeSetWords: {},
    };
  }

  /**
   * Resets all counters
   */
  resetCounters(): void {
    this.#counters.rootSet = 0;
    this.#counters.char = 0;
    this.#counters.word = 0;
    this.#counters.attributeSets = {};
    this.#counters.attributeSetWords = {};
  }

  /**
   * Creates a wrapped character element
   *
   * @param char - Single character to wrap
   * @param options - Additional options
   * @returns Wrapped character element
   */
  createCharElement(char: string, options: WrapOptions = {}): HTMLElement {
    if (typeof options !== 'object' || options === null) {
      options = {};
    }

    const { setName = null, setCharClass = null } = options;
    const element = document.createElement(this.#config.tags.char);

    // Build class list
    const classes: (string | null | undefined | false)[] = [
      this.#config.classes.char,
      this.#config.classes.rootSet,
    ];

    // Add root-set enumerated class if enabled
    if (this.#config.enumerate.rootSet) {
      const shouldEnumerate = this.#shouldEnumerateCharForRule(char, this.#config.enumerate.rootSet);
      if (shouldEnumerate) {
        classes.push(`${this.#config.classes.rootSet}-${padNumber(this.#counters.rootSet++)}`);
      }
    }

    // Add enumerated class if enabled
    if (this.#config.enumerate.chars) {
      const shouldEnumerate = this.#shouldEnumerateChar(char);
      if (shouldEnumerate) {
        classes.push(`${this.#config.classes.char}-${padNumber(this.#counters.char++)}`);
      }
    }

    // Add attribute-set class if provided
    if (setCharClass) {
      classes.push(setCharClass);
    }

    // Add attribute-set enumerated class if enabled and explicit set class exists
    if (this.#config.enumerate.attributeSets && setName && setCharClass) {
      const shouldEnumerate = this.#shouldEnumerateCharForRule(char, this.#config.enumerate.attributeSets);
      if (shouldEnumerate) {
        const count = this.#counters.attributeSets[setName] ?? 0;
        classes.push(`${setCharClass}-${padNumber(count)}`);
        this.#counters.attributeSets[setName] = count + 1;
      }
    }

    // Add character type classes
    if (this.#config.wrap.spaces && PATTERNS.space.test(char)) {
      classes.push(this.#config.classes.space);
    }

    if (this.#config.wrap.specialChars && PATTERNS.special.test(char)) {
      classes.push(this.#config.classes.special);
    }

    if (PATTERNS.regular.test(char)) {
      classes.push(this.#config.classes.regular);
    }

    // Set classes
    element.className = buildClassString(...classes);

    // Create text node with proper space handling
    const textContent = char === ' ' && this.#config.replaceSpaceWith
      ? this.#config.replaceSpaceWith
      : char;

    element.textContent = textContent;

    // Add accessibility attributes
    if (this.#config.accessibility.enabled && this.#config.accessibility.ariaHidden) {
      element.setAttribute('aria-hidden', 'true');
    }

    return element;
  }

  /**
   * Creates a wrapped word element
   *
   * @param word - Word text
   * @param charElements - Array of wrapped character elements
   * @returns Wrapped word element containing character elements
   */
  createWordElement(word: string, charElements: HTMLElement[] = [], options: WrapOptions = {}): HTMLElement {
    if (typeof options !== 'object' || options === null) {
      options = {};
    }

    const { setName = null, setWordClass = null } = options;
    const element = document.createElement(this.#config.tags.word);

    // Build class list
    const classes: string[] = [this.#config.classes.word];

    // Add enumerated class if enabled
    if (this.#config.enumerate.words) {
      // Don't enumerate space-only words if configured
      const isSpaceWord = word.trim() === '';
      if (!isSpaceWord || this.#config.enumerate.includeSpaces) {
        classes.push(`${this.#config.classes.word}-${padNumber(this.#counters.word++)}`);
      }
    }

    if (setWordClass) {
      classes.push(setWordClass);
    }

    if (this.#config.enumerate.attributeSets && setName && setWordClass) {
      const isSpaceWord = word.trim() === '';
      if (!isSpaceWord || this.#getEnumerationRule(this.#config.enumerate.attributeSets).includeSpaces) {
        const count = this.#counters.attributeSetWords[setName] ?? 0;
        classes.push(`${setWordClass}-${padNumber(count)}`);
        this.#counters.attributeSetWords[setName] = count + 1;
      }
    }

    // Set classes
    element.className = buildClassString(...classes);

    // Append character elements
    charElements.forEach(charEl => element.appendChild(charEl));

    // Add accessibility attributes
    if (this.#config.accessibility.enabled && this.#config.accessibility.ariaHidden) {
      element.setAttribute('aria-hidden', 'true');
    }

    return element;
  }

  /**
   * Creates a space element between words
   *
   * @returns Space element
   */
  createSpaceElement(): HTMLElement {
    const element = document.createElement(this.#config.tags.word);
    element.className = this.#config.classes.space;
    element.textContent = this.#config.replaceSpaceWith;

    // Add accessibility attributes
    if (this.#config.accessibility.enabled && this.#config.accessibility.ariaHidden) {
      element.setAttribute('aria-hidden', 'true');
    }

    return element;
  }

  /**
   * Wraps text into character elements
   *
   * @param text - Text to wrap
   * @param options - Wrapping options
   * @returns Array of wrapped character elements
   */
  wrapChars(text: string, options: WrapOptions = {}): HTMLElement[] {
    if (!text) return [];

    const chars = text.split('');
    return chars.map(char => this.createCharElement(char, options));
  }

  /**
   * Wraps text into word elements (with nested character elements)
   *
   * @param text - Text to wrap
   * @param options - Wrapping options
   * @returns Object containing words and chars arrays
   */
  wrapWords(text: string, options: WrapOptions = {}): WrapWordsResult {
    if (!text) return { words: [], chars: [] };

    const words = text.split(' ');
    const wordElements: HTMLElement[] = [];
    const allCharElements: HTMLElement[] = [];

    words.forEach((word, index) => {
      // Wrap each character in the word
      const charElements = this.wrapChars(word, options);
      allCharElements.push(...charElements);

      // Create word element containing character elements
      const wordElement = this.createWordElement(word, charElements, options);
      wordElements.push(wordElement);

      // Add space between words (except after last word)
      if (index < words.length - 1) {
        const spaceElement = this.createSpaceElement();
        wordElements.push(spaceElement);
      }
    });

    return {
      words: wordElements,
      chars: allCharElements,
    };
  }

  /**
   * Determines if a character should be enumerated based on config
   *
   * @param char - Character to check
   * @returns Whether the character should be enumerated
   */
  #shouldEnumerateChar(char: string): boolean {
    return this.#shouldEnumerateCharForRule(char, {
      includeSpaces: this.#config.enumerate.includeSpaces,
      includeSpecialChars: this.#config.enumerate.includeSpecialChars,
    });
  }

  /**
   * Determines if a character should be enumerated for a specific rule.
   *
   * @param char - Character to check
   * @param rule - Boolean or explicit inclusion rule
   * @returns Whether the character should be enumerated
   */
  #shouldEnumerateCharForRule(char: string, rule: boolean | EnumerationRule): boolean {
    if (!rule) {
      return false;
    }

    const normalizedRule = this.#getEnumerationRule(rule);
    const isSpace = PATTERNS.space.test(char);
    const isSpecial = PATTERNS.special.test(char);

    // If including everything, enumerate all
    if (normalizedRule.includeSpaces && normalizedRule.includeSpecialChars) {
      return true;
    }

    // If excluding spaces, skip space characters
    if (isSpace && !normalizedRule.includeSpaces) {
      return false;
    }

    // If excluding special chars, skip special characters
    if (isSpecial && !normalizedRule.includeSpecialChars) {
      return false;
    }

    // Otherwise, enumerate
    return true;
  }

  #getEnumerationRule(rule: boolean | EnumerationRule): EnumerationRule {
    if (typeof rule === 'object') {
      return rule;
    }

    return {
      includeSpaces: this.#config.enumerate.includeSpaces,
      includeSpecialChars: this.#config.enumerate.includeSpecialChars,
    };
  }

  /**
   * Gets current counter values (useful for debugging)
   *
   * @returns Current counter values
   */
  getCounters(): Counters {
    return { ...this.#counters };
  }
}
