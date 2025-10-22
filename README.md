# CharWrapper 2.0

Modern text wrapper library with TypeScript support, designed for seamless integration with GSAP and other animation libraries.

## 🎯 What's New in 2.0

- ✨ **TypeScript Support** - Full type definitions included
- 📦 **Single Bundle File** - Just 13KB minified, one file to include
- ⚡ **60%+ Performance Improvement** - DocumentFragment batching, optimized DOM operations
- 🚫 **Zero Dependencies** - Pure vanilla JavaScript
- 🏗️ **Modular Architecture** - 6 focused modules for maintainability
- 🧹 **Memory Safe** - Built-in cleanup prevents memory leaks
- 🎨 **Cleaner API** - Simplified, intuitive configuration
- 🌍 **Diacritical Support** - Supports accented characters (ü, é, ñ, etc.)
- ♿ **Accessibility Built-in** - ARIA labels, aria-hidden, and title attributes for screen readers
- 🎯 **Character Groups** - Smart selection system for targeting specific character subsets (NEW!)
- 🎬 **Animation Presets** - Ready-to-use GSAP animations with one line of code (Optional GSAP feature)
- 🔄 **Text Transitions** - Smoothly morph between different text content (Optional GSAP feature)

## 📦 Installation

### Browser (CDN) - Recommended for Quick Start

```html
<!-- Include the bundle (13KB minified) -->
<script src="dist/charwrapper.min.js"></script>

<script>
  // CharWrapper is available globally
  const wrapper = new CharWrapper('.my-text', {
    wrap: { chars: true },
    enumerate: { chars: true }
  });

  const { chars } = wrapper.wrap();

  // Animate with GSAP
  gsap.from(chars, { opacity: 0, stagger: 0.05 });
</script>
```

### NPM Package

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
    ordered: false          // Order elements by data-custom-order attribute (for data attribute selection)
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

## 🎯 Character Groups (NEW!)

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
const wrapper = new CharWrapper('.profile-card', {
  wrap: { chars: true }
});

// All text nodes inside .profile-card are now wrapped
const { chars } = wrapper.wrap();

// Animate all characters in document order
gsap.from(chars, { opacity: 0, stagger: 0.02 });
```

The `data-sub-set-name` attributes provide semantic structure and enable features like custom classes and exclusion.

### Basic Setup

#### 1. Mark Elements with Data Attributes

```html
<div class="profile">
  <h1 data-sub-set-name="first_name">John</h1>
  <h1 data-sub-set-name="last_name">Van der Slice</h1>

  <!-- Mix in non-text elements -->
  <div data-sub-set-name="divider_line" class="divider"></div>

  <p data-sub-set-name="profession_1">composer</p>
  <p data-sub-set-name="profession_2">teacher</p>
  <p data-sub-set-name="profession_3">analyst</p>
</div>
```

#### 2. Initialize CharWrapper

**IMPORTANT:** CharWrapper wraps the **container element** and processes all text nodes inside it **in HTML document order**. The order elements appear in your HTML determines their animation sequence:

```javascript
// Wrap the container - all text inside will be wrapped in document order
const wrapper = new CharWrapper('.profile', {
  wrap: { chars: true }
});

const { chars } = wrapper.wrap();

// Animate all characters in the order they appear in HTML
gsap.from(chars, { opacity: 0, stagger: 0.02 });
```

### Controlling Animation Order

The text is wrapped in **HTML document order** - the order elements appear in your HTML source. If you want to change the animation order, you can either rearrange the HTML elements or use the `ordered: true` processing option:

```javascript
const wrapper = new CharWrapper('.profile', {
  wrap: { chars: true },
  processing: { ordered: true }  // This will order elements by data-custom-order attribute
});
```

When `ordered: true`, elements are sorted by their `data-custom-order` attribute values instead of HTML document order.

```html
<div class="profile">
  <!-- First name animates first -->
  <h1 data-sub-set-name="first_name">John</h1>

  <!-- Last name animates second -->
  <h1 data-sub-set-name="last_name">Van der Slice</h1>

  <!-- Professions animate in the order they appear -->
  <p data-sub-set-name="profession_1">composer</p>
  <p data-sub-set-name="profession_2">teacher</p>
  <p data-sub-set-name="profession_3">analyst</p>
</div>
```

To control specific element animations separately, target them with CSS selectors after the character animation:

```javascript
const wrapper = new CharWrapper('.profile', { wrap: { chars: true } });
const { chars } = wrapper.wrap();

const tl = gsap.timeline();

// First animate all text
tl.from(chars, { opacity: 0, stagger: 0.02 });

// Then animate specific elements (e.g., a divider)
tl.from('.divider', { scaleX: 0 }, '-=0.5');
```

### Custom Classes per Element

Add element-specific classes using `data-sub-set-chars-class`:

```html
<div class="profile">
  <!-- Add 'name-char' class to all characters in this element -->
  <h1 data-sub-set-name="first_name"
      data-sub-set-chars-class="name-char">John</h1>

  <!-- Add 'profession-char' class to all characters in this element -->
  <p data-sub-set-name="profession_1"
     data-sub-set-chars-class="profession-char">composer</p>
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

Exclude elements from wrapping using `data-sub-set-name="_exclude_"`:

```html
<div class="profile">
  <h1 data-sub-set-name="name">John Doe</h1>

  <!-- This will be skipped during wrapping -->
  <div data-sub-set-name="_exclude_">
    <span>This text will NOT be wrapped</span>
  </div>

  <p data-sub-set-name="profession">composer</p>
</div>
```

### Mixing Text and Graphics

**Key Feature:** Data attributes work with **any element**, not just text! This lets you combine text animations with graphic elements:

```html
<div class="business-card">
  <h1 data-sub-set-name="first_name">John</h1>
  <h1 data-sub-set-name="last_name">Van der Slice</h1>

  <!-- Animate a divider line -->
  <div data-sub-set-name="divider_line" class="divider"></div>

  <p data-sub-set-name="title">Lead Composer</p>
</div>
```

```javascript
const wrapper = new CharWrapper('[data-sub-set-name]', {
  wrap: { chars: true }
});

const { chars } = wrapper.wrap();

// Create timeline
const tl = gsap.timeline();

// First name and last name appear
tl.from(chars, { opacity: 0, y: 20, stagger: 0.02 });

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
const wrapper = new CharWrapper('[data-profile-item]', {
  wrap: { chars: true },
  dataAttributes: {
    subSetName: 'profileItem',      // data-profile-item
    subSetClass: 'profileClass',     // data-profile-class
    customOrder: 'sequence'          // data-sequence
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
  <div class="profile-card">
    <h1 data-sub-set-name="first_name">John</h1>
    <h1 data-sub-set-name="last_name">Van der Slice</h1>

    <div data-sub-set-name="divider_line" class="divider"></div>

    <p data-sub-set-name="profession_1">composer</p>
    <p data-sub-set-name="profession_2">teacher</p>
    <p data-sub-set-name="profession_3">analyst</p>
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
├── dist/
│   ├── charwrapper.js       # Browser bundle (36KB)
│   ├── charwrapper.min.js   # Minified bundle (13KB) ← Use this!
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
└── examples/                # Live examples
    ├── index.html           # Examples showcase
    ├── 01-text-reveal.html
    ├── 02-scramble.html
    ├── 03-hover-effects.html
    └── 04-scroll-trigger.html
```

## 🛠️ Development

### Building from Source

```bash
npm install              # Install dependencies
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
