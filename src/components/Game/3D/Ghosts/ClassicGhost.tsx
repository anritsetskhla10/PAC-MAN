import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MeshStandardMaterial, PointLight } from 'three';

interface GhostProps {
  color: string;
  isFlashing?: boolean;
}

export const ClassicGhost = ({ color, isFlashing = false }: GhostProps) => {
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  
  const [mat] = useState(() => new MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.1,
    emissiveIntensity: 0.2
  }));

  useFrame((state) => {
    if(!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;

    if (isFlashing) {
      const isWhite = Math.floor(t * 5) % 2 === 0; 
      const flashCol = isWhite ? '#FFFFFF' : '#0000FF';
      mat.color.set(flashCol);
      mat.emissive.set(flashCol);
      if (lightRef.current) lightRef.current.color.set(flashCol);
    } else {
      mat.color.set(color);
      mat.emissive.set(color);
      if (lightRef.current) lightRef.current.color.set(color);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.5, 0]} material={mat}>
        <sphereGeometry args={[0.35, 32, 32]} />
      </mesh>

      <mesh position={[0, 0, 0]} material={mat}>
        <cylinderGeometry args={[0.34, 0.6, 1.1, 32, 1, true]} /> 
      </mesh>

      {/* სახე*/}
      <group position={[0, 0.45, 0.32]}>
        <group position={[0, 0.1, 0]}>
            <mesh position={[-0.14, 0, 0]} rotation={[0, -0.2, -0.2]}> 
                <capsuleGeometry args={[0.05, 0.12]} /> 
                <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[0.14, 0, 0]} rotation={[0, 0.2, 0.2]}>
                <capsuleGeometry args={[0.05, 0.12]} />
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
        <group position={[0, -0.15, 0.02]}>
            <mesh>
                <capsuleGeometry args={[0.08, 0.15]} /> 
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
      </group>
      
      {/* --- ხელები --- */}
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, 0.6]} material={mat}>
        <capsuleGeometry args={[0.08, 0.25]} />
      </mesh>
      <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -0.6]} material={mat}>
        <capsuleGeometry args={[0.08, 0.25]} />
      </mesh>

      {/*  განათება */}
      <pointLight ref={lightRef} distance={4} intensity={2} />
    </group>
  );
};