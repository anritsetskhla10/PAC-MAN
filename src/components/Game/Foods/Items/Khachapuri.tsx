import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';

export const Khachapuri = () => {
  const materials = useMemo(() => ({
    dough: new MeshStandardMaterial({ color: "#F5F5DC", roughness: 0.5 }),
    cheese: new MeshStandardMaterial({ color: "#FFD700", roughness: 0.4 }),
    crust: new MeshStandardMaterial({ color: "#F4C430", roughness: 0.8 }),
  }), []);

  return (
    <group rotation={[Math.PI / 3, 0, 0]} scale={1.2}>
      <mesh material={materials.dough}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
      </mesh>
      <mesh position={[0, 0.02, 0]} material={materials.cheese}>
          <cylinderGeometry args={[0.17, 0.17, 0.02, 32]} />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]} material={materials.crust}>
           <torusGeometry args={[0.2, 0.03, 8, 32]} />
      </mesh>
    </group>
  );
};