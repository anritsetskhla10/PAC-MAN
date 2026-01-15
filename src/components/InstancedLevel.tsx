import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { LEVEL_MAP } from '../utils/constants';
import { TileType } from '../types';

type Position3D = [number, number, number];

export const InstancedLevel = () => {
  const { settings } = useTheme();

  const wallsRef = useRef<InstancedMesh>(null);
  const floorsRef = useRef<InstancedMesh>(null);

  const dummy = useMemo(() => new Object3D(), []);

  const { wallPositions, floorPositions } = useMemo(() => {
    const walls: Position3D[] = [];
    const floors: Position3D[] = [];

    LEVEL_MAP.forEach((row, z) => {
      row.forEach((tile, x) => {
        floors.push([x, 0, z]);
        if (tile === TileType.WALL) {
          walls.push([x, 0.75, z]);
        }
      });
    });
    return { wallPositions: walls, floorPositions: floors };
  }, []);

  useEffect(() => {
    if (!wallsRef.current || !floorsRef.current) return;

    wallPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      wallsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    wallsRef.current.instanceMatrix.needsUpdate = true;
    if (wallsRef.current) wallsRef.current.computeBoundingSphere();

    floorPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.rotation.set(-Math.PI / 2, 0, 0); 
      dummy.updateMatrix();
      floorsRef.current!.setMatrixAt(i, dummy.matrix);
      dummy.rotation.set(0, 0, 0); 
    });
    floorsRef.current.instanceMatrix.needsUpdate = true;
  }, [wallPositions, floorPositions, dummy]);

  return (
    <group>
      {/* --- WALLS --- */}
      <instancedMesh 
        ref={wallsRef} 
        args={[undefined, undefined, wallPositions.length]}
        castShadow 
        receiveShadow={false}
        frustumCulled={false} 
      >
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial
          color={settings.wallColor}
          roughness={0.5} 
          metalness={0.1}
          emissive={settings.wallColor}
          emissiveIntensity={0.2}
          side={THREE.DoubleSide} 
        />
      </instancedMesh>

      {/* --- FLOORS --- */}
      <instancedMesh 
        ref={floorsRef} 
        args={[undefined, undefined, floorPositions.length]}
        receiveShadow
        frustumCulled={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={1} 
            metalness={0} 
        />
      </instancedMesh>
    </group>
  );
};