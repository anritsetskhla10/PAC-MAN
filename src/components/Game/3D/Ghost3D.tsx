import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';

interface Ghost3DProps {
  x: number;
  z: number;
  color: string;
}

export const Ghost3D = ({ x, z, color }: Ghost3DProps) => {
  const groupRef = useRef<Group>(null);
  const isValid = typeof x === 'number' && !isNaN(x) && typeof z === 'number' && !isNaN(z);

  useFrame(() => {
    if (!isValid || !groupRef.current) return;
    
    const targetPos = new Vector3(x, 0.5, z);
    
    // დაცვა: Lerp მხოლოდ მაშინ, თუ მანძილი ძალიან დიდი არაა 
    if (groupRef.current.position.distanceTo(targetPos) < 10) {
        groupRef.current.position.lerp(targetPos, 0.1);
    } else {
        groupRef.current.position.copy(targetPos);
    }
    
    const time = Date.now() * 0.003;
    const scale = 1 + Math.sin(time) * 0.05;
    groupRef.current.scale.set(scale, scale, scale);
  });
  //  თუ არასწორია, არ ვარენდერებ არც მეშს, არც განათებას
  if (!isValid) return null;

  return (
    <group ref={groupRef} position={[x, 0.5, z]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>

      <mesh position={[-0.15, 0.25, 0.32]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.15, 0.25, 0.32]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.15, 0.28, 0.42]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[0.15, 0.28, 0.42]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      <pointLight 
        color={color} 
        distance={1.5} 
        intensity={2} 
        decay={2} 
        shadow-bias={-0.001} 
      />
    </group>
  );
};