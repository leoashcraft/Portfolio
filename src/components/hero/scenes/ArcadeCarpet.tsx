import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// Neon colors from 80s arcade carpets
const NEON_COLORS = [
  '#ff00ff', // Hot pink/magenta
  '#ffff00', // Yellow
  '#ff6600', // Orange
  '#00ff00', // Lime green
  '#ff0066', // Hot pink
  '#6600ff', // Purple
];

// Floating geometric shapes (triangles, circles, squares)
function FloatingShapes({ count = 40 }: { count?: number }) {
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 15 - 5,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: Math.random() * 0.4 + 0.2,
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      type: ['triangle', 'circle', 'square', 'diamond'][Math.floor(Math.random() * 4)],
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      floatSpeed: Math.random() * 0.5 + 0.3,
    }));
  }, [count]);

  useFrame((state) => {
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.x += shapes[i].rotationSpeed;
      mesh.rotation.y += shapes[i].rotationSpeed * 0.7;
      mesh.rotation.z += shapes[i].rotationSpeed * 0.5;
    });
  });

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={shape.floatSpeed} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh
            ref={(el) => { if (el) meshRefs.current[i] = el; }}
            position={shape.position}
            rotation={shape.rotation}
            scale={shape.scale}
          >
            {shape.type === 'triangle' && <coneGeometry args={[1, 1.5, 3]} />}
            {shape.type === 'circle' && <torusGeometry args={[1, 0.15, 8, 32]} />}
            {shape.type === 'square' && <boxGeometry args={[1, 1, 0.1]} />}
            {shape.type === 'diamond' && <octahedronGeometry args={[0.8]} />}
            <meshBasicMaterial color={shape.color} transparent opacity={0.9} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Squiggly/wavy neon lines
function SquigglyLines({ count = 12 }: { count?: number }) {
  const linesRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points: THREE.Vector3[] = [];
      const segments = 30;
      const amplitude = Math.random() * 0.8 + 0.3;
      const frequency = Math.random() * 3 + 2;
      const length = Math.random() * 8 + 4;

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const x = (t - 0.5) * length;
        const y = Math.sin(t * Math.PI * frequency) * amplitude;
        const z = Math.cos(t * Math.PI * frequency * 0.5) * amplitude * 0.5;
        points.push(new THREE.Vector3(x, y, z));
      }

      return {
        points,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10 - 8,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });
  }, [count]);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.children.forEach((child, i) => {
      const material = (child as THREE.Line).material as THREE.LineBasicMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * 2 + lines[i].pulseOffset) * 0.3 + 0.7;
      material.opacity = pulse;
    });
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i} position={line.position} rotation={line.rotation}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={line.points.length}
              array={new Float32Array(line.points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={line.color} transparent opacity={0.8} linewidth={2} />
        </line>
      ))}
    </group>
  );
}

