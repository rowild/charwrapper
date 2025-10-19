/**
 * TextTransition
 *
 * Handles smooth transitions between different text content.
 * Intelligently matches characters, animates additions/removals, and morphs text.
 */

import { logger } from './utils.js';

/**
 * Transition strategy type
 */
export type TransitionStrategy = 'smart' | 'sequential' | 'replace';

/**
 * Options for text transitions
 */
export interface TransitionOptions {
  strategy?: TransitionStrategy;
  addDuration?: number;
  removeDuration?: number;
  morphDuration?: number;
  stagger?: number;
  ease?: string;
  onComplete?: () => void;
}

/**
 * Character mapping result
 */
interface CharacterMapping {
  keep: Array<{ oldIndex: number; newIndex: number; element: HTMLElement }>;
  remove: Array<{ index: number; element: HTMLElement }>;
  add: Array<{ index: number; char: string }>;
}

/**
 * Default transition options
 */
const DEFAULT_TRANSITION_OPTIONS: Required<Omit<TransitionOptions, 'onComplete'>> = {
  strategy: 'smart',
  addDuration: 0.4,
  removeDuration: 0.4,
  morphDuration: 0.5,
  stagger: 0.02,
  ease: 'power2.out',
};

/**
 * TextTransition class
 */
export class TextTransition {
  /**
   * Calculate Levenshtein distance between two strings
   * Used for smart character matching
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Map old characters to new text using smart strategy
   * Attempts to reuse matching characters in similar positions
   */
  private static smartMapping(
    oldText: string,
    newText: string,
    oldElements: HTMLElement[]
  ): CharacterMapping {
    const keep: CharacterMapping['keep'] = [];
    const remove: CharacterMapping['remove'] = [];
    const add: CharacterMapping['add'] = [];

    const oldChars = oldText.split('');
    const newChars = newText.split('');
    const usedOldIndices = new Set<number>();
    const usedNewIndices = new Set<number>();

    // First pass: match identical characters in exact positions
    const minLen = Math.min(oldChars.length, newChars.length);
    for (let i = 0; i < minLen; i++) {
      if (oldChars[i] === newChars[i]) {
        keep.push({
          oldIndex: i,
          newIndex: i,
          element: oldElements[i],
        });
        usedOldIndices.add(i);
        usedNewIndices.add(i);
      }
    }

    // Second pass: match remaining characters by proximity
    for (let newIdx = 0; newIdx < newChars.length; newIdx++) {
      if (usedNewIndices.has(newIdx)) continue;

      let bestOldIdx = -1;
      let bestDistance = Infinity;

      for (let oldIdx = 0; oldIdx < oldChars.length; oldIdx++) {
        if (usedOldIndices.has(oldIdx)) continue;
        if (oldChars[oldIdx] !== newChars[newIdx]) continue;

        const distance = Math.abs(oldIdx - newIdx);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestOldIdx = oldIdx;
        }
      }

      if (bestOldIdx !== -1) {
        keep.push({
          oldIndex: bestOldIdx,
          newIndex: newIdx,
          element: oldElements[bestOldIdx],
        });
        usedOldIndices.add(bestOldIdx);
        usedNewIndices.add(newIdx);
      }
    }

    // Third pass: mark characters to remove
    for (let i = 0; i < oldChars.length; i++) {
      if (!usedOldIndices.has(i)) {
        remove.push({
          index: i,
          element: oldElements[i],
        });
      }
    }

    // Fourth pass: mark characters to add
    for (let i = 0; i < newChars.length; i++) {
      if (!usedNewIndices.has(i)) {
        add.push({
          index: i,
          char: newChars[i],
        });
      }
    }

