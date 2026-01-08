import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { LEVEL_MAP } from '../utils/constants';
import { TileType } from '../types';

type Position3D = [number, number, number];
type FoodItem = { x: number; z: number; id: number };

export const InstancedLevel = () => {
  const { settings } = useTheme();
  const { layout } = useGame();

  const wallsRef = useRef<InstancedMesh>(null);
  const floorsRef = useRef<InstancedMesh>(null);
  const foodRef = useRef<InstancedMesh>(null);

  const dummy = useMemo(() => new Object3D(), []);

  const { wallPositions, floorPositions, foodData } = useMemo(() => {
    const walls: Position3D[] = [];
    const floors: Position3D[] = [];
    const foods: FoodItem[] = [];
    let foodCount = 0;

    LEVEL_MAP.forEach((row, z) => {
      row.forEach((tile, x) => {
        floors.push([x, 0, z]);
        if (tile === TileType.WALL) {
          walls.push([x, 0.75, z]);
        } else if (tile === TileType.FOOD) {
          foods.push({ x, z, id: foodCount++ });
        }
      });
    });
    return { wallPositions: walls, floorPositions: floors, foodData: foods };
  }, []);

  useEffect(() => {
    if (!wallsRef.current || !floorsRef.current) return;

    wallPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      wallsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    wallsRef.current.instanceMatrix.needsUpdate = true;

    floorPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.rotation.set(-Math.PI / 2, 0, 0); 
      dummy.updateMatrix();
      floorsRef.current!.setMatrixAt(i, dummy.matrix);
      dummy.rotation.set(0, 0, 0); 
    });
    floorsRef.current.instanceMatrix.needsUpdate = true;
  }, [wallPositions, floorPositions, dummy]);

  useEffect(() => {
    if (!foodRef.current) return;
    foodData.forEach((foodItem) => {
      const isEaten = layout[foodItem.z][foodItem.x] !== TileType.FOOD;
      dummy.position.set(foodItem.x, 0.4, foodItem.z);
      if (isEaten) dummy.scale.set(0, 0, 0);
      else dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      foodRef.current!.setMatrixAt(foodItem.id, dummy.matrix);
    });
    foodRef.current.instanceMatrix.needsUpdate = true;
  }, [layout, foodData, dummy]); 

  return (
    <group>
      {/* --- WALLS --- */}
      <instancedMesh 
        ref={wallsRef} 
        args={[undefined, undefined, wallPositions.length]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial
          color={settings.wallColor}
          roughness={1} 
          metalness={0}
          emissive={settings.wallColor}
          emissiveIntensity={0.05}
        />
      </instancedMesh>

      {/* --- FLOORS --- */}
      <instancedMesh 
        ref={floorsRef} 
        args={[undefined, undefined, floorPositions.length]}
        receiveShadow
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={1} 
            metalness={0} 
        />
      </instancedMesh>

      {/* --- FOOD --- */}
      <instancedMesh ref={foodRef} args={[undefined, undefined, foodData.length]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={settings.foodColor}
          emissive={settings.foodColor}
          emissiveIntensity={1}
          roughness={1} 
          metalness={0}
        />
      </instancedMesh>
    </group>
  );
};