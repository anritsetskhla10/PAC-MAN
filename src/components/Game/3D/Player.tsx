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

  useEffect(() => {
    if (gameStatus === 'playing') {
      setTimeout(() => { controlsRef.current?.lock(); }, 100);
    } else {
      controlsRef.current?.unlock();
    }
  }, [gameStatus]);
  
  const posRef = useRef(playerPos);
  useEffect(() => { posRef.current = playerPos; }, [playerPos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      const currentPos = posRef.current;
      let newX = currentPos.x;
      let newZ = currentPos.z;

      const direction = new Vector3();
      camera.getWorldDirection(direction);
      const isFacingX = Math.abs(direction.x) > Math.abs(direction.z);

      const forwardStep = { x: isFacingX ? Math.sign(direction.x) : 0, z: !isFacingX ? Math.sign(direction.z) : 0 };
      const rightStep = { x: !isFacingX ? -Math.sign(direction.z) : 0, z: isFacingX ? Math.sign(direction.x) : 0 };

      if (e.code === 'KeyW' || e.code === 'ArrowUp') { newX += forwardStep.x; newZ += forwardStep.z; }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') { newX -= forwardStep.x; newZ -= forwardStep.z; }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') { newX += rightStep.x; newZ += rightStep.z; }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') { newX -= rightStep.x; newZ -= rightStep.z; }

      movePlayer(Math.round(newX), Math.round(newZ));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, movePlayer, gameStatus]);

  useFrame(() => {
    const targetPosition = new Vector3(playerPos.x, 0.5, playerPos.z);
    camera.position.lerp(targetPosition, 0.2); 
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      <group position={[playerPos.x, 0.5, playerPos.z]}>
        <pointLight 
          position={[0, 0.6, 0]} 
          intensity={1.2} 
          distance={10} 
          decay={2} 
          color="#ffaa00"
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.001} 
        />
        <pointLight position={[0, 0.5, 0]} intensity={0.2} distance={3} color="white" />
      </group>
    </>
  );
};