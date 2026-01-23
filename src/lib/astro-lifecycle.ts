/**
 * Utility for handling Astro page lifecycle events
 * Runs init function on page load and after Astro view transitions
 */
export function onPageLoad(initFn: () => void): void {
  // Run on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFn);
  } else {
    initFn();
  }

  // Run after Astro view transitions
  document.addEventListener('astro:after-swap', initFn);
}

/**
 * Creates an IntersectionObserver with common defaults
 */
export function createScrollObserver(
  callback: IntersectionObserverCallback,
  options?: {
    threshold?: number | number[];
    rootMargin?: string;
    root?: Element | null;
  }
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    threshold: options?.threshold ?? 0.1,
    rootMargin: options?.rootMargin ?? '0px 0px -5% 0px',
    root: options?.root ?? null,
  });
}

/**
 * Checks if current viewport is mobile size
 */
export function isMobile(): boolean {
  return window.innerWidth < 768;
}
