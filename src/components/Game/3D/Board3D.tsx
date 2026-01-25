import { Canvas } from '@react-three/fiber';
import { Pacman3D } from '../Player/Pacman3D'; 
import { InstancedLevel } from '../../InstancedLevel';
import { Board } from '../Board';
import { Ghost3D } from '../3D/Ghost3D'; 
import { Food3D } from '../Foods/Food3D';
import { useGame } from '../../../context/GameContext';
import { useTheme } from '../../../context/ThemeContext';
import { TileType, type Ghost } from '../../../types';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading';

const GAME_GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

interface Board3DProps {
  heading?: PlayerHeading;
}

export const Board3D = ({ heading }: Board3DProps) => {
  const { ghostsPos, layout } = useGame();
  const { settings } = useTheme();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      
      {/* MINIMAP */}
      <div className="absolute top-16 left-2 sm:top-20 sm:left-4 z-40 pointer-events-none opacity-80 scale-50 sm:scale-75 origin-top-left transition-transform">
        <Board isMinimap={true} />
      </div>

      {/* CROSSHAIR */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none mix-blend-difference" />

      <Canvas shadows camera={{ fov: 60, near: 0.001 }} className="touch-none block">
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 0, 40]} />
        <hemisphereLight color="#ffffff" groundColor="#000000" intensity={0.7} />
        <ambientLight intensity={0.6} />
        
        <Pacman3D 
           isSpectator={settings.isSpectatorMode} 
           heading={heading} 
        />
        
        <InstancedLevel />

        {/* ITEMS & GHOSTS */}
        {layout.map((row: number[], z: number) => 
          row.map((tile: number, x: number) => {
            if (tile === TileType.STRAWBERRY) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D consumableVariant="strawberry" /></group>;
            if (tile === TileType.CHERRY) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D consumableVariant="cherry" /></group>;
            if (tile === TileType.POWER_PELLET) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D consumableVariant="power" /></group>;
            if (tile === TileType.FOOD) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D consumableVariant="dot" /></group>;
            return null;
          })
        )}

        {ghostsPos.map((ghost: Ghost, index: number) => (
          <group key={index} position={[0, 0.1, 0]}>
            <Ghost3D 
              x={ghost.x} 
              z={ghost.z}
              state={ghost.state} 
              color={GAME_GHOST_COLORS[index % GAME_GHOST_COLORS.length]} 
            />
          </group>
        ))}
      </Canvas>
    </div>
  );
}