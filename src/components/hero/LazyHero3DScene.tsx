import { useState, useEffect, lazy, Suspense } from 'react';

// Dynamically import the heavy 3D scene
const Hero3DScene = lazy(() => import('./scenes'));

export default function LazyHero3DScene() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're on desktop
    if (window.innerWidth < 768) {
      return;
    }

    // Wait for idle time or 2 seconds, whichever comes first
    const loadScene = () => {
      setShouldLoad(true);
      // Fade in after component mounts
      setTimeout(() => setIsVisible(true), 100);
    };

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(loadScene, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(loadScene, 1500);
      return () => clearTimeout(id);
    }
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Suspense fallback={null}>
        <Hero3DScene />
      </Suspense>
    </div>
  );
}
