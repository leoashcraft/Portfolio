/**
 * Keyboard navigation for spacebar section snapping
 * Intercepts spacebar to snap to next section/panel instead of default scroll
 */

let isInitialized = false;
let isScrolling = false;

function getCurrentOfferPanel(): number {
  const dots = document.querySelectorAll('.hscroll-dot');
  for (let i = 0; i < dots.length; i++) {
    if (dots[i].classList.contains('active')) return i;
  }
  return 0;
}

function getCurrentProjectPanel(): number {
  const dots = document.querySelectorAll('.projects-hscroll-dot');
  for (let i = 0; i < dots.length; i++) {
    if (dots[i].classList.contains('active')) return i;
  }
  return 0;
}

function getCurrentExpPanel(): number {
  // Calculate current panel based on scroll position
  const section = document.querySelector('.exp-hscroll-section') as HTMLElement;
  if (!section) return 0;

  const panelCount = document.querySelectorAll('.exp-hscroll-panel').length;
  if (panelCount <= 1) return 0;

  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const sectionHeight = section.offsetHeight - window.innerHeight;
  if (sectionHeight <= 0) return 0;

  const scrollProgress = (window.scrollY - sectionTop) / sectionHeight;
  const rawPanel = scrollProgress * (panelCount - 1);
  const currentPanel = Math.round(rawPanel);
  return Math.max(0, Math.min(currentPanel, panelCount - 1));
}

function scrollToOfferPanel(index: number) {
  const section = document.querySelector('.services-section') as HTMLElement;
  if (!section) return;
  const panelCount = document.querySelectorAll('.service-panel').length;
  if (panelCount <= 1) return;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const totalScrollable = section.offsetHeight - window.innerHeight;
  const targetScroll = sectionTop + (index / (panelCount - 1)) * totalScrollable;
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}

function scrollToProjectPanel(index: number) {
  const section = document.querySelector('.projects-hscroll-section') as HTMLElement;
  if (!section) return;
  const panelCount = document.querySelectorAll('.projects-hscroll-panel').length;
  if (panelCount <= 1) return;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const totalScrollable = section.offsetHeight - window.innerHeight;
  const targetScroll = sectionTop + (index / (panelCount - 1)) * totalScrollable;
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}

function scrollToExpPanel(index: number) {
  const section = document.querySelector('.exp-hscroll-section') as HTMLElement;
  if (!section) return;
  const panelCount = document.querySelectorAll('.exp-hscroll-panel').length;
  if (panelCount <= 1) return;

  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const sectionHeight = section.offsetHeight - window.innerHeight;
  const targetScroll = sectionTop + (index / (panelCount - 1)) * sectionHeight;
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}

function handleSpacebar(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;

  // Allow default behavior for form elements
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return false;
  }

  // Prevent rapid-fire during scroll animation
  if (isScrolling) {
    return true;
  }

  const viewportHeight = window.innerHeight;

  // Check if we're in the Offer section
  const offerSection = document.querySelector('.services-section') as HTMLElement;
  if (offerSection) {
    const rect = offerSection.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5) {
      const currentPanel = getCurrentOfferPanel();
      const panelCount = document.querySelectorAll('.service-panel').length;
      if (currentPanel < panelCount - 1) {
        isScrolling = true;
        scrollToOfferPanel(currentPanel + 1);
        setTimeout(() => { isScrolling = false; }, 600);
        return true;
      } else {
        const education = document.getElementById('education');
        if (education) {
          isScrolling = true;
          const nav = document.querySelector('nav, header') as HTMLElement;
          const navHeight = nav?.offsetHeight || 0;
          const targetScroll = education.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          setTimeout(() => { isScrolling = false; }, 600);
          return true;
        }
      }
    }
  }

  // Check if we're in the Projects section
  const projectsSection = document.querySelector('.projects-hscroll-section') as HTMLElement;
  if (projectsSection) {
    const rect = projectsSection.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5) {
      const currentPanel = getCurrentProjectPanel();
      const panelCount = document.querySelectorAll('.projects-hscroll-panel').length;
      if (currentPanel < panelCount - 1) {
        isScrolling = true;
        scrollToProjectPanel(currentPanel + 1);
        setTimeout(() => { isScrolling = false; }, 600);
        return true;
      } else {
        const moreWork = document.getElementById('more-work');
        if (moreWork) {
          isScrolling = true;
          const nav = document.querySelector('nav, header') as HTMLElement;
          const navHeight = nav?.offsetHeight || 0;
          const targetScroll = moreWork.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          setTimeout(() => { isScrolling = false; }, 600);
          return true;
        }
      }
    }
  }

  // Check if we're in the Experience section
  const expSection = document.querySelector('.exp-hscroll-section') as HTMLElement;
  if (expSection) {
    const rect = expSection.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5) {
      const currentPanel = getCurrentExpPanel();
      const panelCount = document.querySelectorAll('.exp-hscroll-panel').length;
      const nextPanel = currentPanel + 1;
      if (nextPanel < panelCount) {
        isScrolling = true;
        scrollToExpPanel(nextPanel);
        setTimeout(() => { isScrolling = false; }, 1000);
        return true;
      } else {
        const github = document.getElementById('github');
        if (github) {
          isScrolling = true;
          const targetScroll = github.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          setTimeout(() => { isScrolling = false; }, 1000);
          return true;
        }
      }
    }
  }

  // Default: snap to next major section
  // For horizontal scroll sections, use the scroll container instead of the section ID
  const sectionTargets: { id: string; element: HTMLElement | null }[] = [
    { id: 'home', element: document.getElementById('home') },
    { id: 'offer', element: document.querySelector('.services-section') as HTMLElement },
    { id: 'education', element: document.getElementById('education') },
    { id: 'projects', element: document.querySelector('.projects-hscroll-section') as HTMLElement },
    { id: 'more-work', element: document.getElementById('more-work') },
    { id: 'experience', element: document.querySelector('.exp-hscroll-section') as HTMLElement },
    { id: 'github', element: document.getElementById('github') },
    { id: 'contact', element: document.getElementById('contact') },
  ].filter(t => t.element) as { id: string; element: HTMLElement }[];

  for (const { id, element } of sectionTargets) {
    const rect = element.getBoundingClientRect();
    if (rect.top > 50) {
      isScrolling = true;
      const targetScroll = rect.top + window.scrollY;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      setTimeout(() => { isScrolling = false; }, 600);
      return true;
    }
  }

  return true;
}

function keydownHandler(e: KeyboardEvent) {
  if (e.code === 'Space' && !e.shiftKey) {
    // Check active element instead of event target for more reliable detection
    const activeEl = document.activeElement as HTMLElement;
    const tagName = activeEl?.tagName || '';

    // Skip if focused on form elements
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || activeEl?.isContentEditable) {
      return;
    }

    try {
      const handled = handleSpacebar(e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    } catch (err) {
      console.error('Keyboard nav error:', err);
    }
  }
}

export function initKeyboardNav() {
  // Prevent duplicate initialization
  if (isInitialized) return;
  isInitialized = true;

  // Listen on both window and document for maximum compatibility
  window.addEventListener('keydown', keydownHandler, { capture: true });
  document.addEventListener('keydown', keydownHandler, { capture: true });
}

// Reset initialization flag on page navigation
if (typeof document !== 'undefined') {
  document.addEventListener('astro:before-swap', () => {
    isInitialized = false;
    isScrolling = false;
    window.removeEventListener('keydown', keydownHandler, { capture: true });
    document.removeEventListener('keydown', keydownHandler, { capture: true });
  });
}
