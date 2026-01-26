/**
 * Parallax utility for decorative elements
 * Uses margin offsets to avoid conflicts with CSS animation transforms
 */

export interface ParallaxElement {
  element: HTMLElement;
  speed: number;
  direction: 'up' | 'down';
}

export function initSectionParallax(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxElements = section.querySelectorAll('[data-parallax]') as NodeListOf<HTMLElement>;
  if (parallaxElements.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const rect = section!.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Only apply parallax when section is in view
    if (rect.top < windowHeight && rect.bottom > 0) {
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.5');
        const direction = el.dataset.parallaxDir === 'down' ? 1 : -1;
        // Doubled multipliers for more pronounced effect
        const yOffset = (scrollProgress - 0.5) * speed * 800 * direction;
        const xOffset = parseFloat(el.dataset.parallaxX || '0') * (scrollProgress - 0.5) * 400;

        // Use margin for parallax to avoid conflicting with CSS animation transforms
        el.style.marginTop = `${yOffset}px`;
        el.style.marginLeft = `${xOffset}px`;
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateParallax();
}
