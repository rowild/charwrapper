# CharWrapper

Modern text wrapper library with TypeScript support, designed for seamless integration with GSAP and other animation libraries.

## What's New in 2.0.2

- **Changelog** - Release notes are now maintained in `CHANGELOG.md`
- **Agent Workflow Notes** - The `fin-patch` workflow and changelog convention are documented in `AGENTS.md`

## What's New in 2.0.1

- **Root Sets** - `wrap()` now returns a root set directly with `chars`, `words`, `groups`, `attributeSets`, and `customSets`
- **Attribute Sets** - Use `data-set-name` to create named child sets from HTML
- **Batch Root Sets** - `CharWrapper.wrapAll('[data-root-set]')` wraps every root set on a page and returns an ordered array
- **Explicit Ordering** - Use `data-root-order` for root sets and `data-set-order` inside a root set
- **Set-Specific Classes** - Use `data-set-char-class` and `data-set-word-class`
- **Live/Code Examples** - New GSAP examples show runnable demos and highlighted source code

## What's New in 2.0

- **TypeScript Support** - Full type definitions included
- **Single Bundle File** - Just 13KB minified, one file to include
- **60%+ Performance Improvement** - DocumentFragment batching, optimized DOM operations
- **Zero Dependencies** - Pure vanilla JavaScript
- **Modular Architecture** - 6 focused modules for maintainability
- **Memory Safe** - Built-in cleanup prevents memory leaks
- **Cleaner API** - Simplified, intuitive configuration
- **Diacritical Support** - Supports accented characters (ü, é, ñ, etc.)
- **Accessibility Built-in** - ARIA labels, aria-hidden, and title attributes for screen readers
- **Character Groups** - Smart selection system for targeting specific character subsets (NEW!)
- **Animation Presets** - Ready-to-use GSAP animations with one line of code (Optional GSAP feature)
- **Text Transitions** - Smoothly morph between different text content (Optional GSAP feature)

PS: Version 1.0 was never published.

## Installation

### NPM Package (Recommended for Bundlers)

```bash
npm install charwrapper
```

```javascript
// ES Module import
import CharWrapper from 'charwrapper';

const wrapper = new CharWrapper('.my-text', {
  wrap: { chars: true }
});

const { chars } = wrapper.wrap();
```

### Direct Download (GitHub)

Download the latest release from GitHub:
1. Visit: https://github.com/rowild/charwrapper/releases
2. Download the `charwrapper.min.js` file
3. Include it in your project

```html
<script src="path/to/charwrapper.min.js"></script>
```

### GitHub Integration (ES Module)

Use directly from GitHub with native ES modules:

```html
<script type="module">
  import CharWrapper from 'https://raw.githubusercontent.com/rowild/charwrapper/main/dist/esm/CharWrapper.js';

  const wrapper = new CharWrapper('.my-text', {
    wrap: { chars: true }
  });

  const { chars } = wrapper.wrap();
</script>
```

> **Note:** For production environments, always use the CDN or NPM package for better performance and reliability. Direct GitHub usage is primarily for development and testing.

### Build Tool Integration

#### Webpack Configuration
```javascript
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    alias: {
      'charwrapper': path.resolve(__dirname, 'node_modules/charwrapper/dist/esm/CharWrapper.js')
    }
  }
};
```

#### Vite Configuration
```javascript
// vite.config.js
export default {
  // ...
  resolve: {
    alias: {
      'charwrapper': 'charwrapper/dist/esm/CharWrapper.js'
    }
  }
};
```

#### Rollup Configuration
```javascript
// rollup.config.js
export default {
  // ...
  plugins: [
    resolve({
      // Enables node_modules resolution
      preferBuiltins: false
    })
  ]
};
```

## 🚀 Quick Start

### Basic Example

```html
<!DOCTYPE html>
<html>
<head>
  <!-- GSAP from CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

  <!-- CharWrapper bundle -->
  <script src="dist/charwrapper.min.js"></script>
</head>
<body>
  <h1 class="my-text">Hello World</h1>

  <script>
    // Create wrapper instance
    const wrapper = new CharWrapper('.my-text', {
      wrap: { chars: true },
      enumerate: { chars: true }
    });

    // Wrap the text
    const { chars } = wrapper.wrap();

    // Animate with GSAP
    gsap.from(chars, {
      opacity: 0,
      y: 50,
      stagger: 0.05,
      duration: 0.8
    });

    // Clean up when done
    wrapper.destroy();
  </script>
</body>
</html>
```

## 🆚 CharWrapper vs GSAP SplitText API

**Note:** CharWrapper uses a **different API structure** than GSAP SplitText (by design).

| Aspect | CharWrapper 2.0 | GSAP SplitText |
|--------|----------------|----------------|
| **Config Style** | Nested/Grouped | Flat |
| **Split Selection** | `wrap: { chars: true }` | `type: 'chars,words,lines'` |
| **Enumeration** | `enumerate: { chars: true }` | `charsClass: 'char++'` |
| **Class Names** | `classes: { char: 'x' }` | `charsClass: 'x'` |
| **Philosophy** | Organized, explicit | Concise, magic syntax |

**Example comparison:**

```javascript
// CharWrapper 2.0 - Grouped & Explicit
new CharWrapper('.text', {
  wrap: { chars: true, words: true },
  enumerate: { chars: true },
  classes: { char: 'c', word: 'w' }
});

// GSAP SplitText - Flat & Concise
new SplitText('.text', {
  type: 'chars,words',
  charsClass: 'c++',
  wordsClass: 'w++'
});
```

Both approaches are valid - CharWrapper prioritizes organization and discoverability, SplitText prioritizes brevity. See `COMPARISON_WITH_GSAP_SPLITTEXT.md` for detailed feature differences.

### Quick Static Method

```javascript
// One-liner for simple use cases
const wrapper = CharWrapper.create('.text', { wrap: { chars: true } });
const chars = wrapper.getChars();
```

## 📖 Configuration Options

### Wrap Options

```javascript
{
  wrap: {
    chars: true,        // Wrap individual characters
    words: false,       // Wrap words (can combine with chars)
    spaces: false,      // Wrap space characters
    specialChars: false // Wrap special characters (!?.,)
  }
}
```

### Enumeration (Add Index Numbers)

```javascript
{
  enumerate: {
    chars: true,              // Add numbered classes (.char-001, .char-002)
    words: false,             // Add numbered classes to words
    includeSpaces: false,     // Include spaces in enumeration
    includeSpecialChars: false // Include special chars in enumeration
  }
}
```

### CSS Classes

```javascript
{
  classes: {
    char: 'char',           // Base character class
    word: 'word',           // Base word class
    space: 'char--space',   // Space character class
    special: 'char--special', // Special character class
    regular: 'char--regular'  // Regular character class
  }
}
```

### HTML Tags

```javascript
{
  tags: {
    char: 'span', // Tag for character wrapping (span, div, i, em, strong, mark)
    word: 'span'  // Tag for word wrapping
  }
}
```

### Advanced Options

```javascript
{
  replaceSpaceWith: '\xa0', // Non-breaking space replacement

  processing: {
    stripHTML: true,        // Remove HTML tags before processing
    trimWhitespace: true,   // Trim leading/trailing whitespace (preserved when adjacent to inline elements)
    preserveStructure: true, // Maintain DOM structure
    lazyWrap: false,        // Wrap on-demand for performance
    ordered: false          // Order root/text records by data-root-order and data-set-order
  },

  performance: {
    useBatching: true,     // Use DocumentFragment (recommended)
    cacheSelectors: true   // Cache DOM queries
  },

  accessibility: {
    enabled: true,         // Enable accessibility features
    ariaLabel: 'auto',     // 'auto' = use original text, 'none' = disabled, or custom string
    ariaHidden: true,      // Add aria-hidden="true" to wrapped elements
    addTitle: true         // Add title attribute if not present
  }
}
```

### ♿ Accessibility (NEW!)

CharWrapper now includes built-in accessibility features to ensure screen reader compatibility:

```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  accessibility: {
    enabled: true,       // Enable all accessibility features
    ariaLabel: 'auto',   // Adds aria-label with original text to root element
    ariaHidden: true,    // Adds aria-hidden="true" to all wrapped elements
    addTitle: true       // Adds title attribute if not present
  }
});
```

**What this does:**

