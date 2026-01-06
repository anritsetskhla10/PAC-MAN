import { Canvas } from '@react-three/fiber';
import { LEVEL_MAP } from '../../../utils/constants';
import { TileType } from '../../../types'; 
import { useTheme } from '../../../context/ThemeContext';
import { Player } from './Player';
import { Board } from '../Board';

export const Board3D = () => {
  const { settings } = useTheme();

  return (
    <div className="relative w-full h-150 rounded-xl overflow-hidden shadow-2xl border-4 border-border-color bg-black">
      
      {/* მინირუკა & UI */}
      <div className="absolute bottom-4 right-4 z-50 pointer-events-none opacity-90 scale-90 origin-bottom-right">
        <Board isMinimap={true} />
        <div className="text-white text-[10px] text-center mt-1 font-mono bg-black/50 rounded backdrop-blur">RADAR</div>
      </div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none mix-blend-difference" />

      <Canvas shadows>
        <fog attach="fog" args={['black', 0, 18]} />
        <ambientLight intensity={0.2} />
        <Player />

        <group position={[0, 0, 0]}>
          {LEVEL_MAP.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
              const x = colIndex;
              const z = rowIndex;
              const key = `${rowIndex}-${colIndex}`;

              if (tile === TileType.WALL) {
                return (
                  <mesh key={key} position={[x, 0.75, z]}>
                    <boxGeometry args={[1, 1.5, 1]} /> 
                    <meshStandardMaterial 
                      color={settings.wallColor} 
                      emissive={settings.wallColor}
                      emissiveIntensity={0.25}
                    />
                  </mesh>
                );
              }

              return (
                <group key={key}>
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, z]}>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial 
                      color={tile === TileType.GHOST_HOUSE ? '#4a0404' : '#1a1a1a'} 
                      roughness={0.8} 
                    />
                  </mesh>

                  {tile === TileType.FOOD && (
                    <mesh position={[x, 0.4, z]}>
                      <sphereGeometry args={[0.15, 16, 16]} />
                      <meshStandardMaterial 
                        color={settings.foodColor} 
                        emissive={settings.foodColor} 
                        emissiveIntensity={1} 
                      />
                      <pointLight distance={1} intensity={0.5} color={settings.foodColor} />
                    </mesh>
                  )}
                </group>
              );
            })
          )}
        </group>
      </Canvas>
    </div>
  );
};