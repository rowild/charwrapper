/**
 * AnimationPresets
 *
 * Built-in animation presets for CharWrapper.
 * Provides ready-to-use GSAP animations without writing custom code.
 */

import { logger } from './utils.js';

/**
 * Options for animation presets
 */
export interface PresetOptions {
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  loop?: boolean;
  yoyo?: boolean;
  groups?: string; // Target specific character group
  [key: string]: any; // Allow custom options
}

/**
 * Preset animation function type
 */
export type PresetFunction = (
  elements: HTMLElement[],
  options: PresetOptions
) => gsap.core.Timeline | gsap.core.Tween;

/**
 * Registry of animation presets
 */
const presetRegistry: Map<string, PresetFunction> = new Map();

/**
 * Default options for presets
 */
const DEFAULT_OPTIONS: PresetOptions = {
  duration: 0.8,
  stagger: 0.03,
  delay: 0,
  ease: 'power2.out',
};

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

/**
 * Fade in with stagger
 */
presetRegistry.set('fadeInStagger', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.from(elements, {
    opacity: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Slide in from bottom
 */
presetRegistry.set('slideInUp', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.from(elements, {
    opacity: 0,
    y: 50,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Slide in from top
 */
presetRegistry.set('slideInDown', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.from(elements, {
    opacity: 0,
    y: -50,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Slide in from left
 */
presetRegistry.set('slideInLeft', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.from(elements, {
    opacity: 0,
    x: -50,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Slide in from right
 */
presetRegistry.set('slideInRight', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.from(elements, {
    opacity: 0,
    x: 50,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Scale in from center
 */
presetRegistry.set('scaleIn', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ease: 'back.out(1.7)', ...options };
  return gsap.from(elements, {
    opacity: 0,
    scale: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Rotate in
 */
presetRegistry.set('rotateIn', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ease: 'back.out(2)', ...options };
  return gsap.from(elements, {
    opacity: 0,
    rotation: -180,
    scale: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Elastic bounce entrance
 */
presetRegistry.set('elasticBounce', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ease: 'elastic.out(1, 0.5)', duration: 1.2, ...options };
  return gsap.from(elements, {
    opacity: 0,
    y: -100,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Typewriter effect
 */
presetRegistry.set('typewriter', (elements, options) => {
  const opts = { stagger: 0.05, duration: 0, ...options };

  // Set all invisible first
  gsap.set(elements, { opacity: 0 });

  return gsap.to(elements, {
    opacity: 1,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: 'none',
  });
});

/**
 * Wave pattern entrance
 */
presetRegistry.set('wave', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, stagger: 0.02, ...options };
  const amplitude = options.amplitude || 30;

  return gsap.from(elements, {
    opacity: 0,
    y: (index) => Math.sin(index * 0.5) * amplitude,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Glitch effect
 */
presetRegistry.set('glitch', (elements, options) => {
  const opts = { duration: 0.05, stagger: 0.01, ...options };

  const tl = gsap.timeline();

  elements.forEach((el, i) => {
    tl.to(el, {
      x: () => Math.random() * 10 - 5,
      y: () => Math.random() * 10 - 5,
      duration: opts.duration,
      repeat: 5,
      yoyo: true,
      ease: 'none',
    }, i * (opts.stagger || 0.01));
  });

  return tl;
});

// ============================================
// LOOP ANIMATIONS
// ============================================

/**
 * Floating wave loop
 */
presetRegistry.set('floatingWave', (elements, options) => {
  const opts = { duration: 2, stagger: 0.05, ...options };
  const amplitude = options.amplitude || 10;

  return gsap.to(elements, {
    y: (index) => Math.sin(index * 0.5) * amplitude,
    duration: opts.duration,
    stagger: opts.stagger,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});

/**
 * Pulse/breathing effect
 */
presetRegistry.set('pulse', (elements, options) => {
  const opts = { duration: 1.5, stagger: 0.02, ...options };

  return gsap.to(elements, {
    scale: 1.1,
    duration: opts.duration,
    stagger: opts.stagger,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});

/**
 * Color cycle
 */
presetRegistry.set('colorCycle', (elements, options) => {
  const opts = { duration: 2, stagger: 0.1, ...options };
  const colors = options.colors || ['#ff6b9d', '#4ecdc4', '#ffd93d', '#95e1d3'];

  const tl = gsap.timeline({ repeat: -1 });

  colors.forEach((color) => {
    tl.to(elements, {
      color: color,
      duration: opts.duration,
      stagger: opts.stagger,
      ease: 'none',
    });
  });

  return tl;
});

/**
 * Shimmer effect
 */
presetRegistry.set('shimmer', (elements, options) => {
  const opts = { duration: 0.3, stagger: 0.03, ...options };

  return gsap.to(elements, {
    opacity: 0.3,
    duration: opts.duration,
    stagger: opts.stagger,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
});

// ============================================
// EXIT ANIMATIONS
// ============================================

/**
 * Fade out
 */
presetRegistry.set('fadeOut', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.to(elements, {
    opacity: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Slide out down
 */
presetRegistry.set('slideOutDown', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return gsap.to(elements, {
    opacity: 0,
    y: 50,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Scale out
 */
presetRegistry.set('scaleOut', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, ease: 'back.in(1.7)', ...options };
  return gsap.to(elements, {
    opacity: 0,
    scale: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: opts.ease,
  });
});

/**
 * Explode - characters scatter in random directions
 */
presetRegistry.set('explode', (elements, options) => {
  const opts = { ...DEFAULT_OPTIONS, duration: 1.2, ...options };

  return gsap.to(elements, {
    opacity: 0,
    x: () => (Math.random() - 0.5) * 200,
    y: () => (Math.random() - 0.5) * 200,
    rotation: () => (Math.random() - 0.5) * 720,
    scale: 0,
    duration: opts.duration,
    stagger: opts.stagger,
    delay: opts.delay,
    ease: 'power2.in',
  });
});

// ============================================
// INTERACTIVE ANIMATIONS
// ============================================

/**
 * Auto-attach hover bounce effect
 */
presetRegistry.set('hoverBounce', (elements, options) => {
  const opts = { duration: 0.3, ...options };

  elements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        y: -20,
        duration: opts.duration,
        ease: 'power2.out',
      });
      gsap.to(el, {
        y: 0,
        duration: 0.5,
        delay: opts.duration,
        ease: 'bounce.out',
      });
    });
  });

  // Return empty timeline (interactive setup only)
  return gsap.timeline();
});

/**
 * Auto-attach click spin effect
 */
presetRegistry.set('clickSpin', (elements, options) => {
  const opts = { duration: 0.6, ...options };

  elements.forEach((el) => {
    el.addEventListener('click', () => {
      gsap.to(el, {
        rotation: '+=360',
        duration: opts.duration,
        ease: 'back.out(1.7)',
      });
    });
  });

  return gsap.timeline();
});

// ============================================
// PUBLIC API
// ============================================

/**
 * Get a preset by name
 */
export function getPreset(name: string): PresetFunction | undefined {
  return presetRegistry.get(name);
}

/**
 * Register a custom preset
 */
export function registerPreset(name: string, fn: PresetFunction): void {
  if (presetRegistry.has(name)) {
    logger.warn(`Preset "${name}" already exists. Overwriting.`);
  }
  presetRegistry.set(name, fn);
  logger.info(`Preset "${name}" registered successfully.`);
}

/**
 * Get all available preset names
 */
export function getPresetNames(): string[] {
  return Array.from(presetRegistry.keys());
}

/**
 * Check if a preset exists
 */
export function hasPreset(name: string): boolean {
  return presetRegistry.has(name);
}

/**
 * Execute a preset animation
 */
export function executePreset(
  name: string,
  elements: HTMLElement[],
  options: PresetOptions = {}
): gsap.core.Timeline | gsap.core.Tween | null {
  const preset = presetRegistry.get(name);

  if (!preset) {
    logger.error(`Preset "${name}" not found. Available presets: ${getPresetNames().join(', ')}`);
    return null;
  }

  if (!elements || elements.length === 0) {
    logger.warn(`No elements provided for preset "${name}"`);
    return null;
  }

  logger.info(`Executing preset "${name}" on ${elements.length} elements`);
  return preset(elements, options);
}