```html
<!-- Before wrapping -->
<div class="text">Hello World</div>

<!-- After wrapping (with accessibility enabled) -->
<div class="text" aria-label="Hello World" title="Hello World">
  <span class="char" aria-hidden="true">H</span>
  <span class="char" aria-hidden="true">e</span>
  <span class="char" aria-hidden="true">l</span>
  <span class="char" aria-hidden="true">l</span>
  <span class="char" aria-hidden="true">o</span>
  <span class="char" aria-hidden="true"> </span>
  <span class="char" aria-hidden="true">W</span>
  <span class="char" aria-hidden="true">o</span>
  <span class="char" aria-hidden="true">r</span>
  <span class="char" aria-hidden="true">l</span>
  <span class="char" aria-hidden="true">d</span>
</div>
```

**Result:** Screen readers read "Hello World" once (from aria-label) instead of "H. e. l. l. o. W. o. r. l. d."

**Options:**
- `ariaLabel: 'auto'` - Uses original text content (default)
- `ariaLabel: 'Custom text'` - Uses your custom text
- `ariaLabel: 'none'` - Disables aria-label
- `ariaHidden: true` - Hides wrapped elements from screen readers (default)
- `addTitle: true` - Adds title attribute for hover tooltips (default)

**Note:** Accessibility is **enabled by default**. This ensures your text animations are screen reader friendly out of the box!

## 🧩 Complete Configuration Reference

Here's a comprehensive example showing ALL available configuration options for reference:

```javascript
const wrapper = new CharWrapper('.text', {
  // Wrap Options - What to wrap
  wrap: {
    chars: true,        // Wrap individual characters
    words: false,       // Wrap words (can combine with chars)
    spaces: false,      // Wrap space characters  
    specialChars: false // Wrap special characters (!?.,)
  },

  // Enumeration Options - Add numbered classes
  enumerate: {
    rootSet: false,          // Add numbered classes with the root-set class prefix
    chars: false,             // Add numbered classes (.char-001, .char-002)
    words: false,             // Add numbered classes to words
    attributeSets: false,     // Add numbered classes with data-set-char-class / data-set-word-class
    includeSpaces: false,     // Include spaces in enumeration count
    includeSpecialChars: false // Include special chars in enumeration count
  },

  // CSS Classes - Customize the class names used
  classes: {
    rootSet: 'belongs-to-root-set', // Class applied to every wrapped character
    char: 'char',           // Base character class
    word: 'word',           // Base word class
    space: 'char--space',   // Space character class
    special: 'char--special', // Special character class
    regular: 'char--regular'  // Regular character class
  },

  // HTML Tags - Choose the element type for wrapping
  tags: {
    char: 'span', // Tag for character wrapping (span, div, i, em, strong, mark)
    word: 'span'  // Tag for word wrapping
  },

  // Data Attributes - Customize data attribute names
  dataAttributes: {
    rootSet: 'rootSet',          // data-root-set
    rootOrder: 'rootOrder',      // data-root-order
    setName: 'setName',          // data-set-name
    setOrder: 'setOrder',        // data-set-order
    setCharClass: 'setCharClass', // data-set-char-class
    setWordClass: 'setWordClass'  // data-set-word-class
  },

  // Root Set Options
  rootSet: {
    customSets: {},              // JS-defined animation targets under each root set
    exposeEmptyAttributeSets: false,
    autoDetectDataAttributes: true
  },

  // Advanced Options
  replaceSpaceWith: '\\xa0', // Replace spaces with non-breaking space

  // Processing Options - Text processing behavior
  processing: {
    stripHTML: true,        // Remove HTML tags before processing
    trimWhitespace: true,   // Trim leading/trailing whitespace (preserved when adjacent to inline elements)
    preserveStructure: true, // Maintain DOM structure
    lazyWrap: false,        // Wrap on-demand for performance
    ordered: false          // Order root/text records by data-root-order and data-set-order
  },

  // Performance Options
  performance: {
    useBatching: true,     // Use DocumentFragment for DOM updates (recommended)
    cacheSelectors: true   // Cache DOM queries
  },

  // Accessibility Options
  accessibility: {
    enabled: true,         // Enable accessibility features
    ariaLabel: 'auto',     // 'auto' = use original text, 'none' = disabled, or custom string
    ariaHidden: true,      // Add aria-hidden="true" to wrapped elements
    addTitle: true         // Add title attribute if not present
  },

  // Character Groups - Smart selection system for character subsets
  groups: {
    // Examples of different group types (these are optional):
    vowels: /[aeiou]/i,                    // Pattern matching
    everyThird: { nth: 3 },                // Every Nth character
    firstThree: { indices: [0, 1, 2] },    // Specific indices
    // Custom filter function
    firstLetters: {
      custom: (char, index, context) => context.isFirstInWord,
      class: 'first-letter'
    }
  }
});
```

## Character Groups

CharWrapper 2.0 introduces **Character Groups** - a powerful feature for selecting and animating specific character subsets. This is something GSAP SplitText doesn't offer!

### What are Character Groups?

Character groups allow you to organize wrapped characters into named collections based on patterns, positions, or custom logic. You can then animate each group independently.

```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  groups: {
    vowels: /[aeiou]/i,
    consonants: /[bcdfghjklmnpqrstvwxyz]/i,
    everyThird: { nth: 3 }
  }
});

const { chars, groups } = wrapper.wrap();

// Animate vowels and consonants separately
gsap.from(groups.vowels, { opacity: 0, color: '#ff6b9d', stagger: 0.05 });
gsap.from(groups.consonants, { y: 20, stagger: 0.03, delay: 0.3 });
```

### Predefined Character Groups

CharWrapper includes predefined patterns you can use instantly:

```javascript
import { PREDEFINED_GROUPS } from 'charwrapper';

// Basic character types
PREDEFINED_GROUPS.vowels          // a, e, i, o, u (case insensitive)
PREDEFINED_GROUPS.consonants      // All consonants
PREDEFINED_GROUPS.numbers         // 0-9
PREDEFINED_GROUPS.lowercase       // a-z
PREDEFINED_GROUPS.uppercase       // A-Z

// Punctuation
PREDEFINED_GROUPS.punctuation     // . , ! ? ; :
PREDEFINED_GROUPS.quotes          // " ' ` ´
PREDEFINED_GROUPS.brackets        // [ ] ( ) { }

// Diacritics (accented characters) - Perfect for multilingual content!
PREDEFINED_GROUPS.diacritics      // All accented characters (à, é, ü, ñ, etc.)

// Language-specific diacritics
PREDEFINED_GROUPS.french          // é, è, ç, à, û, etc.
PREDEFINED_GROUPS.german          // ä, ö, ü, ß
PREDEFINED_GROUPS.spanish         // á, é, í, ó, ú, ñ, ¿, ¡
PREDEFINED_GROUPS.portuguese      // ã, õ, ç
PREDEFINED_GROUPS.slavic          // Czech, Polish, Croatian characters
PREDEFINED_GROUPS.scandinavian    // å, æ, ø

// Special symbols
PREDEFINED_GROUPS.currency        // $, €, £, ¥, ₹, ₽
PREDEFINED_GROUPS.math            // +, -, =, ×, ÷, ±, ∞, ≈
PREDEFINED_GROUPS.emoji           // Emoji ranges
```

### Group Configuration Options

#### 1. Pattern Matching (RegEx)

```javascript
{
  groups: {
    vowels: /[aeiou]/i,
    specialChars: /[!@#$%^&*]/
  }
}
```

#### 2. Every Nth Character

```javascript
{
  groups: {
    everySecond: { nth: 2 },  // Every 2nd character
    everyThird: { nth: 3 },   // Every 3rd character
    everyFifth: { nth: 5 }    // Every 5th character
  }
}
```

#### 3. Specific Indices

```javascript
{
  groups: {
    firstThree: { indices: [0, 1, 2] },
    highlights: { indices: [5, 10, 15, 20] }
  }
}
```

#### 4. Word-Based Selection

```javascript
{
  groups: {
    keywords: {
      words: ['CharWrapper', 'animation', 'GSAP'],
      class: 'keyword-highlight'  // Optional: add CSS class
    }
  }
}
```

#### 5. Custom Filter Functions

The most powerful option - full control with context awareness:

```javascript
{
  groups: {
    firstLetters: {
      custom: (char, index, context) => context.isFirstInWord,
      class: 'first-letter'
    },
    lastLetters: {
      custom: (char, index, context) => context.isLastInWord
    },
    oddPositions: {
      custom: (char, index) => index % 2 === 1
    }
  }
}
```

**CharContext API:**
- `char` (string) - The character
- `index` (number) - Character position in text
- `isFirstInWord` (boolean) - Is first character of a word
- `isLastInWord` (boolean) - Is last character of a word
- `wordIndex` (number) - Which word this character belongs to

### Real-World Examples

#### Multilingual Diacritics Highlighting

```javascript
// Perfect for emphasizing accented characters in French text
const wrapper = new CharWrapper('.french-text', {
  wrap: { chars: true },
  groups: {
    accents: /[àâæçéèêëïîôùûüÿœ]/i
  }
});

const { groups } = wrapper.wrap();

gsap.to(groups.accents, {
  color: '#ff6b9d',
  scale: 1.2,
  stagger: 0.1,
  yoyo: true,
  repeat: -1,
  repeatDelay: 2
});
```

#### Data Visualization - Highlight Numbers

```javascript
const wrapper = new CharWrapper('.price', {
  wrap: { chars: true },
  groups: {
    numbers: /[0-9]/,
    currency: /[$€£¥]/
  }
});

const { groups } = wrapper.wrap();

// Animate numbers and currency symbols differently
gsap.from(groups.currency, { scale: 0, duration: 0.5 });
gsap.from(groups.numbers, {
  opacity: 0,
  y: -20,
  stagger: 0.05,
  delay: 0.3
});
```

#### First Letter Emphasis

```javascript
const wrapper = new CharWrapper('.headline', {
  wrap: { chars: true },
  groups: {
    firstLetters: {
      custom: (char, index, context) => context.isFirstInWord,
      class: 'drop-cap'
    }
  }
});

const { groups } = wrapper.wrap();

gsap.from(groups.firstLetters, {
  scale: 2,
  color: '#ffd700',
  stagger: 0.15,
  ease: 'back.out(1.7)'
});
```

### Combining Multiple Groups

```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  groups: {
    vowels: /[aeiou]/i,
    numbers: /[0-9]/,
    everyThird: { nth: 3 },
    firstLetters: {
      custom: (char, index, context) => context.isFirstInWord
    }
  }
});

