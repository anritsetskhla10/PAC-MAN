import { Canvas } from '@react-three/fiber';
import { Pacman3D } from '../Player/Pacman3D'; 
import { InstancedLevel } from '../InstancedLevel';
import { Board } from '../2D/Board';
import { Ghost3D } from '../3D/Ghost3D'; 
import { Food3D } from '../3D/Food3D';
import { InstancedFood } from '../3D/Food/InstancedFood';
import { useGame } from '../../../context/GameContext';
import { useTheme } from '../../../context/ThemeContext';
import { type Ghost } from '../../../types';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading';
import { useIsMobile } from '../../../hooks/useIsMobile'; 
import { Suspense } from 'react';

const GAME_GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];

interface Board3DProps {
  heading?: PlayerHeading;
}

export const Board3D = ({ heading }: Board3DProps) => {
  const { ghostsPos, layout, activeBonus } = useGame(); 
  const { settings } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      
      {/* MINIMAP */}
      <div className="absolute top-16 left-2 sm:top-20 sm:left-4 z-40 pointer-events-none opacity-80 scale-50 sm:scale-75 origin-top-left transition-transform landscape:scale-[0.4] landscape:top-4">
        <Board isMinimap={true} />
      </div>

      {/* 3D SCENE */}
      <Canvas 
        shadows={!isMobile} 
        camera={{ fov: 60, near: 0.001 }} 
        className="touch-none block"
        dpr={isMobile ? [1, 1.5] : [1, 2]} 
        frameloop="always"
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#050505']} />
          <hemisphereLight color="#ffffff" groundColor="#000000" intensity={0.7} />
          <ambientLight intensity={0.4} />
          
          {!isMobile && <fog attach="fog" args={['#050505', 0, 40]} />}
          
          <Pacman3D 
             isShowcase={false}
             isSpectator={settings.isSpectatorMode} 
             heading={heading} 
          />
          
          <InstancedLevel />

          <InstancedFood layout={layout} />

          {activeBonus && (
             <group position={[activeBonus.x, 0.5, activeBonus.z]}>
                 {activeBonus.type === 'CHERRY' && <Food3D consumableVariant="cherry" />}
                 {activeBonus.type === 'STRAWBERRY' && <Food3D consumableVariant="strawberry" />}
                 {activeBonus.type === 'EXTRA_LIFE' && <Food3D consumableVariant="life" />}
             </group>
          )}

          {/* Ghosts */}
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
        </Suspense>
      </Canvas>
    </div>
  );
};