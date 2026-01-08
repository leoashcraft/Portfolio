import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Scanline, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Floating spores/particles from the Upside Down
function UpsideDownSpores({ count = 300 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      velocity: Math.random() * 0.01 + 0.005,
      scale: Math.random() * 0.15 + 0.02,
      flickerSpeed: Math.random() * 2 + 1,
      flickerOffset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      // Slow upward drift like spores
      particle.position[1] += particle.velocity;

      // Slight horizontal drift
      particle.position[0] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;

      // Reset when out of bounds
      if (particle.position[1] > 12) {
        particle.position[1] = -12;
        particle.position[0] = (Math.random() - 0.5) * 30;
      }

      // Flickering effect
      const flicker = Math.sin(state.clock.elapsedTime * particle.flickerSpeed + particle.flickerOffset);
      const scale = particle.scale * (0.5 + flicker * 0.5);

      dummy.position.set(...particle.position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ff2a00" transparent opacity={0.8} />
    </instancedMesh>
  );
}

// Lightning bolt effect
function Lightning() {
  const [visible, setVisible] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const flash = () => {
      if (Math.random() > 0.7) {
        setVisible(true);
        setTimeout(() => setVisible(false), 50 + Math.random() * 100);
        setTimeout(() => {
          if (Math.random() > 0.5) {
            setVisible(true);
            setTimeout(() => setVisible(false), 30 + Math.random() * 50);
          }
        }, 100);
      }
    };

    const interval = setInterval(flash, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <pointLight
      ref={lightRef}
      position={[0, 10, 5]}
      color="#ff4444"
      intensity={visible ? 50 : 0}
      distance={50}
    />
  );
}

// Flickering neon light
function FlickeringLight({ position, color }: { position: [number, number, number]; color: string }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    // Erratic flickering like broken neon
    const flicker = Math.sin(state.clock.elapsedTime * 30) *
                    Math.sin(state.clock.elapsedTime * 17) *
                    Math.sin(state.clock.elapsedTime * 23);
    lightRef.current.intensity = Math.max(0, 2 + flicker * 1.5);
  });

  return <pointLight ref={lightRef} position={position} color={color} intensity={2} distance={15} />;
}

// Floating debris from the Upside Down
function FloatingDebris() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  const debris = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15 - 5,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <group ref={meshRef}>
      {debris.map((item, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh position={item.position} rotation={item.rotation} scale={item.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#1a0a0a"
              roughness={0.9}
              metalness={0.1}
              emissive="#330000"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Pulsing portal/rift effect
function UpsideDownPortal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
  });

  const portalShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;

      void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float angle = atan(center.y, center.x);

        float swirl = sin(dist * 10.0 - time * 2.0 + angle * 3.0) * 0.5 + 0.5;
        float pulse = sin(time * 3.0) * 0.3 + 0.7;

        float alpha = smoothstep(0.5, 0.2, dist) * swirl * pulse;
        vec3 color = mix(vec3(0.8, 0.0, 0.0), vec3(0.3, 0.0, 0.0), dist * 2.0);

        gl_FragColor = vec4(color, alpha * 0.6);
      }
    `,
  }), []);

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={materialRef}
        {...portalShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Fog/mist layer
function DarkMist() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color="#0a0000" transparent opacity={0.3} />
    </mesh>
  );
}

// Vine-like tendrils
function Tendrils() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.5) * 0.1;
    });
  });

  const tendrils = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (i % 2 === 0 ? -1 : 1) * (8 + Math.random() * 4),
        -3 + Math.random() * 2,
        -5 - Math.random() * 5,
      ] as [number, number, number],
      rotation: [0, 0, (i % 2 === 0 ? 1 : -1) * (0.3 + Math.random() * 0.3)] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {tendrils.map((tendril, i) => (
        <mesh key={i} position={tendril.position} rotation={tendril.rotation} scale={tendril.scale}>
          <cylinderGeometry args={[0.05, 0.15, 8, 8]} />
          <meshStandardMaterial color="#1a0505" roughness={1} emissive="#220000" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Dark ambient */}
      <ambientLight intensity={0.05} color="#ff0000" />

      {/* Main red atmospheric lights */}
      <pointLight position={[0, 5, 10]} color="#ff2200" intensity={1} distance={30} />
      <pointLight position={[-10, 0, 0]} color="#aa0000" intensity={0.5} distance={20} />
      <pointLight position={[10, 0, 0]} color="#ff0000" intensity={0.5} distance={20} />

      {/* Flickering lights */}
      <FlickeringLight position={[-5, 3, 5]} color="#ff3300" />
      <FlickeringLight position={[5, 2, 3]} color="#ff2200" />
      <FlickeringLight position={[0, -2, 8]} color="#ff4400" />

      {/* Lightning effect */}
      <Lightning />

      {/* Background portal */}
      <UpsideDownPortal />

      {/* Spores/particles */}
      <UpsideDownSpores count={250} />

      {/* Floating debris */}
      <FloatingDebris />

      {/* Dark mist */}
      <DarkMist />

      {/* Tendrils */}
      <Tendrils />

      {/* Fog */}
      <fog attach="fog" args={['#0a0000', 5, 30]} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
        <Scanline
          blendFunction={BlendFunction.OVERLAY}
          density={1.5}
          opacity={0.1}
        />
        <Noise
          opacity={0.05}
          blendFunction={BlendFunction.OVERLAY}
        />
      </EffectComposer>
    </>
  );
}

// Fallback for reduced motion or no WebGL
function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0000] via-[#1a0505] to-[#0a0000]">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-orange-900/20 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

// Main component
export default function StrangerThingsScene() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted) {
    return <StaticFallback />;
  }

  if (prefersReducedMotion || !hasWebGL) {
    return <StaticFallback />;
  }

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 10], fov: 60 }}
    >
      <Scene />
    </Canvas>
  );
}