const { groups } = wrapper.wrap();

// Animate each group with different effects
gsap.from(groups.vowels, { opacity: 0, stagger: 0.02 });
gsap.from(groups.numbers, { scale: 2, stagger: 0.1 });
gsap.from(groups.everyThird, { color: '#ff6b9d' });
gsap.from(groups.firstLetters, { y: -30, ease: 'bounce.out' });
```

### Live Demo

Check out `examples/05-character-groups.html` for a complete interactive demonstration with:
- Vowels vs consonants separation
- Multilingual diacritics (French, German, Spanish)
- Mixed content separation (letters, numbers, punctuation)
- Custom filters (first/last letters of words)
- Nth character patterns
- Word-based selection

**Note:** Character groups are completely **optional**. If you don't configure any groups, the `groups` object in the result will simply be empty `{}`.

## 📊 Data Attributes - Data-Driven Selection

CharWrapper includes a powerful **data attribute selection system** that allows you to define text segments in HTML using data attributes instead of CSS selectors. This is perfect for:
- **Dynamic content** - CMS-driven text animations
- **Structured data** - Business cards, profiles, forms
- **Custom ordering** - Animate elements in any sequence regardless of HTML order
- **Mixing content types** - Combine text, graphics, and interactive elements

### Why Use Data Attributes?

Instead of wrapping elements individually, wrap a **container** and use data attributes to organize and control the content:

```javascript
// Wrap the entire container - all text inside will be wrapped
const wrapper = new CharWrapper('[data-root-set="profile"]', {
  wrap: { chars: true }
});

// All text nodes inside this root set are now wrapped
const profileRootSet = wrapper.wrap();

// Animate all characters in document order
gsap.from(profileRootSet.chars, { opacity: 0, stagger: 0.02 });
```

The `data-set-name` attributes provide semantic child sets inside the root set and enable features like custom classes, ordering, custom sets, and exclusion.

### Basic Setup

#### 1. Mark Elements with Data Attributes

```html
<div class="profile" data-root-set="profile">
  <h1 data-set-name="first_name">John</h1>
  <h1 data-set-name="last_name">Van der Slice</h1>

  <!-- Mix in non-text elements -->
  <div data-set-name="divider_line" class="divider"></div>

  <p data-set-name="profession_1">composer</p>
  <p data-set-name="profession_2">teacher</p>
  <p data-set-name="profession_3">analyst</p>
</div>
```

#### 2. Initialize CharWrapper

**IMPORTANT:** CharWrapper wraps the **container element** and processes all text nodes inside it **in HTML document order**. The order elements appear in your HTML determines their animation sequence:

```javascript
// Wrap the container - all text inside will be wrapped in document order
const wrapper = new CharWrapper('[data-root-set="profile"]', {
  wrap: { chars: true }
});

const profileRootSet = wrapper.wrap();

// Animate all characters in the order they appear in HTML
gsap.from(profileRootSet.chars, { opacity: 0, stagger: 0.02 });
```

### Controlling Animation Order

The text is wrapped in **HTML document order** - the order elements appear in your HTML source. If you want to change the animation order, you can either rearrange the HTML elements or use the `ordered: true` processing option:

```javascript
const wrapper = new CharWrapper('.profile', {
  wrap: { chars: true },
  processing: { ordered: true }  // Uses data-set-order inside this root
});
```

When `ordered: true`, root sets returned by `CharWrapper.wrapAll()` are sorted by `data-root-order`, and text records inside a root set are sorted by nearest `data-set-order`.

```html
<div class="profile" data-root-set="profile" data-root-order="1">
  <!-- First name animates first -->
  <h1 data-set-name="first_name" data-set-order="1">John</h1>

  <!-- Last name animates second -->
  <h1 data-set-name="last_name" data-set-order="2">Van der Slice</h1>

  <!-- Professions animate in the order they appear -->
  <p data-set-name="profession_1" data-set-order="3">composer</p>
  <p data-set-name="profession_2" data-set-order="4">teacher</p>
  <p data-set-name="profession_3" data-set-order="5">analyst</p>
</div>
```

To control specific element animations separately, target them with CSS selectors after the character animation:

```javascript
const wrapper = new CharWrapper('.profile', { wrap: { chars: true } });
const profileRootSet = wrapper.wrap();

const tl = gsap.timeline();

// First animate all text
tl.from(profileRootSet.chars, { opacity: 0, stagger: 0.02 });

// Then animate specific elements (e.g., a divider)
tl.from('.divider', { scaleX: 0 }, '-=0.5');
```

### Custom Classes per Element

Add element-specific classes using `data-set-char-class`:

```html
<div class="profile">
  <!-- Add 'name-char' class to all characters in this element -->
  <h1 data-set-name="first_name"
      data-set-char-class="name-char">John</h1>

  <!-- Add 'profession-char' class to all characters in this element -->
  <p data-set-name="profession_1"
     data-set-char-class="profession-char">composer</p>
</div>
```

```css
/* Target characters in specific elements */
.name-char {
  color: #ff6b9d;
  font-weight: bold;
}

.profession-char {
  color: #4ecdc4;
  font-style: italic;
}
```

### Excluding Elements

Exclude elements from wrapping using `data-set-name="_exclude_"`:

```html
<div class="profile">
  <h1 data-set-name="name">John Doe</h1>

  <!-- This will be skipped during wrapping -->
  <div data-set-name="_exclude_">
    <span>This text will NOT be wrapped</span>
  </div>

  <p data-set-name="profession">composer</p>
</div>
```

### Mixing Text and Graphics

**Key Feature:** Data attributes work with **any element**, not just text! This lets you combine text animations with graphic elements:

```html
<div class="business-card">
  <h1 data-set-name="first_name">John</h1>
  <h1 data-set-name="last_name">Van der Slice</h1>

  <!-- Animate a divider line -->
  <div data-set-name="divider_line" class="divider"></div>

  <p data-set-name="title">Lead Composer</p>
</div>
```

```javascript
const wrapper = new CharWrapper('[data-root-set="business-card"]', {
  wrap: { chars: true }
});

const businessCardRootSet = wrapper.wrap();

// Create timeline
const tl = gsap.timeline();

// First name and last name appear
tl.from(businessCardRootSet.chars, { opacity: 0, y: 20, stagger: 0.02 });

// Then animate the divider
tl.from('.divider', {
  scaleX: 0,
  transformOrigin: 'center',
  duration: 0.6,
  ease: 'power2.out'
}, '-=0.3');

