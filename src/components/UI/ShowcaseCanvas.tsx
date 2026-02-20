import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ShowcaseCanvasProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  isDark: boolean;
  scale?: number;
  position?: [number, number, number];
}

export const ShowcaseCanvas = ({ 
  children, 
  cameraPosition = [0, 0, 4.5], 
  isDark,
  scale = 1,
  position = [0, 0, 0]
}: ShowcaseCanvasProps) => {
  return (
    <Canvas camera={{ position: cameraPosition, fov: 50 }}>
      <OrbitControls 
        enablePan={true} 
        enableZoom={true}
        enableRotate={true}
        autoRotate 
        autoRotateSpeed={1.5}
        minDistance={0.5} 
        maxDistance={30}
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2 + 0.1} 
      />

      {/* განათება */}
      <ambientLight intensity={isDark ? 0.6 : 1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color={isDark ? "blue" : "orange"} />

      <Suspense fallback={null}>
        <group scale={scale} position={position}>
          {children}
        </group>
      </Suspense>

      <gridHelper 
        args={[20, 20, isDark ? '#ffffff' : '#000000', isDark ? '#ffffff' : '#000000']} 
        position={[0, -1.2, 0]} 
        material-opacity={isDark ? 0.2 : 0.1} 
        material-transparent={true}
      />

    </Canvas>
  );
};