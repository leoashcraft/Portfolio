/**
 * Timeline eyes animation - handles direction flipping, blinking, and slowing at dots
 * - At 768-1024px: Eyes look left (timeline on right), blink and slow at dots
 * - At 1024px+: Eyes flip at container tops, blink and slow at dots
 */

interface TravelerState {
  currentPercent: number;
  isSlowed: boolean;
  slowEndTime: number;
  blinkedBefore: Set<number>;
  blinkedAfter: Set<number>;
  nextDotIndex: number;
  startDelay: number; // Delay before this traveler starts (ms)
  started: boolean;
}

export function initTimelineEyes(): (() => void) | undefined {
  // Skip if animations disabled
  if (document.documentElement.getAttribute('data-animations') === 'disabled') return;

  const timelineLine = document.getElementById('timeline-line');
  const timelineEyes = document.getElementById('timeline-eyes');
  if (!timelineLine || !timelineEyes) return;

  const travelers = Array.from(timelineEyes.querySelectorAll('.timeline-traveler')) as HTMLElement[];
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

  // Get experience container positions (for flipping at 1024px+)
  const experienceContainers = document.querySelectorAll('#experience .space-y-12 > div');
  const containerTopThresholds = Array.from(experienceContainers).map((container) => {
    const containerRect = container.getBoundingClientRect();
    return ((containerRect.top - lineRect.top) / lineHeight) * 100;
  });

  // Helper to check viewport - called on each frame for responsive behavior
  function isRightSideTimeline() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  // Animation settings
  const travelDuration = 20000; // 20 seconds for full journey
  const slowDuration = 3000; // 3 second slow period at each dot
  const blinkBeforeOffset = 2; // Blink 2% before dot
  const speed = 100 / travelDuration; // percent per millisecond

  // Initialize state for each traveler
  const travelerStates = new Map<HTMLElement, TravelerState>();
  const travelerDelay = 8000; // 8 seconds between each traveler

  travelers.forEach((t, index) => {
    travelerStates.set(t, {
      currentPercent: 0,
      isSlowed: false,
      slowEndTime: 0,
      blinkedBefore: new Set(),
      blinkedAfter: new Set(),
      nextDotIndex: 0,
      startDelay: index * travelerDelay,
      started: index === 0, // First traveler starts immediately
    });
    // Disable CSS animation
    t.style.animation = 'none';
    t.style.top = '0%';
    t.style.opacity = index === 0 ? '0' : '0'; // Both start invisible
  });

  let lastTime = performance.now();
  const startTime = performance.now();
  let animationId: number;

  function blink(traveler: HTMLElement) {
    const eyesSpan = traveler.querySelector('.eyes-blink') as HTMLElement;
    if (eyesSpan) {
      eyesSpan.classList.add('blinking');
      setTimeout(() => eyesSpan.classList.remove('blinking'), 200);
    }
  }

  function updateTraveler(traveler: HTMLElement, deltaTime: number, elapsedTime: number) {
    const state = travelerStates.get(traveler)!;
    const now = performance.now();

    // Check if traveler should start yet
    if (!state.started) {
      if (elapsedTime >= state.startDelay) {
        state.started = true;
      } else {
        return; // Not time to start yet
      }
    }

    // Check if slow period ended
    if (state.isSlowed && now >= state.slowEndTime) {
      blink(traveler);
      state.isSlowed = false;
      state.nextDotIndex++;
    }

    // Move the traveler (50% speed when slowed)
    const currentSpeed = state.isSlowed ? speed * 0.5 : speed;
    state.currentPercent += currentSpeed * deltaTime;

    // Check for approaching dots
    const nextDot = dotThresholds[state.nextDotIndex];
    if (nextDot !== undefined) {
      const blinkPoint = nextDot - blinkBeforeOffset;

      // Blink before dot
      if (state.currentPercent >= blinkPoint && !state.blinkedBefore.has(state.nextDotIndex)) {
        state.blinkedBefore.add(state.nextDotIndex);
        blink(traveler);
      }

      // Start slowing down 3% before dot
      const slowPoint = nextDot - 3;
      if (state.currentPercent >= slowPoint && !state.isSlowed && !state.blinkedAfter.has(state.nextDotIndex)) {
        state.isSlowed = true;
        state.slowEndTime = now + slowDuration;
        state.blinkedAfter.add(state.nextDotIndex);
      }
    }

    // Reset when reaching the end
    if (state.currentPercent >= 100) {
      state.currentPercent = 0;
      state.blinkedBefore.clear();
      state.blinkedAfter.clear();
      state.nextDotIndex = 0;
      state.isSlowed = false;
    }

    // Update position
    traveler.style.top = `${state.currentPercent}%`;

    // Update opacity (fade in/out at edges)
    let opacity = 1;
    if (state.currentPercent < 3) {
      opacity = state.currentPercent / 3;
    } else if (state.currentPercent > 97) {
      opacity = (100 - state.currentPercent) / 3;
    }
    traveler.style.opacity = String(opacity);

    // Update look direction
    if (isRightSideTimeline()) {
      // At 768-1024px: always look left
      traveler.classList.add('look-left');
      traveler.classList.remove('look-right');
    } else {
      // At 1024px+: flip based on passed container tops
      const passedContainers = containerTopThresholds.filter((t) => state.currentPercent >= t).length;
      const shouldLookLeft = passedContainers % 2 === 1;

      traveler.classList.toggle('look-left', shouldLookLeft);
      traveler.classList.toggle('look-right', !shouldLookLeft);
    }
  }

  function animate(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    const elapsedTime = currentTime - startTime;
    lastTime = currentTime;

    travelers.forEach((traveler) => updateTraveler(traveler, deltaTime, elapsedTime));
    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
  };
}
