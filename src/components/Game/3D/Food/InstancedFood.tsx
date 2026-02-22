import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TileType } from '../../../../types';
import { useTheme } from '../../../../context/ThemeContext';

const dummy = new THREE.Object3D();

const randomGrain = (x: number, y: number, z: number) => {
  return Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 53.53) * 43758.5453) % 1;
};

const createMchadiGeometry = () => {
  const geo = new THREE.SphereGeometry(0.13, 16, 16);
  const positions = geo.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const tempColor = new THREE.Color();
  const doughColor = new THREE.Color("#FCEEB5"); 
  const goldenColor = new THREE.Color("#E3B04B"); 
  const burntColor = new THREE.Color("#A35622"); 
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    const warp = Math.sin(vertex.x * 3) * Math.sin(vertex.z * 3) * 0.02;
    const grain = randomGrain(vertex.x, vertex.y, vertex.z);
    vertex.addScaledVector(vertex.clone().normalize(), warp + grain * 0.008);
    positions.setXYZ(i, vertex.x, vertex.y, vertex.z);

    tempColor.copy(doughColor);
    if (grain > 0.6) tempColor.lerp(goldenColor, 0.6);
    if (grain > 0.85) tempColor.lerp(burntColor, 0.7);
    colors[i * 3] = tempColor.r; colors[i * 3 + 1] = tempColor.g; colors[i * 3 + 2] = tempColor.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
};

const createLavashGeometry = () => {
  const geo = new THREE.CylinderGeometry(0.13, 0.13, 0.75, 16, 8, true);
  const positions = geo.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const tempColor = new THREE.Color();
  const doughColor = new THREE.Color("#FFF8DC"); 
  const burnColor = new THREE.Color("#8B4513"); 
  const v = new THREE.Vector3();

  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    const crumple = Math.sin(v.y * 30 + v.x * 20) * 0.004; 
    v.addScaledVector(v.clone().normalize(), crumple);
    positions.setXYZ(i, v.x, v.y, v.z);

    const noise = Math.sin(v.x * 15 + v.z * 15) * Math.sin(v.y * 25) + Math.sin(i * 0.9) * 0.3; 
    tempColor.copy(doughColor).lerp(burnColor, Math.min(1, Math.max(0, (noise - 0.4) * 3)));
    colors[i * 3] = tempColor.r; colors[i * 3 + 1] = tempColor.g; colors[i * 3 + 2] = tempColor.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
};

interface InstancedFoodProps {
  layout: number[][];
  themeOverride?: 'classic' | 'labadze';
}

