/**
 * Default Configuration for CharWrapper
 *
 * Modern ES6+ configuration with validation and sensible defaults.
 */

/**
 * Valid HTML tags for wrapping elements
 */
export type WrapTag = 'span' | 'div' | 'i' | 'em' | 'strong' | 'mark';

/**
 * ARIA label configuration
 */
export type AriaLabelConfig = 'auto' | 'none' | string;

/**
 * Character context information for custom group filters
 */
export interface CharContext {
  char: string;
  index: number;
  isFirstInWord: boolean;
  isLastInWord: boolean;
  wordIndex: number;
}

/**
 * Custom filter function for character groups
 */
export type GroupFilterFunction = (char: string, index: number, context: CharContext) => boolean;

/**
 * Configuration for a single character group
 */
export interface GroupConfig {
  pattern?: RegExp;           // Match characters by regex pattern
  nth?: number;               // Every nth character (e.g., 3 = every 3rd char)
  indices?: number[];         // Specific character positions [0, 5, 10]
  class?: string;             // Additional CSS class to add
  words?: string[];           // Match characters in specific words
  custom?: GroupFilterFunction; // Custom filter function
}

/**
 * Character groups configuration
 */
export interface GroupsConfig {
  [groupName: string]: GroupConfig | RegExp;
}

/**
 * Wrapping options configuration
 */
export interface WrapConfig {
  chars: boolean;
  words: boolean;
  spaces: boolean;
  specialChars: boolean;
}

/**
 * Enumeration options configuration
 */
export interface EnumerateConfig {
  chars: boolean;
  words: boolean;
  includeSpaces: boolean;
  includeSpecialChars: boolean;
}

/**
 * CSS class names configuration
 */
export interface ClassesConfig {
  char: string;
  word: string;
  space: string;
  special: string;
  regular: string;
}

/**
 * HTML tags configuration
 */
export interface TagsConfig {
  char: WrapTag;
  word: WrapTag;
}

/**
 * Data attributes configuration
 */
export interface DataAttributesConfig {
  subSetName: string;
  subSetClass: string;
  customOrder: string;
}

/**
 * Processing options configuration
 */
export interface ProcessingConfig {
  stripHTML: boolean;
  trimWhitespace: boolean;
  preserveStructure: boolean;
  lazyWrap: boolean;
}

/**
 * Performance options configuration
 */
export interface PerformanceConfig {
  useBatching: boolean;
  cacheSelectors: boolean;
}

/**
 * Accessibility options configuration
 */
export interface AccessibilityConfig {
  enabled: boolean;
  ariaLabel: AriaLabelConfig;
  ariaHidden: boolean;
  addTitle: boolean;
}

/**
 * Complete CharWrapper configuration interface
 */
export interface CharWrapperConfig {
  wrap: WrapConfig;
  enumerate: EnumerateConfig;
  classes: ClassesConfig;
  tags: TagsConfig;
  dataAttributes: DataAttributesConfig;
  replaceSpaceWith: string;
  processing: ProcessingConfig;
  performance: PerformanceConfig;
  accessibility: AccessibilityConfig;
  groups: GroupsConfig;
}

/**
 * Partial user configuration (all fields optional)
 */
export type UserConfig = Partial<{
  wrap: Partial<WrapConfig>;
  enumerate: Partial<EnumerateConfig>;
  classes: Partial<ClassesConfig>;
  tags: Partial<TagsConfig>;
  dataAttributes: Partial<DataAttributesConfig>;
  replaceSpaceWith: string;
  processing: Partial<ProcessingConfig>;
  performance: Partial<PerformanceConfig>;
  accessibility: Partial<AccessibilityConfig>;
  groups: GroupsConfig;
}>;

/**
 * Default configuration with all required values
 */
export const DEFAULT_CONFIG: CharWrapperConfig = {
  // Wrapping options
  wrap: {
    chars: true,
    words: false,
    spaces: false,
    specialChars: false,
  },

  // Enumeration (add index numbers to classes)
  enumerate: {
    chars: false,
    words: false,
    includeSpaces: false,
    includeSpecialChars: false,
  },

  // CSS class names (BEM-style recommended)
  classes: {
    char: 'char',
    word: 'word',
    space: 'char--space',
    special: 'char--special',
    regular: 'char--regular',
  },

  // HTML tag to wrap with
  tags: {
    char: 'span',
    word: 'span',
  },

  // Data attributes for data-driven selection
  dataAttributes: {
    subSetName: 'subSetName',
    subSetClass: 'subSetCharsClass',
    customOrder: 'customOrder',
  },

  // Character replacement
  replaceSpaceWith: '\xa0', // Non-breaking space

  // Processing options
  processing: {
    stripHTML: true,           // Remove HTML tags before processing
    trimWhitespace: true,      // Trim leading/trailing whitespace
    preserveStructure: true,   // Try to maintain DOM structure
    lazyWrap: false,          // Wrap on-demand (performance)
  },

  // Performance options
  performance: {
    useBatching: true,        // Use DocumentFragment for DOM updates
    cacheSelectors: true,     // Cache DOM queries
  },

  // Accessibility options
  accessibility: {
    enabled: true,            // Enable accessibility features
    ariaLabel: 'auto',        // 'auto' = use original text, 'none' = disabled, or custom string
    ariaHidden: true,         // Add aria-hidden to wrapped elements
    addTitle: true,           // Add title attribute if not present
  },

  // Character groups (predefined patterns + custom groups)
  groups: {},
};

