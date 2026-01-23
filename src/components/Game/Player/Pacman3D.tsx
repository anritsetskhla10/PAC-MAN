import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group, MeshStandardMaterial, DoubleSide } from 'three';
import { PointerLockControls } from '@react-three/drei';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';
import { useGame } from '../../../context/GameContext'; 

interface Pacman3DProps {
  isShowcase?: boolean;
  isSpectator?: boolean; 
}

export const Pacman3D = ({ isShowcase = false, isSpectator = false }: Pacman3DProps) => {
  const { playerPos, movePlayer, gameStatus } = useGame();
  const { camera, viewport } = useThree(); 
  const controlsRef = useRef<PointerLockControlsImpl>(null);

  const groupRef = useRef<Group>(null);       
  const mainBodyRef = useRef<Group>(null);    
  const upperJawRef = useRef<Group>(null);
  const lowerJawRef = useRef<Group>(null);
  const leftArmPivot = useRef<Group>(null);
  const rightArmPivot = useRef<Group>(null);
  const leftLegPivot = useRef<Group>(null);
  const rightLegPivot = useRef<Group>(null);

  const currentPosRef = useRef(new Vector3(playerPos.x, 0, playerPos.z));
  const targetRotation = useRef(Math.PI); 
  const isMoving = useRef(false);

  const colors = useMemo(() => ({
    skin: "#FFD600", boots: "#D50000", gloves: "#FF8F00", eyes: "#000000",
  }), []);

  const materials = useMemo(() => ({
    skin: new MeshStandardMaterial({ color: colors.skin, roughness: 0.2, metalness: 0.1, side: DoubleSide }),
    boots: new MeshStandardMaterial({ color: colors.boots, roughness: 0.4, side: DoubleSide }),
    gloves: new MeshStandardMaterial({ color: colors.gloves, roughness: 0.5, side: DoubleSide }),
    eyes: new MeshStandardMaterial({ color: colors.eyes, roughness: 0.1, side: DoubleSide }),
  }), [colors]);

  // --- KEYBOARD CONTROLS ---
  useEffect(() => {
    if (isShowcase) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      
      const currentX = Math.round(playerPos.x);
      const currentZ = Math.round(playerPos.z);
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
  }, [camera, movePlayer, gameStatus, playerPos, isShowcase, isSpectator]);

  // --- POINTER LOCK ---
  useEffect(() => {
    if (isShowcase || isSpectator) {
         controlsRef.current?.unlock(); 
         return;
    }
    
    if (gameStatus === 'playing') {
      const timer = setTimeout(() => { controlsRef.current?.lock(); }, 100);
      return () => clearTimeout(timer);
    } else {
      controlsRef.current?.unlock();
    }
  }, [gameStatus, isShowcase, isSpectator]);

  // --- MOVEMENT CALC ---
  useEffect(() => {
    if (isShowcase) return;
    const dx = playerPos.x - currentPosRef.current.x;
    const dz = playerPos.z - currentPosRef.current.z;
    const hasMoved = Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01;
    isMoving.current = hasMoved;
    if (hasMoved) { targetRotation.current = Math.atan2(dx, dz) + Math.PI; }
  }, [playerPos, isShowcase]);

  // --- MAIN LOOP ---
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // მოდელის პოზიცია
    const targetVec = isShowcase 
        ? new Vector3(0, 0, 0)
        : new Vector3(playerPos.x, 0.85, playerPos.z);
    
    groupRef.current.position.lerp(targetVec, 9.0 * delta);
    currentPosRef.current.lerp(targetVec, 9.0 * delta);

    //  კამერის კონტროლი
    if (!isShowcase) {
        if (isSpectator) {
            const isMobile = viewport.aspect < 1;
            const camHeight = isMobile ? 18 : 14; 
            const camDist = isMobile ? 10 : 8;
            
            const camTargetPos = new Vector3(
                groupRef.current.position.x, 
                groupRef.current.position.y + camHeight, 
                groupRef.current.position.z + camDist
            );

            if (!isNaN(camera.position.x)) {
                camera.position.lerp(camTargetPos, 0.1); 
                camera.lookAt(groupRef.current.position); 
            }
        } else {
            // --- FIRST PERSON MODE  ---
            const fpsPos = new Vector3(groupRef.current.position.x, 0.6, groupRef.current.position.z);
            if (!isNaN(camera.position.x)) {
                camera.position.lerp(fpsPos, 0.8);
            }
        }
    }

    //  ანიმაციები
    if (!isSpectator && !isShowcase) return;

    const tRot = targetRotation.current;
    const cRot = groupRef.current.rotation.y;
    let diff = tRot - cRot;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    groupRef.current.rotation.y += diff * 12.0 * delta;

    const t = state.clock.getElapsedTime();
    const speed = 12; 
    const mouthAngle = (Math.sin(t * 12) + 1) * 0.25; 
    if (lowerJawRef.current) lowerJawRef.current.rotation.x = mouthAngle;

    if (isMoving.current || isShowcase) {
        const legSwing = Math.sin(t * speed) * 0.8;
        const armSwing = Math.cos(t * speed) * 0.6; 
        const bounce = Math.abs(Math.sin(t * speed)) * 0.12;

        if (leftLegPivot.current) leftLegPivot.current.rotation.x = legSwing;
        if (rightLegPivot.current) rightLegPivot.current.rotation.x = -legSwing;
        
        if (leftArmPivot.current) {
            leftArmPivot.current.rotation.x = armSwing;
            leftArmPivot.current.rotation.z = -0.8; 
        }
        if (rightArmPivot.current) {
            rightArmPivot.current.rotation.x = -armSwing;
            rightArmPivot.current.rotation.z = 0.8; 
        }
        if (mainBodyRef.current) mainBodyRef.current.position.y = 1.1 + bounce;
    } else {
        const breath = Math.sin(t * 2) * 0.03;
        if (mainBodyRef.current) mainBodyRef.current.position.y = 1.1 + breath;
        if (leftLegPivot.current) leftLegPivot.current.rotation.x = 0;
        if (rightLegPivot.current) rightLegPivot.current.rotation.x = 0;
        if (leftArmPivot.current) leftArmPivot.current.rotation.set(0, 0, -0.8);
        if (rightArmPivot.current) rightArmPivot.current.rotation.set(0, 0, 0.8);
    }
  });

  return (
    <>
      {!isShowcase && <PointerLockControls ref={controlsRef} />}
      <group position={[playerPos.x, 3, playerPos.z]}>
         <pointLight intensity={1.5} distance={15} decay={2} color="#ffaa00" />
      </group>

      <group ref={groupRef}>
        <group scale={[0.4, 0.4, 0.4]} visible={isSpectator || isShowcase}>
            
             <group ref={mainBodyRef} position={[0, 1.1, 0]}>
                <group ref={upperJawRef}>
                    <mesh material={materials.skin}><sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[1, 64]} /><meshStandardMaterial color={colors.skin} side={DoubleSide} /></mesh>
                    <mesh position={[0, 0.2, 0.95]} rotation={[-0.1, 0, 0]}><sphereGeometry args={[0.2, 32, 32]} /><meshStandardMaterial color={colors.skin} roughness={0.3} /></mesh>
                    <group position={[0, 0.5, 0.85]} rotation={[-0.1, 0, 0]}>
                        <group position={[-0.32, 0, 0]} rotation={[0, -0.3, 0]}>
                            <mesh rotation={[0, 0, 0.15]}><capsuleGeometry args={[0.12, 0.28, 4, 16]} /><meshStandardMaterial color="black" roughness={0.1} /></mesh>
                            <mesh position={[0.05, 0.1, 0.11]}><sphereGeometry args={[0.045, 16, 16]} /><meshBasicMaterial color="white" /></mesh>
                            <mesh position={[0, 0.3, -0.05]} rotation={[0, 0, -0.4]}><capsuleGeometry args={[0.04, 0.25, 4, 8]} /><meshStandardMaterial color="black" /></mesh>
                        </group>
                        <group position={[0.32, 0, 0]} rotation={[0, 0.3, 0]}>
                            <mesh rotation={[0, 0, -0.15]}><capsuleGeometry args={[0.12, 0.28, 4, 16]} /><meshStandardMaterial color="black" roughness={0.1} /></mesh>
                            <mesh position={[-0.05, 0.1, 0.11]}><sphereGeometry args={[0.045, 16, 16]} /><meshBasicMaterial color="white" /></mesh>
                            <mesh position={[0, 0.3, -0.05]} rotation={[0, 0, 0.4]}><capsuleGeometry args={[0.04, 0.25, 4, 8]} /><meshStandardMaterial color="black" /></mesh>
                        </group>
                    </group>
                </group>
                <group ref={lowerJawRef}>
                    <mesh material={materials.skin}><sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[1, 64]} /><meshStandardMaterial color={colors.skin} side={DoubleSide} /></mesh>
                </group>
            </group>
            <group ref={leftArmPivot} position={[-0.92, 1.15, 0]}> 
                <mesh position={[0, -0.35, 0]} material={materials.skin}><capsuleGeometry args={[0.24, 0.4, 16, 32]} /></mesh>
                <group position={[0, -0.8, 0]}>
                    <mesh position={[0, 0.15, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.2, 0.09, 16, 32]} /><meshStandardMaterial color={colors.gloves} side={DoubleSide} /></mesh>
                    <mesh position={[0, -0.1, 0]}><sphereGeometry args={[0.35, 32, 32]} /><meshStandardMaterial color={colors.gloves} /></mesh>
                    <mesh position={[0.2, 0, 0.15]} rotation={[0.5, 0, 0.5]}><capsuleGeometry args={[0.1, 0.25]} /><meshStandardMaterial color={colors.gloves} /></mesh>
                </group>
            </group>
            <group ref={rightArmPivot} position={[0.92, 1.15, 0]}>
                <mesh position={[0, -0.35, 0]} material={materials.skin}><capsuleGeometry args={[0.24, 0.4, 16, 32]} /></mesh>
                <group position={[0, -0.8, 0]}>
                    <mesh position={[0, 0.15, 0]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.2, 0.09, 16, 32]} /><meshStandardMaterial color={colors.gloves} side={DoubleSide} /></mesh>
                    <mesh position={[0, -0.1, 0]}><sphereGeometry args={[0.35, 32, 32]} /><meshStandardMaterial color={colors.gloves} /></mesh>
                    <mesh position={[-0.2, 0, 0.15]} rotation={[0.5, 0, -0.5]}><capsuleGeometry args={[0.1, 0.25]} /><meshStandardMaterial color={colors.gloves} /></mesh>
                </group>
            </group>
            <group ref={leftLegPivot} position={[-0.4, 0.5, 0]}>
                <mesh material={materials.skin}><sphereGeometry args={[0.22, 32, 32]} /></mesh>
                <group position={[0, -0.4, 0]}>
                    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.18, 0.15, 0.5]} /><meshStandardMaterial color={colors.skin} side={DoubleSide} /></mesh>
                    <group position={[0, -0.2, 0.1]}>
                        <mesh position={[0, 0.2, -0.05]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.24, 0.1, 16, 32]} /><meshStandardMaterial color={colors.boots} side={DoubleSide} /></mesh>
                        <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.52, 0.4, 0.65]} /><meshStandardMaterial color={colors.boots} /></mesh>
                        <mesh position={[0, -0.15, 0.38]}><sphereGeometry args={[0.3, 32, 32]} /><meshStandardMaterial color={colors.boots} /></mesh>
                    </group>
                </group>
            </group>
            <group ref={rightLegPivot} position={[0.4, 0.5, 0]}>
                <mesh material={materials.skin}><sphereGeometry args={[0.22, 32, 32]} /></mesh>
                <group position={[0, -0.4, 0]}>
                    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.18, 0.15, 0.5]} /><meshStandardMaterial color={colors.skin} side={DoubleSide} /></mesh>
                    <group position={[0, -0.2, 0.1]}>
                        <mesh position={[0, 0.2, -0.05]} rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.24, 0.1, 16, 32]} /><meshStandardMaterial color={colors.boots} side={DoubleSide} /></mesh>
                        <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.52, 0.4, 0.65]} /><meshStandardMaterial color={colors.boots} /></mesh>
                        <mesh position={[0, -0.15, 0.38]}><sphereGeometry args={[0.3, 32, 32]} /><meshStandardMaterial color={colors.boots} /></mesh>
                    </group>
                </group>
            </group>
        </group>
      </group>
    </>
  );
};