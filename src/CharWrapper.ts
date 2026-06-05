/**
 * CharWrapper - Modern ES6+ Text Character Wrapper
 *
 * Wraps text characters and words in HTML elements for animation purposes.
 * Designed to work seamlessly with GSAP and other animation libraries.
 *
 * @version 2.0.1
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

import { validateConfig, CharWrapperConfig, UserConfig, RootSet, TextSet, CustomSetSource } from './config.js';
import { WrapperFactory } from './WrapperFactory.js';
import { DOMProcessor, ProcessOptions } from './DOMProcessor.js';
import { Selector } from './SelectionStrategy.js';
import { CharacterGrouper, GroupResult } from './CharacterGrouper.js';
import { executePreset, PresetOptions, registerPreset as registerPresetGlobal } from './AnimationPresets.js';
import { TextTransition, TransitionOptions } from './TextTransition.js';
import { logger, generateId, is } from './utils.js';

/**
 * Instance metadata
 */
export interface InstanceMetadata {
  id: string;
  isWrapped: boolean;
  charCount: number;
  wordCount: number;
  rootSetName: string;
  attributeSetCount: number;
  customSetCount: number;
  rootElement?: string;
}

/**
 * Character type for filtering
 */
export type CharType = 'regular' | 'space' | 'special';

export class CharWrapper {
  // Private fields (ES2022+)
  #config: CharWrapperConfig;
  #selector: Selector | null;
  #processor: DOMProcessor | null;
  #factory: WrapperFactory | null;
  #grouper: CharacterGrouper | null;
  #rootElement: Element | null;
  #originalContent: string;
  #originalText: string;
  #rootSetResult: RootSet | null;
  #isWrapped: boolean;
  #instanceId: string;

  /**
   * Creates a new CharWrapper instance
   *
   * @param target - CSS selector or DOM element to wrap
   * @param userConfig - Configuration options
   * @throws Error if target is invalid or not found
   */
  constructor(target: string | Element, userConfig: UserConfig = {}) {
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
    const selected = this.#selector.select(target);
    this.#rootElement = Array.isArray(selected) ? selected[0] : selected;

    // Store original content for potential restoration
    this.#originalContent = this.#rootElement.innerHTML;
    this.#originalText = this.#rootElement.textContent || '';

    // Initialize processor, factory, and grouper
    this.#processor = new DOMProcessor(this.#config);
    this.#factory = new WrapperFactory(this.#config);
    this.#grouper = new CharacterGrouper(this.#config.groups);

    // Initialize state
    this.#rootSetResult = null;
    this.#isWrapped = false;

    logger.info(`CharWrapper instance created: ${this.#instanceId}`, {
      target,
      config: this.#config,
    });
  }

  /**
   * Wraps the text content
   *
   * @param options - Additional wrapping options
   * @returns Root set containing wrapped elements and child collections
   */
  wrap(options: ProcessOptions = {}): RootSet {
    if (this.#isWrapped) {
      logger.warn('Element already wrapped. Call unwrap() first or use rewrap()');
      return this.#rootSetResult!;
    }

    try {
      // Apply accessibility features BEFORE wrapping
      if (this.#config.accessibility.enabled) {
        this.#applyAccessibility();
      }

      // Reset factory counters
      this.#factory!.resetCounters();

      // Process the element
      const result = this.#processor!.processElement(
        this.#rootElement!,
        this.#factory!,
        {
          ...options,
          rootSetName: options.rootSetName || this.#getRootSetName(),
        }
      );

      // Group root and attribute-set characters if groups are configured
      result.rootSet.groups = this.#grouper!.groupCharacters(
        result.rootSet.chars,
        result.rootText || this.#textFromElements(result.rootSet.chars)
      );

