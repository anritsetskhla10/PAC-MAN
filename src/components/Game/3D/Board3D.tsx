import { Canvas } from '@react-three/fiber';
import { Player } from './Player';
import { InstancedLevel } from '../../InstancedLevel';
import { Board } from '../Board';

export const Board3D = () => {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-border-color bg-black">
      
      {/* ---  MINIMAP (RADAR) --- */}
      <div className="absolute bottom-4 right-4 z-50 pointer-events-none opacity-90 scale-90 origin-bottom-right">
        <Board isMinimap={true} />
        <div className="text-white text-[10px] text-center mt-1 font-mono bg-black/50 rounded backdrop-blur">RADAR</div>
      </div>

      {/* ---  CROSSHAIR --- */}
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none mix-blend-difference" />

      {/* ---  3D SCENE --- */}
      <Canvas shadows camera={{ fov: 60 }}>
        <fog attach="fog" args={['black', 0, 18]} />
        <ambientLight intensity={0.2} />
        
        <Player />
        <InstancedLevel />
      </Canvas>
      
    </div>
  );
};