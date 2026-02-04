import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, PositionalAudio as ThreePositionalAudio } from 'three'; 
import { PositionalAudio } from '@react-three/drei';
import { useTheme } from '../../../context/ThemeContext';
import { useGame } from '../../../context/GameContext'; 
import { ClassicGhost } from './Ghosts/ClassicGhost';
import { ReaperGhost } from './Ghosts/ReaperGhost';
import { Eyes3D } from './Ghosts/Eyes3D'; 
import { TileType, type GhostState } from '../../../types'; 

interface Ghost3DProps {
  x: number;
  z: number;
  color: string;
  state: GhostState;
}

const isWallBetween = (x1: number, z1: number, x2: number, z2: number, layout: number[][]) => {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
    if (steps === 0) return false;
    const dx = (x2 - x1) / steps;
    const dz = (z2 - z1) / steps;
    for (let i = 1; i < steps; i++) {
        const checkX = Math.round(x1 + dx * i);
        const checkZ = Math.round(z1 + dz * i);
        if (layout[checkZ] && layout[checkZ][checkX] === TileType.WALL) return true; 
    }
    return false; 
};

export const Ghost3D = ({ x, z, color, state }: Ghost3DProps) => {
  const { settings } = useTheme();
  const { gameStatus, playerPos, layout } = useGame(); 
  
  const groupRef = useRef<Group>(null);
  const audioRef = useRef<ThreePositionalAudio>(null!); 

  const prevPos = useRef({ x, z });
  const targetRotation = useRef(0);

  // Audio Calculations
  const masterMuted = settings.audio.masterMuted;
  const sfxVolume = settings.audio.sfxVolume;
  const isSfxEnabled = !masterMuted && sfxVolume > 0;
  
  const shouldPlaySound = isSfxEnabled && gameStatus === 'playing';

  useEffect(() => {
    if (audioRef.current) {
        if (!isSfxEnabled) {
            audioRef.current.setVolume(0);
        }
        if (audioRef.current.setRolloffFactor) {
            audioRef.current.setRolloffFactor(0); 
        }
    }
  }, [sfxVolume, isSfxEnabled]);

  useFrame(() => {
    if (!audioRef.current) return;
    
    if (!shouldPlaySound) {
        if (audioRef.current.getVolume() > 0) audioRef.current.setVolume(0);
        return;
    }

    const distance = Math.hypot(x - playerPos.x, z - playerPos.z);
    const MAX_AUDIBLE_DISTANCE = 12; 
    
    if (distance > MAX_AUDIBLE_DISTANCE) {
        audioRef.current.setVolume(0);
        return;
    }

    let volume = 1 - (distance / MAX_AUDIBLE_DISTANCE);
    
    if (isWallBetween(playerPos.x, playerPos.z, x, z, layout)) {
        volume *= 0.2;
    }

    audioRef.current.setVolume(volume * sfxVolume * 1.5);
  });

  useEffect(() => {
    const dx = x - prevPos.current.x;
    const dz = z - prevPos.current.z;
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      targetRotation.current = Math.atan2(dx, dz);
    }
    prevPos.current = { x, z };
  }, [x, z]);

  useFrame((stateThree, delta) => {
    if (!groupRef.current) return;
    const currentPos = groupRef.current.position;
    const targetPos = new Vector3(x, 0.5, z);
    const speed = state === 'EATEN' ? 15.0 : 6.0; 
    currentPos.lerp(targetPos, speed * delta);
    const tRotation = targetRotation.current;
    const cRotation = groupRef.current.rotation.y;
    let diff = tRotation - cRotation;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rotationSpeed = state === 'EATEN' ? 20.0 : 10.0;
    groupRef.current.rotation.y += diff * rotationSpeed * delta; 
    
    if (state !== 'EATEN') {
        const t = stateThree.clock.getElapsedTime();
        groupRef.current.position.y = 0.5 + Math.sin(t * 3) * 0.05;
    } else {
        groupRef.current.position.y = 0.5; 
    }
  });

  const displayColor = state === 'SCARED' ? '#0000FF' : color;

  return (
    <group ref={groupRef} position={[x, 0.5, z]}>
      <group scale={[0.6, 0.6, 0.6]} position={[0, -0.2, 0]}> 
        {state === 'EATEN' ? <Eyes3D /> : (
           <>
             {settings.ghostVariant === 1 && <ClassicGhost color={displayColor} />}
             {settings.ghostVariant === 2 && <ReaperGhost color={displayColor} />}
           </>
        )}
      </group>
      
      {state !== 'EATEN' && state !== 'EYES' && (
        <PositionalAudio
          ref={audioRef}
          url="/sounds/siren.mp3" 
          distance={1} 
          loop
          autoplay
        />
      )}
    </group>
  );
};