// Finally the title
tl.from('.title', { opacity: 0, y: 10 }, '-=0.2');
```

### Configuration

You can customize data attribute names:

```javascript
const wrapper = new CharWrapper('[data-text-root="profile"]', {
  wrap: { chars: true },
  dataAttributes: {
    rootSet: 'textRoot',           // data-text-root
    rootOrder: 'textRootOrder',    // data-text-root-order
    setName: 'profileItem',        // data-profile-item
    setOrder: 'profileItemOrder',  // data-profile-item-order
    setCharClass: 'profileChar',   // data-profile-char
    setWordClass: 'profileWord'    // data-profile-word
  }
});
```

### Real-World Example: Animated Profile Card

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
    }

    .divider {
      height: 2px;
      background: linear-gradient(to right, transparent, #333, transparent);
      margin: 1rem 0;
      transform-origin: center;
    }

    .char { display: inline-block; }
  </style>
</head>
<body>
  <div class="profile-card" data-root-set="profile">
    <h1 data-set-name="first_name">John</h1>
    <h1 data-set-name="last_name">Van der Slice</h1>

    <div data-set-name="divider_line" class="divider"></div>

    <p data-set-name="profession_1">composer</p>
    <p data-set-name="profession_2">teacher</p>
    <p data-set-name="profession_3">analyst</p>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="charwrapper.min.js"></script>

  <script>
    // Wrap the entire profile card
    const wrapper = new CharWrapper('.profile-card', {
      wrap: { chars: true }
    });

    const { chars } = wrapper.wrap();

    const tl = gsap.timeline();

    // Animate all text characters in document order
    tl.from(chars, {
      opacity: 0,
      y: 20,
      stagger: 0.02,
      ease: 'back.out(1.7)'
    });

    // Animate divider from center outward
    tl.from('.divider', {
      scaleX: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.5');
  </script>
</body>
</html>
```

### Live Demo

Check out `examples/gsap/09-data-attributes.html`, `examples/animejs/09-data-attributes.html`, and `examples/waapi/09-data-attributes.html` for complete interactive demonstrations showing:
- Data-driven element selection
- HTML document order vs custom ordering
- Mixing text and graphic elements
- Custom class assignment per element
- Excluding elements from processing

**Note:** The data attributes feature is completely **optional**. Most users will use CSS selectors (`'.text'`, `'#heading'`) and won't need data attributes unless building dynamic, data-driven animations.

## 🎬 Animation Presets (Optional GSAP Feature)

**⚠️ Requires GSAP:** Animation presets are optional GSAP-specific features. CharWrapper core is animation-agnostic and works with any animation library (anime.js, Framer Motion, etc.). To use presets, include GSAP separately:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="charwrapper.min.js"></script>
```

### What are Animation Presets?

Instead of writing custom GSAP code every time, use built-in presets with a single method call:

```javascript
const wrapper = new CharWrapper('.text', { wrap: { chars: true } });
wrapper.wrap();

// Use presets instead of writing GSAP code:
wrapper.animate('fadeInStagger');
wrapper.animate('typewriter', { stagger: 0.05 });
wrapper.animate('wave', { amplitude: 30 });
```

### Built-in Presets

**Entrance Animations:**
- `fadeInStagger` - Classic fade with stagger
- `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight` - Directional slides
- `scaleIn` - Pop in from center
- `rotateIn` - Spinning entrance
- `elasticBounce` - Bouncy entrance
- `typewriter` - Classic typing effect
- `wave` - Wave-like stagger pattern
- `glitch` - Digital glitch effect

**Loop Animations:**
- `floatingWave` - Continuous floating wave
- `pulse` - Breathing effect
- `colorCycle` - Color transitions
- `shimmer` - Shine/shimmer effect

**Exit Animations:**
- `fadeOut`, `slideOutDown`, `scaleOut` - Standard exits
- `explode` - Characters scatter in random directions

**Interactive:**
- `hoverBounce` - Auto-attach hover listeners
- `clickSpin` - Auto-attach click listeners

### Preset Options

All presets accept custom options:

```javascript
wrapper.animate('fadeInStagger', {
  duration: 1,
  stagger: 0.05,
  ease: 'power2.out',
  delay: 0.5,
  groups: 'vowels' // Animate only specific groups!
});
```

### Custom Presets

Register your own reusable presets:

```javascript
CharWrapper.registerPreset('myEffect', (elements, options) => {
  return gsap.from(elements, {
    opacity: 0,
    scale: 2,
    rotation: 360,
    stagger: options.stagger || 0.05
  });
});

wrapper.animate('myEffect');
```

### Why Use Presets?

✅ **Faster development** - Common effects in one line
✅ **Beginner-friendly** - No GSAP knowledge required
✅ **Still flexible** - Customize any preset
✅ **Works with groups** - Combine with character groups
✅ **Returns GSAP timeline** - Advanced users can manipulate it

## 🔄 Text Transitions (Optional GSAP Feature)

**⚠️ Requires GSAP:** Text transitions are optional GSAP-specific features. CharWrapper core remains animation-agnostic. Include GSAP separately:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="charwrapper.min.js"></script>
```

### What are Text Transitions?

Smoothly morph from one text to another with intelligent character matching:

```javascript
const wrapper = new CharWrapper('.text', { wrap: { chars: true } });
wrapper.wrap();

// Transition to new text
wrapper.transitionTo('New Text Here');

// With options
wrapper.transitionTo('Updated!', {
  strategy: 'smart',
  addDuration: 0.5,
  removeDuration: 0.3,
  stagger: 0.02
});
```

### Transition Strategies

**1. Smart (default)** - Intelligently matches characters between old and new text:
```javascript
wrapper.transitionTo('New Text', { strategy: 'smart' });
```
- Reuses matching characters
- Only animates what changed
- Best for similar text

**2. Sequential** - Removes all, then adds all:
```javascript
wrapper.transitionTo('Completely Different', { strategy: 'sequential' });
```
- Clean and simple
- Best for very different text

### Transition Options

```javascript
wrapper.transitionTo('New Text', {
  strategy: 'smart',        // 'smart' or 'sequential'
  addDuration: 0.4,         // Duration for adding characters
  removeDuration: 0.4,      // Duration for removing characters
  stagger: 0.02,            // Stagger between characters
  ease: 'power2.out',       // GSAP easing
  onComplete: () => {       // Callback when done
    console.log('Transition complete!');
  }
});
```

### Real-World Examples

**Counter:**
```javascript
let count = 0;

function increment() {
  count++;
  wrapper.transitionTo(String(count));
}
```

**Status Messages:**
```javascript
wrapper.transitionTo('Loading...');
// later
wrapper.transitionTo('Success!');
```

**Chained Transitions:**
```javascript
wrapper.transitionTo('First', {
  onComplete: () => {
    setTimeout(() => {
      wrapper.transitionTo('Second', {
        onComplete: () => {
          wrapper.transitionTo('Done!');
        }
      });
    }, 1000);
  }
});
```

### Why Use Text Transitions?

✅ **Smooth morphing** - No jarring content changes
✅ **Intelligent matching** - Reuses characters when possible
✅ **Perfect for dynamic content** - Counters, status updates, live data
✅ **Returns GSAP timeline** - Full control for advanced users
✅ **Auto-updates groups** - Character groups are re-evaluated after transition

## 🎨 Examples

Open `examples/index.html` in your browser to see all examples:

### 1. Text Reveal Animations
Staggered entrance effects with fade, slide, scale, and wave animations.

```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  enumerate: { chars: true }
});

const { chars } = wrapper.wrap();

gsap.from(chars, {
  opacity: 0,
  y: 50,
  stagger: 0.03,
  ease: 'back.out(1.7)'
});
```

### 2. Scramble & Shuffle Effects
Matrix-style decoding, character randomization, glitch effects.

```javascript
// Matrix decode effect
const originalText = chars.map(el => el.textContent);

chars.forEach((char, i) => {
  gsap.to(char, {
    duration: 0.05,
    repeat: 20,
    onRepeat: () => char.textContent = getRandomChar(),
    onComplete: () => char.textContent = originalText[i]
  });
});
```

### 3. Interactive Hover Effects
Mouse-reactive animations with bounce, magnetic pull, and ripple effects.

```javascript
chars.forEach(char => {
  char.addEventListener('mouseenter', () => {
    gsap.to(char, { y: -20, duration: 0.3 });
    gsap.to(char, { y: 0, duration: 0.5, delay: 0.3, ease: 'bounce.out' });
  });
});
```

### 4. Scroll-Triggered Animations
GSAP ScrollTrigger integration with parallax and progressive blur.

```javascript
gsap.registerPlugin(ScrollTrigger);

gsap.from(chars, {
  opacity: 0,
  y: 30,
  stagger: 0.02,
  scrollTrigger: {
    trigger: '.text',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1
  }
});
```

## 📚 API Reference

### Constructor

```javascript
new CharWrapper(target, config)
```

**Parameters:**
- `target` (string|Element) - CSS selector or DOM element
- `config` (Object) - Configuration options

### Methods