      Object.entries(result.rootSet.attributeSets).forEach(([name, attributeSet]) => {
        attributeSet.groups = this.#grouper!.groupCharacters(
          attributeSet.chars,
          result.attributeSetTexts[name] || this.#textFromElements(attributeSet.chars)
        );
      });

      result.rootSet.customSets = this.#resolveCustomSets(result.rootSet);

      // Store wrapped root set
      this.#rootSetResult = result.rootSet;

      this.#isWrapped = true;

      logger.info(`Text wrapped successfully: ${this.#instanceId}`, {
        charCount: result.rootSet.chars.length,
        wordCount: result.rootSet.words.length,
        groupCount: Object.keys(result.rootSet.groups).length,
        attributeSetCount: Object.keys(result.rootSet.attributeSets).length,
        customSetCount: Object.keys(result.rootSet.customSets).length,
      });

      return this.#rootSetResult;
    } catch (error) {
      logger.error('Failed to wrap text:', error);
      throw error;
    }
  }

  /**
   * Applies accessibility attributes to root element
   * @private
   */
  #applyAccessibility(): void {
    const { ariaLabel, addTitle } = this.#config.accessibility;

    // Get original text content
    const originalText = this.#rootElement!.textContent?.trim() || '';

    // Sanitize text for aria attributes (remove line breaks and extra whitespace)
    const sanitizedText = originalText.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

    // Add aria-label if configured
    if (ariaLabel === 'auto' && sanitizedText) {
      this.#rootElement!.setAttribute('aria-label', sanitizedText);
    } else if (ariaLabel && ariaLabel !== 'auto' && ariaLabel !== 'none') {
      // Sanitize custom ariaLabel as well
      const sanitizedAriaLabel = ariaLabel.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      this.#rootElement!.setAttribute('aria-label', sanitizedAriaLabel);
    }

    // Add title attribute if not present and configured
    if (addTitle && !this.#rootElement!.hasAttribute('title') && sanitizedText) {
      this.#rootElement!.setAttribute('title', sanitizedText);
    }
  }

  /**
   * Unwraps the text content (restores original)
   */
  unwrap(): void {
    if (!this.#isWrapped) {
      logger.warn('Element is not wrapped');
      return;
    }

    try {
      // Restore original content
      this.#rootElement!.innerHTML = this.#originalContent;

      // Reset state
      this.#rootSetResult = null;
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
   * @param options - Additional wrapping options
   * @returns Root set containing wrapped elements and child collections
   */
  rewrap(options: ProcessOptions = {}): RootSet {
    this.unwrap();
    return this.wrap(options);
  }

  /**
   * Destroys the wrapper instance and cleans up resources
   */
  destroy(): void {
    // Unwrap if currently wrapped
    if (this.#isWrapped) {
      this.unwrap();
    }

    // Clear processor cache
    this.#processor?.clearCache();

    // Clear references
    this.#rootSetResult = null;
    this.#rootElement = null;
    this.#processor = null;
    this.#factory = null;
    this.#grouper = null;
    this.#selector = null;

    logger.info(`CharWrapper instance destroyed: ${this.#instanceId}`);
  }

  /**
   * Gets the wrapped character elements
   *
   * @returns Array of wrapped character elements
   */
  getChars(): HTMLElement[] {
    return [...(this.#rootSetResult?.chars || [])];
  }

  /**
   * Gets the wrapped word elements
   *
   * @returns Array of wrapped word elements
   */
  getWords(): HTMLElement[] {
    return [...(this.#rootSetResult?.words || [])];
  }

  /**
   * Gets a specific character element by index
   *
   * @param index - Character index
   * @returns Character element or undefined
   */
  getChar(index: number): HTMLElement | undefined {
    return this.#rootSetResult?.chars[index];
  }

  /**
   * Gets a specific word element by index
   *
   * @param index - Word index
   * @returns Word element or undefined
   */
  getWord(index: number): HTMLElement | undefined {
    return this.#rootSetResult?.words[index];
  }

  /**
   * Checks if the element is currently wrapped
   *
   * @returns True if wrapped
   */
  isWrapped(): boolean {
    return this.#isWrapped;
  }

  /**
   * Gets the root element
   *
   * @returns Root DOM element or null if destroyed
   */
  getRootElement(): Element | null {
    return this.#rootElement;
  }

  /**
   * Gets the current configuration
   *
   * @returns Current configuration (read-only copy)
   */
  getConfig(): CharWrapperConfig {
    return JSON.parse(JSON.stringify(this.#config));
  }

  /**
   * Gets instance metadata
   *
   * @returns Instance metadata
   */
  getMetadata(): InstanceMetadata {
    return {
      id: this.#instanceId,
      isWrapped: this.#isWrapped,
      charCount: this.#rootSetResult?.chars.length || 0,
      wordCount: this.#rootSetResult?.words.length || 0,
      rootSetName: this.#rootSetResult?.name || this.#getRootSetName(),
      attributeSetCount: Object.keys(this.#rootSetResult?.attributeSets || {}).length,
      customSetCount: Object.keys(this.#rootSetResult?.customSets || {}).length,
      rootElement: this.#rootElement?.tagName,
    };
  }

  /**
   * Filters wrapped characters by class name
   *
   * @param className - Class name to filter by
   * @returns Filtered character elements
   */
  filterCharsByClass(className: string): HTMLElement[] {
    return (this.#rootSetResult?.chars || []).filter(el =>
      el.classList.contains(className)
    );
  }

  /**
   * Gets the current root set.
   *
   * @returns Root set or null if not wrapped
   */
  getRootSet(): RootSet | null {
    return this.#rootSetResult;
  }

  /**
   * Gets an attribute set by name.
   *
   * @param name - Attribute set name
   * @returns Attribute set or undefined
   */
  getAttributeSet(name: string): TextSet | undefined {
    return this.#rootSetResult?.attributeSets[name];
  }

  /**
   * Gets character elements from an attribute set.
   *
   * @param name - Attribute set name
   * @returns Attribute-set chars or empty array
   */
  getAttributeSetChars(name: string): HTMLElement[] {
    return [...(this.getAttributeSet(name)?.chars || [])];
  }

  /**
   * Gets word elements from an attribute set.
   *
   * @param name - Attribute set name
   * @returns Attribute-set words or empty array
   */
  getAttributeSetWords(name: string): HTMLElement[] {
    return [...(this.getAttributeSet(name)?.words || [])];
  }

  /**
   * Gets a configured custom set.
   *
   * @param name - Custom set name
   * @returns Custom set elements or empty array
   */
  getCustomSet(name: string): HTMLElement[] {
    return [...(this.#rootSetResult?.customSets[name] || [])];
  }

  /**
   * Checks if an attribute set exists.
   *
   * @param name - Attribute set name
   * @returns Whether the attribute set exists
   */
  hasAttributeSet(name: string): boolean {
    return Boolean(this.#rootSetResult?.attributeSets[name]);
  }

  /**
   * Gets available attribute-set names.
   *
   * @returns Attribute-set names
   */
  getAttributeSetNames(): string[] {
    return Object.keys(this.#rootSetResult?.attributeSets || {});
  }

  /**
   * Gets all characters matching a pattern (e.g., only regular chars, only spaces)
   *
   * @param type - Type to filter ('regular', 'space', 'special')
   * @returns Filtered elements
   */
  getCharsByType(type: CharType): HTMLElement[] {
    const typeMap: Record<CharType, string> = {
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
   * Animate characters using a preset animation
   *
   * @param presetName - Name of the animation preset
   * @param options - Animation options
   * @returns GSAP timeline or tween, or null if preset not found
   *
   * @example
   * wrapper.animate('fadeInStagger');
   * wrapper.animate('wave', { amplitude: 30, duration: 1 });
   * wrapper.animate('typewriter', { stagger: 0.05, groups: 'vowels' });
   */
  animate(presetName: string, options: PresetOptions = {}): gsap.core.Timeline | gsap.core.Tween | null {
    if (!this.#isWrapped) {
      logger.error('Cannot animate: element not wrapped. Call wrap() first.');
      return null;
    }

    // Determine which elements to animate
    let elements = this.#rootSetResult.chars;

    // If targeting a specific group
    if (options.groups && this.#rootSetResult.groups[options.groups]) {
      elements = this.#rootSetResult.groups[options.groups];
      logger.info(`Animating group "${options.groups}" with preset "${presetName}"`);
    }

    return executePreset(presetName, elements, options);
  }

  /**
   * Transition to new text content with smooth animation
   *
   * @param newText - The new text to transition to
   * @param options - Transition options
   * @returns GSAP timeline
   *
   * @example
   * wrapper.transitionTo('New Text Here');
   * wrapper.transitionTo('Updated!', {
   *   strategy: 'smart',
   *   addDuration: 0.5,
   *   removeDuration: 0.3,
   *   stagger: 0.02
   * });
   */
  transitionTo(newText: string, options: TransitionOptions = {}): gsap.core.Timeline | null {
    if (!this.#isWrapped) {
      logger.error('Cannot transition: element not wrapped. Call wrap() first.');
      return null;
    }

    if (!this.#rootElement) {
      logger.error('Cannot transition: root element not found.');
      return null;
    }

    // Execute transition
    const timeline = TextTransition.transition(
      this.#rootElement,
      this.#originalText,
      newText,
      this.#rootSetResult.chars,
      this.#factory,
      {
        ...options,
        onComplete: () => {
          // Update original text reference
          this.#originalText = newText;

          // Re-query wrapped elements after transition
          const newChars = Array.from(
            this.#rootElement!.querySelectorAll(`.${this.#config.classes.char}`)
          ) as HTMLElement[];

          const newWords = Array.from(
            this.#rootElement!.querySelectorAll(`.${this.#config.classes.word}`)
          ) as HTMLElement[];

          this.#rootSetResult = {
            name: this.#getRootSetName(),
            element: this.#rootElement!,
            chars: newChars,
            words: newWords,
            groups: {},
            attributeSets: {},
            customSets: {},
          };

          // Re-group if groups were configured
          if (Object.keys(this.#config.groups).length > 0) {
            this.#rootSetResult.groups = this.#grouper!.groupCharacters(newChars, newText);
          }

          this.#rootSetResult.customSets = this.#resolveCustomSets(this.#rootSetResult);

          // Call user's onComplete if provided
          if (options.onComplete) {
            options.onComplete();
          }

          logger.info(`Transition complete. New text: "${newText}"`);
        },
      }
    );

    return timeline;
  }

  /**
   * Static factory method for quick usage
   *
   * @param target - CSS selector or DOM element
   * @param config - Configuration options
   * @returns New CharWrapper instance (already wrapped)
   */
  static create(target: string | Element, config: UserConfig = {}): CharWrapper {
    const wrapper = new CharWrapper(target, config);
    wrapper.wrap();
    return wrapper;
  }

  /**
   * Static method to wrap multiple elements at once
   *
   * @param targets - Array of targets
   * @param config - Configuration options
   * @returns Array of CharWrapper instances
   */
  static wrapMultiple(targets: (string | Element)[], config: UserConfig = {}): CharWrapper[] {
    if (!is.array(targets)) {
      throw new TypeError('targets must be an array');
    }

    return targets.map(target => CharWrapper.create(target, config));
  }

  /**
   * Wraps all matching root-set elements and returns their root sets.
   *
   * @param targets - CSS selector, element array, or node list
   * @param config - Configuration options
   * @returns Ordered root sets
   */
  static wrapAll(targets: string | Element[] | NodeListOf<Element>, config: UserConfig = {}): RootSet[] {
    const elements = this.#resolveWrapAllTargets(targets);
    const validatedConfig = validateConfig(config);
    const rootOrderKey = validatedConfig.dataAttributes.rootOrder;
    const ordered = validatedConfig.processing.ordered;

    const orderedElements = ordered
      ? [...elements].sort((a, b) => {
          const aOrder = this.#parseOrder((a as HTMLElement).dataset?.[rootOrderKey]);
          const bOrder = this.#parseOrder((b as HTMLElement).dataset?.[rootOrderKey]);
          const aHasOrder = typeof aOrder === 'number';
          const bHasOrder = typeof bOrder === 'number';

          if (aHasOrder && bHasOrder && aOrder !== bOrder) {
            return aOrder! - bOrder!;
          }

          if (aHasOrder !== bHasOrder) {
            return aHasOrder ? -1 : 1;
          }

          return elements.indexOf(a) - elements.indexOf(b);
        })
      : elements;

    return orderedElements.map(element => new CharWrapper(element, config).wrap());
  }

  /**
   * Finds a root set by name in a root-set array.
   *
   * @param rootSets - Root-set array
   * @param name - Root-set name
   * @returns First matching root set or undefined
   */
  static getRootSet(rootSets: RootSet[], name: string): RootSet | undefined {
    return rootSets.find(rootSet => rootSet.name === name);
  }

  /**
   * Register a custom animation preset
   *
   * @param name - Preset name
   * @param fn - Preset function
   *
   * @example
   * CharWrapper.registerPreset('myEffect', (elements, options) => {
   *   return gsap.from(elements, {
   *     opacity: 0,
   *     scale: 2,
   *     rotation: 360,
   *     stagger: options.stagger || 0.05
   *   });
   * });
   */
  static registerPreset(name: string, fn: (elements: HTMLElement[], options: PresetOptions) => gsap.core.Timeline | gsap.core.Tween): void {
    registerPresetGlobal(name, fn);
  }

  #getRootSetName(): string {
    const configuredName = this.#rootElement instanceof HTMLElement
      ? this.#rootElement.dataset?.[this.#config.dataAttributes.rootSet]
      : '';

    return configuredName || this.#instanceId;
  }

  #textFromElements(elements: HTMLElement[]): string {
    return elements.map(element => element.textContent || '').join('');
  }

  #resolveCustomSets(rootSet: RootSet): Record<string, HTMLElement[]> {
    const customSets: Record<string, HTMLElement[]> = {};

    Object.entries(this.#config.rootSet.customSets || {}).forEach(([name, source]) => {
      customSets[name] = this.#resolveCustomSetSource(rootSet, source);
    });

    return customSets;
  }

  #resolveCustomSetSource(rootSet: RootSet, source: CustomSetSource): HTMLElement[] {
    if (typeof source === 'function') {
      return [...source(rootSet)];
    }

    if (source === 'root' || source === 'rootChars') {
      return [...rootSet.chars];
    }

    if (source === 'rootWords') {
      return [...rootSet.words];
    }

    if (typeof source === 'string') {
      return [...(rootSet.attributeSets[source]?.chars || [])];
    }

    if (Array.isArray(source)) {
      return source.flatMap(item => {
        if (typeof item === 'string') {
          return rootSet.attributeSets[item]?.chars || [];
        }

        return this.#resolveCustomSetObject(rootSet, item);
      });
    }

    return this.#resolveCustomSetObject(rootSet, source);
  }

  #resolveCustomSetObject(
    rootSet: RootSet,
    source: { attributeSet: string; target: 'chars' | 'words' | 'both' }
  ): HTMLElement[] {
    const attributeSet = rootSet.attributeSets[source.attributeSet];
    if (!attributeSet) {
      return [];
    }

    if (source.target === 'chars') {
      return [...attributeSet.chars];
    }

    if (source.target === 'words') {
      return [...attributeSet.words];
    }

    return [...attributeSet.chars, ...attributeSet.words];
  }

  static #resolveWrapAllTargets(targets: string | Element[] | NodeListOf<Element>): Element[] {
    if (typeof targets === 'string') {
      return Array.from(document.querySelectorAll(targets));
    }

    return Array.from(targets);
  }

  static #parseOrder(value: string | undefined): number | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
}

// Export as default for convenience
export default CharWrapper;
