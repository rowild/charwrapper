/**
 * Minimal GSAP type declarations
 *
 * CharWrapper uses GSAP as an external dependency.
 * These are minimal type definitions for the GSAP functions we use.
 */

declare namespace gsap {
  export namespace core {
    export interface Timeline {
      to(targets: any, vars: any, position?: any): this;
      from(targets: any, vars: any, position?: any): this;
      set(targets: any, vars: any): this;
      kill(): void;
    }

    export interface Tween {
      kill(): void;
      pause(): this;
      play(): this;
      reverse(): this;
    }
  }

  export interface TweenVars {
    [key: string]: any;
    duration?: number;
    delay?: number;
    ease?: string;
    stagger?: number | object;
    repeat?: number;
    yoyo?: boolean;
    onComplete?: () => void;
    onStart?: () => void;
    onUpdate?: () => void;
    onRepeat?: () => void;
  }

  export interface TimelineVars {
    [key: string]: any;
    delay?: number;
    repeat?: number;
    onComplete?: () => void;
    onStart?: () => void;
    onUpdate?: () => void;
  }
}

declare const gsap: {
  to(targets: any, vars: gsap.TweenVars): gsap.core.Tween;
  from(targets: any, vars: gsap.TweenVars): gsap.core.Tween;
  fromTo(targets: any, fromVars: gsap.TweenVars, toVars: gsap.TweenVars): gsap.core.Tween;
  set(targets: any, vars: any): void;
  timeline(vars?: gsap.TimelineVars): gsap.core.Timeline;
  killTweensOf(targets: any): void;
};
