/**
 * Scroll-driven wave animation for titles
 * Letters scale up as the "wave" passes through based on scroll position
 */

interface WaveState {
  element: HTMLElement;
  letters: HTMLSpanElement[];
  lastProgress: number;
}

const waveStates = new Map<Element, WaveState>();

function wrapLetters(element: HTMLElement): HTMLSpanElement[] {
  const letters: HTMLSpanElement[] = [];

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const fragment = document.createDocumentFragment();

      for (const char of text) {
        if (char === ' ' || char === '\n' || char === '\t') {
          fragment.appendChild(document.createTextNode(char));
        } else {
          const span = document.createElement('span');
          span.className = 'wave-letter';
          span.style.display = 'inline-block';
          span.textContent = char;
          letters.push(span);
          fragment.appendChild(span);
        }
      }

      node.parentNode?.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const isGradient = el.classList.contains('gradient-text');
      const gradientStyle = isGradient ? getComputedStyle(el).backgroundImage : '';

      Array.from(el.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || '';
          const fragment = document.createDocumentFragment();

          for (const char of text) {
            if (char === ' ' || char === '\n' || char === '\t') {
              fragment.appendChild(document.createTextNode(char));
            } else {
              const span = document.createElement('span');
              span.className = 'wave-letter';
              span.style.display = 'inline-block';
              span.textContent = char;

              if (isGradient && gradientStyle) {
                span.style.backgroundImage = gradientStyle;
                span.style.backgroundClip = 'text';
                span.style.webkitBackgroundClip = 'text';
                span.style.color = 'transparent';
              }

              letters.push(span);
              fragment.appendChild(span);
            }
          }

          child.parentNode?.replaceChild(fragment, child);
        }
      });
    }
  };

  Array.from(element.childNodes).forEach(processNode);
  return letters;
}

export interface ScrollWaveOptions {
  /** CSS selector for the title elements */
  selector: string;
  /** Start of wave animation (viewport percentage, 0-1). Default: 0.85 */
  waveStart?: number;
  /** End of wave animation (viewport percentage, 0-1). Default: 0.40 */
  waveEnd?: number;
  /** CSS class to add when visible. Default: 'visible' */
  visibleClass?: string;
}

export function initScrollWave(options: ScrollWaveOptions): () => void {
  const {
    selector,
    waveStart = 0.85,
    waveEnd = 0.40,
    visibleClass = 'visible'
  } = options;

  const elements = document.querySelectorAll(selector);

  // Check if animations are disabled
  const animationsDisabled = document.documentElement.getAttribute('data-animations') === 'disabled';

  elements.forEach((el) => {
    const element = el as HTMLElement;

    if (animationsDisabled) {
      element.classList.add(visibleClass);
      return;
    }

    // Wrap letters if not already done
    let letters = Array.from(element.querySelectorAll('.wave-letter')) as HTMLSpanElement[];
    if (letters.length === 0) {
      letters = wrapLetters(element);
    }

    waveStates.set(element, {
      element,
      letters,
      lastProgress: -1
    });
  });

  if (animationsDisabled) {
    return () => {};
  }

  let ticking = false;

  const updateWaves = () => {
    const viewportHeight = window.innerHeight;
    const waveStartPx = viewportHeight * waveStart;
    const waveEndPx = viewportHeight * waveEnd;

    waveStates.forEach((state) => {
      const rect = state.element.getBoundingClientRect();

      // Calculate wave progress (0 = not started, 1 = complete)
      let waveProgress = 0;
      if (rect.top <= waveStartPx && rect.top >= waveEndPx) {
        waveProgress = (waveStartPx - rect.top) / (waveStartPx - waveEndPx);
      } else if (rect.top < waveEndPx) {
        waveProgress = 1;
      }

      // Show/hide based on progress
      if (waveProgress > 0) {
        state.element.classList.add(visibleClass);
      } else {
        state.element.classList.remove(visibleClass);
      }

      // Apply wave animation to letters
      if (Math.abs(waveProgress - state.lastProgress) > 0.001) {
        state.lastProgress = waveProgress;

        const totalLetters = state.letters.length;
        const letterWindow = 0.15;

        // When wave is complete, all letters should be at normal scale
        if (waveProgress >= 1) {
          state.letters.forEach((letter) => {
            letter.style.transform = 'scale(1)';
            letter.style.filter = '';
          });
        } else {
          state.letters.forEach((letter, index) => {
            // Adjust so the wave completes before progress reaches 1
            // Map letter peaks to 0 - 0.85 range so wave finishes by progress 0.85
            const letterPeak = (index / totalLetters) * 0.85;
            const distFromPeak = Math.abs(waveProgress - letterPeak);

            let scale = 1;
            if (distFromPeak < letterWindow) {
              const normalizedDist = distFromPeak / letterWindow;
              scale = 1 + 0.4 * (1 - normalizedDist * normalizedDist);
            }

            let brightness = 1;
            if (distFromPeak < letterWindow * 0.5) {
              brightness = 1.3;
            }

            letter.style.transform = `scale(${scale})`;
            letter.style.filter = brightness > 1 ? `brightness(${brightness})` : '';
          });
        }
      }
    });

    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateWaves);
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  updateWaves();

  return () => {
    window.removeEventListener('scroll', handleScroll);
    waveStates.clear();
  };
}
