import { Canvas } from '@react-three/fiber';
import { Pacman3D } from '../Player/Pacman3D'; 
import { InstancedLevel } from '../../InstancedLevel';
import { Board } from '../Board';
import { Ghost3D } from '../3D/Ghost3D'; 
import { Food3D } from '../Foods/Food3D';
import { useGame } from '../../../context/GameContext';
import { TileType } from '../../../types';

const GAME_GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

export const Board3D = () => {
  const { ghostsPos, layout } = useGame();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      
      <div className="absolute top-16 left-4 z-40 pointer-events-none opacity-80 scale-75 origin-top-left sm:top-20">
        <Board isMinimap={true} />
      </div>
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none mix-blend-difference" />

      <Canvas shadows camera={{ fov: 60, near: 0.001 }} className="touch-none block">
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 0, 40]} />
        
        <hemisphereLight color="#ffffff" groundColor="#000000" intensity={0.7} />
        <ambientLight intensity={0.6} />

        <Pacman3D />
        
        <InstancedLevel />

        {layout.map((row, z) => 
          row.map((tile, x) => {
            if (tile === TileType.STRAWBERRY) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D type="strawberry" /></group>;
            if (tile === TileType.CHERRY) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D type="cherry" /></group>;
            if (tile === TileType.POWER_PELLET) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D type="power" /></group>;
            if (tile === TileType.FOOD) return <group key={`${x}-${z}`} position={[x, 0.5, z]}><Food3D type="dot" /></group>;
            return null;
          })
        )}

        {ghostsPos.map((ghost, index) => (
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