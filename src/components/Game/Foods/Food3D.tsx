import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from '../../../context/ThemeContext';

type ConsumableVariant = 'dot' | 'power' | 'cherry' | 'strawberry';

interface Food3DProps {
  consumableVariant: ConsumableVariant;
}

const PRECALCULATED_STRAWBERRY_SEEDS = (() => {
  const seedPositions: [number, number, number][] = [];
  const totalSeeds = 60;
  const strawberryRadius = 0.235;

  for (let i = 0; i < totalSeeds; i++) {
    const phi = Math.acos(-1 + (2 * i) / totalSeeds);
    const theta = Math.sqrt(totalSeeds * Math.PI) * phi;
    const verticalAdjust = phi > 1.5 ? 0.9 : 1; 

    const x = strawberryRadius * Math.sin(phi) * Math.cos(theta) * verticalAdjust;
    const y = (strawberryRadius * Math.sin(phi) * Math.sin(theta) * verticalAdjust) - 0.05;
    const z = strawberryRadius * Math.cos(phi);

    seedPositions.push([x, y, z]);
  }
  return seedPositions;
})();

export const Food3D = ({ consumableVariant }: Food3DProps) => {
  const meshGroupRef = useRef<Group>(null);
  const { settings } = useTheme();
  
  const themeDerivedPelletColor = settings?.foodColor ?? '#fef08a';

  useFrame((state) => {
    if (!meshGroupRef.current) return;
    
    const elapsedTime = state.clock.getElapsedTime();
    
    meshGroupRef.current.rotation.y += 0.015;
    meshGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.05;

    if (consumableVariant === 'power') {
        const pulseScale = 1 + Math.sin(elapsedTime * 8) * 0.15;
        meshGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
  });

  if (consumableVariant === 'dot') {
    return (
      <group ref={meshGroupRef}>
        <mesh rotation={[0.5, 0.5, 0]}>
          <icosahedronGeometry args={[0.15, 0]} /> 
          <meshStandardMaterial 
            color={themeDerivedPelletColor} 
            emissive={themeDerivedPelletColor} 
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    );
  }

  if (consumableVariant === 'power') {
    return (
      <group ref={meshGroupRef}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color={themeDerivedPelletColor} 
            emissive={themeDerivedPelletColor} 
            emissiveIntensity={2} 
            toneMapped={false} 
          />
        </mesh>
        <pointLight distance={1} intensity={2} color={themeDerivedPelletColor} />
      </group>
    );
  }

  if (consumableVariant === 'cherry') {
    const cherryFleshMaterial = { color: "#be123c", roughness: 0.1, metalness: 0.4 }; 
    const stemMaterial = { color: "#a16207", roughness: 0.8 };

    return (
      <group ref={meshGroupRef} position={[0, 0.1, 0]}>
        <group position={[-0.16, -0.2, 0]} rotation={[0, 0, 0.2]}>
            <mesh><sphereGeometry args={[0.15, 32, 32]} /><meshStandardMaterial {...cherryFleshMaterial} /></mesh>
        </group>
        <group position={[0.16, -0.2, 0]} rotation={[0, 0, -0.2]}>
            <mesh><sphereGeometry args={[0.15, 32, 32]} /><meshStandardMaterial {...cherryFleshMaterial} /></mesh>
        </group>
        <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.008, 0.008, 0.6]} /><meshStandardMaterial {...stemMaterial} />
        </mesh>
        <mesh position={[0.08, 0.08, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.008, 0.008, 0.6]} /><meshStandardMaterial {...stemMaterial} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
            <sphereGeometry args={[0.018]} /><meshStandardMaterial {...stemMaterial} />
        </mesh>
      </group>
    );
  }

  if (consumableVariant === 'strawberry') {
    const strawberryRed = "#d32f2f";
    const seedYellow = "#ffdb70";
    const leafGreen = "#2e7d32";

    return (
      <group ref={meshGroupRef} scale={[0.9, 0.9, 0.9]}>
        <mesh position={[0, 0, 0]} scale={[0.95, 1.15, 0.95]}>
            <sphereGeometry args={[0.25, 64, 64]} /> 
            <MeshDistortMaterial 
                color={strawberryRed}
                roughness={0.4}
                metalness={0.1}
                distort={0.25} 
                speed={0} 
            />
        </mesh>

        <group position={[0, 0.22, 0]}>
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.03, 0.04, 0.1]} />
                <meshStandardMaterial color={leafGreen} roughness={0.8} />
            </mesh>
            
            {[0, 72, 144, 216, 288].map((degreeAngle, index) => (
                <group key={index} rotation={[0.4, MathUtils.degToRad(degreeAngle), 0]}>
                     <mesh position={[0, 0.02, 0.08]} scale={[1, 0.1, 1.5]} rotation={[-0.2, 0, 0]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial color={leafGreen} roughness={0.7} side={2} />
                    </mesh>
                </group>
            ))}
        </group>

        {PRECALCULATED_STRAWBERRY_SEEDS.map((position, index) => (
            <mesh key={`seed-${index}`} position={position}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshStandardMaterial color={seedYellow} roughness={0.5} />
            </mesh>
        ))}
      </group>
    );
  }

  return null;
};