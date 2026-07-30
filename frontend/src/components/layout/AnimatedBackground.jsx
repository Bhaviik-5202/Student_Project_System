import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
import { useTheme } from '../../hooks/useTheme';

// Generate random points distributed in a sphere
const generateParticles = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Math.cbrt is used to ensure even distribution inside the sphere
    const r = 25 * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
    positions[i * 3 + 2] = r * Math.cos(phi); // z
  }
  return positions;
};

const ParticleCloud = ({ isDarkMode }) => {
  const ref = useRef();

  // Memoize geometry so it is not regenerated on re-render
  const sphere = useMemo(() => generateParticles(2500), []);

  // Theme-aware colors: subtle glowing purple in dark mode, light blue in light mode
  const particleColor = isDarkMode ? '#8b5cf6' : '#60a5fa';
  const particleOpacity = isDarkMode ? 0.6 : 0.4;
  const particleSize = isDarkMode ? 0.04 : 0.06;

  useFrame((state, delta) => {
    if (ref.current) {
      // Extremely slow rotation for a premium, non-distracting feel
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 45;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={particleColor}
          size={particleSize}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={particleOpacity}
        />
      </Points>
    </group>
  );
};

const AnimatedBackground = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 2]} // Optimize for high DPI, capping at 2x
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <ParticleCloud isDarkMode={isDarkMode} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
