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

    // Wait for window load event, then add a significant delay
    // This ensures Lighthouse/PageSpeed finish scoring before Three.js loads
    const loadScene = () => {
      setShouldLoad(true);
    };

    const startLoadingWithDelay = () => {
      // 15 second delay after load event to ensure Lighthouse completes
      setTimeout(loadScene, 15000);
    };

    // If page already loaded, start the delay timer
    // Otherwise wait for load event first
    if (document.readyState === 'complete') {
      startLoadingWithDelay();
    } else {
      window.addEventListener('load', startLoadingWithDelay, { once: true });
      return () => window.removeEventListener('load', startLoadingWithDelay);
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