// Zigzag patterns
function ZigzagPatterns({ count = 8 }: { count?: number }) {
  const zigzags = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points: THREE.Vector3[] = [];
      const segments = 10;
      const width = Math.random() * 4 + 2;
      const height = Math.random() * 0.8 + 0.4;

      for (let j = 0; j <= segments; j++) {
        const x = (j / segments - 0.5) * width;
        const y = (j % 2 === 0 ? height : -height);
        points.push(new THREE.Vector3(x, y, 0));
      }

      return {
        points,
        position: [
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8 - 6,
        ] as [number, number, number],
        rotation: [0, 0, Math.random() * Math.PI] as [number, number, number],
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      };
    });
  }, [count]);

  return (
    <>
      {zigzags.map((zigzag, i) => (
        <line key={i} position={zigzag.position} rotation={zigzag.rotation}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={zigzag.points.length}
              array={new Float32Array(zigzag.points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={zigzag.color} transparent opacity={0.9} />
        </line>
      ))}
    </>
  );
}


// Grid floor effect (Tron-style)
function NeonGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    // Slow scroll effect
    gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
  });

  return (
    <group position={[0, -6, 0]} rotation={[0, 0, 0]}>
      <gridHelper
        ref={gridRef}
        args={[40, 40, '#ff00ff', '#6600ff']}
        position={[0, 0, -10]}
      />
      {/* Glow plane under grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -10]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color="#1a0a2a" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Scattered dots/circles (like carpet pattern)
function ScatteredDots({ count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const dots = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 8,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.05,
      pulseSpeed: Math.random() * 2 + 1,
      pulseOffset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    dots.forEach((dot, i) => {
      const pulse = Math.sin(state.clock.elapsedTime * dot.pulseSpeed + dot.pulseOffset) * 0.3 + 0.7;
      dummy.position.set(...dot.position);
      dummy.scale.setScalar(dot.scale * pulse);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  // Create gradient of colors for instanced mesh
  const colors = useMemo(() => {
    const colorArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = new THREE.Color(NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]);
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }
    return colorArray;
  }, [count]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 16]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </circleGeometry>
      <meshBasicMaterial vertexColors transparent opacity={0.9} />
    </instancedMesh>
  );
}

// Lightning bolt shapes
function LightningBolts({ count = 5 }: { count?: number }) {
  const bolts = useMemo(() => {
    return Array.from({ length: count }, () => {
      const points: THREE.Vector3[] = [];
      const segments = 6;
      let y = 2;

      for (let j = 0; j <= segments; j++) {
        const x = (j % 2 === 0 ? 0.3 : -0.3) * (j === 0 || j === segments ? 0 : 1);
        points.push(new THREE.Vector3(x, y, 0));
        y -= 0.7;
      }

      return {
        points,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8 - 5,
        ] as [number, number, number],
        rotation: [0, 0, (Math.random() - 0.5) * 0.5] as [number, number, number],
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        scale: Math.random() * 0.8 + 0.4,
      };
    });
  }, [count]);

  return (
    <>
      {bolts.map((bolt, i) => (
        <Float key={i} speed={0.3} floatIntensity={0.2}>
          <line position={bolt.position} rotation={bolt.rotation} scale={bolt.scale}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={bolt.points.length}
                array={new Float32Array(bolt.points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={bolt.color} transparent opacity={0.9} linewidth={3} />
          </line>
        </Float>
      ))}
    </>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Dark ambient with slight purple tint */}
      <ambientLight intensity={0.1} color="#4400ff" />

      {/* Colored point lights for atmosphere */}
      <pointLight position={[10, 5, 5]} color="#ff00ff" intensity={0.8} distance={25} />
      <pointLight position={[-10, 5, 5]} color="#6600ff" intensity={0.8} distance={25} />
      <pointLight position={[0, -5, 10]} color="#ffff00" intensity={0.5} distance={20} />
      <pointLight position={[5, 8, 0]} color="#00ff00" intensity={0.4} distance={20} />

      {/* Geometric shapes */}
      <FloatingShapes count={35} />

      {/* Squiggly lines */}
      <SquigglyLines count={10} />

      {/* Zigzag patterns */}
      <ZigzagPatterns count={8} />


      {/* Neon grid floor */}
      <NeonGrid />

      {/* Scattered dots */}
      <ScatteredDots count={60} />

      {/* Lightning bolts */}
      <LightningBolts count={4} />

      {/* Dark purple fog */}
      <fog attach="fog" args={['#0a0015', 8, 35]} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.8}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
        />
      </EffectComposer>
    </>
  );
}

// Fallback for reduced motion or no WebGL
function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#1a0a2a] to-[#0a0015]">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-fuchsia-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-green-400/25 rounded-full blur-2xl" />
      </div>
    </div>
  );
}

// Main component
export default function ArcadeCarpetScene() {
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
      camera={{ position: [0, 0, 12], fov: 60 }}
    >
      <Scene />
    </Canvas>
  );
}
