import * as THREE from 'three';
import { useMemo } from 'react';

const applyStrawberryShape = (x: number, y: number, z: number, baseRadius: number) => {
  const normalizedY = y / baseRadius; 

  const finalY = y * 1.3;
  const taperScale = 0.95 + 0.25 * normalizedY - 0.15 * (normalizedY * normalizedY);

  const finalX = x * taperScale;
  const finalZ = z * taperScale;

  return new THREE.Vector3(finalX, finalY, finalZ);
};

export const Strawberry3D = () => {
  const strawberryRed = "#b81200";
  const seedYellow = "#d4b33d";
  const leafGreen = "#1e5c22";
  const baseRadius = 0.25;

  const strawberryGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(baseRadius, 64, 64);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const v = applyStrawberryShape(pos.getX(i), pos.getY(i), pos.getZ(i), baseRadius);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const seedsData = useMemo(() => {
    const items = [];
    const totalSeeds = 150; 
    const goldenRatio = Math.PI * (Math.sqrt(5) - 1);

    for (let i = 0; i < totalSeeds; i++) {
      const yOffset = 1 - (i / (totalSeeds - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - yOffset * yOffset);
      const theta = goldenRatio * i;

      const rawX = Math.cos(theta) * radiusAtY * baseRadius;
      const rawY = yOffset * baseRadius;
      const rawZ = Math.sin(theta) * radiusAtY * baseRadius;

      const shapedPos = applyStrawberryShape(rawX, rawY, rawZ, baseRadius);

      if (yOffset < 0.85 && yOffset > -0.9) {

        const normalVector = new THREE.Vector3(shapedPos.x, shapedPos.y * 0.4, shapedPos.z).normalize();

        shapedPos.add(normalVector.clone().multiplyScalar(0.006));

        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          normalVector
        );

        const scaleMultiplier = Math.max(0.4, Math.sqrt(1 - yOffset * yOffset));

        items.push({
          position: [shapedPos.x, shapedPos.y, shapedPos.z] as [number, number, number],
          quaternion,
          scale: scaleMultiplier
        });
      }
    }
    return items;
  }, []);

  // ღეროს მრუდი 
  const stemCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.02, 0.12, 0),
      new THREE.Vector3(0.08, 0.25, 0),
      new THREE.Vector3(0.18, 0.38, -0.05)
    ]);
  }, []);

  return (
    <group position={[0, -0.1, 0]}>
      
      <mesh geometry={strawberryGeometry}>
        <meshPhysicalMaterial 
          color={strawberryRed} 
          roughness={0.4} 
          metalness={0.1}
          clearcoat={0.8}  
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* თესლების დარენდერება */}
      <group>
        {seedsData.map((seed, index) => (
          <mesh 
            key={`seed-${index}`} 
            position={seed.position} 
            quaternion={seed.quaternion}
            scale={[seed.scale, 1, seed.scale]} 
          >
            <cylinderGeometry args={[0.0045, 0.004, 0.006, 6]} />
            <meshStandardMaterial 
              color={seedYellow} 
              roughness={0.6} 
            />
          </mesh>
        ))}
      </group>

      {/* ფოთლები და ყუნწი */}
      <group position={[0, 0.31, 0]} scale={[1.1, 1.1, 1.1]}>
        <mesh>
          <tubeGeometry args={[stemCurve, 20, 0.012, 8, false]} />
          <meshStandardMaterial color={leafGreen} roughness={0.7} />
        </mesh>

        {[0, 60, 120, 180, 240, 300].map((degreeAngle, index) => (
          <group key={index} rotation={[0, THREE.MathUtils.degToRad(degreeAngle), 0]}>
            <mesh position={[0, 0.01, 0.07]} rotation={[0.5, 0, 0]} scale={[0.4, 0.1, 1.3]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={leafGreen} roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
      
    </group>
  );
};