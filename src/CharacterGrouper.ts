/**
 * CharacterGrouper
 *
 * Handles grouping of wrapped character elements based on patterns,
 * positions, or custom filter functions.
 */

import { GroupsConfig, GroupConfig, CharContext } from './config.js';
import { logger } from './utils.js';

/**
 * Result of character grouping
 */
export interface GroupResult {
  [groupName: string]: HTMLElement[];
}

export class CharacterGrouper {
  #groupsConfig: GroupsConfig;

  constructor(groupsConfig: GroupsConfig) {
    this.#groupsConfig = groupsConfig;
  }

  /**
   * Groups characters based on configuration
   *
   * @param chars - Array of wrapped character elements
   * @param originalText - Original text before wrapping (for context)
   * @returns Object containing grouped elements
   */
  groupCharacters(chars: HTMLElement[], originalText: string): GroupResult {
    const groups: GroupResult = {};

    // If no groups configured, return empty
    if (!this.#groupsConfig || Object.keys(this.#groupsConfig).length === 0) {
      return groups;
    }

    // Build word boundaries for context
    const wordBoundaries = this.#getWordBoundaries(originalText);

    // Process each configured group
    for (const [groupName, groupDef] of Object.entries(this.#groupsConfig)) {
      groups[groupName] = this.#filterCharacters(
        chars,
        originalText,
        groupDef,
        wordBoundaries
      );
    }

    return groups;
  }

  /**
   * Filters characters based on group definition
   */
  #filterCharacters(
    chars: HTMLElement[],
    originalText: string,
    groupDef: GroupConfig | RegExp,
    wordBoundaries: number[]
  ): HTMLElement[] {
    const filtered: HTMLElement[] = [];

    // Handle RegExp shorthand
    if (groupDef instanceof RegExp) {
      return chars.filter((char, index) => {
        const text = originalText[index] || char.textContent || '';
        return groupDef.test(text);
      });
    }

    // Handle GroupConfig object
    const config = groupDef as GroupConfig;

    chars.forEach((char, index) => {
      const charText = originalText[index] || char.textContent || '';
      const context = this.#createContext(charText, index, wordBoundaries, originalText);
      let matches = false;

      // Pattern matching
      if (config.pattern && config.pattern.test(charText)) {
        matches = true;
      }

      // Nth character
      if (config.nth && (index + 1) % config.nth === 0) {
        matches = true;
      }

      // Specific indices
      if (config.indices && config.indices.includes(index)) {
        matches = true;
      }

      // Word matching
      if (config.words) {
        const currentWord = this.#getCurrentWord(index, originalText, wordBoundaries);
        if (config.words.includes(currentWord)) {
          matches = true;
        }
      }

      // Custom filter function
      if (config.custom && config.custom(charText, index, context)) {
        matches = true;
      }

      if (matches) {
        // Add custom class if specified
        if (config.class) {
          char.classList.add(config.class);
        }
        filtered.push(char);
      }
    });

    return filtered;
  }

  /**
   * Gets word boundaries in the text
   */
  #getWordBoundaries(text: string): number[] {
    const boundaries: number[] = [0]; // Start of first word

    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ' && i + 1 < text.length) {
        boundaries.push(i + 1); // Start of next word
      }
    }

    return boundaries;
  }

  /**
   * Creates character context for custom filters
   */
  #createContext(
    char: string,
    index: number,
    wordBoundaries: number[],
    text: string
  ): CharContext {
    const wordIndex = this.#getWordIndex(index, wordBoundaries);
    const wordStart = wordBoundaries[wordIndex];
    const wordEnd = wordBoundaries[wordIndex + 1]
      ? wordBoundaries[wordIndex + 1] - 1
      : text.length - 1;

    return {
      char,
      index,
      isFirstInWord: index === wordStart,
      isLastInWord: index === wordEnd || text[index + 1] === ' ',
      wordIndex,
    };
  }

  /**
   * Gets the word index for a character position
   */
  #getWordIndex(charIndex: number, wordBoundaries: number[]): number {
    for (let i = wordBoundaries.length - 1; i >= 0; i--) {
      if (charIndex >= wordBoundaries[i]) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Gets the current word at a character position
   */
  #getCurrentWord(charIndex: number, text: string, wordBoundaries: number[]): string {
    const wordIndex = this.#getWordIndex(charIndex, wordBoundaries);
    const start = wordBoundaries[wordIndex];
    const end = wordBoundaries[wordIndex + 1] || text.length;
    return text.substring(start, end).trim();
  }

  /**
   * Validates groups configuration
   */
  static validateGroupsConfig(groupsConfig: GroupsConfig): void {
    for (const [groupName, groupDef] of Object.entries(groupsConfig)) {
      if (!(groupDef instanceof RegExp) && typeof groupDef !== 'object') {
        logger.warn(`Invalid group definition for "${groupName}". Must be RegExp or GroupConfig object.`);
      }

      // Validate GroupConfig
      if (typeof groupDef === 'object' && !(groupDef instanceof RegExp)) {
        const config = groupDef as GroupConfig;

        if (config.nth && (config.nth < 1 || !Number.isInteger(config.nth))) {
          logger.warn(`Invalid nth value for group "${groupName}". Must be a positive integer.`);
        }

        if (config.indices && !Array.isArray(config.indices)) {
          logger.warn(`Invalid indices for group "${groupName}". Must be an array of numbers.`);
        }

        if (config.words && !Array.isArray(config.words)) {
          logger.warn(`Invalid words for group "${groupName}". Must be an array of strings.`);
        }
      }
    }
  }
}
