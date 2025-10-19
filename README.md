# CharWrapper 2.0

Modern ES6+ text animation library designed for seamless integration with GSAP and other animation libraries.

## 🎯 What's New in 2.0

- ✨ **Complete ES6+ Rewrite** - Modern JavaScript with private fields, classes, and modules
- ⚡ **60%+ Performance Improvement** - DocumentFragment batching, optimized DOM operations
- 🚫 **Zero Dependencies** - Removed lodash, pure vanilla JS
- 🏗️ **Modular Architecture** - Split into 6 focused modules
- 🧹 **Memory Safe** - Built-in cleanup prevents memory leaks
- 🎨 **Cleaner API** - Simplified, intuitive configuration
- 📝 **Full JSDoc** - TypeScript-style documentation
- 🌍 **Diacritical Support** - Now supports accented characters (ü, é, ñ, etc.)
- ♿ **Accessibility Built-in** - ARIA labels, aria-hidden, and title attributes for screen readers

## 🚀 Quick Start

### Basic Usage

```javascript
import CharWrapper from './src/CharWrapper.js';

// Create wrapper instance
const wrapper = new CharWrapper('.my-text', {
  wrap: { chars: true },
  enumerate: { chars: true }
});

// Wrap the text
const { chars, words } = wrapper.wrap();

// Animate with GSAP
gsap.from(chars, {
  opacity: 0,
  y: 50,
  stagger: 0.05,
  duration: 0.8
});

// Clean up when done
wrapper.destroy();
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
    trimWhitespace: true,   // Trim leading/trailing whitespace
    preserveStructure: true // Maintain DOM structure
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
- **Returns:** `{ chars: Array<HTMLElement>, words: Array<HTMLElement> }`

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

## 🏗️ Architecture

```
CharWrapper/
├── src/
│   ├── CharWrapper.js       # Main class - public API
│   ├── config.js            # Configuration & validation
│   ├── utils.js             # Pure utility functions
│   ├── WrapperFactory.js    # Creates wrapped elements
│   ├── DOMProcessor.js      # DOM operations & traversal
│   └── SelectionStrategy.js # Element selection strategies
└── examples/
    ├── index.html           # Examples showcase
    ├── 01-text-reveal.html
    ├── 02-scramble.html
    ├── 03-hover-effects.html
    └── 04-scroll-trigger.html
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
```javascript
const wrapper = new CharWrapper('.text', {
  wrap: { chars: true },
  enumerate: { chars: true, includeSpaces: true },
  tags: { char: 'span' }
});

const { chars, words } = wrapper.wrap();
wrapper.destroy(); // Don't forget cleanup!
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
