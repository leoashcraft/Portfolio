import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Trail } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Code particles floating in 3D space
function CodeParticles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions and velocities
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      velocity: (Math.random() - 0.5) * 0.02,
      scale: Math.random() * 0.5 + 0.1,
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      // Animate Y position
      particle.position[1] += particle.velocity;

      // Reset when out of bounds
      if (particle.position[1] > 10) particle.position[1] = -10;
      if (particle.position[1] < -10) particle.position[1] = 10;

      // Add subtle wave motion
      const wave = Math.sin(state.clock.elapsedTime + i * 0.1) * 0.02;
      dummy.position.set(
        particle.position[0] + wave,
        particle.position[1],
        particle.position[2]
      );
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshBasicMaterial color="#00fff7" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Floating geometric shapes
function FloatingShape({
  position,
  color,
  size = 1,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.3;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Trail
        width={1}
        length={4}
        color={color}
        attenuation={(t) => t * t}
      >
        <mesh ref={mesh} position={position}>
          <octahedronGeometry args={[size * 0.3]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>
      </Trail>
    </Float>
  );
}

// Glowing orb
function GlowingOrb({
  position,
  color,
  size = 0.5,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    mesh.current.scale.setScalar(scale * size);
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Orbiting ring
function OrbitingRing() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.PI / 2;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[3, 0.02, 16, 100]} />
      <meshStandardMaterial
        color="#00fff7"
        emissive="#00fff7"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />

      {/* Colored point lights */}
      <pointLight position={[10, 10, 10]} color="#00fff7" intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={0.5} />
      <pointLight position={[0, 10, -10]} color="#ec4899" intensity={0.3} />

      {/* Stars background */}
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Code particles */}
      <CodeParticles count={150} />

      {/* Floating shapes */}
      <FloatingShape position={[-3, 2, -2]} color="#00fff7" size={1} />
      <FloatingShape position={[4, -1, -3]} color="#a855f7" size={0.8} />
      <FloatingShape position={[2, 3, -4]} color="#ec4899" size={0.6} />
      <FloatingShape position={[-4, -2, -5]} color="#22c55e" size={0.7} />

      {/* Glowing orbs */}
      <GlowingOrb position={[-2, -3, -2]} color="#00fff7" size={0.3} />
      <GlowingOrb position={[3, 2, -3]} color="#a855f7" size={0.4} />
      <GlowingOrb position={[0, -2, -4]} color="#ec4899" size={0.25} />

      {/* Orbiting ring */}
      <OrbitingRing />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.8}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

// Fallback for reduced motion or no WebGL
function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-night-900 via-night-800 to-night-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-neon-pink/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

// Main component with SSR handling
export default function Hero3DScene() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Show nothing during SSR
  if (!mounted) {
    return <StaticFallback />;
  }

  // Show static fallback if reduced motion or no WebGL
  if (prefersReducedMotion || !hasWebGL) {
    return <StaticFallback />;
  }

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 60 }}
    >
      <Scene />
    </Canvas>
  );
}
