import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useTheme } from '../../../context/ThemeContext';
import { ClassicGhost } from '../3D/Ghosts/ClassicGhost';
import { ReaperGhost } from '../3D/Ghosts/ReaperGhost';

interface Ghost3DProps {
  x: number;
  z: number;
  color: string;
}

export const Ghost3D = ({ x, z, color }: Ghost3DProps) => {
  const groupRef = useRef<Group>(null);
  const { settings } = useTheme();

  const variant = settings.ghostVariant;

  useFrame(() => {
    if (!groupRef.current) return;
    
    const targetPos = new Vector3(x, 0.5, z); 
    groupRef.current.position.lerp(targetPos, 0.1);
  });

  return (
    <group ref={groupRef} position={[x, 0.5, z]} scale={[0.6, 0.6, 0.6]}>
      {variant === 2 ? (
        <ReaperGhost color={color} />
      ) : (
        <ClassicGhost color={color} />
      )}
    </group>
  );
};