import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei'; 
import { useGame } from '../../../context/GameContext'; 
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

export const Player = () => {
  const { camera } = useThree();
  const { playerPosRef, movePlayer, gameStatus } = useGame();
  const controlsRef = useRef<PointerLockControlsImpl>(null);

  const [initialPos, setInitialPos] = useState({ x: 0, z: 0 });

  useEffect(() => {
    if (playerPosRef.current) {
        setInitialPos({ x: playerPosRef.current.x, z: playerPosRef.current.z });
    }
  }, [playerPosRef]);
  
  // --- Controls Lock ---
  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setTimeout(() => { controlsRef.current?.lock(); }, 100);
      return () => clearTimeout(timer);
    } else {
      controlsRef.current?.unlock();
    }
  }, [gameStatus]);

  // --- Keyboard Movement ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      const currentPos = playerPosRef.current;
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
  }, [camera, movePlayer, gameStatus, playerPosRef]);

  // --- Camera Movement (Smooth Lerp) ---
  useFrame(() => {
    const pos = playerPosRef.current;
    if (!pos || isNaN(pos.x)) return;

    const targetPosition = new Vector3(pos.x, 0.5, pos.z);
    if (!isNaN(camera.position.x)) {
       camera.position.lerp(targetPosition, 0.8); 
    } else {
       camera.position.copy(targetPosition);
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      <group position={[initialPos.x, 0.5, initialPos.z]}>
        <pointLight 
          position={[0, 0.6, 0]} 
          intensity={1.5} 
          distance={10} 
          decay={2} 
          color="#ffaa00"
          shadow-mapSize={[1024, 1024]} 
          shadow-bias={-0.0001} 
        />
        <pointLight position={[0, 0.5, 0]} intensity={0.2} distance={3} color="white" />
      </group>
    </>
  );
};