/**
 * TextTransition
 *
 * Handles smooth transitions between different text content.
 * Uses a clean approach: rebuild DOM correctly first, then animate only new/removed chars.
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
  stagger?: number;
  ease?: string;
  onComplete?: () => void;
}

/**
 * Default transition options
 */
const DEFAULT_TRANSITION_OPTIONS: Required<Omit<TransitionOptions, 'onComplete'>> = {
  strategy: 'smart',
  addDuration: 0.4,
  removeDuration: 0.4,
  stagger: 0.02,
  ease: 'power2.out',
};

/**
 * TextTransition class
 */
export class TextTransition {
  /**
   * Smart transition: Rebuild DOM correctly, animate only new/removed characters
   *
   * This approach ensures text is always readable and correctly spelled:
   * 1. Clear the container
   * 2. Build complete new structure with all characters
   * 3. Identify which are new (animate in) vs existing (keep visible)
   * 4. Animate
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

    // CRITICAL: Kill all existing GSAP animations on old elements to prevent overlapping
    if (oldElements.length > 0) {
      gsap.killTweensOf(oldElements);
    }

    const timeline = gsap.timeline({
      onComplete: options.onComplete,
    });

    if (opts.strategy === 'sequential') {
      // Sequential: Simple remove all, then add all
      return this.sequentialTransition(rootElement, oldElements, newText, wrapperFactory, opts, timeline);
    } else {
      // Smart: Reuse matching characters
      return this.smartTransition(rootElement, oldText, newText, oldElements, wrapperFactory, opts, timeline);
    }
  }

  /**
   * Sequential transition: Remove all, then add all
   */
  private static sequentialTransition(
    rootElement: Element,
    oldElements: HTMLElement[],
    newText: string,
    wrapperFactory: any,
    opts: Required<Omit<TransitionOptions, 'onComplete'>>,
    timeline: gsap.core.Timeline
  ): gsap.core.Timeline {

    // Pre-create new elements (but don't append to DOM yet)
    const newElements: HTMLElement[] = [];
    newText.split('').forEach((char, index) => {
      const charElement = wrapperFactory.createCharElement(char, index);
      // Set invisible using GSAP immediately (works on elements not yet in DOM)
      gsap.set(charElement, { opacity: 0, scale: 0 });
      newElements.push(charElement);
    });

    // Phase 1: Fade out old characters
    if (oldElements.length > 0) {
      timeline.to(oldElements, {
        opacity: 0,
        scale: 0,
        duration: opts.removeDuration,
        stagger: opts.stagger,
        ease: opts.ease,
      });
    }

    // Phase 2: Clear and add new elements at the right time
    timeline.call(() => {
      rootElement.innerHTML = '';
      newElements.forEach(el => rootElement.appendChild(el));
    }, undefined, opts.removeDuration);

    // Phase 3: Animate new characters in
    timeline.to(
      newElements,
      {
        opacity: 1,
        scale: 1,
        duration: opts.addDuration,
        stagger: opts.stagger,
        ease: opts.ease,
        clearProps: 'transform', // Clear inline transform after animation completes
      },
      `+=${opts.removeDuration * 0.05}` // Small delay after DOM update
    );

    return timeline;
  }

  /**
   * Smart transition: Reuse matching characters
   *
   * Strategy:
   * 1. Find matching characters between old and new text
   * 2. Clear container and rebuild with ALL new characters
   * 3. For matches, copy the old element (keeps it visible)
   * 4. For new chars, create and start invisible
   * 5. Animate only the new characters in
   */
  private static smartTransition(
    rootElement: Element,
    oldText: string,
    newText: string,
    oldElements: HTMLElement[],
    wrapperFactory: any,
    opts: Required<Omit<TransitionOptions, 'onComplete'>>,
    timeline: gsap.core.Timeline
  ): gsap.core.Timeline {

    const oldChars = oldText.split('');
    const newChars = newText.split('');

    // Build a map of old elements by their character
    const oldElementMap = new Map<string, HTMLElement[]>();
    oldElements.forEach((el, index) => {
      const char = oldChars[index];
      if (!oldElementMap.has(char)) {
        oldElementMap.set(char, []);
      }
      oldElementMap.get(char)!.push(el);
    });

    // Track which elements to animate
    const elementsToRemove: HTMLElement[] = [];
    const elementsToAdd: HTMLElement[] = [];

    // Build new structure
    const newElements: HTMLElement[] = [];

    newChars.forEach((char, newIndex) => {
      // Check if we have a matching old element we can reuse
      const availableOldElements = oldElementMap.get(char);
      let element: HTMLElement;

      if (availableOldElements && availableOldElements.length > 0) {
        // Reuse an existing element - ensure it's fully visible and reset any transforms
        element = availableOldElements.shift()!;

        // CRITICAL: Reset element to fully visible state (previous animations may have changed this)
        gsap.set(element, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0 });

        // Update its index if enumeration is used
        const classesToUpdate = Array.from(element.classList).filter(c => /char-\d+/.test(c));
        classesToUpdate.forEach(c => element.classList.remove(c));
        element.classList.add(`char-${String(newIndex + 1).padStart(3, '0')}`);

      } else {
        // Create new element and set to invisible immediately using GSAP
        element = wrapperFactory.createCharElement(char, newIndex);
        // Use GSAP set immediately (works on elements not yet in DOM)
        gsap.set(element, { opacity: 0, scale: 0 });
        elementsToAdd.push(element);
      }

      newElements.push(element);
    });

    // Collect elements that weren't reused (to remove)
    oldElementMap.forEach((elements) => {
      elements.forEach(el => elementsToRemove.push(el));
    });

    // Phase 1: Fade out elements that are being removed
    if (elementsToRemove.length > 0) {
      timeline.to(
        elementsToRemove,
        {
          opacity: 0,
          scale: 0,
          duration: opts.removeDuration,
          stagger: opts.stagger,
          ease: opts.ease,
        },
        0
      );
    }

    // Phase 2: Rebuild DOM structure
    // Do this after a brief delay to allow fade-out to start
    timeline.call(() => {
      rootElement.innerHTML = '';
      newElements.forEach(el => rootElement.appendChild(el));
    }, undefined, opts.removeDuration * 0.3);

    // Phase 3: Fade in new elements
    if (elementsToAdd.length > 0) {
      timeline.to(
        elementsToAdd,
        {
          opacity: 1,
          scale: 1,
          duration: opts.addDuration,
          stagger: opts.stagger,
          ease: opts.ease,
          clearProps: 'transform', // Clear inline transform after animation completes
        },
        opts.removeDuration * 0.5
      );
    }

    return timeline;
  }

  /**
   * Simple replace transition (for backwards compatibility)
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

    return this.sequentialTransition(rootElement, oldElements, newText, wrapperFactory, opts, timeline);
  }
}
