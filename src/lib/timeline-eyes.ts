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
}

export function initTimelineEyes(): (() => void) | undefined {
  // Skip if animations disabled
  if (document.documentElement.getAttribute('data-animations') === 'disabled') return;

  const timelineLine = document.getElementById('timeline-line');
  const timelineEyes = document.getElementById('timeline-eyes');
  if (!timelineLine || !timelineEyes) return;

  const traveler = timelineEyes.querySelector('.timeline-traveler') as HTMLElement;
  const dots = document.querySelectorAll('.timeline-dot');
  const experienceContainers = document.querySelectorAll('#experience .space-y-12 > div');

  if (!traveler || dots.length === 0) return;

  // Function to get current dot positions (recalculated each frame for accuracy)
  function getDotThresholds(): number[] {
    const lineRect = timelineEyes.getBoundingClientRect();
    const lineHeight = lineRect.height;
    if (lineHeight === 0) return [];

    return Array.from(dots).map((dot) => {
      const dotRect = dot.getBoundingClientRect();
      return ((dotRect.top - lineRect.top) / lineHeight) * 100;
    });
  }

  // Function to get container positions for flipping
  function getContainerThresholds(): number[] {
    const lineRect = timelineEyes.getBoundingClientRect();
    const lineHeight = lineRect.height;
    if (lineHeight === 0) return [];

    return Array.from(experienceContainers).map((container) => {
      const containerRect = container.getBoundingClientRect();
      return ((containerRect.top - lineRect.top) / lineHeight) * 100;
    });
  }

  // Helper to check viewport - called on each frame for responsive behavior
  function isRightSideTimeline() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  // Animation settings
  const travelDuration = 20000; // 20 seconds for full journey
  const slowDuration = 3000; // 3 second slow period at each dot
  const blinkBeforeOffset = 2; // Blink 2% before dot
  const speed = 100 / travelDuration; // percent per millisecond

  // Initialize state
  const state: TravelerState = {
    currentPercent: 0,
    isSlowed: false,
    slowEndTime: 0,
    blinkedBefore: new Set(),
    blinkedAfter: new Set(),
    nextDotIndex: 0,
  };

  // Disable CSS animation
  traveler.style.animation = 'none';
  traveler.style.top = '0%';
  traveler.style.opacity = '0';

  let lastTime = performance.now();
  let animationId: number;

  function blink() {
    const eyesSpan = traveler.querySelector('.eyes-blink') as HTMLElement;
    if (eyesSpan) {
      eyesSpan.classList.add('blinking');
      setTimeout(() => eyesSpan.classList.remove('blinking'), 200);
    }
  }

  function update(deltaTime: number) {
    const now = performance.now();

    // Get current timeline line height (dynamic based on visible cards)
    const heightStyle = timelineLine.style.height;
    let lineCurrentHeight: number;

    if (heightStyle.endsWith('%')) {
      // If height is a percentage, calculate actual pixel value
      const containerHeight = timelineEyes.getBoundingClientRect().height;
      lineCurrentHeight = (parseFloat(heightStyle) / 100) * containerHeight;
    } else {
      lineCurrentHeight = parseFloat(heightStyle) || 0;
    }

    const containerHeight = timelineEyes.getBoundingClientRect().height;
    const maxPercent = containerHeight > 0 ? (lineCurrentHeight / containerHeight) * 100 : 0;

    // Hide traveler if timeline is too short
    if (maxPercent < 5) {
      traveler.style.opacity = '0';
      return;
    }

    // Check if slow period ended
    if (state.isSlowed && now >= state.slowEndTime) {
      blink();
      state.isSlowed = false;
      state.nextDotIndex++;
    }

    // Move the traveler (50% speed when slowed)
    const currentSpeed = state.isSlowed ? speed * 0.5 : speed;
    state.currentPercent += currentSpeed * deltaTime;

    // Get current dot positions (dynamic)
    const dotThresholds = getDotThresholds();

    // Check for approaching dots (only dots within current timeline extent)
    const nextDot = dotThresholds[state.nextDotIndex];
    if (nextDot !== undefined && nextDot <= maxPercent) {
      const blinkPoint = nextDot - blinkBeforeOffset;

      // Blink before dot
      if (state.currentPercent >= blinkPoint && !state.blinkedBefore.has(state.nextDotIndex)) {
        state.blinkedBefore.add(state.nextDotIndex);
        blink();
      }

      // Start slowing down 3% before dot
      const slowPoint = nextDot - 3;
      if (state.currentPercent >= slowPoint && !state.isSlowed && !state.blinkedAfter.has(state.nextDotIndex)) {
        state.isSlowed = true;
        state.slowEndTime = now + slowDuration;
        state.blinkedAfter.add(state.nextDotIndex);
      }
    }

    // Reset when reaching the current max extent (not 100%)
    if (state.currentPercent >= maxPercent) {
      state.currentPercent = 0;
      state.blinkedBefore.clear();
      state.blinkedAfter.clear();
      state.nextDotIndex = 0;
      state.isSlowed = false;
    }

    // Update position
    traveler.style.top = `${state.currentPercent}%`;

    // Update opacity (fade in/out at edges of current extent)
    let opacity = 1;
    if (state.currentPercent < 3) {
      opacity = state.currentPercent / 3;
    } else if (state.currentPercent > maxPercent - 3) {
      opacity = (maxPercent - state.currentPercent) / 3;
    }
    traveler.style.opacity = String(Math.max(0, Math.min(1, opacity)));

    // Update look direction
    if (isRightSideTimeline()) {
      // At 768-1024px: always look left
      traveler.classList.add('look-left');
      traveler.classList.remove('look-right');
    } else {
      // At 1024px+: flip based on passed container tops
      const containerTopThresholds = getContainerThresholds();
      const passedContainers = containerTopThresholds.filter((t) => state.currentPercent >= t).length;
      const shouldLookLeft = passedContainers % 2 === 1;

      traveler.classList.toggle('look-left', shouldLookLeft);
      traveler.classList.toggle('look-right', !shouldLookLeft);
    }
  }

  function animate(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime);
    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
  };
}
