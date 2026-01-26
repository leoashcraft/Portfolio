/**
 * Theme utility for toggling between normal and high contrast modes
 */

export type Theme = 'normal' | 'high-contrast';

const STORAGE_KEY = 'portfolio-theme';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'normal';
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'normal';
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}

export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === 'normal' ? 'high-contrast' : 'normal';
  setTheme(next);
  return next;
}

export function initTheme(): void {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}
