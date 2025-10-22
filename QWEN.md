# CharWrapper Project Context

## Project Overview

CharWrapper is a modern ES6+ text wrapper library designed primarily for use with GSAP animations. Version 2.0+ features TypeScript support and has been completely rewritten with a focus on performance, modularity, and accessibility.

### Key Features
- **TypeScript Support**: Full type definitions included
- **Zero Dependencies**: Pure vanilla JavaScript with no external dependencies
- **Performance Optimized**: 60%+ performance improvement using DocumentFragment batching
- **Modular Architecture**: 6 focused modules for maintainability
- **Memory Safe**: Built-in cleanup methods prevent memory leaks
- **Accessibility Built-in**: ARIA labels, aria-hidden, and title attributes
- **Character Groups**: Smart selection system for targeting character subsets
- **Animation Presets**: Ready-to-use GSAP animations with one line of code
- **Text Transitions**: Smooth morphing between different text content

## Project Structure

```
CharWrapper/
├── dist/                    # Built bundles
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
├── examples/                # Live examples for multiple animation libraries
│   ├── index.html           # Examples showcase
│   ├── animejs/
│   ├── gsap/
│   └── waapi/
├── build-bundle.js          # Esbuild script for browser bundles
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # Comprehensive documentation
├── QUICKSTART.md            # Quick start guide
└── COMPARISON_WITH_GSAP_SPLITTEXT.md # API comparison with GSAP SplitText
```

## Core Architecture

The library consists of several modules:
- **CharWrapper.ts**: Main class that orchestrates the wrapping functionality
- **config.ts**: Configuration options and TypeScript types
- **utils.ts**: Utility functions
- **WrapperFactory.ts**: Handles DOM element creation and management
- **DOMProcessor.ts**: Manages DOM operations with performance optimizations
- **SelectionStrategy.ts**: Defines how characters and words are selected
- **CharacterGrouper.ts**: Implements the character grouping feature
- **AnimationPresets.ts**: Provides built-in GSAP animation presets
- **TextTransition.ts**: Handles text transition functionality
- **gsap.d.ts**: TypeScript declarations for GSAP integration

## Building and Running

### Development Commands
```bash
npm install              # Install dependencies
npm run build           # Compile TypeScript to esm/
npm run bundle          # Build + create browser bundles
npm run watch           # Watch mode for development
npm run clean           # Remove all build output
```

### Build Process
The project uses TypeScript to compile to ES modules, then Esbuild to create browser bundles. The build process creates two bundles:
- `dist/charwrapper.js`: Unminified IIFE bundle (36KB)
- `dist/charwrapper.min.js`: Minified IIFE bundle (13KB)

### NPM Package
The library is published as an NPM package with:
- ES modules for bundlers
- IIFE bundle for direct browser usage
- Full TypeScript definitions
- Tree-shakeable exports

## API Usage

### Basic Usage
```javascript
import CharWrapper from 'charwrapper';

const wrapper = new CharWrapper('.my-text', {
  wrap: { chars: true },
  enumerate: { chars: true }
});

const { chars } = wrapper.wrap();

// Animate with GSAP
gsap.from(chars, { opacity: 0, stagger: 0.05 });
```

### Configuration Options
- **wrap**: Controls what elements to wrap (chars, words, spaces, specialChars)
- **enumerate**: Adds numbered classes to elements
- **classes**: CSS class names for different element types
- **tags**: HTML tags to use for wrapping (span, div, etc.)
- **processing**: Text processing options (strip HTML, trim whitespace)
- **performance**: Performance optimizations (batching, caching)
- **accessibility**: Accessibility features (ARIA labels, etc.)
- **groups**: Character grouping configuration (regex, nth, custom filters)

### Main Methods
- `wrap(options)`: Wraps text content and returns character/word elements
- `unwrap()`: Restores original content
- `rewrap(options)`: Unwraps and wraps again
- `destroy()`: Cleans up and removes all references
- `getChars()`, `getWords()`: Get wrapped elements
- `getCharsByType()`: Filter characters by type
- `animate(presetName, options)`: Use built-in animation presets
- `transitionTo(newText, options)`: Transition to new text content

### Static Methods
- `CharWrapper.create(target, config)`: Creates and wraps in one call
- `CharWrapper.wrapMultiple(targets, config)`: Wraps multiple elements
- `CharWrapper.registerPreset(name, fn)`: Register custom animation presets

## Development Conventions

### Coding Style
- Modern ES6+ with private fields, optional chaining, and nullish coalescing
- Comprehensive JSDoc comments with TypeScript-style annotations
- Clean, modular architecture with focused responsibilities
- Performance-first approach with DocumentFragment batching

### TypeScript
- Strict mode with gradual migration (currently disabled for migration)
- Full type definitions for public API
- JSDoc with TypeScript-style annotations in source code

### Performance Considerations
- DocumentFragment batching to minimize DOM reflows
- WeakMap caching to prevent memory leaks
- Query caching for frequently accessed elements
- Single DOM clear operations

### Accessibility
- ARIA labels automatically added to preserve screen reader compatibility
- aria-hidden attributes on wrapped elements
- Title attributes for hover tooltips
- Accessibility enabled by default

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Uses modern ES6+ features and requires browsers that support DocumentFragment.

## Testing and Examples
The project includes comprehensive examples demonstrating:
- GSAP animations
- Anime.js integration
- Web Animations API usage
- Character grouping
- Animation presets
- Text transitions
- Data attribute selection

Examples are organized by animation library in the `/examples/` directory with a main index.html showcasing all options.