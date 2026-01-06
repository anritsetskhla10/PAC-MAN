import { Canvas } from '@react-three/fiber';
import { LEVEL_MAP } from '../../../utils/constants';
import { TileType } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { Player } from './Player'; 

export const Board3D = () => {
  const { settings } = useTheme();

  return (
    <div className="relative w-full h-150 rounded-xl overflow-hidden shadow-2xl border-4 border-border-color bg-black">
    {/* Crosshair */}
    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none" />
      <Canvas shadows>
        <fog attach="fog" args={['black', 0, 15]} />

        <ambientLight intensity={0.1} />

        <Player />

        <group position={[0, 0, 0]}>
          {LEVEL_MAP.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
              const position: [number, number, number] = [colIndex, 0, rowIndex];

              if (tile === TileType.WALL) {
                return (
                  <mesh key={`${rowIndex}-${colIndex}`} position={[position[0], 0.5, position[2]]}>
                    <boxGeometry args={[1, 1.5, 1]} /> 
                    <meshStandardMaterial 
                      color={settings.wallColor} 
                      emissive={settings.wallColor}
                      emissiveIntensity={0.2}
                      roughness={0.1}
                    />
                  </mesh>
                );
              }

              if (tile === TileType.FOOD) {
                return (
                  <mesh key={`${rowIndex}-${colIndex}`} position={[position[0], 0.3, position[2]]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial 
                      color={settings.foodColor} 
                      emissive={settings.foodColor} 
                      emissiveIntensity={0.8} 
                    />
                  </mesh>
                );
              }
              
              return (
                 <mesh key={`floor-${rowIndex}-${colIndex}`} rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0, position[2]]}>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial color="#111" />
                 </mesh>
              );
            })
          )}
        </group>
      </Canvas>
    </div>
  );
};