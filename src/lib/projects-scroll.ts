/**
 * Projects section — horizontal scroll, project modals, external link modal,
 * "More Work" card reveal, icon flips, parallax, scroll-wave
 */

import { initIconFlips } from './icon-flip';
import { initSectionParallax } from './parallax';
import { initScrollWave } from './scroll-wave';
import { createSnapSound, createTapSound, playSoundCascade } from './sounds';
import { isAnimationsDisabled, setNavHeightVar } from './section-utils';
import { initScrollReveal } from './scroll-reveal';
import { initTouchSwipe } from './touch-swipe';

// ── Sounds ───────────────────────────────────────────────────────────
const playSnapSound = createSnapSound('/sounds/movement-101711.mp3');
const playMoreWorkTapSound = createTapSound('/sounds/step_1-389275.mp3');

// ── Icon flips ───────────────────────────────────────────────────────
let iconCleanup: () => void;

function initProjectIconFlips() {
  iconCleanup?.();
  iconCleanup = initIconFlips({
    selector: '.project-icon',
    randomFlip: true,
    randomFlipDelay: [3000, 7000],
  });
}

// ── Project modals ───────────────────────────────────────────────────
function initProjectModals() {
  // Open modal on trigger click
  document.querySelectorAll('[data-modal-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId || '');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal on close button click
  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('[role="dialog"]');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });

  // Back button handler for nested modals
  document.querySelectorAll('[data-back-to-modal]').forEach((backBtn) => {
    backBtn.addEventListener('click', () => {
      const targetModalId = backBtn.getAttribute('data-back-to-modal');
      const currentModal = backBtn.closest('[role="dialog"]');
      const targetModal = document.getElementById(targetModalId || '');

      if (currentModal && targetModal) {
        currentModal.classList.add('hidden');
        currentModal.classList.remove('flex');
        targetModal.classList.remove('hidden');
        targetModal.classList.add('flex');
      }
    });
  });

  // Close modal on backdrop click
  document.querySelectorAll('[data-modal-backdrop]').forEach((backdrop) => {
    backdrop.addEventListener('click', () => {
      const modal = backdrop.closest('[role="dialog"]');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('[role="dialog"]:not(.hidden)');
      if (openModal) {
        openModal.classList.add('hidden');
        openModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    }
  });
}

// ── External link confirmation modal ─────────────────────────────────
function initExternalLinkModal() {
  const modal = document.getElementById('external-link-modal');
  const urlDisplay = document.getElementById('external-link-url');
  const confirmBtn = document.querySelector('[data-external-modal-confirm]');
  const cancelBtn = document.querySelector('[data-external-modal-cancel]');
  const backdrop = document.querySelector('[data-external-modal-backdrop]');

  let pendingUrl = '';

  function openExternalModal(url: string) {
    pendingUrl = url;
    if (urlDisplay) urlDisplay.textContent = url;
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeExternalModal() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
    pendingUrl = '';
  }

  // Intercept external link clicks
  document.querySelectorAll('.external-link, a[data-external-url]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('data-external-url') || link.getAttribute('href');
      if (url && url !== '#') {
        openExternalModal(url);
      }
    });
  });

  // Also intercept btn-primary links that go external
  document.querySelectorAll('a.btn-primary[href^="http"], a.btn-primary[href^="https"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');
      if (url) {
        openExternalModal(url);
      }
    });
  });

  // Confirm button - open in new tab
  confirmBtn?.addEventListener('click', () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    }
    closeExternalModal();
  });

  cancelBtn?.addEventListener('click', closeExternalModal);
  backdrop?.addEventListener('click', closeExternalModal);
}

// ── Featured projects horizontal scroll ──────────────────────────────
let projectsHscrollCleanup: (() => void) | undefined;

