import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { useGame } from '../../../context/GameContext';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

export const Player = () => {
  const { camera } = useThree();
  const { playerPos, movePlayer, gameStatus } = useGame(); 

  const controlsRef = useRef<PointerLockControlsImpl>(null);

  // ---  მაუსის ჩაკეტვის ლოგიკა ---
  useEffect(() => {
    if (gameStatus === 'playing') {
      setTimeout(() => {
        controlsRef.current?.lock();
      }, 100);
    } else {
      controlsRef.current?.unlock();
    }
  }, [gameStatus]);

  // ---  პოზიციის სინქრონიზაცია ---
  const posRef = useRef(playerPos);
  useEffect(() => { posRef.current = playerPos; }, [playerPos]);

  // ---  კლავიატურის მოსმენა ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // თუ თამაში არ მიდის, არ იმოძრაო
      if (gameStatus !== 'playing') return;

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

      movePlayer(Math.round(newX), Math.round(newZ));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, movePlayer, gameStatus]);

  // ---  კამერის მოძრაობა ---
  useFrame(() => {
    const targetPosition = new Vector3(playerPos.x, 0.5, playerPos.z);
    camera.position.lerp(targetPosition, 0.15);
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      <group position={[playerPos.x, 0.5, playerPos.z]}>
        <spotLight 
          position={[0, 0, 0]}
          target={camera}
          intensity={2}
          angle={0.6}
          penumbra={1}
          distance={15}
          castShadow
        />
      </group>
    </>
  );
};