#### `wrap(options)`
Wraps the text content.
- **Returns:** `{ chars: Array<HTMLElement>, words: Array<HTMLElement>, groups: GroupResult }`
  - `chars` - Array of all wrapped character elements
  - `words` - Array of all wrapped word elements
  - `groups` - Object containing grouped character elements (e.g., `{ vowels: [...], consonants: [...] }`)

#### `unwrap()`
Restores original content.

#### `rewrap(options)`
Unwraps and wraps again (useful for re-animation).

#### `destroy()`
Cleans up and removes all references (prevents memory leaks).

#### `getChars()`
Returns array of wrapped character elements.

#### `getWords()`
Returns array of wrapped word elements.

#### `getChar(index)`
Returns specific character element by index.

#### `getWord(index)`
Returns specific word element by index.

#### `getCharsByType(type)`
Filters characters by type ('regular', 'space', 'special').

```javascript
const regularChars = wrapper.getCharsByType('regular');
const spaces = wrapper.getCharsByType('space');
```

#### `filterCharsByClass(className)`
Returns characters matching a specific class.

#### `isWrapped()`
Checks if element is currently wrapped.

#### `getRootElement()`
Returns the root DOM element.

#### `getConfig()`
Returns current configuration (read-only copy).

#### `getMetadata()`
Returns instance metadata (id, charCount, wordCount, etc.).

#### `animate(presetName, options)` ⚡ GSAP Required
Animate characters using a preset animation.

```javascript
wrapper.animate('fadeInStagger');
wrapper.animate('wave', { amplitude: 30, duration: 1 });
wrapper.animate('typewriter', { stagger: 0.05, groups: 'vowels' });
```

**Parameters:**
- `presetName` (string) - Name of the animation preset
- `options` (PresetOptions) - Animation options (duration, stagger, delay, ease, groups, etc.)

**Returns:** GSAP timeline or tween, or null if preset not found

**Note:** Requires GSAP to be loaded. Returns null if element is not wrapped.

#### `transitionTo(newText, options)` ⚡ GSAP Required
Transition to new text content with smooth animation.

```javascript
wrapper.transitionTo('New Text Here');
wrapper.transitionTo('Updated!', {
  strategy: 'smart',
  addDuration: 0.5,
  removeDuration: 0.3,
  stagger: 0.02
});
```

**Parameters:**
- `newText` (string) - The new text to transition to
- `options` (TransitionOptions) - Transition options

**Options:**
- `strategy` - 'smart' (default) or 'sequential'
- `addDuration` - Duration for adding characters (default: 0.4)
- `removeDuration` - Duration for removing characters (default: 0.4)
- `stagger` - Stagger between characters (default: 0.02)
- `ease` - GSAP easing (default: 'power2.out')
- `onComplete` - Callback function

**Returns:** GSAP timeline or null

**Note:** Requires GSAP to be loaded. Automatically updates character groups after transition.

### Static Methods

#### `CharWrapper.create(target, config)`
Creates and wraps in one call.

```javascript
const wrapper = CharWrapper.create('.text', { wrap: { chars: true } });
```

#### `CharWrapper.wrapMultiple(targets, config)`
Wraps multiple elements at once.

```javascript
const wrappers = CharWrapper.wrapMultiple(['.text1', '.text2'], {
  wrap: { chars: true }
});
```

#### `CharWrapper.registerPreset(name, fn)` ⚡ GSAP Required
Register a custom animation preset.

```javascript
CharWrapper.registerPreset('myEffect', (elements, options) => {
  return gsap.from(elements, {
    opacity: 0,
    scale: 2,
    rotation: 360,
    stagger: options.stagger || 0.05
  });
});

// Use it
wrapper.animate('myEffect');
```

**Parameters:**
- `name` (string) - Preset name
- `fn` (function) - Preset function that receives (elements, options) and returns a GSAP timeline/tween

## 🏗️ Project Structure

```
CharWrapper/
├── dist/                    # Built bundles
│   ├── charwrapper.js       # Browser bundle (IIFE format, 36KB)
│   ├── charwrapper.min.js   # Minified browser bundle (IIFE format, 13KB) ← Use this for browsers!
│   ├── charwrapper.cjs.js   # Node.js bundle (CommonJS format, 52KB)
│   ├── charwrapper.cjs.min.js # Minified Node.js bundle (CommonJS format, 21KB)
│   └── esm/                 # ES modules (for npm/bundlers)
│       ├── CharWrapper.js
│       ├── CharWrapper.d.ts # TypeScript definitions
│       ├── config.js
│       ├── utils.js
│       └── ...
├── src/                     # TypeScript source files
│   ├── CharWrapper.ts       # Main class
│   ├── config.ts            # Configuration & types
│   ├── utils.ts             # Utilities
│   ├── WrapperFactory.ts    # Element factory
│   ├── DOMProcessor.ts      # DOM operations
│   └── SelectionStrategy.ts # Selection patterns
├── build-bundle.js          # Esbuild script for browser bundles
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # Comprehensive documentation
├── QUICKSTART.md            # Quick start guide
└── COMPARISON_WITH_GSAP_SPLITTEXT.md # API comparison with GSAP SplitText
```

## 🛠️ Development

### Building from Source

```bash
npm install             # Install dependencies
npm run build           # Compile TypeScript to esm/
npm run bundle          # Build + create browser bundles
npm run watch           # Watch mode for development
npm run clean           # Remove all build output
```

### TypeScript

Full TypeScript support with type definitions:

```typescript
import CharWrapper from 'charwrapper';

const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  enumerate: { chars: true }
});

// Full type inference and autocomplete
const { chars, words } = wrapper.wrap();
```

## ⚡ Performance

### Optimizations Applied

1. **DocumentFragment Batching** - Reduces reflows from 100+ to 1
2. **WeakMap Caching** - Prevents memory leaks, auto garbage collection
3. **Single DOM Clear** - Removed redundant `innerHTML`/`innerText` operations
4. **Native Array Methods** - Replaced lodash with native `sort()`
5. **Query Caching** - Stores selector results when enabled

### Before vs After

| Metric | v1.0 (Old) | v2.0 (New) | Improvement |
|--------|-----------|-----------|-------------|
| DOM Reflows | 100+ | 1-2 | **98% reduction** |
| Dependencies | lodash | none | **100% reduction** |
| Memory Leaks | Yes | No | **Fixed** |
| Load Time | ~150ms | ~50ms | **66% faster** |

## 🎯 Use Cases

- **Hero Text Animations** - Stunning entrance effects
- **Interactive Typography** - Mouse-reactive text
- **Loading Screens** - Scramble/decode effects
- **Scroll Narratives** - Story-driven scroll animations
- **UI Microinteractions** - Button and link hover effects
- **Data Visualization** - Animated number counters

## 🔧 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Uses modern ES6+ features (private fields, optional chaining, nullish coalescing).

## 📂 File Sizes

| File | Size | Use Case |
|------|------|----------|
| `charwrapper.min.js` | 13KB | Production (recommended) |
| `charwrapper.js` | 36KB | Development/debugging |
| ESM modules | ~40KB | NPM package (tree-shakeable) |

## 📝 Migration from v1.0

### Old API (v1.0)
```javascript
let wrapper = new CharWrapper({
  rootSetIdentifier: '.text',
  wrapChars: true,
  enumerateRootSet: { includeSpaces: true },
  characterWrapTag: 'span',
  // ...30+ options
});
wrapper.initializeWrap();
```

### New API (v2.0)
```html
<script src="dist/charwrapper.min.js"></script>
<script>
  const wrapper = new CharWrapper('.text', {
    wrap: { chars: true },
    enumerate: { chars: true, includeSpaces: true },
    tags: { char: 'span' }
  });

  const { chars, words } = wrapper.wrap();
  wrapper.destroy(); // Don't forget cleanup!
</script>
```

## 🐛 Known Limitations

- **Nested HTML tags** are stripped before processing (intentional for clean output)
- **`<br>` tags** are removed during text processing
- **Inline styles** on original text are not preserved

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Please open an issue to discuss improvements.

## 📄 License

MIT License - Free to use in personal and commercial projects.

## 💡 Tips

1. **Always call `destroy()`** when removing elements (especially in SPAs)
2. **Use `useBatching: true`** for best performance (default)
3. **Combine with GSAP's `stagger`** for beautiful effects
4. **Filter by character type** to animate only specific characters
5. **Use `rewrap()`** instead of creating new instances

## 🎓 Learning Resources

Check out the examples folder for production-ready code:
- All 4 examples are fully commented
- Copy-paste ready
- Best practices demonstrated
- Performance optimized

---

**Built with ❤️ for modern web animations**

*CharWrapper 2.0 - Zero dependencies, maximum performance*
# CharWrapper vs GSAP SplitText - Detailed Comparison

