import type { ReactNode } from 'react';
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
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={2}
        maxDistance={10}
      />

      {/* განათება */}
      <ambientLight intensity={isDark ? 0.6 : 1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color={isDark ? "blue" : "orange"} />

      {/* მოდელის კონტეინერი */}
      <group scale={[scale, scale, scale]} position={position}>
        {children}
      </group>

      {/* იატაკის ბადე */}
      <gridHelper 
        args={[20, 20, isDark ? '#333' : '#ddd', isDark ? '#111' : '#f0f0f0']} 
        position={[0, -1, 0]} 
      />
    </Canvas>
  );
};