function initProjectsHscroll() {
  // Skip horizontal scroll on very small screens (374px and below)
  if (window.innerWidth <= 374) return () => {};

  const section = document.querySelector('.projects-hscroll-section') as HTMLElement;
  const container = document.querySelector('.projects-hscroll-container') as HTMLElement;
  const track = document.querySelector('.projects-hscroll-track') as HTMLElement;
  const dots = document.querySelectorAll('.projects-hscroll-dot') as NodeListOf<HTMLElement>;

  if (!section || !container || !track) return () => {};

  const panels = track.querySelectorAll('.projects-hscroll-panel') as NodeListOf<HTMLElement>;
  const projects = track.querySelectorAll('.featured-project') as NodeListOf<HTMLElement>;
  const panelCount = panels.length;

  if (panelCount === 0) return () => {};

  const animDisabled = isAnimationsDisabled();

  // Show all content when animations disabled
  if (animDisabled) {
    projects.forEach((p) => {
      p.classList.add('image-in', 'content-in', 'metrics-in', 'tags-in', 'links-in');
    });
  }

  // Measure nav height
  setNavHeightVar(container);

  // Equalize panel heights
  panels.forEach((p) => { p.style.minHeight = ''; });
  projects.forEach((p) => {
    p.classList.add('image-in', 'content-in', 'metrics-in', 'tags-in', 'links-in');
  });
  let maxH = 0;
  panels.forEach((p) => {
    if (p.scrollHeight > maxH) maxH = p.scrollHeight;
  });
  panels.forEach((p) => { p.style.minHeight = `${maxH}px`; });
  if (!animDisabled) {
    projects.forEach((p) => {
      p.classList.remove('image-in', 'content-in', 'metrics-in', 'tags-in', 'links-in');
    });
  }

  const stepPx = container.offsetWidth;

  const scrollPerPanel = window.innerHeight * 0.7;
  section.style.height = `${window.innerHeight + (panelCount - 1) * scrollPerPanel}px`;

  let ticking = false;
  let snappedPanel = -1;
  let panel0Revealed = false;
  let wasPastSection = false;
  let resetLock = false;
  const previewOffset = 50; // pixels of preview movement
  let snapTime = 0; // timestamp of last snap for lockout

  let activeTimers: ReturnType<typeof setTimeout>[] = [];

  function revealPanel(index: number) {
    const project = projects[index];
    if (!project) return;

    project.classList.add('image-in');
    activeTimers.push(setTimeout(() => project.classList.add('content-in'), 200));
    activeTimers.push(setTimeout(() => project.classList.add('metrics-in'), 350));
    activeTimers.push(setTimeout(() => project.classList.add('tags-in'), 500));
    activeTimers.push(setTimeout(() => project.classList.add('links-in'), 650));
  }

  function resetAllPanels() {
    activeTimers.forEach((t) => clearTimeout(t));
    activeTimers = [];
    projects.forEach((p) => {
      p.classList.remove('image-in', 'content-in', 'metrics-in', 'tags-in', 'links-in');
    });
  }

  function updateDots(activeIndex: number) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  let pendingSnapTimer: ReturnType<typeof setTimeout> | null = null;

  function snapTo(panelIndex: number) {
    const clamped = Math.max(0, Math.min(panelIndex, panelCount - 1));
    if (clamped === snappedPanel) return;
    snappedPanel = clamped;

    playSnapSound();
    snapTime = Date.now();

    if (pendingSnapTimer) clearTimeout(pendingSnapTimer);

    pendingSnapTimer = setTimeout(() => {
      pendingSnapTimer = null;

      resetAllPanels();

      const translatePx = clamped * stepPx;
      track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      track.style.transform = `translateX(-${translatePx}px)`;

      updateDots(clamped);
      revealPanel(clamped);
    }, 250);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      if (resetLock) { ticking = false; return; }

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = -sectionRect.top;
      const totalScrollable = section.offsetHeight - window.innerHeight;

      if (sectionTop < 0) {
        if (snappedPanel !== 0) {
          snappedPanel = 0;
          panel0Revealed = false;
          track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          track.style.transform = 'translateX(0)';
          updateDots(0);
        }

        wasPastSection = false;

        if (sectionRect.top > window.innerHeight * 0.5) {
          panel0Revealed = false;
          resetAllPanels();
        } else if (!panel0Revealed) {
          panel0Revealed = true;
          playSnapSound();
          revealPanel(0);
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
          panel0Revealed = false;
          snapTime = Date.now(); // Prevent preview from applying during reset
          resetAllPanels();
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          updateDots(0);
          void track.offsetHeight;
          setTimeout(() => {
            panel0Revealed = true;
            revealPanel(0);
            snapTime = Date.now(); // Reset again after reveal
            resetLock = false;
          }, 600);
        } else {
          const progress = sectionTop / totalScrollable;
          const targetPanel = Math.round(progress * (panelCount - 1));

          // Show continuous preview movement while scrolling (with lockout after snap)
          const timeSinceSnap = Date.now() - snapTime;
          if (targetPanel === snappedPanel && snappedPanel >= 0 && timeSinceSnap > 500) {
            const exactProgress = progress * (panelCount - 1);
            const subProgress = exactProgress - snappedPanel;
            // Only apply preview when scrolling forward (positive subProgress)
            if (subProgress > 0.05) {
              const previewPx = subProgress * previewOffset * 2;
              const basePx = snappedPanel * stepPx;
              track.style.transition = 'none';
              track.style.transform = `translateX(-${basePx + previewPx}px)`;
            }
          }

          snapTo(targetPanel);
        }
      }

      ticking = false;
    });
  }

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const panelIndex = parseInt(dot.dataset.panel || '0', 10);
      const totalScrollable = section.offsetHeight - window.innerHeight;
      const targetScroll = section.offsetTop + (panelIndex / (panelCount - 1)) * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  // Touch swipe handlers for mobile
  let swipeCleanup: (() => void) | undefined;

  function goToPanel(panelIndex: number) {
    const clamped = Math.max(0, Math.min(panelIndex, panelCount - 1));
    const totalScrollable = section.offsetHeight - window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetScroll = sectionTop + (clamped / (panelCount - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }

  swipeCleanup = initTouchSwipe({
    element: container,
    onSwipeLeft: () => goToPanel(snappedPanel + 1),
    onSwipeRight: () => goToPanel(snappedPanel - 1),
    threshold: 50,
  });

  // Resize: full reinit
  let resizeTimer: ReturnType<typeof setTimeout>;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      projectsHscrollCleanup?.();
      projectsHscrollCleanup = initProjectsHscroll();
    }, 200);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    clearTimeout(resizeTimer);
    swipeCleanup?.();
  };
}

