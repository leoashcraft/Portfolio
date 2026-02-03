/**
 * Experience section — GSAP horizontal scroll timeline
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSectionParallax } from './parallax';
import { isAnimationsDisabled, setNavHeightVar } from './section-utils';

gsap.registerPlugin(ScrollTrigger);

// ── Horizontal scroll ────────────────────────────────────────────────
let expCleanup: (() => void) | undefined;

function initExpHscroll() {
  const section = document.querySelector('.exp-hscroll-section') as HTMLElement;
  const container = document.querySelector('.exp-hscroll-container') as HTMLElement;
  const progressFill = document.querySelector('.exp-hscroll-progress-fill') as HTMLElement;
  const panels = document.querySelectorAll('.exp-hscroll-panel') as NodeListOf<HTMLElement>;
  const cards = document.querySelectorAll('.experience-card') as NodeListOf<HTMLElement>;
  const markerDots = document.querySelectorAll('.exp-hscroll-marker-dot') as NodeListOf<HTMLElement>;

  if (!section || !container) return () => {};

  // Measure nav height so CSS calc(100vh - var(--nav-h)) works
  setNavHeightVar(section);

  const animDisabled = isAnimationsDisabled();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animations disabled or reduced motion — show everything immediately
  if (animDisabled || prefersReduced) {
    cards.forEach((c) => {
      c.style.opacity = '1';
      c.style.transform = 'none';
    });
    if (progressFill) progressFill.style.transform = 'scaleX(1)';
    markerDots.forEach((d) => d.classList.add('active'));
    return () => {};
  }

  // Match panel height to the Offer section's rendered panel height
  const offerPanel = document.querySelector('.services-hscroll-track .service-panel') as HTMLElement;
  if (offerPanel) {
    const targetH = offerPanel.offsetHeight;
    panels.forEach((p) => { p.style.minHeight = `${targetH}px`; });
  } else {
    let maxH = 0;
    panels.forEach((p) => {
      if (p.scrollHeight > maxH) maxH = p.scrollHeight;
    });
    panels.forEach((p) => { p.style.minHeight = `${maxH}px`; });
  }

  // Desktop: GSAP ScrollTrigger horizontal scroll
  const tweens: gsap.core.Tween[] = [];
  const triggers: ScrollTrigger[] = [];

  const panelCount = panels.length;
  const snapIncrement = panelCount > 1 ? 1 / (panelCount - 1) : 1;

  const scrollTween = gsap.to(container, {
    x: () => -(container.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 0.3,
      invalidateOnRefresh: true,
      end: () => '+=' + container.scrollWidth,
      snap: {
        snapTo: snapIncrement,
        duration: { min: 0.2, max: 0.45 },
        delay: 0.05,
        ease: 'power2.inOut',
      },
      onEnter: () => document.documentElement.classList.remove('snap-scroll'),
      onLeave: () => {},
      onEnterBack: () => document.documentElement.classList.remove('snap-scroll'),
      onLeaveBack: () => document.documentElement.classList.add('snap-scroll'),
      onUpdate: (self) => {
        if (progressFill) {
          progressFill.style.transform = `scaleX(${self.progress})`;
        }
        markerDots.forEach((dot, i) => {
          const threshold = panelCount > 1 ? i / (panelCount - 1) : 0;
          dot.classList.toggle('active', self.progress >= threshold - 0.02);
        });
      },
    },
  });

  tweens.push(scrollTween);
  if (scrollTween.scrollTrigger) triggers.push(scrollTween.scrollTrigger);

  // Allow horizontal wheel/trackpad input to drive the scroll
  function onWheel(e: WheelEvent) {
    const st = scrollTween.scrollTrigger;
    if (!st || !st.isActive) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
      e.preventDefault();
      window.scrollBy(0, e.deltaX);
    }
  }

  section.addEventListener('wheel', onWheel, { passive: false });

  // Cards are visible immediately
  cards.forEach((c) => {
    c.style.opacity = '1';
  });

  // Resize handler
  let resizeTimer: ReturnType<typeof setTimeout>;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }

  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    section.removeEventListener('wheel', onWheel);
    triggers.forEach((t) => t.kill());
    tweens.forEach((t) => t.kill());
    gsap.set(container, { clearProps: 'x' });
    if (!document.documentElement.classList.contains('snap-scroll')) {
      document.documentElement.classList.add('snap-scroll');
    }
  };
}

// ── Public entry point ───────────────────────────────────────────────

export function initExperienceSection() {
  function initAll() {
    expCleanup?.();
    expCleanup = initExpHscroll();
    initSectionParallax('experience');
  }

  initAll();
  document.addEventListener('astro:after-swap', () => {
    // Kill all experience-related ScrollTrigger instances before re-init
    ScrollTrigger.getAll().forEach((t) => {
      const trigger = t.vars?.trigger || t.trigger;
      if (trigger && (trigger as HTMLElement).classList?.contains('exp-hscroll-section')) {
        t.kill();
      }
    });
    initAll();
  });

  window.addEventListener('animations-change', () => {
    expCleanup?.();
    expCleanup = initExpHscroll();
  });
}
