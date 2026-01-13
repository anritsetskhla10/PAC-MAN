import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

type FoodType = 'dot' | 'power' | 'cherry' | 'strawberry';

interface Food3DProps {
  type: FoodType;
}

const STRAWBERRY_SEEDS = (() => {
  const temp = [];
  const numSeeds = 60;
  const radius = 0.235;

  for (let i = 0; i < numSeeds; i++) {
    const phi = Math.acos(-1 + (2 * i) / numSeeds);
    const theta = Math.sqrt(numSeeds * Math.PI) * phi;
    
    const verticalAdjust = phi > 1.5 ? 0.9 : 1; 

    const x = radius * Math.sin(phi) * Math.cos(theta) * verticalAdjust;
    const y = (radius * Math.sin(phi) * Math.sin(theta) * verticalAdjust) - 0.05;
    const z = radius * Math.cos(phi);

    temp.push([x, y, z] as [number, number, number]);
  }
  return temp;
})();


export const Food3D = ({ type }: Food3DProps) => {
  const groupRef = useRef<Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    groupRef.current.rotation.y += 0.015;
    groupRef.current.position.y = Math.sin(t * 2) * 0.05;

    if (type === 'power') {
        const scale = 1 + Math.sin(t * 8) * 0.15;
        groupRef.current.scale.set(scale, scale, scale);
    }
  });

  // --- DOT ---
  if (type === 'dot') {
    return (
      <group ref={groupRef}>
        <mesh rotation={[0.5, 0.5, 0]}>
          <icosahedronGeometry args={[0.15, 0]} /> 
          <meshStandardMaterial 
            color="#fef08a" 
            emissive="#fef08a" 
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    );
  }

  // ---  POWER PELLET ---
  if (type === 'power') {
    return (
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color="#ffbd2e" 
            emissive="#ffbd2e" 
            emissiveIntensity={2} 
            toneMapped={false} 
          />
        </mesh>
        <pointLight distance={1} intensity={2} color="#ffbd2e" />
      </group>
    );
  }

  // ---  CHERRY ---
  if (type === 'cherry') {
    const fruitMat = { color: "#be123c", roughness: 0.1, metalness: 0.4 }; 
    const stemMat = { color: "#a16207", roughness: 0.8 };

    return (
      <group ref={groupRef} position={[0, 0.1, 0]}>
        <group position={[-0.16, -0.2, 0]} rotation={[0, 0, 0.2]}>
            <mesh><sphereGeometry args={[0.15, 32, 32]} /><meshStandardMaterial {...fruitMat} /></mesh>
        </group>
        <group position={[0.16, -0.2, 0]} rotation={[0, 0, -0.2]}>
            <mesh><sphereGeometry args={[0.15, 32, 32]} /><meshStandardMaterial {...fruitMat} /></mesh>
        </group>
        <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.008, 0.008, 0.6]} /><meshStandardMaterial {...stemMat} />
        </mesh>
        <mesh position={[0.08, 0.08, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.008, 0.008, 0.6]} /><meshStandardMaterial {...stemMat} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
            <sphereGeometry args={[0.018]} /><meshStandardMaterial {...stemMat} />
        </mesh>
      </group>
    );
  }

  // --- STRAWBERRY ---
  if (type === 'strawberry') {
    const redColor = "#d32f2f";
    const seedColor = "#ffdb70";
    const leafColor = "#2e7d32";

    return (
      <group ref={groupRef} scale={[0.9, 0.9, 0.9]}>
        
        {/* body */}
        <mesh position={[0, 0, 0]} scale={[0.95, 1.15, 0.95]}>
            <sphereGeometry args={[0.25, 64, 64]} /> 
            <MeshDistortMaterial 
                color={redColor}
                roughness={0.4}
                metalness={0.1}
                distort={0.25} 
                speed={0} 
            />
        </mesh>

        {/* leaves */}
        <group position={[0, 0.22, 0]}>
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.03, 0.04, 0.1]} />
                <meshStandardMaterial color={leafColor} roughness={0.8} />
            </mesh>
            
            {[0, 72, 144, 216, 288].map((deg, i) => (
                <group key={i} rotation={[0.4, MathUtils.degToRad(deg), 0]}>
                     <mesh position={[0, 0.02, 0.08]} scale={[1, 0.1, 1.5]} rotation={[-0.2, 0, 0]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial color={leafColor} roughness={0.7} side={2} />
                    </mesh>
                </group>
            ))}
        </group>

        {/* STRAWBERRY_SEEDS */}
        {STRAWBERRY_SEEDS.map((pos, i) => (
            <mesh key={i} position={pos}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshStandardMaterial color={seedColor} roughness={0.5} />
            </mesh>
        ))}

      </group>
    );
  }

  return null;
};