import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { useTheme } from '../../../context/ThemeContext';
import { ClassicGhost } from '../3D/Ghosts/ClassicGhost';
import { ReaperGhost } from '../3D/Ghosts/ReaperGhost';

interface Ghost3DProps {
  x: number;
  z: number;
  color: string;
}

export const Ghost3D = ({ x, z, color }: Ghost3DProps) => {
  const { settings } = useTheme();
  const groupRef = useRef<Group>(null);
  
  const prevPos = useRef({ x, z });
  const targetRotation = useRef(0);

  // --- კუთხის გამოთვლა ---
  useEffect(() => {
    const dx = x - prevPos.current.x;
    const dz = z - prevPos.current.z;
    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
      targetRotation.current = Math.atan2(dx, dz);
    }

    prevPos.current = { x, z };
  }, [x, z]);


  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const currentPos = groupRef.current.position;
    const targetPos = new Vector3(x, 0.5, z);
    currentPos.lerp(targetPos, 6.0 * delta);

    const currentRotation = groupRef.current.rotation.y;
    const target = targetRotation.current;
    
    const angleDiff = target - currentRotation;
    const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
    
    // 10.0 ტრიალის სიჩქარე
    groupRef.current.rotation.y += normalizedDiff * 10.0 * delta; 
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = 0.5 + Math.sin(t * 3) * 0.05;
  });

  return (
    <group ref={groupRef} position={[x, 0.5, z]}>
      <group scale={[0.6, 0.6, 0.6]} position={[0, -0.2, 0]}> 
        {settings.ghostVariant === 1 && <ClassicGhost color={color} />}
        {settings.ghostVariant === 2 && <ReaperGhost color={color} />}
      </group>
    </group>
  );
};