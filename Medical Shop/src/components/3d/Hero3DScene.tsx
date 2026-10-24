import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeMotion } from '../../context/ThemeMotionContext';
import { StaticPosterFallback } from './StaticPosterFallback';

// Procedural 3D Capsule Mesh
const CapsuleModel = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pillRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (pillRef.current) {
      // Gentle auto-rotation
      pillRef.current.rotation.y += delta * 0.45;
      pillRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.2 + 0.35;
    }
    if (groupRef.current) {
      // Subtle cursor parallax
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.y * 0.35,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.45,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        <group ref={pillRef} scale={1.25}>
          {/* Top Half of Capsule (Vibrant Medical Blue) */}
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshPhysicalMaterial
              color="#2563EB"
              roughness={0.15}
              metalness={0.1}
              clearcoat={0.9}
              clearcoatRoughness={0.1}
              transmission={0.4}
              thickness={1.2}
              ior={1.45}
            />
          </mesh>

          {/* Top Cylinder Sleeve */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.7, 32]} />
            <meshPhysicalMaterial
              color="#2563EB"
              roughness={0.15}
              metalness={0.1}
              clearcoat={0.9}
              clearcoatRoughness={0.1}
              transmission={0.3}
              thickness={1.0}
            />
          </mesh>

          {/* Golden / Metallic Middle Ring */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.76, 0.76, 0.08, 32]} />
            <meshStandardMaterial
              color="#F8FAFC"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Bottom Cylinder Sleeve */}
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.7, 32]} />
            <meshPhysicalMaterial
              color="#22C55E"
              roughness={0.18}
              metalness={0.05}
              clearcoat={0.8}
              clearcoatRoughness={0.15}
              transmission={0.4}
              thickness={1.0}
            />
          </mesh>

          {/* Bottom Half of Capsule (Fresh Medical Green) */}
          <mesh position={[0, -0.7, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshPhysicalMaterial
              color="#22C55E"
              roughness={0.18}
              metalness={0.05}
              clearcoat={0.8}
              clearcoatRoughness={0.15}
              transmission={0.4}
              thickness={1.2}
              ior={1.45}
            />
          </mesh>
        </group>

        {/* Small Orbiting Pill 1 */}
        <group position={[1.8, 0.8, -0.5]} scale={0.45} rotation={[0.4, 0.8, 0.2]}>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[0.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.8, 24]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.2} />
          </mesh>
        </group>

        {/* Small Orbiting Cross Symbol */}
        <group position={[-1.7, -0.6, 0.6]} scale={0.35} rotation={[0.3, -0.5, 0.1]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#22C55E" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.4, 1.2, 0.4]} />
            <meshStandardMaterial color="#22C55E" roughness={0.3} />
          </mesh>
        </group>
      </Float>

      {/* Floating particles & sparkles */}
      <Sparkles
        count={35}
        scale={4.5}
        size={2.5}
        speed={0.4}
        opacity={0.6}
        color="#38BDF8"
      />

      {/* Soft Contact Shadow below */}
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.4}
        scale={6}
        blur={2.4}
        far={4}
        color="#1E3A8A"
      />
    </group>
  );
};

// Error Boundary wrapper for WebGL
class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('3D Canvas render fallback triggered:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const Hero3DScene: React.FC = () => {
  const { prefersReducedMotion, enable3DGraphics } = useThemeMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !enable3DGraphics) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, enable3DGraphics]);

  if (prefersReducedMotion || !enable3DGraphics) {
    return <StaticPosterFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] lg:h-[540px] flex items-center justify-center select-none"
    >
      <CanvasErrorBoundary fallback={<StaticPosterFallback />}>
        <Suspense fallback={<StaticPosterFallback />}>
          <Canvas
            camera={{ position: [0, 0, 4.8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, -2, -2]} intensity={0.6} color="#38BDF8" />
            <pointLight position={[0, 3, 2]} intensity={0.9} color="#DCFCE7" />

            <CapsuleModel mousePos={mousePos} />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
};
