# CharWrapper Bundle Information

## Single-File Bundle Created ✓

All examples now use **ONE single file** instead of multiple ES6 modules!

### Bundle Files Created:

1. **`dist/charwrapper.js`** (36KB) - Full bundle with comments and source maps
2. **`dist/charwrapper.min.js`** (13KB) - Minified production version

### How to Use the Bundle:

```html
<!-- Just include ONE script tag -->
<script src="dist/charwrapper.js"></script>

<!-- Then use CharWrapper directly (no import needed!) -->
<script>
  const wrapper = new CharWrapper('#my-text', {
    wrap: { chars: true },
    enumerate: { chars: true }
  });

  const { chars } = wrapper.wrap();

  // Animate with GSAP
  gsap.from(chars, { opacity: 0, stagger: 0.05 });
</script>
```

### What Changed:

**Before (ES6 Modules - Multiple Files):**
```html
<script type="module">
  import CharWrapper from '../src/CharWrapper.js';
  const wrapper = new CharWrapper('#text', config);
</script>
```

**After (Single Bundle - ONE File):**
```html
<script src="dist/charwrapper.js"></script>
<script>
  // Simple and clean!
  const wrapper = new CharWrapper('#text', config);
</script>
```

### Folder Structure:

```
dist/
├── charwrapper.js        ← Browser bundle (use this!)
├── charwrapper.min.js    ← Minified for production
├── charwrapper.js.map    ← Source map
├── charwrapper.min.js.map
└── esm/                  ← ES modules for npm (auto-handled)
    ├── CharWrapper.js
    ├── CharWrapper.d.ts
    ├── config.js
    ├── utils.js
    └── ... (all modules)
```

### Building the Bundle:

```bash
npm run bundle   # Compiles TypeScript + creates bundle
npm run build    # Just compiles TypeScript to esm/
npm run watch    # Watch mode for development
npm run clean    # Remove all build output
```

### Examples Updated:

✓ `01-text-reveal.html`
✓ `02-scramble.html`
✓ `03-hover-effects.html`
✓ `04-scroll-trigger.html`
✓ `index.html`

All examples now load from the single bundle file!

### Production Use:

For production websites, use the minified version:

```html
<script src="dist/charwrapper.min.js"></script>
```

Only **13KB minified** - perfect for web performance!

### NPM Package Use:

When installed via npm, the package automatically provides the right files:

```javascript
// ES Module import (Node.js / bundlers)
import CharWrapper from 'charwrapper';

const wrapper = new CharWrapper('#text', { wrap: { chars: true } });
```

The package.json exports handle everything automatically!
