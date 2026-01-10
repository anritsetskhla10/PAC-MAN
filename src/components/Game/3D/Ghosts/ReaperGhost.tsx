import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface GhostProps {
  color: string;
}

export const ReaperGhost = ({ color }: GhostProps) => {
  const groupRef = useRef<Group>(null);
  const scytheRef = useRef<Group>(null);
  
  useFrame((state) => {
    if(!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t) * 0.08;
    
    if (scytheRef.current) {
        scytheRef.current.rotation.z = -0.2 + Math.sin(t * 1.5) * 0.1;
        scytheRef.current.rotation.x = Math.sin(t * 1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* --- მანტია --- */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.55, 1.3, 32, 1, true]} />
        <meshStandardMaterial color="#050505" side={2} roughness={1} /> 
      </mesh>
      
      {/* --- კაპიუშონი --- */}
      <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]}>
        <dodecahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial color="#050505" roughness={1} side={2} />
      </mesh>

      {/* --- სიბნელე კაპიუშონში --- */}
      <mesh position={[0, 0.45, 0.15]} scale={[0.8, 0.8, 0.8]}>
         <sphereGeometry args={[0.35]} />
         <meshBasicMaterial color="black" /> 
      </mesh>

      {/* --- თვალები --- */}
      <group position={[0, 0.5, 0.4]}>
         <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -0.1]}> 
             <capsuleGeometry args={[0.04, 0.12]} />
             <meshBasicMaterial color={color} toneMapped={false} />
             <pointLight distance={0.6} intensity={2} color={color} />
         </mesh>
         <mesh position={[0.12, 0, 0]} rotation={[0, 0, 0.1]}>
             <capsuleGeometry args={[0.04, 0.12]} />
             <meshBasicMaterial color={color} toneMapped={false} />
             <pointLight distance={0.6} intensity={2} color={color} />
         </mesh>
      </group>

      {/* --- ხელები --- */}
      <mesh position={[0.35, 0.1, 0.2]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#050505" />
      </mesh>

      {/* --- ცელი --- */}
      <group ref={scytheRef} position={[0.35, 0.1, 0.2]} rotation={[0, 0, -0.2]}>
         {/* ტარი */}
         <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 1.8]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
         </mesh>
         
         {/* დანა */}
         <group position={[0, 0.9, 0.15]}>
            <mesh rotation={[0, 1.5, 0.5]}>
                <torusGeometry args={[0.35, 0.05, 8, 32, 2.5]} /> 
                <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
            </mesh>
         </group>
      </group>
    </group>
  );
};