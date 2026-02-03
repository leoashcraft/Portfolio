/**
 * Experience section — CSS sticky horizontal scroll timeline (no GSAP)
 * Uses same scroll-hijack pattern as Offer section
 */

import { initSectionParallax } from './parallax';
import { createSnapSound } from './sounds';
import { isAnimationsDisabled, setNavHeightVar } from './section-utils';
import { initTouchSwipe } from './touch-swipe';

// ── Sound ────────────────────────────────────────────────────────────
const playSnapSound = createSnapSound('/sounds/fast-swipe-48158.mp3');

// ── Horizontal scroll ────────────────────────────────────────────────
let expCleanup: (() => void) | undefined;

interface PanelState {
  panel: HTMLElement;
  card: HTMLElement | null;
  revealed: boolean;
}

function initExpHscroll() {
  // Skip horizontal scroll on very small screens (374px and below)
  if (window.innerWidth <= 374) return () => {};

  const expSection = document.querySelector('.exp-hscroll-section') as HTMLElement;
  const container = document.querySelector('.exp-hscroll-container') as HTMLElement;
  const track = document.querySelector('.exp-hscroll-track') as HTMLElement;
  const progressFill = document.querySelector('.exp-hscroll-progress-fill') as HTMLElement;
  const markerDots = document.querySelectorAll('.exp-hscroll-marker-dot') as NodeListOf<HTMLElement>;
  const dots = document.querySelectorAll('.exp-hscroll-dot') as NodeListOf<HTMLElement>;

  if (!expSection || !container || !track) return () => {};

  const panels = track.querySelectorAll('.exp-hscroll-panel') as NodeListOf<HTMLElement>;
  const panelCount = panels.length;

  if (panelCount === 0) return () => {};

  // Build panel states for content animation
  const panelStates: PanelState[] = [];
  panels.forEach((panel) => {
    panelStates.push({
      panel,
      card: panel.querySelector('.experience-card'),
      revealed: false,
    });
  });

  const animDisabled = isAnimationsDisabled();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If animations disabled or prefers-reduced-motion, show all content immediately
  if (animDisabled || prefersReduced) {
    panelStates.forEach((state) => {
      if (state.card) {
        state.card.classList.add('card-in');
      }
      state.revealed = true;
    });
    if (progressFill) progressFill.style.transform = 'scaleX(1)';
    markerDots.forEach((d) => d.classList.add('active'));
  }

  // Measure nav height and set CSS variable so sticky offsets below it
  setNavHeightVar(container);

  // Match panel height to the Offer section's rendered panel height
  const offerPanel = document.querySelector('.services-hscroll-track .service-panel') as HTMLElement;
  if (offerPanel) {
    const targetH = offerPanel.offsetHeight;
    panels.forEach((p) => { p.style.minHeight = `${targetH}px`; });
  } else {
    // Fallback: equalize Experience panel heights among themselves
    let maxH = 0;
    panels.forEach((p) => {
      if (p.scrollHeight > maxH) maxH = p.scrollHeight;
    });
    panels.forEach((p) => { p.style.minHeight = `${maxH}px`; });
  }

  // Each panel is 100% of container width
  const stepPx = container.offsetWidth;

  // Set the section height to create scroll space
  const scrollPerPanel = window.innerHeight * 0.7;
  expSection.style.height = `${window.innerHeight + (panelCount - 1) * scrollPerPanel}px`;

  let currentPanel = 0;
  let snappedPanel = 0;
  let panel0Revealed = false;
  let wasPastSection = false;
  let resetLock = false;
  const previewOffset = 50; // pixels of preview movement
  let snapTime = 0; // timestamp of last snap for lockout

  function revealPanelContent(state: PanelState) {
    if (state.revealed) return;
    state.revealed = true;
    if (state.card) {
      state.card.classList.add('card-in');
    }
  }

  function resetPanelContent(state: PanelState) {
    state.revealed = false;
    if (state.card) {
      state.card.classList.remove('card-in');
    }
  }

  function resetAllPanels() {
    panelStates.forEach((state) => resetPanelContent(state));
  }

  function updateDots(activeIndex: number) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  function updateTimeline(progress: number) {
    if (progressFill) {
      progressFill.style.transform = `scaleX(${progress})`;
    }
    markerDots.forEach((dot, i) => {
      const threshold = panelCount > 1 ? i / (panelCount - 1) : 0;
      dot.classList.toggle('active', progress >= threshold - 0.02);
    });
  }

  function snapTo(panelIndex: number) {
    const clamped = Math.max(0, Math.min(panelIndex, panelCount - 1));
    if (clamped === snappedPanel) return;
    snappedPanel = clamped;

    playSnapSound();
    snapTime = Date.now();

    resetAllPanels();

    const translatePx = clamped * stepPx;
    track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = `translateX(-${translatePx}px)`;

    updateDots(clamped);
    currentPanel = clamped;

    // Update timeline progress
    const progress = panelCount > 1 ? clamped / (panelCount - 1) : 1;
    updateTimeline(progress);

    revealPanelContent(panelStates[clamped]);
  }

  function checkScroll() {
    if (resetLock) return;

    const sectionRect = expSection.getBoundingClientRect();
    const sectionTop = -sectionRect.top;
    const totalScrollable = expSection.offsetHeight - window.innerHeight;

    if (sectionTop < 0) {
      if (snappedPanel !== 0) {
        snappedPanel = 0;
        currentPanel = 0;
        panel0Revealed = false;
        track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(0)';
        updateDots(0);
        updateTimeline(0);
      }

      wasPastSection = false;

      if (sectionRect.top > window.innerHeight * 0.5) {
        panel0Revealed = false;
        panelStates.forEach((state) => resetPanelContent(state));
        updateTimeline(0);
      } else if (!panel0Revealed) {
        panel0Revealed = true;
        playSnapSound();
        revealPanelContent(panelStates[0]);
        updateTimeline(0);
      }
    } else if (sectionTop >= totalScrollable) {
      snapTo(panelCount - 1);
      if (!wasPastSection) {
        wasPastSection = true;
      }
    } else {
      if (wasPastSection) {
        wasPastSection = false;
        resetLock = true;
        snappedPanel = 0;
        currentPanel = 0;
        panel0Revealed = false;
        panelStates.forEach((state) => resetPanelContent(state));
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        updateDots(0);
        updateTimeline(0);
        void track.offsetHeight;
        setTimeout(() => {
          panel0Revealed = true;
          revealPanelContent(panelStates[0]);
          resetLock = false;
        }, 600);
      } else {
        const progress = sectionTop / totalScrollable;
        const targetPanel = Math.round(progress * (panelCount - 1));

        // Show continuous preview movement while scrolling (with lockout after snap)
        const timeSinceSnap = Date.now() - snapTime;
        if (targetPanel === snappedPanel && timeSinceSnap > 500) {
          const exactProgress = progress * (panelCount - 1);
          const subProgress = exactProgress - snappedPanel;
          const previewPx = subProgress * previewOffset * 2;
          const basePx = snappedPanel * stepPx;
          track.style.transition = 'none';
          track.style.transform = `translateX(-${basePx + previewPx}px)`;
        }

        snapTo(targetPanel);
      }
    }
  }

  // rAF polling loop
  let rafId: number;
  function tick() {
    checkScroll();
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // Dot click handlers (both timeline markers and indicator dots)
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const panelIndex = parseInt(dot.dataset.panel || '0', 10);
      const totalScrollable = expSection.offsetHeight - window.innerHeight;
      const targetScroll = expSection.offsetTop + (panelIndex / (panelCount - 1)) * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  // Touch swipe handlers for mobile
  let swipeCleanup: (() => void) | undefined;

  function goToPanel(panelIndex: number) {
    const clamped = Math.max(0, Math.min(panelIndex, panelCount - 1));
    const totalScrollable = expSection.offsetHeight - window.innerHeight;
    const sectionTop = expSection.getBoundingClientRect().top + window.scrollY;
    const targetScroll = sectionTop + (clamped / (panelCount - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }

  swipeCleanup = initTouchSwipe({
    element: container,
    onSwipeLeft: () => goToPanel(snappedPanel + 1),
    onSwipeRight: () => goToPanel(snappedPanel - 1),
    threshold: 50,
  });

  // Handle resize — full reinit via debounce
  let resizeTimer: ReturnType<typeof setTimeout>;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      expCleanup?.();
      expCleanup = initExpHscroll();
    }, 200);
  }

  window.addEventListener('resize', onResize, { passive: true });

  // Initial state
  checkScroll();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    clearTimeout(resizeTimer);
    swipeCleanup?.();
  };
}

// ── Public entry point ───────────────────────────────────────────────

export function initExperienceSection() {
  function initAll() {
    expCleanup?.();
    expCleanup = initExpHscroll();
    initSectionParallax('experience');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  document.addEventListener('astro:after-swap', initAll);

  window.addEventListener('animations-change', () => {
    expCleanup?.();
    expCleanup = initExpHscroll();
  });
}
