import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface GhostProps {
  color: string;
}

export const ClassicGhost = ({ color }: GhostProps) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if(!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;
  });

  const materialProps = {
    color: color,
    emissive: color,
    emissiveIntensity: 0.2,
    roughness: 0.3,
    metalness: 0.1,
  };

  return (
    <group ref={groupRef}>
      {/* --- თავი --- */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* --- ტანი --- */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.6, 1.1, 32, 1, true]} /> 
        <meshStandardMaterial {...materialProps} side={2} />
      </mesh>

      {/* --- სახე (საშიში) --- */}
      <group position={[0, 0.45, 0.32]}>
        {/* თვალები */}
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
        
        {/* პირი */}
        <group position={[0, -0.15, 0.02]}>
            <mesh>
                <capsuleGeometry args={[0.08, 0.15]} /> 
                <meshBasicMaterial color="black" />
            </mesh>
        </group>
      </group>
      
      {/* --- ხელები --- */}
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.08, 0.25]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -0.6]}>
        <capsuleGeometry args={[0.08, 0.25]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      <pointLight color={color} distance={4} intensity={2} />
    </group>
  );
};