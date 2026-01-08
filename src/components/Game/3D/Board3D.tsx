import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { InstancedLevel } from '../../InstancedLevel';
import { Board } from '../Board';
import { Ghost3D } from './Ghost3D';
import { useGame } from '../../../context/GameContext';

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

export const Board3D = () => {
  const { ghostsPos } = useGame();

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-border-color bg-black">
      
      <div className="absolute bottom-4 right-4 z-50 pointer-events-none opacity-90 scale-90 origin-bottom-right">
        <Board isMinimap={true} />
        <div className="text-white text-[10px] text-center mt-1 font-mono bg-black/50 rounded backdrop-blur">RADAR</div>
      </div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none mix-blend-difference" />

      <Canvas shadows camera={{ fov: 60, near: 0.1 }}>
        <fog attach="fog" args={['#000000', 0, 25]} />
        <hemisphereLight 
          args={['#ffffff', '#222222', 0.6]} 
        />
        <ambientLight intensity={0.3} />
        
        <Player />
        <InstancedLevel />

        {ghostsPos.map((pos, index) => (
          <Ghost3D 
            key={index}
            x={pos.x} 
            z={pos.z}
            color={GHOST_COLORS[index % GHOST_COLORS.length]} 
          />
        ))}

      </Canvas>
    </div>
  );
};