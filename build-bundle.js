/**
 * Bundle script for CharWrapper
 * Creates a single-file bundle for browser usage
 */

import * as esbuild from 'esbuild';

// Build IIFE bundle for browser (exposes CharWrapper as global)
await esbuild.build({
  entryPoints: ['dist/esm/CharWrapper.js'],
  bundle: true,
  format: 'iife',
  globalName: 'CharWrapperModule',
  outfile: 'dist/charwrapper.js',
  sourcemap: true,
  target: 'es2020',
  platform: 'browser',
  banner: {
    js: `/**
 * CharWrapper v2.0.0 - Text Character Wrapper for GSAP Animations
 * @author Robert Wildling
 * @license MIT
 */`
  },
  footer: {
    js: `
// Export default class as global CharWrapper
if (typeof window !== 'undefined') {
  window.CharWrapper = CharWrapperModule.default || CharWrapperModule.CharWrapper;
}`
  }
});

// Build minified version
await esbuild.build({
  entryPoints: ['dist/esm/CharWrapper.js'],
  bundle: true,
  format: 'iife',
  globalName: 'CharWrapperModule',
  outfile: 'dist/charwrapper.min.js',
  sourcemap: true,
  minify: true,
  target: 'es2020',
  platform: 'browser',
  banner: {
    js: `/** CharWrapper v2.0.0 | MIT License | github.com/yourusername/charwrapper */`
  },
  footer: {
    js: `if(typeof window!=='undefined'){window.CharWrapper=CharWrapperModule.default||CharWrapperModule.CharWrapper;}`
  }
});

console.log('✓ Bundle created: dist/charwrapper.js');
console.log('✓ Minified bundle created: dist/charwrapper.min.js');
