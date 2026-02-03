/**
 * Shared scroll-triggered reveal pattern.
 *
 * Used by "More Work" (ProjectsSection) and Education sections where
 * cards fly in/out based on scroll position.
 */

import { isAnimationsDisabled } from './section-utils';

export interface ScrollRevealConfig {
  /** Selector for the outer section wrapper */
  sectionSelector: string;
  /** Selector for the grid container (receives cards-in / cards-out) */
  gridSelector?: string;
  /** Selector for individual cards (receive `revealClass` per-card when revealTarget is 'cards') */
  cardSelector?: string;
  /** Selector for the title element (gets 'visible' class) */
  titleSelector?: string;
  /** Class toggled on reveal. Default: 'visible' */
  revealClass?: string;
  /** Where the reveal class is added: per-card or on the grid container. Default: 'cards' */
  revealTarget?: 'cards' | 'grid';
  /** Callback fired when cards are revealed (e.g. to play sounds) */
  onReveal?: () => void;
}

/**
 * Sets up scroll-based card reveal with rAF throttling, exit-up/exit-down
 * detection, cards-out exit class, and title visible trigger.
 *
 * Returns a cleanup function.
 */
export function initScrollReveal(config: ScrollRevealConfig): () => void {
  const {
    sectionSelector,
    gridSelector,
    cardSelector,
    titleSelector,
    revealClass = 'visible',
    revealTarget = 'cards',
    onReveal,
  } = config;

  const section = document.querySelector(sectionSelector) as HTMLElement;
  const grid = gridSelector ? (document.querySelector(gridSelector) as HTMLElement) : null;
  const cards = cardSelector
    ? (document.querySelectorAll(cardSelector) as NodeListOf<HTMLElement>)
    : (null as unknown as NodeListOf<HTMLElement>);
  const title = titleSelector ? (document.querySelector(titleSelector) as HTMLElement) : null;

  if (!section) return () => {};

  // If animations disabled, show everything immediately
  if (isAnimationsDisabled()) {
    if (title) title.classList.add('visible');
    if (revealTarget === 'grid' && grid) {
      grid.classList.add(revealClass);
    } else if (cards) {
      cards.forEach((card) => card.classList.add(revealClass));
    }
    return () => {};
  }

  let ticking = false;
  let cardsVisible = false;

  const check = () => {
    const viewportHeight = window.innerHeight;
    const titleTrigger = viewportHeight * 0.7;
    const cardsTrigger = viewportHeight * 0.5;
    const exitUpPoint = viewportHeight * 0.8;

    const sectionRect = section.getBoundingClientRect();

    const exitUp = sectionRect.top > exitUpPoint;
    const exitDown = sectionRect.top < -sectionRect.height * 0.35;

    if (exitUp || exitDown) {
      if (cardsVisible) {
        cardsVisible = false;
        if (title) title.classList.remove('visible');
        if (grid) grid.classList.add('cards-out');
        if (revealTarget === 'grid' && grid) {
          grid.classList.remove(revealClass);
        } else if (cards) {
          cards.forEach((card) => card.classList.remove(revealClass));
        }
        if (onReveal) {
          // Signal reset — onReveal won't fire again until cards re-enter
        }
      }
    } else {
      // Remove cards-out when re-entering
      if (!cardsVisible && grid && grid.classList.contains('cards-out')) {
        grid.classList.remove('cards-out');
      }

      // Title fades in first
      if (title && sectionRect.top < titleTrigger) {
        title.classList.add('visible');
      }

      // Cards fly in
      const triggerRect = grid ? grid.getBoundingClientRect() : sectionRect;
      if (triggerRect.top < cardsTrigger && !cardsVisible) {
        cardsVisible = true;
        if (revealTarget === 'grid' && grid) {
          grid.classList.add(revealClass);
        } else if (cards) {
          cards.forEach((card) => card.classList.add(revealClass));
        }
        onReveal?.();
      }
    }

    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(check);
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  check();

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}
