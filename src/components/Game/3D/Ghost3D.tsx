import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, PositionalAudio as ThreePositionalAudio } from 'three'; 
import { PositionalAudio } from '@react-three/drei';
import { useTheme } from '../../../context/ThemeContext';
import { useGame } from '../../../context/GameContext'; 
import { ClassicGhost } from './Ghosts/ClassicGhost';
import { ReaperGhost } from './Ghosts/ReaperGhost';
import { Eyes3D } from './Ghosts/Eyes3D'; 
import { TileType, GhostState } from '../../../types'; 

import { LabadzeGhostModel, type LabadzeGhostName } from './Models/LabadzeGhostModel';

interface Ghost3DProps {
  index: number;
  color: string;
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

export const Ghost3D = ({ index, color }: Ghost3DProps) => {
  const { settings } = useTheme();
  const { gameStatus, playerPosRef, ghostsPosRef, layout } = useGame(); 
  
  const groupRef = useRef<Group>(null);
  const audioRef = useRef<ThreePositionalAudio>(null!); 

  const [visualState, setVisualState] = useState<GhostState>(GhostState.NORMAL);
  const [initialPos, setInitialPos] = useState({ x: 0, z: 0 });
  
  const targetRotation = useRef(0);

  const masterMuted = settings.audio.masterMuted;
  const sfxVolume = settings.audio.sfxVolume;
  const isSfxEnabled = !masterMuted && sfxVolume > 0;
  
  const shouldPlaySound = isSfxEnabled && gameStatus === 'playing';
  const isLabadzeGhost = settings.gameTheme === 'labadze' || settings.ghostVariant >= 4;
  const sirenUrl = isLabadzeGhost ? '/sounds/kacebi/labadze_siren.mp3' : '/sounds/siren.mp3';

  useEffect(() => {
    const ghost = ghostsPosRef.current[index];
    if (ghost) {
      setVisualState(ghost.state);
      setInitialPos({ x: ghost.x, z: ghost.z });
    }
  }, [ghostsPosRef, index]);

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

  useFrame((stateThree, delta) => {
    if (!groupRef.current) return;
    
    const ghost = ghostsPosRef.current[index];
    const playerPos = playerPosRef.current;

    if (!ghost || !playerPos) return;

    if (ghost.state !== visualState) {
        setVisualState(ghost.state);
    }

    // აუდიოს ლოგიკა (დისტანციაზე დამოკიდებული ხმა)
    if (audioRef.current) {
        if (!shouldPlaySound) {
            if (audioRef.current.getVolume() > 0) audioRef.current.setVolume(0);
        } else {
            const distance = Math.hypot(ghost.x - playerPos.x, ghost.z - playerPos.z);
            const MAX_AUDIBLE_DISTANCE = 12; 
            
            if (distance > MAX_AUDIBLE_DISTANCE) {
                audioRef.current.setVolume(0);
            } else {
                let volume = 1 - (distance / MAX_AUDIBLE_DISTANCE);
                if (isWallBetween(playerPos.x, playerPos.z, ghost.x, ghost.z, layout)) {
                    volume *= 0.2;
                }
                audioRef.current.setVolume(volume * sfxVolume * 0.5);
            }
        }
    }

    // პოზიციის lerp 
    const currentPos = groupRef.current.position;
    const targetPos = new Vector3(ghost.x, 0.5, ghost.z);
    const speed = visualState === 'EATEN' ? 15.0 : 6.0; 
    currentPos.lerp(targetPos, speed * delta);
    
    // როტაციის გამოთვლა
    const dx = targetPos.x - currentPos.x;
    const dz = targetPos.z - currentPos.z;
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      targetRotation.current = Math.atan2(dx, dz);
    }

    const tRotation = targetRotation.current;
    const cRotation = groupRef.current.rotation.y;
    let diff = tRotation - cRotation;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rotationSpeed = visualState === 'EATEN' ? 20.0 : 10.0;
    groupRef.current.rotation.y += diff * rotationSpeed * delta; 
    
    //  Y ღერძის ბაუნსი ანიმაციისთვის
    if (visualState !== 'EATEN') {
        if (isLabadzeGhost) {
            groupRef.current.position.y = 0.5; 
        } else {
            const t = stateThree.clock.getElapsedTime();
            groupRef.current.position.y = 0.5 + Math.sin(t * 3) * 0.05;
        }
    } else {
        groupRef.current.position.y = 0.5; 
    }
  });

  const displayColor = visualState === 'SCARED' ? '#0000FF' : color;

  const renderLabadzeGhost = () => {
    const ghostMap: Record<string, LabadzeGhostName> = {
      '#FF0000': 'kakaba',
      '#FFB8FF': 'janela',
      '#00FFFF': 'iko',
      '#FFB852': 'jafara',
    };
    const ghostName = ghostMap[color] || 'kakaba';
    
    return <LabadzeGhostModel name={ghostName} ghostState={visualState} />;
  };

  const getScale = (): [number, number, number] => {
    if (visualState === 'EATEN' && !isLabadzeGhost) return [0.8, 0.8, 0.8]; 
    if (isLabadzeGhost) return [0.65, 0.65, 0.65]; 
    return [0.6, 0.6, 0.6]; 
  };

  const getYPosition = () => {
    if (visualState === 'EATEN' && !isLabadzeGhost) return 0; 
    if (isLabadzeGhost) return -0.6; 
    return -0.2; 
  };

  return (
    <group ref={groupRef} position={[initialPos.x, 0.5, initialPos.z]}>
      
      <group scale={getScale()} position={[0, getYPosition(), 0]}> 
        
        {isLabadzeGhost ? (
             renderLabadzeGhost()
        ) : (
             visualState === 'EATEN' ? (
                 <Eyes3D /> 
             ) : (
                 <>
                    {settings.ghostVariant === 1 && <ClassicGhost color={displayColor} />}
                    {settings.ghostVariant === 2 && <ReaperGhost color={displayColor} />}
                    {settings.ghostVariant === 3 && <Eyes3D />}
                 </>
             )
        )}

      </group>
      
      {visualState !== 'EATEN' && visualState !== 'EYES' && (
        <PositionalAudio
          ref={audioRef}
          url={sirenUrl} 
          distance={1} 
          loop
          autoplay
        />
      )}
    </group>
  );
};