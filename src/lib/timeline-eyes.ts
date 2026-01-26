/**
 * Timeline eyes animation - handles direction flipping and blinking
 * Eyes look toward content and blink when crossing midpoints between dots
 */

interface TravelerState {
  crossedMidpoints: Set<number>;
}

export function initTimelineEyes(): (() => void) | undefined {
  const timelineLine = document.getElementById('timeline-line');
  const timelineEyes = document.getElementById('timeline-eyes');
  if (!timelineLine || !timelineEyes) return;

  const travelers = timelineEyes.querySelectorAll('.timeline-traveler');
  const dots = document.querySelectorAll('.timeline-dot');

  if (travelers.length === 0 || dots.length === 0) return;

  // Calculate positions using the eyes container (same dimensions as line)
  const lineRect = timelineEyes.getBoundingClientRect();
  const lineHeight = lineRect.height;

  // Get dot positions as percentages
  const dotThresholds = Array.from(dots).map((dot) => {
    const dotRect = dot.getBoundingClientRect();
    return ((dotRect.top - lineRect.top) / lineHeight) * 100;
  });

  // Calculate midpoints between dots for blink triggers
  const midpointThresholds = dotThresholds.slice(0, -1).map((threshold, i) =>
    (threshold + dotThresholds[i + 1]) / 2
  );

  // Track state for each traveler
  const travelerStates = new Map<Element, TravelerState>();
  travelers.forEach((t) => travelerStates.set(t, { crossedMidpoints: new Set() }));

  let animationId: number;

  function updateTraveler(traveler: Element) {
    const state = travelerStates.get(traveler)!;
    const style = getComputedStyle(traveler);
    const topValue = parseFloat(style.top);
    const currentPercent = (topValue / lineHeight) * 100;

    // Update look direction based on passed dots
    const passedDots = dotThresholds.filter((t) => currentPercent >= t).length;
    const shouldLookLeft = passedDots % 2 === 1;

    traveler.classList.toggle('look-left', shouldLookLeft);
    traveler.classList.toggle('look-right', !shouldLookLeft);

    // Check for midpoint crossings to trigger blink
    const eyesSpan = traveler.querySelector('.eyes-blink') as HTMLElement;
    if (eyesSpan) {
      midpointThresholds.forEach((midpoint, i) => {
        const isNearMidpoint = currentPercent >= midpoint - 0.5 && currentPercent <= midpoint + 0.5;

        if (isNearMidpoint && !state.crossedMidpoints.has(i)) {
          state.crossedMidpoints.add(i);
          eyesSpan.classList.add('blinking');
          setTimeout(() => eyesSpan.classList.remove('blinking'), 200);
        }
      });
    }

    // Reset when traveler loops back to top
    if (currentPercent < 5) {
      state.crossedMidpoints.clear();
    }
  }

  function animate() {
    travelers.forEach(updateTraveler);
    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
  };
}
