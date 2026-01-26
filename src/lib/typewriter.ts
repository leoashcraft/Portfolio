/**
 * Typewriter utility with natural typing delays
 */

export interface TypewriterOptions {
  baseSpeed?: number;
  variance?: number;
  spaceDelay?: number;
  hesitationChance?: number;
  hesitationDelay?: number;
  deleteSpeed?: number;
}

const defaultOptions: Required<TypewriterOptions> = {
  baseSpeed: 50,
  variance: 80,
  spaceDelay: 150,
  hesitationChance: 0.1,
  hesitationDelay: 200,
  deleteSpeed: 50,
};

/**
 * Get a random typing delay for natural feel
 */
export function getRandomTypeDelay(char: string, options: TypewriterOptions = {}): number {
  const opts = { ...defaultOptions, ...options };
  let delay = opts.baseSpeed + Math.random() * opts.variance;

  // Longer pause after spaces (like thinking between words)
  if (char === ' ') {
    delay += Math.random() * opts.spaceDelay;
  }

  // Occasional longer pause (simulating hesitation)
  if (Math.random() < opts.hesitationChance) {
    delay += Math.random() * opts.hesitationDelay;
  }

  return delay;
}

/**
 * Type a phrase character by character with natural delays
 */
export function typePhrase(
  element: HTMLElement,
  phrase: string,
  onComplete: () => void,
  options: TypewriterOptions = {}
): void {
  let charIndex = 0;

  function typeChar() {
    if (charIndex < phrase.length) {
      const currentChar = phrase[charIndex];
      element.textContent = phrase.slice(0, charIndex + 1);
      charIndex++;
      setTimeout(typeChar, getRandomTypeDelay(currentChar, options));
    } else {
      onComplete();
    }
  }
  typeChar();
}

/**
 * Delete text character by character
 */
export function deletePhrase(
  element: HTMLElement,
  onComplete: () => void,
  options: TypewriterOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };

  function deleteChar() {
    const current = element.textContent || '';
    if (current.length > 0) {
      element.textContent = current.slice(0, -1);
      setTimeout(deleteChar, opts.deleteSpeed);
    } else {
      onComplete();
    }
  }
  deleteChar();
}
