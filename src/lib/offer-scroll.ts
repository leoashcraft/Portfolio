/**
 * Offer (services) section — horizontal scroll + logo modal + shimmer + icon flips
 */

import { initIconFlips } from './icon-flip';
import { initSectionParallax } from './parallax';
import { createSnapSound } from './sounds';
import { isAnimationsDisabled, setNavHeightVar } from './section-utils';
import { initTouchSwipe } from './touch-swipe';

// ── Sound ────────────────────────────────────────────────────────────
const playSnapSound = createSnapSound('/sounds/fast-swipe-48158.mp3');

// ── Icon flips ───────────────────────────────────────────────────────
let iconCleanup: () => void;

function initServiceIconFlips() {
  iconCleanup?.();
  iconCleanup = initIconFlips({ selector: '.service-icon' });
}

// ── Logo modal ───────────────────────────────────────────────────────
function initLogoModal() {
  const modal = document.getElementById('logo-modal');
  const modalImage = document.getElementById('modal-image') as HTMLImageElement;
  const modalClose = document.getElementById('modal-close');
  const thumbnails = document.querySelectorAll('.logo-thumbnail');

  if (!modal || !modalImage || !modalClose) return;

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-src');
      const alt = thumb.getAttribute('data-alt');
      if (src) {
        modalImage.src = src;
        modalImage.alt = alt || '';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

// ── Logo shimmer ─────────────────────────────────────────────────────
function initLogoShimmer() {
  const wrappers = document.querySelectorAll('.logo-image-wrapper');

  wrappers.forEach((wrapper) => {
    const shimmer = wrapper.querySelector('.logo-shimmer');
    const img = wrapper.querySelector('img');
    if (!shimmer || !img) return;

    let isAnimating = false;

    img.addEventListener('mouseenter', () => {
      if (isAnimating) return;
      isAnimating = true;
      shimmer.classList.add('shimmer-active');
    });

    shimmer.addEventListener('animationend', () => {
      shimmer.classList.remove('shimmer-active');
      isAnimating = false;
    });

    img.addEventListener('mouseleave', () => {
      isAnimating = false;
    });
  });
}

// ── Static inits (icons, parallax, logo UI) ──────────────────────────
function initAbout() {
  initServiceIconFlips();
  initSectionParallax('offer');
  initLogoModal();
  initLogoShimmer();
}

// ── Horizontal scroll ────────────────────────────────────────────────
let hscrollCleanup: (() => void) | undefined;

interface PanelState {
  panel: HTMLElement;
  icon: HTMLElement | null;
  title: HTMLElement | null;
  titleText: string;
  desc: HTMLElement | null;
  features: HTMLElement[];
  logos: HTMLElement[];
  lastTitleProgress: number;
  revealed: boolean;
}

function initHorizontalScroll() {
  // Skip horizontal scroll on very small screens (374px and below)
  if (window.innerWidth <= 374) return () => {};

  const servicesSection = document.querySelector('.services-section') as HTMLElement;
  const container = document.querySelector('.services-container') as HTMLElement;
  const track = document.querySelector('.services-hscroll-track') as HTMLElement;
  const dots = document.querySelectorAll('.hscroll-dot') as NodeListOf<HTMLElement>;

  if (!servicesSection || !container || !track) return () => {};

  const panels = track.querySelectorAll('.service-panel') as NodeListOf<HTMLElement>;
  const panelCount = panels.length;

  if (panelCount === 0) return () => {};

  // Build panel states for content animation
  const panelStates: PanelState[] = [];
  panels.forEach((panel) => {
    const titleEl = panel.querySelector('.service-card-title') as HTMLElement;
    const titleText = titleEl?.dataset.title || '';

    panelStates.push({
      panel,
      icon: panel.querySelector('.service-icon-anim'),
      title: titleEl,
      titleText,
      desc: panel.querySelector('.service-desc'),
      features: Array.from(panel.querySelectorAll('.feature-item')),
      logos: Array.from(panel.querySelectorAll('.logo-item')),
      lastTitleProgress: -1,
      revealed: false,
    });
  });

  // If animations disabled, show all content immediately
  const animDisabled = isAnimationsDisabled();
  if (animDisabled) {
    panelStates.forEach((state) => {
      const card = state.panel.querySelector('.service-card');
      if (card) card.classList.add('card-in');
      if (state.icon) state.icon.classList.add('visible');
      if (state.title) state.title.textContent = state.titleText;
      if (state.desc) state.desc.classList.add('visible');
      state.features.forEach((f) => f.classList.add('visible'));
      state.logos.forEach((l) => l.classList.add('visible'));
      state.revealed = true;
    });
  }

  // Measure nav height and set CSS variable so sticky offsets below it
  setNavHeightVar(container);

  // Equalize panel heights: temporarily show all content so we can measure
  track.style.transition = 'none';
  panels.forEach((p) => {
    p.style.minHeight = '';
    p.style.transition = 'none';
  });
  panelStates.forEach((state) => {
    const card = state.panel.querySelector('.service-card') as HTMLElement;
    if (card) { card.style.transition = 'none'; card.style.opacity = '1'; card.style.transform = 'none'; }
    if (state.icon) { (state.icon as HTMLElement).style.transition = 'none'; (state.icon as HTMLElement).style.opacity = '1'; (state.icon as HTMLElement).style.transform = 'none'; }
    if (state.title) state.title.textContent = state.titleText;
    if (state.desc) { (state.desc as HTMLElement).style.transition = 'none'; (state.desc as HTMLElement).style.opacity = '1'; (state.desc as HTMLElement).style.transform = 'none'; }
    state.features.forEach((f) => { (f as HTMLElement).style.transition = 'none'; (f as HTMLElement).style.opacity = '1'; (f as HTMLElement).style.transform = 'none'; });
    state.logos.forEach((l) => { (l as HTMLElement).style.transition = 'none'; (l as HTMLElement).style.opacity = '1'; (l as HTMLElement).style.transform = 'none'; });
  });
  // Force layout to measure
  let maxH = 0;
  panels.forEach((p) => {
    if (p.scrollHeight > maxH) maxH = p.scrollHeight;
  });
  panels.forEach((p) => { p.style.minHeight = `${maxH}px`; });
  // Reset: clear inline styles and content for non-disabled animations
  if (!animDisabled) {
    panelStates.forEach((state) => {
      state.revealed = false;
      state.lastTitleProgress = -1;
      const card = state.panel.querySelector('.service-card') as HTMLElement;
      if (card) { card.style.transition = ''; card.style.opacity = ''; card.style.transform = ''; }
      if (state.icon) { (state.icon as HTMLElement).style.transition = ''; (state.icon as HTMLElement).style.opacity = ''; (state.icon as HTMLElement).style.transform = ''; }
      if (state.title) state.title.textContent = '';
      if (state.desc) { (state.desc as HTMLElement).style.transition = ''; (state.desc as HTMLElement).style.opacity = ''; (state.desc as HTMLElement).style.transform = ''; }
      state.features.forEach((f) => { (f as HTMLElement).style.transition = ''; (f as HTMLElement).style.opacity = ''; (f as HTMLElement).style.transform = ''; });
      state.logos.forEach((l) => { (l as HTMLElement).style.transition = ''; (l as HTMLElement).style.opacity = ''; (l as HTMLElement).style.transform = ''; });
    });
  }
  // Restore track transition
  track.style.transition = '';
  panels.forEach((p) => { p.style.transition = ''; });

  // Each panel is 100% of container width — step is the container width
  const stepPx = container.offsetWidth;

  // Set the section height to create scroll space
  const scrollPerPanel = window.innerHeight * 0.7;
  servicesSection.style.height = `${window.innerHeight + (panelCount - 1) * scrollPerPanel}px`;

  let currentPanel = 0;
  let snappedPanel = 0;
  let panel0Revealed = false;
  let wasPastSection = false;
  let resetLock = false;
  const previewOffset = 50; // pixels of preview movement

  // Track active timeouts/intervals so we can clear them on reset
  let activeTimers: ReturnType<typeof setTimeout>[] = [];
  let activeIntervals: ReturnType<typeof setInterval>[] = [];

  function revealPanelContent(state: PanelState) {
    state.revealed = true;

    const card = state.panel.querySelector('.service-card');
    if (card) card.classList.add('card-in');

    if (state.icon) state.icon.classList.add('visible');

    if (state.title && state.titleText) {
      state.title.textContent = '';
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        charIndex++;
        if (state.title) {
          state.title.textContent = state.titleText.slice(0, charIndex);
        }
        if (charIndex >= state.titleText.length) {
          clearInterval(typeInterval);
        }
      }, 30);
      activeIntervals.push(typeInterval);
    }

    activeTimers.push(setTimeout(() => {
      if (state.desc) state.desc.classList.add('visible');
    }, 300));

    state.features.forEach((feature, index) => {
      activeTimers.push(setTimeout(() => {
        feature.classList.add('visible');
      }, 500 + index * 100));
    });

    state.logos.forEach((logo, index) => {
      activeTimers.push(setTimeout(() => {
        logo.classList.add('visible');
      }, 400 + index * 120));
    });
  }

  function resetPanelContent(state: PanelState) {
    state.revealed = false;
    state.lastTitleProgress = -1;

    const card = state.panel.querySelector('.service-card');
    if (card) card.classList.remove('card-in');
    if (state.icon) state.icon.classList.remove('visible');
    if (state.title) state.title.textContent = '';
    if (state.desc) state.desc.classList.remove('visible');
    state.features.forEach((f) => f.classList.remove('visible'));
    state.logos.forEach((l) => l.classList.remove('visible'));
  }

  function resetAllPanels() {
    activeTimers.forEach((t) => clearTimeout(t));
    activeIntervals.forEach((t) => clearInterval(t));
    activeTimers = [];
    activeIntervals = [];

    panelStates.forEach((state) => resetPanelContent(state));
  }

  function updateDots(activeIndex: number) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  function snapTo(panelIndex: number) {
    const clamped = Math.max(0, Math.min(panelIndex, panelCount - 1));
    if (clamped === snappedPanel) return;
    snappedPanel = clamped;

    playSnapSound();

    resetAllPanels();

    const translatePx = clamped * stepPx;
    track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.transform = `translateX(-${translatePx}px)`;

    updateDots(clamped);
    currentPanel = clamped;

    revealPanelContent(panelStates[clamped]);
  }

  function checkScroll() {
    if (resetLock) return;

    const sectionRect = servicesSection.getBoundingClientRect();
    const sectionTop = -sectionRect.top;
    const totalScrollable = servicesSection.offsetHeight - window.innerHeight;

    if (sectionTop < 0) {
      if (snappedPanel !== 0) {
        snappedPanel = 0;
        currentPanel = 0;
        panel0Revealed = false;
        track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(0)';
        updateDots(0);
      }

      wasPastSection = false;

      if (sectionRect.top > window.innerHeight * 0.5) {
        panel0Revealed = false;
        panelStates.forEach((state) => resetPanelContent(state));
      } else if (!panel0Revealed) {
        panel0Revealed = true;
        playSnapSound();
        revealPanelContent(panelStates[0]);
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
        void track.offsetHeight;
        setTimeout(() => {
          panel0Revealed = true;
          revealPanelContent(panelStates[0]);
          resetLock = false;
        }, 600);
      } else {
        const progress = sectionTop / totalScrollable;
        const targetPanel = Math.round(progress * (panelCount - 1));

        // Show continuous preview movement while scrolling
        if (targetPanel === snappedPanel) {
          const exactProgress = progress * (panelCount - 1);
          const subProgress = exactProgress - snappedPanel;
          // subProgress: -0.5 to 0.5 range around current panel
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

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const panelIndex = parseInt(dot.dataset.panel || '0', 10);
      const totalScrollable = servicesSection.offsetHeight - window.innerHeight;
      const targetScroll = servicesSection.offsetTop + (panelIndex / (panelCount - 1)) * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  // Touch swipe handlers for mobile
  let swipeCleanup: (() => void) | undefined;

  function goToPanel(panelIndex: number) {
    const clamped = Math.max(0, Math.min(panelIndex, panelCount - 1));
    const totalScrollable = servicesSection.offsetHeight - window.innerHeight;
    const sectionTop = servicesSection.getBoundingClientRect().top + window.scrollY;
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
      hscrollCleanup?.();
      hscrollCleanup = initHorizontalScroll();
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

export function initOfferSection() {
  function initAll() {
    initAbout();
    hscrollCleanup?.();
    hscrollCleanup = initHorizontalScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  document.addEventListener('astro:after-swap', initAll);

  window.addEventListener('animations-change', () => {
    hscrollCleanup?.();
    hscrollCleanup = initHorizontalScroll();
  });
}
