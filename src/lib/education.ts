/**
 * Education section — card reveal, year counters, scroll-wave title
 */

import { initScrollWave } from './scroll-wave';
import { createTapSound, playSoundCascade } from './sounds';
import { initScrollReveal } from './scroll-reveal';

// ── Sounds ───────────────────────────────────────────────────────────
const playEduTapSound = createTapSound('/sounds/step_1-389275.mp3');

// ── Card reveal via shared scroll-reveal ─────────────────────────────
let eduCleanup: (() => void) | undefined;
let waveCleanup: (() => void) | undefined;

function initEducationCards() {
  const cascade = playSoundCascade(playEduTapSound);

  eduCleanup?.();
  eduCleanup = initScrollReveal({
    sectionSelector: '.education-section',
    gridSelector: '.education-grid',
    titleSelector: '.education-title',
    revealClass: 'cards-in',
    revealTarget: 'grid',
    onReveal: () => cascade.play(),
  });

  waveCleanup?.();
  waveCleanup = initScrollWave({
    selector: '.education-title',
    waveStart: 0.75,
    waveEnd: 0.35,
  });
}

// ── Year counter animation ───────────────────────────────────────────

function animateCounter(element: HTMLElement, start: number, end: number) {
  const duration = 1500;
  const startTime = performance.now();
  const range = end - start;

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + range * easeOut);
    element.textContent = current.toString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initYearCounters(skipInitialInView = false) {
  const counters = document.querySelectorAll('.year-counter');
  const animatedCounters = new Set<Element>();
  const wasOutOfView = new Set<Element>();
  const pendingTimeouts: number[] = [];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        wasOutOfView.add(entry.target);
      } else if (entry.isIntersecting && !animatedCounters.has(entry.target)) {
        if (!skipInitialInView || wasOutOfView.has(entry.target)) {
          animatedCounters.add(entry.target);
          const target = entry.target as HTMLElement;
          const targetYear = parseInt(target.dataset.targetYear || '2000', 10);
          const timeoutId = window.setTimeout(() => {
            animateCounter(target, 2000, targetYear);
          }, 1000);
          pendingTimeouts.push(timeoutId);
        }
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => {
    counter.textContent = '2000';
    observer.observe(counter);
  });

  return () => {
    observer.disconnect();
    animatedCounters.clear();
    wasOutOfView.clear();
    pendingTimeouts.forEach((id) => clearTimeout(id));
    pendingTimeouts.length = 0;
  };
}

let yearCleanup: (() => void) | undefined;

function initYears() {
  yearCleanup?.();
  yearCleanup = initYearCounters();
}

function resetYearCounters() {
  yearCleanup?.();
  document.querySelectorAll('.year-counter').forEach((counter) => {
    counter.textContent = '2000';
  });
  yearCleanup = initYearCounters(true);
}

// ── Public entry point ───────────────────────────────────────────────

export function initEducationSection() {
  function initAll() {
    initEducationCards();
    initYears();
  }

  initAll();
  document.addEventListener('astro:after-swap', initAll);

  window.addEventListener('animations-change', () => {
    initEducationCards();
  });

  initYears();
  document.addEventListener('astro:after-swap', initYears);

  document.querySelectorAll('nav a[href^="#"], .back-to-top, a[href="#home"]').forEach((link) => {
    link.addEventListener('click', resetYearCounters);
  });
}
