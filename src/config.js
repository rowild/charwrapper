/**
 * Default Configuration for CharWrapper
 *
 * Modern ES6+ configuration with validation and sensible defaults.
 */

export const DEFAULT_CONFIG = {
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
};

/**
 * Regular expression patterns for character matching
 */
export const PATTERNS = {
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
 * Validates and merges user configuration with defaults
 *
 * @param {Object} userConfig - User-provided configuration
 * @returns {Object} Validated and merged configuration
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(userConfig = {}) {
  // Deep merge user config with defaults
  const config = deepMerge(DEFAULT_CONFIG, userConfig);

  // Validate wrap options
  if (typeof config.wrap !== 'object') {
    throw new Error('config.wrap must be an object');
  }

  // Validate tags
  const validTags = ['span', 'div', 'i', 'em', 'strong', 'mark'];
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
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

/**
 * Check if value is a plain object
 *
 * @param {*} item - Value to check
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