// ── Other projects (More Work) card reveal ───────────────────────────
let otherProjectsCleanup: (() => void) | undefined;
let waveCleanup: (() => void) | undefined;

function initOtherProjects() {
  const cascade = playSoundCascade(playMoreWorkTapSound);

  otherProjectsCleanup?.();
  otherProjectsCleanup = initScrollReveal({
    sectionSelector: '.other-projects-section',
    gridSelector: '.other-projects-grid',
    cardSelector: '.other-project-card',
    titleSelector: '.other-projects-title',
    revealClass: 'visible',
    revealTarget: 'cards',
    onReveal: () => cascade.play(),
  });

  waveCleanup?.();
  waveCleanup = initScrollWave({
    selector: '.other-projects-title',
    waveStart: 0.75,
    waveEnd: 0.35,
  });
}

// ── Public entry point ───────────────────────────────────────────────

export function initProjectsSection() {
  // Modals + external link modal
  initProjectModals();
  initExternalLinkModal();
  document.addEventListener('astro:after-swap', () => {
    initProjectModals();
    initExternalLinkModal();
  });

  // Icon flips + parallax
  function initProjects() {
    initProjectIconFlips();
    initSectionParallax('projects');
  }

  initProjects();
  document.addEventListener('astro:after-swap', initProjects);

  // Featured projects horizontal scroll
  function initProjectSlides() {
    projectsHscrollCleanup?.();
    projectsHscrollCleanup = initProjectsHscroll();
  }

  initProjectSlides();
  document.addEventListener('astro:after-swap', initProjectSlides);

  // Other projects
  initOtherProjects();
  document.addEventListener('astro:after-swap', initOtherProjects);

  // Re-init on animations toggle
  window.addEventListener('animations-change', () => {
    projectsHscrollCleanup?.();
    projectsHscrollCleanup = initProjectsHscroll();
    initOtherProjects();
  });
}
