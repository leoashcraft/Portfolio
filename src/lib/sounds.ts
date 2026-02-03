/**
 * Shared sound utilities — snap sounds, tap sounds, and cascaded playback
 */

function isSoundEnabled(): boolean {
  return document.documentElement.getAttribute('data-sounds') !== 'disabled';
}

/**
 * Creates a snap-sound player with lazy Audio creation and 1 s debounce.
 * The returned function is safe to call rapidly — duplicate calls within
 * the debounce window are silently ignored.
 */
export function createSnapSound(url: string, volume = 0.3): () => void {
  let audio: HTMLAudioElement | null = null;
  let lastTime = 0;

  function getAudio(): HTMLAudioElement | null {
    if (!audio) {
      try {
        audio = new Audio(url);
        audio.volume = volume;
      } catch (_) {
        return null;
      }
    }
    return audio;
  }

  return function playSnapSound() {
    if (!isSoundEnabled()) return;
    const now = Date.now();
    if (now - lastTime < 1000) return;
    lastTime = now;
    const snd = getAudio();
    if (!snd) return;
    snd.currentTime = 0;
    snd.play().catch(() => {});
  };
}

/**
 * Creates a tap-sound player that uses the clone-to-play pattern
 * so overlapping plays work (each call creates a throwaway clone).
 */
export function createTapSound(url: string, volume = 0.25): () => void {
  let audio: HTMLAudioElement | null = null;

  function getAudio(): HTMLAudioElement | null {
    if (!audio) {
      try {
        audio = new Audio(url);
        audio.volume = volume;
      } catch (_) {
        return null;
      }
    }
    return audio;
  }

  return function playTapSound() {
    if (!isSoundEnabled()) return;
    const snd = getAudio();
    if (!snd) return;
    const clone = snd.cloneNode() as HTMLAudioElement;
    clone.volume = snd.volume;
    clone.play().catch(() => {});
  };
}

/**
 * Returns a controller for staggered sound playback.
 * `play()` fires `playFn` at each delay; `reset()` clears timers
 * and allows `play()` to fire again.
 */
export function playSoundCascade(
  playFn: () => void,
  delays: number[] = [250, 350, 450, 550],
): { timers: ReturnType<typeof setTimeout>[]; played: boolean; play: () => void; reset: () => void } {
  const state = {
    timers: [] as ReturnType<typeof setTimeout>[],
    played: false,
    play() {
      if (state.played) return;
      state.played = true;
      delays.forEach((delay) => {
        state.timers.push(setTimeout(() => playFn(), delay));
      });
    },
    reset() {
      state.timers.forEach((t) => clearTimeout(t));
      state.timers = [];
      state.played = false;
    },
  };
  return state;
}
