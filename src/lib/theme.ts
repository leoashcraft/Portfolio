/**
 * Theme utility for toggling between normal, high contrast dark, and high contrast light modes
 * Also handles animation preferences
 */

export type Theme = 'normal' | 'high-contrast' | 'high-contrast-light';

const STORAGE_KEY = 'portfolio-theme';
const ANIMATIONS_KEY = 'portfolio-animations';

// Theme cycle order
const THEME_ORDER: Theme[] = ['normal', 'high-contrast', 'high-contrast-light'];

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'normal';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme;
  // Validate stored value is a valid theme
  if (stored && THEME_ORDER.includes(stored)) {
    return stored;
  }
  return 'normal';
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}

export function toggleTheme(): Theme {
  const current = getTheme();
  const currentIndex = THEME_ORDER.indexOf(current);
  const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
  const next = THEME_ORDER[nextIndex];
  setTheme(next);
  return next;
}

export function initTheme(): void {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);

  // Also init animations preference
  const animationsEnabled = getAnimationsEnabled();
  document.documentElement.setAttribute('data-animations', animationsEnabled ? 'enabled' : 'disabled');
}

// Animation preference functions
export function getAnimationsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(ANIMATIONS_KEY);
  // Default to enabled if not set
  return stored !== 'disabled';
}

export function setAnimationsEnabled(enabled: boolean): void {
  localStorage.setItem(ANIMATIONS_KEY, enabled ? 'enabled' : 'disabled');
  document.documentElement.setAttribute('data-animations', enabled ? 'enabled' : 'disabled');
  window.dispatchEvent(new CustomEvent('animations-change', { detail: { enabled } }));
}

export function toggleAnimations(): boolean {
  const current = getAnimationsEnabled();
  const next = !current;
  setAnimationsEnabled(next);
  return next;
}