const InstancedFoodComponent = ({ layout, themeOverride }: InstancedFoodProps) => {
  const { settings } = useTheme();
  
  const isLabadze = themeOverride 
    ? themeOverride === 'labadze' 
    : (settings.gameTheme === 'labadze' || settings.playerModel === 'avatar');
    
  const foodColor = settings?.foodColor ?? '#fef08a';

  const classicDotRef = useRef<THREE.InstancedMesh>(null);
  const classicPowerRef = useRef<THREE.InstancedMesh>(null);
  const mchadiRef = useRef<THREE.InstancedMesh>(null);
  const kebabMeatRef = useRef<THREE.InstancedMesh>(null);
  const kebabLavashRef = useRef<THREE.InstancedMesh>(null);

  const itemData = useMemo(() => {
    const dots: { x: number, z: number, randomRot: number }[] = [];
    const powers: { x: number, z: number, randomRot: number }[] = [];
    
    layout.forEach((row, z) => {
      row.forEach((tile, x) => {
        if (tile === TileType.FOOD) dots.push({ x, z, randomRot: Math.random() * Math.PI * 2 });
        if (tile === TileType.POWER_PELLET) powers.push({ x, z, randomRot: Math.random() * Math.PI * 2 });
      });
    });
    return { dots, powers };
  }, [layout]);

  const { mchadiGeo, lavashGeo, meatGeo } = useMemo(() => ({
    mchadiGeo: createMchadiGeometry(),
    lavashGeo: createLavashGeometry(),
    meatGeo: new THREE.CapsuleGeometry(0.11, 0.92, 4, 8)
  }), []);

  //  გლობალური ანიმაციის ციკლ
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 2) * 0.05;
    const globalRot = time * 0.5;
    const pulseScale = isLabadze ? 1 : 1 + Math.sin(time * 8) * 0.15;

    // Dots 
    itemData.dots.forEach((dot, i) => {
      dummy.position.set(dot.x, 0.5 + floatOffset, dot.z);
      
      if (isLabadze) {
        dummy.rotation.set(0, dot.randomRot + globalRot, 0);
        dummy.scale.set(1.5, 0.55, 1.15); 
        dummy.updateMatrix();
        mchadiRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.rotation.set(0.5, 0.5 + globalRot, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        classicDotRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });

    // Power Pellets 
    itemData.powers.forEach((power, i) => {
      dummy.position.set(power.x, 0.5 + floatOffset, power.z);
      
      if (isLabadze) {
        dummy.rotation.set(Math.PI / 8, power.randomRot + globalRot, Math.PI / 6);
        dummy.scale.set(pulseScale, pulseScale, pulseScale);
        dummy.updateMatrix();
        kebabMeatRef.current?.setMatrixAt(i, dummy.matrix);
        kebabLavashRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        dummy.rotation.set(0, globalRot, 0);
        dummy.scale.set(pulseScale, pulseScale, pulseScale);
        dummy.updateMatrix();
        classicPowerRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });

    if (isLabadze) {
      if (mchadiRef.current) mchadiRef.current.instanceMatrix.needsUpdate = true;
      if (kebabMeatRef.current) kebabMeatRef.current.instanceMatrix.needsUpdate = true;
      if (kebabLavashRef.current) kebabLavashRef.current.instanceMatrix.needsUpdate = true;
    } else {
      if (classicDotRef.current) classicDotRef.current.instanceMatrix.needsUpdate = true;
      if (classicPowerRef.current) classicPowerRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {isLabadze ? (
        <>
          {/* Labadze Mchadi */}
          {itemData.dots.length > 0 && (
            <instancedMesh ref={mchadiRef} args={[mchadiGeo, undefined, itemData.dots.length]}>
              <meshStandardMaterial vertexColors={true} roughness={1} metalness={0.0} emissive={"#8B4513"} emissiveIntensity={0.1} />
            </instancedMesh>
          )}
          
          {/* Labadze Kebab */}
          {itemData.powers.length > 0 && (
            <group>
              <instancedMesh ref={kebabMeatRef} args={[meatGeo, undefined, itemData.powers.length]}>
                <meshPhysicalMaterial color="#771313" roughness={0.65} metalness={0.0} reflectivity={0.5} />
              </instancedMesh>
              <instancedMesh ref={kebabLavashRef} args={[lavashGeo, undefined, itemData.powers.length]}>
                <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} roughness={1} metalness={0} />
              </instancedMesh>
            </group>
          )}
        </>
      ) : (
        <>
          {/* Classic Dots */}
          {itemData.dots.length > 0 && (
            <instancedMesh ref={classicDotRef} args={[undefined, undefined, itemData.dots.length]}>
              <icosahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial color={foodColor} emissive={foodColor} emissiveIntensity={0.5} roughness={0.3} />
            </instancedMesh>
          )}

          {/* Classic Power Pellets */}
          {itemData.powers.length > 0 && (
            <instancedMesh ref={classicPowerRef} args={[undefined, undefined, itemData.powers.length]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={foodColor} emissive={foodColor} emissiveIntensity={2} toneMapped={false} />
            </instancedMesh>
          )}

          {/* lights for power pellets */}
          {itemData.powers.map((pos, i) => (
            <pointLight 
              key={`light-${i}`} 
              position={[pos.x, 0.5, pos.z]} 
              distance={1} 
              intensity={2} 
              color={foodColor} 
            />
          ))}
        </>
      )}
    </group>
  );
};

export const InstancedFood = React.memo(InstancedFoodComponent);