## 📊 Executive Summary

**GSAP SplitText** is the professional, feature-rich industry standard with 14+ advanced features.
**CharWrapper 2.0** is a lighter, independent alternative focused on character/word wrapping basics.

---

## ✅ Similarities

### Core Functionality
Both libraries provide:

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Character splitting** | ✅ `wrap: { chars: true }` | ✅ `type: "chars"` |
| **Word splitting** | ✅ `wrap: { words: true }` | ✅ `type: "words"` |
| **Nested wrapping** | ✅ Words contain chars | ✅ Words contain chars |
| **Custom CSS classes** | ✅ `classes: { char: 'x' }` | ✅ `charsClass: 'x'` |
| **Class enumeration** | ✅ `enumerate: { chars: true }` | ✅ `charsClass: 'char++'` |
| **Custom HTML tags** | ✅ `tags: { char: 'span' }` | ✅ `tag: 'span'` |
| **Destroy/cleanup** | ✅ `wrapper.destroy()` | ✅ `splitText.revert()` |
| **Re-wrapping** | ✅ `wrapper.rewrap()` | ✅ `splitText.split(newVars)` |

### Design Patterns
- Both use ES6 classes
- Both return element arrays for GSAP animation
- Both support method chaining
- Both designed specifically for GSAP integration

---

## 🔴 Key Differences

### 1. **Line Splitting** ⭐ MAJOR

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Split by lines** | ❌ **NOT SUPPORTED** | ✅ `type: "lines"` |
| **Line detection** | ❌ N/A | ✅ Intelligent algorithm |
| **Line reflow handling** | ❌ N/A | ✅ `autoSplit: true` |
| **Deep slicing** | ❌ N/A | ✅ Handles nested elements across lines |

**Impact:** This is the **biggest missing feature** in CharWrapper. Line splitting is crucial for many professional text animations.

---

### 2. **Accessibility** ⭐ MAJOR

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **aria-label** | ❌ Not implemented | ✅ Auto-added to parent |
| **aria-hidden** | ❌ Not implemented | ✅ Auto-added to split elements |
| **Accessibility modes** | ❌ None | ✅ `aria: "auto"\|"hidden"\|"none"` |
| **Screen reader friendly** | ✅ Yes | ✅ Yes |

**Impact:** CharWrapper now includes accessibility features for screen readers.

---

### 3. **Advanced Features** ⭐ MAJOR

#### Mask/Reveal Effects
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Mask property** | ❌ Not supported | ✅ `mask: "lines"\|"words"\|"chars"` |
| **Automatic masking** | ❌ Manual CSS needed | ✅ Creates wrapper with `overflow: hidden` |
| **Reveal animations** | ⚠️ Possible but manual | ✅ Built-in, easy |

#### Auto-Split & Responsiveness
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Font loading detection** | ❌ Not supported | ✅ `autoSplit: true` + font observer |
| **Resize observer** | ❌ Not supported | ✅ Auto re-splits on resize |
| **Debounced re-splitting** | ❌ N/A | ✅ 200ms debounce |
| **Responsive text** | ⚠️ Manual rewrap() | ✅ Automatic |

#### Text Processing
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **White space reduction** | ✅ `trimWhitespace: true` | ✅ `reduceWhiteSpace: true` |
| **Preserve `<pre>` formatting** | ❌ No | ✅ Honors extra spaces + auto `<br>` |
| **Custom word delimiter** | ❌ Only space | ✅ `wordDelimiter: /regex/` or custom |
| **Ignore elements** | ✅ Via `_exclude_` data attr | ✅ `ignore: ".keep-whole"` |
| **Smart wrap** | ❌ No | ✅ Prevents odd breaks |
| **Deep slice** | ❌ No | ✅ Subdivides nested `<strong>` across lines |

#### Character Grouping (CharWrapper Unique Feature)
| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **Character grouping** | ✅ Advanced grouping by pattern, position, custom functions | ❌ Not Supported |
| **Pattern matching** | ✅ Regex-based grouping | ❌ Not Supported |
| **nth character grouping** | ✅ Every Nth character grouping | ❌ Not Supported |
| **Custom filter functions** | ✅ Full context-aware filters | ❌ Not Supported |
| **Predefined patterns** | ✅ Language-specific diacritics, punctuation groups, etc. | ❌ Not Supported |

**Impact:** CharWrapper's character grouping is a unique feature not available in GSAP SplitText.

---

### 4. **Performance & Optimization**

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **File size** | ~13KB minified (IIFE) | ~14KB (50% smaller after rewrite!) |
| **TypeScript** | ✅ JSDoc with TypeScript compatibility | ✅ Written in TypeScript |
| **Bundle optimization** | ✅ Multiple formats (IIFE, CJS, ESM) | ✅ Tree-shakeable |
| **Performance monitoring** | ❌ No | ✅ Internal optimizations |
| **DocumentFragment batching** | ✅ Reduces DOM reflows significantly | ✅ Optimized |

---

### 5. **API Design**

#### Configuration Syntax
```javascript
// CharWrapper 2.0 - Grouped options
new CharWrapper('.text', {
  wrap: { chars: true, words: true },
  enumerate: { chars: true, includeSpaces: true },
  classes: { char: 'c', word: 'w' },
  tags: { char: 'span' }
});

// GSAP SplitText - Flat options
new SplitText('.text', {
  type: 'chars,words',
  charsClass: 'c++',
  wordsClass: 'w++',
  tag: 'span'
});
```

**Winner:** SplitText is more concise. CharWrapper's grouped approach is more organized but verbose.

#### Class Enumeration
```javascript
// CharWrapper 2.0 - Separate config
enumerate: { chars: true }
// Result: .char .char-001 .char-002

// GSAP SplitText - In class name
charsClass: 'char++'
// Result: .char .char1 .char2
```

**Winner:** SplitText's `++` syntax is more elegant.

---

### 6. **Special Features**

| Feature | CharWrapper 2.0 | GSAP SplitText |
|---------|----------------|----------------|
| **CSS variable indices** | ❌ No | ✅ `propIndex: true` → `--char: 3` |
| **Custom text preparation** | ❌ No | ✅ `prepareText: fn` callback |
| **onSplit callback** | ❌ No | ✅ `onSplit: fn` with auto-timing |
| **onRevert callback** | ❌ No | ✅ `onRevert: fn` |
| **Special char handling** | ✅ Advanced via character groups | ✅ `specialChars: /regex/` or array |
| **Mask arrays** | ❌ No | ✅ Separate `masks` property |
| **Animation presets** | ✅ Built-in GSAP animations | ❌ Not Supported |
| **Text transitions** | ✅ Morph between different text content | ❌ Not Supported |
| **Data attribute selection** | ✅ Structure-driven content organization | ❌ Not Supported |

---

## 🚨 What CharWrapper is MISSING (Critical Features)

### 🔴 1. **LINE SPLITTING** - The Biggest Gap

**Why it matters:** Line splitting is essential for:
- Title reveals that animate line-by-line
- Paragraph entrance animations
- Staggered line effects
- Responsive text that reflows properly

**Example use case:**
```javascript
// SplitText can do this:
const split = new SplitText('.title', { type: 'lines' });
gsap.from(split.lines, {
  y: 100,
  opacity: 0,
  stagger: 0.2
});

// CharWrapper cannot! ❌
```

**Impact Level:** 🔴 **CRITICAL** - This is the #1 feature professionals expect.

---

### 🟢 2. **ACCESSIBILITY (ARIA)** - Now Implemented

**Why it matters:**
- Screen readers can read split text with aria-label
- Legal requirement in many countries (ADA, WCAG 2.1)
- CharWrapper now supports accessibility

**Current state:**
```html
<!-- CharWrapper output (now accessible) -->
<div class="text" aria-label="Hi">
  <span class="char" aria-hidden="true">H</span>
  <span class="char" aria-hidden="true">i</span>
</div>
<!-- Screen reader reads: "Hi" (correct) ✅ -->

<!-- SplitText output (accessible) -->
<div class="text" aria-label="Hi">
  <span class="char" aria-hidden="true">H</span>
  <span class="char" aria-hidden="true">i</span>
</div>
<!-- Screen reader reads: "Hi" (correct) ✅ -->
```

**Impact Level:** 🟢 **RESOLVED** - Now supports accessibility features.

---

### 🟡 3. **MASKING/REVEAL EFFECTS** - Professional Feature

**Why it matters:**
- Clean text reveals without clipping issues
- Professional-looking line-by-line animations
- Proper overflow handling

