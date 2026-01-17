import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { useTheme } from '../../../context/ThemeContext';
import { ClassicGhost } from '../3D/Ghosts/ClassicGhost';
import { ReaperGhost } from '../3D/Ghosts/ReaperGhost';
import { Eyes3D } from '../3D/Ghosts/Eyes3D'; 

interface Ghost3DProps {
  x: number;
  z: number;
  color: string;
  state: 'NORMAL' | 'SCARED' | 'EATEN';
}

export const Ghost3D = ({ x, z, color, state }: Ghost3DProps) => {
  const { settings } = useTheme();
  const groupRef = useRef<Group>(null);
  const prevPos = useRef({ x, z });
  const targetRotation = useRef(0);

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
    
    // თუ თვალებია, ძალიან სწრაფად იფრინოს (15.0)
    const speed = state === 'EATEN' ? 15.0 : 6.0; 
    currentPos.lerp(targetPos, speed * delta);

    const tRotation = targetRotation.current;
    const cRotation = groupRef.current.rotation.y;
    
    let diff = tRotation - cRotation;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    // თვალები უფრო სწრაფად ტრიალდება (20.0), სხეული ნელა (10.0)
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
        
        {state === 'EATEN' ? (
           <Eyes3D /> 
        ) : (
           <>
             {settings.ghostVariant === 1 && <ClassicGhost color={displayColor} />}
             {settings.ghostVariant === 2 && <ReaperGhost color={displayColor} />}
           </>
        )}

      </group>
    </group>
  );
};