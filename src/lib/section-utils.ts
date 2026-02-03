/**
 * Small shared helpers used across section scripts
 */

/** Returns nav offsetHeight or 60 fallback */
export function getNavHeight(): number {
  const nav = document.getElementById('main-nav');
  return nav ? nav.offsetHeight : 60;
}

/** Checks data-animations attribute on <html> */
export function isAnimationsDisabled(): boolean {
  return document.documentElement.getAttribute('data-animations') === 'disabled';
}

/** Measures nav and sets --nav-h CSS custom property on element. Returns nav height. */
export function setNavHeightVar(el: HTMLElement): number {
  const navH = getNavHeight();
  el.style.setProperty('--nav-h', `${navH}px`);
  return navH;
}