**Example:**
```javascript
// SplitText
const split = new SplitText('.text', {
  type: 'lines',
  mask: 'lines'  // ✅ Auto-creates masks
});
gsap.from(split.masks, { scaleY: 0, transformOrigin: 'top' });

// CharWrapper
// ❌ Must manually create wrapper elements and CSS
```

**Impact Level:** 🟡 **HIGH** - Very common in professional work.

---

### 🟡 4. **AUTO-SPLIT (Responsive)** - Quality of Life

**Why it matters:**
- Fonts loading late breaks layout
- Window resizing breaks line splits
- Manual rewrapping is tedious

**SplitText solution:**
```javascript
const split = new SplitText('.text', {
  type: 'lines',
  autoSplit: true  // ✅ Auto re-splits on font load & resize
});
```

**CharWrapper workaround:**
```javascript
// ❌ Must manually detect and rewrap
window.addEventListener('resize', debounce(() => {
  wrapper.rewrap();
}, 200));

document.fonts.ready.then(() => {
  wrapper.rewrap();
});
```

**Impact Level:** 🟡 **HIGH** - Essential for responsive sites.

---

### 🟠 5. **SMART WRAP** - Edge Case Handling

**Why it matters:**
- Prevents awkward character-level line breaks
- Better typography control

**Example issue:**
```html
<!-- Without smart wrap -->
<span class="char">H</span>
<span class="char">e</span>  <!-- Line break here! -->
<span class="char">l</span>
<span class="char">l</span>
<span class="char">o</span>
<!-- "He" on one line, "llo" on next - ugly! -->

<!-- With smart wrap (SplitText) -->
<span style="white-space: nowrap;">
  <span class="char">H</span>
  <span class="char">e</span>
  <span class="char">l</span>
  <span class="char">l</span>
  <span class="char">o</span>
</span>
<!-- Word stays together! ✅ -->
```

**Impact Level:** 🟠 **MEDIUM** - Annoying edge case.

---

### 🟠 6. **DEEP SLICE** - Nested Element Handling

**Why it matters:**
- Handles `<strong>`, `<em>`, `<a>` spanning multiple lines
- Prevents vertical expansion of lines

**Example:**
```html
<!-- Input -->
<p>This is <strong>important bold text</strong> here.</p>

<!-- If "bold text" wraps across 2 lines, SplitText subdivides it -->
<!-- CharWrapper strips it or breaks it ❌ -->
```

**Impact Level:** 🟠 **MEDIUM** - Common in CMS content.

---

### 🟠 7. **CSS VARIABLE INDICES** - Modern CSS Integration

**Why it matters:**
- Clean CSS-based animations
- No JS animation needed for simple effects

**SplitText:**
```javascript
new SplitText('.text', { propIndex: true });
```
```css
.char {
  animation-delay: calc(var(--char) * 0.05s);
}
```

**CharWrapper:**
```javascript
// ❌ Not supported, must use GSAP or manual styling
```

**Impact Level:** 🟠 **MEDIUM** - Nice-to-have for CSS animations.

---

### 🟢 8. **CUSTOM WORD DELIMITER** - Edge Case

**Why it matters:**
- Split by custom characters (e.g., `-` or `|`)
- Internationalization needs

**Impact Level:** 🟢 **LOW** - Rare use case.

---

### 🟢 9. **IGNORE SELECTOR** - Convenience

**Why it matters:**
- Skip certain elements (e.g., `<sup>`, `<sub>`)

**Impact Level:** 🟢 **LOW** - Can work around with data attributes.

---

## 📊 Feature Comparison Table

| Feature Category | CharWrapper 2.0 | GSAP SplitText | Winner |
|------------------|----------------|----------------|--------|
| **Basic char/word split** | ✅ Good | ✅ Excellent | Tie |
| **Line splitting** | ❌ None | ✅ Excellent | SplitText |
| **Accessibility** | ✅ Excellent | ✅ Excellent | Tie |
| **Performance** | ✅ Good | ✅ Excellent | SplitText |
| **File size** | 13KB (minified) | 14KB | Tie |
| **TypeScript** | JSDoc with TS compatibility | Native TS | SplitText |
| **Auto-responsiveness** | ❌ Manual | ✅ Auto | SplitText |
| **Masking** | ❌ Manual | ✅ Built-in | SplitText |
| **API simplicity** | Good | Excellent | SplitText |
| **Documentation** | Excellent | Excellent | Tie |
| **Examples** | 17+ demos | Many | Tie |
| **Price** | Free | Free (since v3.13) | Tie |
| **Dependencies** | None | GSAP core | CharWrapper |
| **Custom config** | More verbose | Concise | SplitText |
| **Character grouping** | ✅ Advanced | ❌ None | CharWrapper |
| **Animation presets** | ✅ Built-in | ❌ None | CharWrapper |
| **Text transitions** | ✅ Available | ❌ None | CharWrapper |
| **Data attribute selection** | ✅ Available | ❌ None | CharWrapper |

---

## 💡 When to Use Each

### Use **GSAP SplitText** when:
- ✅ You need **line splitting** (most professional work)
- ✅ Building **responsive** sites with web fonts
- ✅ Need **mask/reveal** effects
- ✅ Want **auto-resplit** on viewport changes
- ✅ Working on **client projects** (proven, supported)
- ✅ Need advanced features (deep slice, custom delimiters, etc.)

### Use **CharWrapper 2.0** when:
- ✅ You **only need chars/words** (no lines)
- ✅ Want **advanced character grouping** capabilities
- ✅ Need **animation presets** for quick effects
- ✅ Want **text transitions** between different content
- ✅ Need **data attribute-driven** content organization
- ✅ Want **TypeScript compatibility** with JSDoc
- ✅ Want comprehensive **accessibility** features
- ✅ Want **zero dependencies** (doesn't require GSAP)
- ✅ Learning/educational purposes
- ✅ Want full control of implementation
- ✅ Building a custom solution

---

## 🎯 Recommendations for CharWrapper Improvement

To make CharWrapper competitive with SplitText, add these features **in priority order:**

### Priority 1: CRITICAL (Must-Have)
1. **Line splitting algorithm** - Core feature gap
2. **autoSplit** - Essential for modern web

### Priority 2: HIGH (Should-Have)
3. **Masking support** - Professional animations
4. **Reduce file size** - Tree-shaking, minification

### Priority 3: MEDIUM (Nice-to-Have)
5. **Smart wrap** - Better typography
6. **Deep slice** - Nested element handling
7. **CSS variable indices** - Modern CSS integration
8. **Callbacks** (onSplit, onRevert)

### Priority 4: LOW (Optional)
9. **Custom word delimiters**
10. **Ignore selectors**
11. **Special char handling**

---

## 🏆 Verdict

**GSAP SplitText remains the clear winner** for professional production use, especially when line splitting is needed. It's:
- 🔴 More feature-complete (14+ advanced features)
- 🔴 Auto-responsive
- 🔴 Written in TypeScript
- 🔴 Industry standard

**CharWrapper 2.0 is excellent for:**
- 📚 Character/word-only animations
- 🎨 Advanced character grouping capabilities
- 🔄 Text transitions between different content
- 🎬 Built-in animation presets
- 📋 Data attribute-driven content organization
- 🚫 Zero dependencies (doesn't require GSAP)
- 🎯 Full control of implementation
- 📖 Educational purposes

---

## 💭 Final Thoughts

CharWrapper 2.0 is well-engineered with modern practices, comprehensive accessibility features, and unique capabilities like character grouping and animation presets. While **GSAP SplitText** remains the go-to for professional work requiring line splitting, **CharWrapper** provides a capable alternative for character/word-based animations with additional features.

**If you need line splitting: Use SplitText.**
**If you want advanced grouping, animation presets, or zero dependencies: CharWrapper is excellent!**

The most valuable features CharWrapper lacks:
1. 🔴 **Line splitting** (dealbreaker for most pros)
2. 🟡 **Auto-split responsiveness** (quality of life)
3. 🟡 **Masking/reveal effects** (professional animations)

---

**Bottom line:** Both libraries serve different needs. GSAP SplitText for professional line-splitting work, CharWrapper for advanced character manipulation with extra features. Both are production-ready tools! 🚀
# CharWrapper 2.0 - Quick Start Guide

Get up and running with CharWrapper in under 5 minutes! 🚀

---

## 🎯 1. Open the Examples (Easiest Way to Start!)

Double-click or open in your browser:

```
examples/index.html
```

This showcases all 4 example types. Click any card to see it in action!

---

## ⚡ 2. Create Your First Animation (30 seconds)

Create a new HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First CharWrapper Animation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    h1 {
      font-size: 4rem;
      color: white;
    }

    .char {
      display: inline-block;
    }
  </style>
</head>
<body>
  <h1 class="text">Hello World</h1>

  <!-- Load GSAP from CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

  <!-- Load CharWrapper -->
  <script type="module">
    import CharWrapper from './src/CharWrapper.js';

    // Create wrapper
    const wrapper = new CharWrapper('.text', {
      wrap: { chars: true }
    });

    // Wrap the text
    const { chars } = wrapper.wrap();

    // Animate!
    gsap.from(chars, {
      opacity: 0,
      y: 50,
      rotation: -180,
      stagger: 0.05,
      duration: 1,
      ease: 'back.out(1.7)'
    });
  </script>
</body>
</html>
```

**That's it!** Open this file in your browser. ✨

---

## 🎨 3. Common Patterns

### Pattern: Fade In Stagger
```javascript
import CharWrapper from './src/CharWrapper.js';

const wrapper = new CharWrapper('.text', {
  wrap: { chars: true }
});
const { chars } = wrapper.wrap();

gsap.from(chars, {
  opacity: 0,
  stagger: 0.05
});
```

### Pattern: Slide Up
```javascript
gsap.from(chars, {
  opacity: 0,
  y: 30,
  stagger: 0.03,
  ease: 'power2.out'
});
```

### Pattern: Scale & Rotate
```javascript
gsap.from(chars, {
  scale: 0,
  rotation: 360,
  stagger: 0.04,
  ease: 'back.out(2)'
});
```

### Pattern: Words + Characters
```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { words: true, chars: true }
});
const { words, chars } = wrapper.wrap();

