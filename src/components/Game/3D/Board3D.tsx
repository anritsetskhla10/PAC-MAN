import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
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
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-border-color bg-black">
      
      <div className="absolute bottom-4 right-4 z-50 pointer-events-none opacity-90 scale-90 origin-bottom-right">
        <Board isMinimap={true} />
        <div className="text-white text-[10px] text-center mt-1 font-mono bg-black/50 rounded backdrop-blur">RADAR</div>
      </div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none mix-blend-difference" />

      <Canvas shadows camera={{ fov: 60, near: 0.001 }}>
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 0, 25]} />
        <hemisphereLight color="#ffffff" groundColor="#222222" intensity={0.6} />
        <ambientLight intensity={1.0} />
        
        <Player />
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
          <Ghost3D 
            key={index}
            x={ghost.x} 
            z={ghost.z}
            state={ghost.state} 
            color={GAME_GHOST_COLORS[index % GAME_GHOST_COLORS.length]} 
          />
        ))}

      </Canvas>
    </div>
  );
}