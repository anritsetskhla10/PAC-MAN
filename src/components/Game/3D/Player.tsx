import { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { LEVEL_MAP } from '../../../utils/constants';
import { TileType } from '../../../types';

export const Player = () => {
  const { camera } = useThree();
  const [pos, setPos] = useState({ x: 1, z: 1 });
  
  const posRef = useRef(pos); 
  useEffect(() => { posRef.current = pos; }, [pos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentPos = posRef.current;
      let newX = currentPos.x;
      let newZ = currentPos.z;

      const direction = new Vector3();
      camera.getWorldDirection(direction);

      const isFacingX = Math.abs(direction.x) > Math.abs(direction.z);

      const forwardStep = { 
        x: isFacingX ? Math.sign(direction.x) : 0, 
        z: !isFacingX ? Math.sign(direction.z) : 0 
      };
      
      const rightStep = { 
        x: !isFacingX ? -Math.sign(direction.z) : 0, 
        z: isFacingX ? Math.sign(direction.x) : 0 
      };

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        newX += forwardStep.x;
        newZ += forwardStep.z;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        newX -= forwardStep.x;
        newZ -= forwardStep.z;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        newX += rightStep.x;
        newZ += rightStep.z;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        newX -= rightStep.x;
        newZ -= rightStep.z;
      }


      const targetX = Math.round(newX);
      const targetZ = Math.round(newZ);

      if (
        LEVEL_MAP[targetZ] && 
        LEVEL_MAP[targetZ][targetX] !== TileType.WALL
      ) {
        setPos({ x: targetX, z: targetZ });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera]); 

  useFrame(() => {
    const targetPosition = new Vector3(pos.x, 0.5, pos.z);
    camera.position.lerp(targetPosition, 0.1);
  });

  return (
    <>
      <PointerLockControls />
      
      <group position={[pos.x, 0.5, pos.z]}>
        <spotLight 
          position={[0, 0, 0]}
          target={camera} 
          intensity={2}
          angle={0.5}
          penumbra={1}
          distance={10}
        />
      </group>
    </>
  );
};