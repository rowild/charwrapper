/**
 * Bundle script for CharWrapper
 * Creates multiple bundles for different environments
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

// Build CommonJS bundle for Node compatibility
await esbuild.build({
  entryPoints: ['dist/esm/CharWrapper.js'],
  bundle: true,
  format: 'cjs',
  outfile: 'dist/charwrapper.cjs.js',
  sourcemap: true,
  target: 'node16',
  platform: 'node',
  banner: {
    js: `/**
 * CharWrapper v2.0.0 - Text Character Wrapper for GSAP Animations
 * @author Robert Wildling
 * @license MIT
 */`
  }
});

// Build minified IIFE version
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
    js: `/** CharWrapper v2.0.0 | MIT License | github.com/rowild/charwrapper */`
  },
  footer: {
    js: `if(typeof window!=='undefined'){window.CharWrapper=CharWrapperModule.default||CharWrapperModule.CharWrapper;}`
  }
});

// Build minified CommonJS version
await esbuild.build({
  entryPoints: ['dist/esm/CharWrapper.js'],
  bundle: true,
  format: 'cjs',
  outfile: 'dist/charwrapper.cjs.min.js',
  sourcemap: true,
  minify: true,
  target: 'node16',
  platform: 'node',
  banner: {
    js: `/** CharWrapper v2.0.0 | MIT License | github.com/rowild/charwrapper */`
  }
});

console.log('✓ IIFE bundle created: dist/charwrapper.js');
console.log('✓ CommonJS bundle created: dist/charwrapper.cjs.js');
console.log('✓ Minified IIFE bundle created: dist/charwrapper.min.js');
console.log('✓ Minified CommonJS bundle created: dist/charwrapper.cjs.min.js');