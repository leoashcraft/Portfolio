/**
 * Touch swipe handler for horizontal scroll sections on mobile
 */

export interface SwipeConfig {
  element: HTMLElement;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number; // minimum swipe distance in px
}

export function initTouchSwipe(config: SwipeConfig): () => void {
  const { element, onSwipeLeft, onSwipeRight, threshold = 80 } = config;

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  function onTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;

    // If horizontal movement is significantly more than vertical, prevent default scroll
    if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 20) {
      e.preventDefault();
    }
  }

  function onTouchEnd(e: TouchEvent) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Only trigger swipe if horizontal movement is significantly more than vertical
    // and exceeds the threshold
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY) * 1.5;
    if (isHorizontalSwipe && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        onSwipeLeft(); // swipe left = go to next panel
      } else {
        onSwipeRight(); // swipe right = go to previous panel
      }
    }
  }

  element.addEventListener('touchstart', onTouchStart, { passive: true });
  element.addEventListener('touchmove', onTouchMove, { passive: false });
  element.addEventListener('touchend', onTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', onTouchStart);
    element.removeEventListener('touchmove', onTouchMove);
    element.removeEventListener('touchend', onTouchEnd);
  };
}
