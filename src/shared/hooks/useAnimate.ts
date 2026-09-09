import { useEffect, RefObject } from 'react';
// @ts-expect-error - animatejs lacks typescript definitions
import { animate } from 'animatejs';

/**
 * Hook to run an animate.js animation on a DOM element.
 *
 * @param ref - React ref pointing to the element to animate.
 * @param from - CSS properties at the start of the animation.
 * @param to - CSS properties at the end of the animation.
 * @param options - Optional animation configuration.
 */
export function useAnimate<T extends HTMLElement>(
  ref: RefObject<T>,
  from: Record<string, any>,
  to: Record<string, any>,
  options?: {
    duration?: number;
    delay?: number;
    easing?: string;
  }
) {
  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, from, to, {
      duration: options?.duration ?? 600,
      delay: options?.delay ?? 0,
      easing: options?.easing ?? 'ease-out',
    });
  }, [ref, from, to, options]);
}