/**
 * Regular expression patterns for character matching
 */
export const PATTERNS: Record<string, RegExp> = {
  // Regular characters (alphanumeric + common diacritics)
  regular: /[\w\-+äüöÄÜÖßéèêëúùûüóòôöáàâäíìîïÉÈÊËÚÙÛÜÓÒÔÖÁÀÂÄÍÌÎÏçÇñÑ]/,

  // Special characters
  special: /[<>?!:;,.$%€£¥\u2026\u00AB\u00BB|]/,

  // Whitespace
  space: /\s/,

  // Include spaces pattern
  withSpaces: /[\w\-+\s]/,

  // Include special chars + diacritics
  withSpecialChars: /[\w\-+<>?!:;,.$%€£¥\u2026\u00AB\u00BB|äüöÄÜÖßéèêëúùûüóòôöáàâäíìîïÉÈÊËÚÙÛÜÓÒÔÖÁÀÂÄÍÌÎÏçÇñÑ]/,
};

/**
 * Predefined character group patterns
 * Users can use these in their groups configuration
 */
export const PREDEFINED_GROUPS: Record<string, RegExp> = {
  // Basic character types
  vowels: /[aeiouAEIOU]/,
  consonants: /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/,
  numbers: /[0-9]/,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,

  // Punctuation
  punctuation: /[.,!?;:]/,
  quotes: /["'`´]/,
  brackets: /[\[\](){}]/,

  // Diacritics (accented characters) - The special letters you mentioned!
  diacritics: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ]/,

  // Specific language groups
  french: /[àâæçéèêëïîôùûüÿœÀÂÆÇÉÈÊËÏÎÔÙÛÜŸŒ]/,
  german: /[äöüßÄÖÜ]/,
  spanish: /[áéíóúüñ¿¡ÁÉÍÓÚÜÑ]/,
  portuguese: /[ãõçÃÕÇ]/,

  // Slavic languages (Czech, Polish, Croatian, etc.)
  slavic: /[čďěňřšťůžČĎĚŇŘŠŤŮŽąćęłńóśźżĄĆĘŁŃÓŚŹŻđšžčćĐŠŽČĆ]/,

  // Scandinavian
  scandinavian: /[åæøÅÆØ]/,

  // Currency symbols
  currency: /[$€£¥₹₽]/,

  // Mathematical symbols
  math: /[+\-=×÷±∞≈≠≤≥]/,

  // Emoji ranges (basic)
  emoji: /[\u{1F300}-\u{1F9FF}]/u,
};

/**
 * Validates and merges user configuration with defaults
 *
 * @param userConfig - User-provided configuration
 * @returns Validated and merged configuration
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(userConfig: UserConfig = {}): CharWrapperConfig {
  // Deep merge user config with defaults
  const config = deepMerge(DEFAULT_CONFIG, userConfig) as CharWrapperConfig;

  // Validate wrap options
  if (typeof config.wrap !== 'object') {
    throw new Error('config.wrap must be an object');
  }

  // Validate tags
  const validTags: WrapTag[] = ['span', 'div', 'i', 'em', 'strong', 'mark'];
  if (!validTags.includes(config.tags.char)) {
    throw new Error(`config.tags.char must be one of: ${validTags.join(', ')}`);
  }
  if (!validTags.includes(config.tags.word)) {
    throw new Error(`config.tags.word must be one of: ${validTags.join(', ')}`);
  }

  // Validate classes (must be non-empty strings)
  Object.entries(config.classes).forEach(([key, value]) => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`config.classes.${key} must be a non-empty string`);
    }
  });

  return config;
}

/**
 * Deep merge two objects (replaces lodash merge)
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof T];
      if (isObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue });
        } else {
          (output as any)[key] = deepMerge(
            target[key as keyof T] as Record<string, any>,
            sourceValue as Record<string, any>
          );
        }
      } else {
        Object.assign(output, { [key]: sourceValue });
      }
    });
  }

  return output;
}

/**
 * Check if value is a plain object
 *
 * @param item - Value to check
 * @returns True if item is a plain object
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}
