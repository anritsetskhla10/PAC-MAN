import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, PositionalAudio as ThreePositionalAudio } from 'three'; 
import { PositionalAudio } from '@react-three/drei';
import { useTheme } from '../../../context/ThemeContext';

import { Dot3D } from '../3D/Food/Dot3D';
import { PowerPellet3D } from '../3D/Food/PowerPellet3D';
import { Cherry3D } from '../3D/Food/Cherry3D';
import { Strawberry3D } from '../3D/Food/Strawberry3D';
import { Life3D } from '../3D/Food/Life3D';

import { Mchadi } from '../3D/Food/Mchadi';
import { Kebab } from '../3D/Food/Kebab';
import { Khinkali } from '../3D/Food/Khinkali';
import { Khachapuri } from '../3D/Food/Khachapuri';

type ConsumableVariant = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';

interface Food3DProps {
  consumableVariant: ConsumableVariant;
  themeOverride?: 'classic' | 'labadze';
}

export const Food3D = ({ consumableVariant, themeOverride }: Food3DProps) => {
  const meshGroupRef = useRef<Group>(null);
  const audioRef = useRef<ThreePositionalAudio>(null!); 
  const { settings } = useTheme();

  const isLabadze = themeOverride 
    ? themeOverride === 'labadze' 
    : (settings.gameTheme === 'labadze' || settings.playerModel === 'avatar');

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

  const soundFile = isLabadze
      ? (consumableVariant === 'life' ? '/sounds/extra_life.wav' : '/sounds/kacebi/labadze_eat_fruit.mp3')
      : (consumableVariant === 'life' ? '/sounds/extra_life.wav' : '/sounds/eat_fruit.wav');

  return (
    <group ref={meshGroupRef}>
        {isLabadze ? (
            <>
                {consumableVariant === 'dot' && <Mchadi />}
                {consumableVariant === 'power' && <Kebab />}
                {consumableVariant === 'cherry' && <Khinkali />}
                {consumableVariant === 'strawberry' && <Khachapuri />}
                {consumableVariant === 'life' && <Khinkali />} 
            </>
        ) : (
            <>
                {consumableVariant === 'dot' && <Dot3D />}
                {consumableVariant === 'power' && <PowerPellet3D />}
                {consumableVariant === 'cherry' && <Cherry3D />}
                {consumableVariant === 'strawberry' && <Strawberry3D />}
                {consumableVariant === 'life' && <Life3D />}
            </>
        )}

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