    return { keep, remove, add };
  }

  /**
   * Sequential strategy: remove all, then add all
   */
  private static sequentialMapping(
    oldText: string,
    newText: string,
    oldElements: HTMLElement[]
  ): CharacterMapping {
    const remove = oldElements.map((element, index) => ({ index, element }));
    const add = newText.split('').map((char, index) => ({ index, char }));

    return {
      keep: [],
      remove,
      add,
    };
  }

  /**
   * Execute text transition
   *
   * @param rootElement - The container element
   * @param oldText - Current text
   * @param newText - New text to transition to
   * @param oldElements - Array of current wrapped character elements
   * @param wrapperFactory - Factory for creating new character elements
   * @param options - Transition options
   * @returns GSAP timeline
   */
  static transition(
    rootElement: Element,
    oldText: string,
    newText: string,
    oldElements: HTMLElement[],
    wrapperFactory: any,
    options: TransitionOptions = {}
  ): gsap.core.Timeline {
    const opts = { ...DEFAULT_TRANSITION_OPTIONS, ...options };

    logger.info(`Transitioning from "${oldText}" to "${newText}" using ${opts.strategy} strategy`);

    // Create timeline
    const timeline = gsap.timeline({
      onComplete: options.onComplete,
    });

    // Get character mapping based on strategy
    let mapping: CharacterMapping;
    if (opts.strategy === 'smart') {
      mapping = this.smartMapping(oldText, newText, oldElements);
    } else if (opts.strategy === 'sequential') {
      mapping = this.sequentialMapping(oldText, newText, oldElements);
    } else {
      // 'replace' strategy - just remove all and add all
      mapping = this.sequentialMapping(oldText, newText, oldElements);
    }

    logger.info(`Transition plan: ${mapping.keep.length} keep, ${mapping.remove.length} remove, ${mapping.add.length} add`);

    // Phase 1: Remove characters that are being deleted
    if (mapping.remove.length > 0) {
      timeline.to(
        mapping.remove.map((item) => item.element),
        {
          opacity: 0,
          scale: 0,
          duration: opts.removeDuration,
          stagger: opts.stagger,
          ease: opts.ease,
          onComplete: () => {
            // Remove elements from DOM
            mapping.remove.forEach((item) => {
              item.element.remove();
            });
          },
        },
        0
      );
    }

    // Phase 2: Morph/reposition kept characters
    if (mapping.keep.length > 0 && opts.strategy === 'smart') {
      // For each kept character, animate it to its new position
      mapping.keep.forEach((item) => {
        if (item.oldIndex !== item.newIndex) {
          // Calculate position offset (simplified - actual positioning would need more logic)
          const offset = (item.newIndex - item.oldIndex) * 20; // Approximate char width

          timeline.to(
            item.element,
            {
              x: offset,
              duration: opts.morphDuration,
              ease: opts.ease,
            },
            opts.removeDuration * 0.5
          );
        }
      });
    }

    // Phase 3: Add new characters
    if (mapping.add.length > 0) {
      // Create new character elements
      const newElements: HTMLElement[] = [];

      mapping.add.forEach((item) => {
        const charElement = wrapperFactory.createCharElement(item.char, item.index);
        newElements.push(charElement);

        // Set initial state (invisible)
        gsap.set(charElement, { opacity: 0, scale: 0 });

        // Insert at correct position
        if (item.index === 0) {
          rootElement.insertBefore(charElement, rootElement.firstChild);
        } else {
          // Find the element that should come before this one
          const prevElements = rootElement.children;
          const insertBefore = prevElements[item.index];
          if (insertBefore) {
            rootElement.insertBefore(charElement, insertBefore);
          } else {
            rootElement.appendChild(charElement);
          }
        }
      });

      // Animate new characters in
      const animateDelay = opts.strategy === 'sequential'
        ? opts.removeDuration
        : opts.removeDuration * 0.5;

      timeline.to(
        newElements,
        {
          opacity: 1,
          scale: 1,
          duration: opts.addDuration,
          stagger: opts.stagger,
          ease: opts.ease,
        },
        animateDelay
      );
    }

    return timeline;
  }

  /**
   * Simple replace transition (no smart matching)
   * Just removes all and adds all sequentially
   */
  static replace(
    rootElement: Element,
    oldElements: HTMLElement[],
    newText: string,
    wrapperFactory: any,
    options: TransitionOptions = {}
  ): gsap.core.Timeline {
    const opts = { ...DEFAULT_TRANSITION_OPTIONS, ...options };
    const timeline = gsap.timeline({
      onComplete: options.onComplete,
    });

    // Phase 1: Remove all old characters
    timeline.to(oldElements, {
      opacity: 0,
      scale: 0,
      duration: opts.removeDuration,
      stagger: opts.stagger,
      ease: opts.ease,
      onComplete: () => {
        oldElements.forEach((el) => el.remove());
      },
    });

    // Phase 2: Create and add new characters
    const newElements: HTMLElement[] = [];
    newText.split('').forEach((char, index) => {
      const charElement = wrapperFactory.createCharElement(char, index);
      gsap.set(charElement, { opacity: 0, scale: 0 });
      newElements.push(charElement);
      rootElement.appendChild(charElement);
    });

    timeline.to(
      newElements,
      {
        opacity: 1,
        scale: 1,
        duration: opts.addDuration,
        stagger: opts.stagger,
        ease: opts.ease,
      },
      opts.removeDuration
    );

    return timeline;
  }
}
