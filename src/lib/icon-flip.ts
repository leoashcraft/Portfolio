/**
 * Shared icon flip animation logic for service icons and project icons
 */

export interface IconFlipOptions {
  /** CSS selector for the icons */
  selector: string;
  /** Enable random flipping at intervals */
  randomFlip?: boolean;
  /** Min/max delay range for random flips in ms */
  randomFlipDelay?: [number, number];
}

/**
 * Initialize icon flip animations
 * - Flips on parent card hover
 * - Optionally flips randomly at intervals
 */
export function initIconFlips(options: IconFlipOptions): () => void {
  const { selector, randomFlip = false, randomFlipDelay = [3000, 7000] } = options;
  const icons = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

  if (icons.length === 0) return () => {};

  const timeouts: number[] = [];

  // Handle hover on parent card
  icons.forEach((icon) => {
    const parentCard = icon.closest('.card');

    if (parentCard) {
      parentCard.addEventListener('mouseenter', () => {
        icon.classList.add('flipped');
      });

      parentCard.addEventListener('mouseleave', () => {
        icon.classList.remove('flipped');
      });
    }

    // Random flip animation
    if (randomFlip) {
      function scheduleRandomFlip() {
        const delay = Math.random() * (randomFlipDelay[1] - randomFlipDelay[0]) + randomFlipDelay[0];
        const timeout = window.setTimeout(() => {
          // Only flip if not currently hovered
          if (!icon.classList.contains('flipped')) {
            icon.classList.add('flipped');
            setTimeout(() => {
              icon.classList.remove('flipped');
            }, 600);
          }
          scheduleRandomFlip();
        }, delay);
        timeouts.push(timeout);
      }
      scheduleRandomFlip();
    }
  });

  // Return cleanup function
  return () => {
    timeouts.forEach((t) => clearTimeout(t));
  };
}
