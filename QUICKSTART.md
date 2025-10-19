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

## 🎉 You're Ready!

CharWrapper 2.0 is designed to be simple yet powerful.

**Happy animating!** 🚀✨