// Animate words
gsap.from(words, {
  opacity: 0,
  x: -50,
  stagger: 0.1
});

// Or animate individual characters
gsap.from(chars, {
  opacity: 0,
  stagger: 0.02
});
```

### Pattern: Enumerated Classes
```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  enumerate: { chars: true } // Adds .char-001, .char-002, etc.
});
const { chars } = wrapper.wrap();

// Now you can target specific characters in CSS!
```

CSS:
```css
.char-001 { color: red; }
.char-002 { color: blue; }
.char-003 { color: green; }
```

### Pattern: Hover Effects
```javascript
const { chars } = wrapper.wrap();

chars.forEach(char => {
  char.addEventListener('mouseenter', () => {
    gsap.to(char, { scale: 1.5, duration: 0.3 });
  });

  char.addEventListener('mouseleave', () => {
    gsap.to(char, { scale: 1, duration: 0.3 });
  });
});
```

### Pattern: Scroll-Triggered
```javascript
import CharWrapper from './src/CharWrapper.js';
gsap.registerPlugin(ScrollTrigger);

const wrapper = new CharWrapper('.text', {
  wrap: { chars: true }
});
const { chars } = wrapper.wrap();

gsap.from(chars, {
  opacity: 0,
  y: 30,
  stagger: 0.02,
  scrollTrigger: {
    trigger: '.text',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1
  }
});
```

---

## 🔧 4. Configuration Cheat Sheet

```javascript
new CharWrapper(selector, {
  // What to wrap
  wrap: {
    chars: true,        // Wrap individual characters
    words: false,       // Wrap words
    spaces: false,      // Wrap space characters
    specialChars: false // Wrap !?.,; etc.
  },

  // Add numbered classes (.char-001, .char-002)
  enumerate: {
    chars: false,             // Enable char numbering
    words: false,             // Enable word numbering
    includeSpaces: false,     // Include spaces in count
    includeSpecialChars: false // Include special chars in count
  },

  // CSS class names
  classes: {
    char: 'char',           // Base char class
    word: 'word',           // Base word class
    space: 'char--space',   // Space class
    special: 'char--special', // Special char class
    regular: 'char--regular'  // Regular char class
  },

  // HTML tags
  tags: {
    char: 'span', // span, div, i, em, strong, mark
    word: 'span'
  },

  // Space replacement
  replaceSpaceWith: '\xa0', // Non-breaking space

  // Performance (usually keep defaults)
  performance: {
    useBatching: true,    // DocumentFragment batching
    cacheSelectors: true  // Cache DOM queries
  }
});
```

---

## 🎯 5. Essential Methods

```javascript
const wrapper = new CharWrapper('.text', config);

// Wrap the text
const { chars, words } = wrapper.wrap();

// Get elements later
const allChars = wrapper.getChars();
const allWords = wrapper.getWords();

// Get specific element
const firstChar = wrapper.getChar(0);
const secondWord = wrapper.getWord(1);

// Filter by type
const regularChars = wrapper.getCharsByType('regular');
const spaces = wrapper.getCharsByType('space');
const specialChars = wrapper.getCharsByType('special');

// Check state
if (wrapper.isWrapped()) {
  // ...
}

// Unwrap (restore original)
wrapper.unwrap();

// Rewrap (unwrap + wrap)
wrapper.rewrap();

// Clean up (important!)
wrapper.destroy();
```

---

## 💡 6. Tips & Tricks

### Tip 1: Always Destroy
```javascript
// In single-page apps, always clean up!
window.addEventListener('beforeunload', () => {
  wrapper.destroy();
});
```

### Tip 2: Use Static Factory
```javascript
// Quick one-liner
const wrapper = CharWrapper.create('.text', { wrap: { chars: true } });
```

### Tip 3: Combine with CSS
```css
.char {
  display: inline-block;
  transition: all 0.3s;
}

.char:hover {
  color: #ff6b6b;
  transform: translateY(-5px);
}
```

### Tip 4: Filter Before Animating
```javascript
const { chars } = wrapper.wrap();

// Only animate letters (not spaces)
const regularChars = wrapper.getCharsByType('regular');
gsap.from(regularChars, { opacity: 0, stagger: 0.05 });
```

### Tip 5: Multiple Instances
```javascript
const wrappers = CharWrapper.wrapMultiple(
  ['.title', '.subtitle', '.description'],
  { wrap: { chars: true } }
);

// Clean up all at once
wrappers.forEach(w => w.destroy());
```

---

## 🚨 Common Mistakes

### ❌ Don't: Forget to set display
```css
/* Without this, wrapped chars won't flow correctly */
.char {
  display: inline-block; /* Add this! */
}
```

### ❌ Don't: Forget to destroy
```javascript
// Memory leak in SPAs!
const wrapper = new CharWrapper('.text', config);
wrapper.wrap();
// ... never destroyed
```

✅ **Do:** Always clean up
```javascript
const wrapper = new CharWrapper('.text', config);
wrapper.wrap();

// Later...
wrapper.destroy();
```

### ❌ Don't: Wrap twice without unwrapping
```javascript
wrapper.wrap();
wrapper.wrap(); // Error! Already wrapped
```

✅ **Do:** Use rewrap() or unwrap first
```javascript
wrapper.wrap();
wrapper.rewrap(); // Correct!
// OR
wrapper.unwrap();
wrapper.wrap(); // Also correct!
```

---

## 📚 Next Steps

1. ✅ You've created your first animation!
2. 🎨 Explore `examples/` folder for more patterns
3. 📖 Read `README.md` for complete API docs
4. 🔄 Check `MIGRATION_GUIDE.md` if upgrading from v1.0
5. 💡 Experiment with different GSAP eases and effects!

---

## 🆘 Need Help?

- Check the examples: `examples/index.html`
- Read the full docs: `README.md`
- See the migration guide: `MIGRATION_GUIDE.md`
- Review the summary: `SUMMARY.md`

---

## 📦 Package Distribution

CharWrapper is distributed with multiple build formats to support different environments:

| File | Format | Size | Use Case |
|------|--------|------|----------|
| `dist/charwrapper.min.js` | IIFE | ~13KB | Direct browser inclusion |
| `dist/charwrapper.cjs.min.js` | CommonJS | ~13KB | Node.js compatibility |
| `dist/charwrapper.js` | IIFE | ~36KB | Development with source maps |
| `dist/charwrapper.cjs.js` | CommonJS | ~36KB | Node.js compatibility |
| `dist/esm/` | ES Modules | ~40KB | NPM package (tree-shakeable) |

### Module Resolution

When using bundlers, CharWrapper properly exports different formats based on your environment:

```javascript
// In bundler environments (Webpack, Vite, etc.) - uses ES modules
import CharWrapper from 'charwrapper';

// In browsers with native modules - uses ES modules
<script type="module">
  import CharWrapper from 'charwrapper';
</script>

// In browsers without modules - uses IIFE version
<script src="https://cdn.jsdelivr.net/npm/charwrapper@latest/dist/charwrapper.min.js"></script>
```

---

## 🎉 You're Ready!

CharWrapper 2.0 is designed to be simple yet powerful.

**Happy animating!** 🚀✨
