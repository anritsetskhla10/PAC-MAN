import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MeshStandardMaterial, DoubleSide } from 'three';

interface ClassicPacmanModelProps {
  isMovingRef: React.MutableRefObject<boolean>;
  isShowcase?: boolean;
}

export const ClassicPacmanModel3D = ({ isMovingRef, isShowcase = false }: ClassicPacmanModelProps) => {
  const mainBodyRef = useRef<Group>(null);    
  const upperJawRef = useRef<Group>(null);
  const lowerJawRef = useRef<Group>(null);
  const leftArmPivot = useRef<Group>(null);
  const rightArmPivot = useRef<Group>(null);
  const leftLegPivot = useRef<Group>(null);
  const rightLegPivot = useRef<Group>(null);

  const colors = useMemo(() => ({
    skin: "#FFD600", boots: "#D50000", gloves: "#FF8F00", eyes: "#000000",
  }), []);

  const materials = useMemo(() => ({
    skin: new MeshStandardMaterial({ color: colors.skin, roughness: 0.2, metalness: 0.1, side: DoubleSide }),
    boots: new MeshStandardMaterial({ color: colors.boots, roughness: 0.4, side: DoubleSide }),
    gloves: new MeshStandardMaterial({ color: colors.gloves, roughness: 0.5, side: DoubleSide }),
    eyes: new MeshStandardMaterial({ color: colors.eyes, roughness: 0.1, side: DoubleSide }),
  }), [colors]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 12; 
    
    // პირის ანიმაცია
    const mouthAngle = (Math.sin(t * 12) + 1) * 0.25; 
    if (lowerJawRef.current) lowerJawRef.current.rotation.x = mouthAngle;

    const isMoving = isMovingRef.current;

    // სხეულის და კიდურების ანიმაცია
    if (isMoving || isShowcase) {
        const legSwing = Math.sin(t * speed) * 0.8;
        const armSwing = Math.cos(t * speed) * 0.6; 
        const bounce = Math.abs(Math.sin(t * speed)) * 0.12;

        if (leftLegPivot.current) leftLegPivot.current.rotation.x = legSwing;
        if (rightLegPivot.current) rightLegPivot.current.rotation.x = -legSwing;
        if (leftArmPivot.current) { leftArmPivot.current.rotation.x = armSwing; leftArmPivot.current.rotation.z = -0.8; }
        if (rightArmPivot.current) { rightArmPivot.current.rotation.x = -armSwing; rightArmPivot.current.rotation.z = 0.8; }
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
    <group scale={[0.4, 0.4, 0.4]}>
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
  );
};