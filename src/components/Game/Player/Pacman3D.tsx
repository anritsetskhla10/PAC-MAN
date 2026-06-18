import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { PointerLockControls } from '@react-three/drei';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';
import { useGameRefs, useGameActions, useGameSession } from '../../../context/GameContext';
import { useTheme } from '../../../context/ThemeContext';
import type { PlayerHeading } from '../../../hooks/usePlayerHeading';
import { useIsMobile } from '../../../hooks/useIsMobile'; 
import { Model as LabadzeModel } from '../../Game/3D/Models/Labadze';
import { ClassicPacmanModel3D } from '../3D/Models/ClassicPacmanModel3D'; 

// Reused scratch vectors so the per-frame camera math doesn't allocate.
const _target = new Vector3();
const _look = new Vector3();
const _current = new Vector3();

interface Pacman3DProps {
    isShowcase?: boolean;
    isSpectator?: boolean;
    heading?: PlayerHeading; 
    forceModel?: 'classic' | 'labadze';
}

export const Pacman3D = ({ isShowcase = false, isSpectator = false, heading = 'RIGHT', forceModel }: Pacman3DProps) => {
  const { settings } = useTheme();
  const { playerPosRef } = useGameRefs();
  const { movePlayer } = useGameActions();
  const { gameStatus } = useGameSession();
  const { camera, viewport } = useThree(); 
  const controlsRef = useRef<PointerLockControlsImpl>(null);
  
  const isMobile = useIsMobile();
  const groupRef = useRef<Group>(null);       

  const currentPosRef = useRef(new Vector3(0, 0, 0));
  const [initialLightPos, setInitialLightPos] = useState({ x: 0, z: 0 });

  useEffect(() => {
      if (playerPosRef.current) {
          currentPosRef.current.set(playerPosRef.current.x, 0, playerPosRef.current.z);
          setInitialLightPos({ x: playerPosRef.current.x, z: playerPosRef.current.z });
      }
  }, [playerPosRef]);

  const targetRotation = useRef(Math.PI / 2); 
  const isMoving = useRef(false);

  const [labadzeAnim, setLabadzeAnim] = useState('IDLE');
  const lastAnimRef = useRef('IDLE'); 

  const isLabadze = forceModel 
      ? forceModel === 'labadze' 
      : (settings.playerModel === 'avatar' || settings.gameTheme === 'labadze');

  const isFpsMode = !isSpectator && !isShowcase && !isMobile;
  const shouldRenderModel = !isFpsMode; 

  // როტაციის ლოგიკა
  useEffect(() => {
    if (!isFpsMode) {
        let angle = 0;
        switch (heading) {
            case 'UP':    angle = Math.PI; break;      
            case 'DOWN':  angle = 0; break;             
            case 'LEFT':  angle = -Math.PI / 2; break;  
            case 'RIGHT': angle = Math.PI / 2; break; 
        }
        targetRotation.current = angle; 
    }
  }, [heading, isFpsMode]);

  // კლავიატურის კონტროლი
  useEffect(() => {
    if (isShowcase || isMobile) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      
      const currentX = Math.round(playerPosRef.current.x);
      const currentZ = Math.round(playerPosRef.current.z);
      let newX = currentX;
      let newZ = currentZ;

      const direction = new Vector3();
      camera.getWorldDirection(direction);
      const isFacingX = Math.abs(direction.x) > Math.abs(direction.z);

      const forwardStep = { x: isFacingX ? Math.sign(direction.x) : 0, z: !isFacingX ? Math.sign(direction.z) : 0 };
      const rightStep = { x: !isFacingX ? -Math.sign(direction.z) : 0, z: isFacingX ? Math.sign(direction.x) : 0 };

      if (e.code === 'KeyW' || e.code === 'ArrowUp') { 
          if (isSpectator) newZ -= 1; 
          else { newX += forwardStep.x; newZ += forwardStep.z; }
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') { 
          if (isSpectator) newZ += 1;
          else { newX -= forwardStep.x; newZ -= forwardStep.z; }
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') { 
          if (isSpectator) newX += 1;
          else { newX += rightStep.x; newZ += rightStep.z; }
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') { 
          if (isSpectator) newX -= 1;
          else { newX -= rightStep.x; newZ -= rightStep.z; }
      }

      movePlayer(newX, newZ);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, movePlayer, gameStatus, isShowcase, isSpectator, isMobile, playerPosRef]);

  // Pointer Lock 
  useEffect(() => {
    if (!isFpsMode) {
         controlsRef.current?.unlock(); 
         return;
    }
    if (gameStatus === 'playing') {
      const timer = setTimeout(() => { controlsRef.current?.lock(); }, 100);
      return () => clearTimeout(timer);
    } else {
      controlsRef.current?.unlock();
    }
  }, [gameStatus, isFpsMode]);

  // ანიმაციის და კამერის ლუპი
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetY = isLabadze ? 0.05 : 0.85;
    const playerPos = playerPosRef.current; 

    const targetVec = isShowcase
        ? _target.set(0, 0, 0)
        : _target.set(playerPos.x, targetY, playerPos.z);

    const dx = playerPos.x - currentPosRef.current.x;
    const dz = playerPos.z - currentPosRef.current.z;
    isMoving.current = Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01;

    // Labadze ანიმაციის სტატუსი
    let nextAnimState = 'IDLE';
    if (gameStatus === 'gameover') nextAnimState = 'DYING';
    else if (isMoving.current) nextAnimState = 'MOVING';

    if (lastAnimRef.current !== nextAnimState) {
        lastAnimRef.current = nextAnimState;
        setLabadzeAnim(nextAnimState); 
    }

    groupRef.current.position.lerp(targetVec, 9.0 * delta);
    currentPosRef.current.lerp(targetVec, 9.0 * delta);

    // კამერის მართვა
    if (!isShowcase) {
        if (!isFpsMode) {
            const isPortrait = viewport.aspect < 1;

            if (isPortrait) {
                const dynamicHeight = Math.max(24, 19.5 / viewport.aspect);

                if (!isNaN(camera.position.x)) {
                    camera.position.lerp(_target.set(9, dynamicHeight, 16), 0.1);

                    _look.set(9, 0, 11); // map center

                    camera.getWorldDirection(_current);
                    _current.add(camera.position);

                    _current.lerp(_look, 0.1);
                    camera.lookAt(_current);
                }
            } else {
                const isLandscape = viewport.width > viewport.height;
                const camHeight = isMobile ? (isLandscape ? 16 : 22) : 14;
                const camDist = isMobile ? (isLandscape ? 10 : 12) : 8;
                const gp = groupRef.current.position;

                if (!isNaN(camera.position.x)) {
                    camera.position.lerp(_target.set(gp.x, gp.y + camHeight, gp.z + camDist), 0.1);

                    _look.copy(gp);

                    camera.getWorldDirection(_current);
                    _current.add(camera.position);

                    _current.lerp(_look, 0.1);
                    camera.lookAt(_current);
                }
            }
        } else {
            const gp = groupRef.current.position;
            if (!isNaN(camera.position.x)) {
                camera.position.lerp(_target.set(gp.x, 0.6, gp.z), 0.8);
            }
        }
    }

    // მოთამაშის ბრუნვა (როტაცია)
    if (!isFpsMode) {
        const tRot = targetRotation.current;
        const cRot = groupRef.current.rotation.y;
        let diff = tRot - cRot;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * 15.0 * delta;
    }
  });

  return (
    <>
      {!isShowcase && !isMobile && <PointerLockControls ref={controlsRef} selector="#root" />}
      
      <group position={[initialLightPos.x, 3, initialLightPos.z]}>
         <pointLight intensity={1.5} distance={15} decay={2} color="#ffaa00" />
      </group>

      <group ref={groupRef}>
        {shouldRenderModel && (
            isLabadze ? (
               <group scale={0.65} rotation={[0, 0, 0]}> 
                  <LabadzeModel playerState={labadzeAnim} />
               </group>
            ) : (
               <ClassicPacmanModel3D isMovingRef={isMoving} isShowcase={isShowcase} />
            )
        )}
      </group>
    </>
  );
};