import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, PositionalAudio as ThreePositionalAudio } from 'three'; 
import { PositionalAudio } from '@react-three/drei';
import { useTheme } from '../../../context/ThemeContext';

import { Dot3D } from './Items/Dot3D';
import { PowerPellet3D } from './Items/PowerPellet3D';
import { Cherry3D } from './Items/Cherry3D';
import { Strawberry3D } from './Items/Strawberry3D';
import { Life3D } from './Items/Life3D';

type ConsumableVariant = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';

interface Food3DProps {
  consumableVariant: ConsumableVariant;
}

export const Food3D = ({ consumableVariant }: Food3DProps) => {
  const meshGroupRef = useRef<Group>(null);
  const audioRef = useRef<ThreePositionalAudio>(null!); 
  const { settings } = useTheme();

  const masterMuted = settings.audio.masterMuted;
  const sfxVolume = settings.audio.sfxVolume;
  const isSfxEnabled = !masterMuted && sfxVolume > 0;
  const isBonus = ['cherry', 'strawberry', 'life'].includes(consumableVariant);

  useEffect(() => {
    if (audioRef.current) {
        const targetVol = isSfxEnabled ? sfxVolume * 0.8 : 0;
        audioRef.current.setVolume(targetVol);
    }
  }, [sfxVolume, isSfxEnabled]);

  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();

    meshGroupRef.current.rotation.y += 0.015;
    
    meshGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.05;

    if (consumableVariant === 'power' || consumableVariant === 'life') {
        const pulseScale = 1 + Math.sin(elapsedTime * 8) * 0.15;
        meshGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
  });

  const soundFile = consumableVariant === 'life' 
      ? '/sounds/extra_life.wav' 
      : '/sounds/eat_fruit.wav';

  return (
    <group ref={meshGroupRef}>
        {consumableVariant === 'dot' && <Dot3D />}
        {consumableVariant === 'power' && <PowerPellet3D />}
        {consumableVariant === 'cherry' && <Cherry3D />}
        {consumableVariant === 'strawberry' && <Strawberry3D />}
        {consumableVariant === 'life' && <Life3D />}

        {isBonus && (
           <PositionalAudio
             ref={audioRef}
             url={soundFile} 
             distance={3}
             loop={false}
             autoplay
           />
        )}
    </group>
  );
};