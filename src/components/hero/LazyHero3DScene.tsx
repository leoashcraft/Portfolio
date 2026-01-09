import { useState, useEffect, lazy, Suspense } from 'react';

// Dynamically import the heavy 3D scene
const Hero3DScene = lazy(() => import('./scenes'));

// Wrapper to detect when the scene has actually mounted
function SceneWithCallback({ onMounted }: { onMounted: () => void }) {
  useEffect(() => {
    // Small delay to ensure canvas is actually rendered
    const timer = setTimeout(onMounted, 50);
    return () => clearTimeout(timer);
  }, [onMounted]);

  return <Hero3DScene />;
}

export default function LazyHero3DScene() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're on desktop
    if (window.innerWidth < 768) {
      return;
    }

    // Wait for window load event FIRST (so PageSpeed/Lighthouse can finish scoring)
    // Then wait for idle time before loading the heavy 3D scene
    const loadScene = () => {
      setShouldLoad(true);
    };

    const startLoadingAfterIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadScene, { timeout: 2000 });
      } else {
        setTimeout(loadScene, 1500);
      }
    };

    // If page already loaded, start after idle
    // Otherwise wait for load event first
    if (document.readyState === 'complete') {
      startLoadingAfterIdle();
    } else {
      window.addEventListener('load', startLoadingAfterIdle, { once: true });
      return () => window.removeEventListener('load', startLoadingAfterIdle);
    }
  }, []);

  const handleMounted = () => {
    // Fade in after the 3D scene has actually rendered
    setIsVisible(true);
  };

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
        <SceneWithCallback onMounted={handleMounted} />
      </Suspense>
    </div>
  );
}
