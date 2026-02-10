import { MathUtils } from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

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

export const Strawberry3D = () => {
  const strawberryRed = "#d32f2f"; 
  const seedYellow = "#ffdb70"; 
  const leafGreen = "#2e7d32";

  return (
    <group scale={[0.9, 0.9, 0.9]}>
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
};