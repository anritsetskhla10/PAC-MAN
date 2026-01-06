import { useEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { LEVEL_MAP } from '../utils/constants';
import { TileType } from '../types';

export const InstancedLevel = () => {
  const { settings } = useTheme();
  const { layout } = useGame();

  const wallsRef = useRef<InstancedMesh>(null);
  const floorsRef = useRef<InstancedMesh>(null);
  const foodRef = useRef<InstancedMesh>(null);

  const dummy = useMemo(() => new Object3D(), []);

  const { wallPositions, floorPositions, foodData } = useMemo(() => {
    const walls: [number, number, number][] = [];
    const floors: [number, number, number][] = [];
    const foods: { x: number; z: number; id: number }[] = [];
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


  // (კედლები, იატაკი) განლაგება
  useEffect(() => {
    if (!wallsRef.current || !floorsRef.current) return;

    // კედლების განლაგება
    wallPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      wallsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    wallsRef.current.instanceMatrix.needsUpdate = true;

    // იატაკების განლაგება
    floorPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.rotation.set(-Math.PI / 2, 0, 0); 
      dummy.updateMatrix();
      floorsRef.current!.setMatrixAt(i, dummy.matrix);
      dummy.rotation.set(0, 0, 0); 
    });
    floorsRef.current.instanceMatrix.needsUpdate = true;

  }, [wallPositions, floorPositions, dummy]);


  //  დინამიური ობიექტები (საჭმელი) 
  useEffect(() => {
    if (!foodRef.current) return;

    foodData.forEach((foodItem) => {
      // ვამოწმებთ მიმდინარე დინამიურ layout-ში, ისევ არის თუ არა აქ საჭმელი
      const isEaten = layout[foodItem.z][foodItem.x] !== TileType.FOOD;

      dummy.position.set(foodItem.x, 0.4, foodItem.z);
      
      // თუ შეჭმულია, ზომას (scale) ვაკეთებთ 0-ს
      if (isEaten) {
        dummy.scale.set(0, 0, 0);
      } else {
        dummy.scale.set(1, 1, 1);
      }
      
      dummy.updateMatrix();
      foodRef.current!.setMatrixAt(foodItem.id, dummy.matrix);
    });
    // აუცილებელია GPU-ს ვუთხრათ, რომ მატრიცები განახლდა
    foodRef.current.instanceMatrix.needsUpdate = true;

  }, [layout, foodData, dummy]); 


  return (
    <group>
      {/* --- WALLS INSTANCES --- */}
      <instancedMesh ref={wallsRef} args={[undefined, undefined, wallPositions.length]}>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial
          color={settings.wallColor}
          emissive={settings.wallColor}
          emissiveIntensity={0.25}
        />
      </instancedMesh>

      {/* --- FLOORS INSTANCES --- */}
      <instancedMesh ref={floorsRef} args={[undefined, undefined, floorPositions.length]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </instancedMesh>

      {/* --- FOOD INSTANCES --- */}
      <instancedMesh ref={foodRef} args={[undefined, undefined, foodData.length]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={settings.foodColor}
          emissive={settings.foodColor}
          emissiveIntensity={1}
        />
      </instancedMesh>
    </group>
  );
};