import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three'; 
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
  const { settings } = useTheme();

  const isLabadze = themeOverride 
    ? themeOverride === 'labadze' 
    : (settings.gameTheme === 'labadze' || settings.playerModel === 'avatar');

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

  return (
    <group ref={meshGroupRef}>
        {isLabadze ? (
            <>
                {consumableVariant === 'dot' && <Mchadi />}
                {consumableVariant === 'power' && <Kebab />}
                {consumableVariant === 'cherry' && <Khinkali />}
                {consumableVariant === 'strawberry' && <Khachapuri />}
                {consumableVariant === 'life' && <Life3D />}
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
    </group>
  );
};