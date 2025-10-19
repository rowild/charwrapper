/**
 * WrapperFactory
 *
 * Responsible for creating wrapped character and word elements.
 * This class handles all the logic for determining which classes to apply
 * and how to structure the wrapped elements.
 */

import { PATTERNS } from './config.js';
import { padNumber, buildClassString } from './utils.js';

export class WrapperFactory {
  #config;
  #counters;

  /**
   * Creates a new WrapperFactory instance
   *
   * @param {Object} config - Validated configuration object
   */
  constructor(config) {
    this.#config = config;
    this.#counters = {
      char: 0,
      word: 0,
    };
  }

  /**
   * Resets all counters
   */
  resetCounters() {
    this.#counters.char = 0;
    this.#counters.word = 0;
  }

  /**
   * Creates a wrapped character element
   *
   * @param {string} char - Single character to wrap
   * @param {Object} options - Additional options
   * @param {string} options.subSetClass - Optional subset-specific class
   * @returns {HTMLElement} Wrapped character element
   */
  createCharElement(char, options = {}) {
    const { subSetClass = null } = options;
    const element = document.createElement(this.#config.tags.char);

    // Build class list
    const classes = [this.#config.classes.char];

    // Add enumerated class if enabled
    if (this.#config.enumerate.chars) {
      const shouldEnumerate = this.#shouldEnumerateChar(char);
      if (shouldEnumerate) {
        classes.push(`${this.#config.classes.char}-${padNumber(this.#counters.char++)}`);
      }
    }

    // Add subset class if provided
    if (subSetClass) {
      classes.push(subSetClass);
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
   * @param {string} word - Word text
   * @param {Array<HTMLElement>} charElements - Array of wrapped character elements
   * @returns {HTMLElement} Wrapped word element containing character elements
   */
  createWordElement(word, charElements = []) {
    const element = document.createElement(this.#config.tags.word);

    // Build class list
    const classes = [this.#config.classes.word];

    // Add enumerated class if enabled
    if (this.#config.enumerate.words) {
      // Don't enumerate space-only words if configured
      const isSpaceWord = word.trim() === '';
      if (!isSpaceWord || this.#config.enumerate.includeSpaces) {
        classes.push(`${this.#config.classes.word}-${padNumber(this.#counters.word++)}`);
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
   * @returns {HTMLElement} Space element
   */
  createSpaceElement() {
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
   * @param {string} text - Text to wrap
   * @param {Object} options - Wrapping options
   * @returns {Array<HTMLElement>} Array of wrapped character elements
   */
  wrapChars(text, options = {}) {
    if (!text) return [];

    const chars = text.split('');
    return chars.map(char => this.createCharElement(char, options));
  }

  /**
   * Wraps text into word elements (with nested character elements)
   *
   * @param {string} text - Text to wrap
   * @param {Object} options - Wrapping options
   * @returns {Object} Object containing words and chars arrays
   */
  wrapWords(text, options = {}) {
    if (!text) return { words: [], chars: [] };

    const words = text.split(' ');
    const wordElements = [];
    const allCharElements = [];

    words.forEach((word, index) => {
      // Wrap each character in the word
      const charElements = this.wrapChars(word, options);
      allCharElements.push(...charElements);

      // Create word element containing character elements
      const wordElement = this.createWordElement(word, charElements);
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
   * @param {string} char - Character to check
   * @returns {boolean}
   */
  #shouldEnumerateChar(char) {
    const isSpace = PATTERNS.space.test(char);
    const isSpecial = PATTERNS.special.test(char);

    // If including everything, enumerate all
    if (this.#config.enumerate.includeSpaces && this.#config.enumerate.includeSpecialChars) {
      return true;
    }

    // If excluding spaces, skip space characters
    if (isSpace && !this.#config.enumerate.includeSpaces) {
      return false;
    }

    // If excluding special chars, skip special characters
    if (isSpecial && !this.#config.enumerate.includeSpecialChars) {
      return false;
    }

    // Otherwise, enumerate
    return true;
  }

  /**
   * Gets current counter values (useful for debugging)
   *
   * @returns {Object} Current counter values
   */
  getCounters() {
    return { ...this.#counters };
  }
}
