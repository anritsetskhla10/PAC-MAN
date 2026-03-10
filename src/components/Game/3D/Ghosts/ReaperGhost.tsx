import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Shape, MeshBasicMaterial, PointLight } from 'three';

interface GhostProps {
  color: string;
  isFlashing?: boolean;
}

export const ReaperGhost = ({ color, isFlashing = false }: GhostProps) => {
  const groupRef = useRef<Group>(null);
  const scytheRef = useRef<Group>(null);

  const [eyeMat] = useState(() => new MeshBasicMaterial({ toneMapped: false }));
  const lightRef1 = useRef<PointLight>(null);
  const lightRef2 = useRef<PointLight>(null);

  const { bladeShape, extrudeSettings } = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.03, 0.06);
    shape.lineTo(-0.03, -0.06);
    shape.quadraticCurveTo(0.5, -0.05, 1.1, -0.5);
    shape.quadraticCurveTo(0.5, 0.15, -0.03, 0.06);
    
    return {
      bladeShape: shape,
      extrudeSettings: {
        depth: 0.01,         
        bevelEnabled: true,  
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.002,
        bevelThickness: 0.002,
      }
    };
  }, []);

  useFrame((state) => {
    if(!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t) * 0.08;
    
    if (scytheRef.current) {
        scytheRef.current.rotation.z = -0.15 + Math.sin(t * 1.5) * 0.05;
        scytheRef.current.rotation.x = 0.1 + Math.sin(t * 1) * 0.05;
    }
    if (isFlashing) {
      const isWhite = Math.floor(t * 5) % 2 === 0;
      const flashCol = isWhite ? '#FFFFFF' : '#0000FF';
      eyeMat.color.set(flashCol);
      if (lightRef1.current) lightRef1.current.color.set(flashCol);
      if (lightRef2.current) lightRef2.current.color.set(flashCol);
    } else {
      eyeMat.color.set(color);
      if (lightRef1.current) lightRef1.current.color.set(color);
      if (lightRef2.current) lightRef2.current.color.set(color);
    }
  });

  return (
    <group ref={groupRef}>
      {/* --- მანტია და კაპიუშონი  */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.55, 1.3, 32, 1, true]} />
        <meshStandardMaterial color="#050505" side={2} roughness={1} /> 
      </mesh>
      
      <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]}>
        <dodecahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial color="#050505" roughness={1} side={2} />
      </mesh>

      <mesh position={[0, 0.45, 0.15]} scale={[0.8, 0.8, 0.8]}>
         <sphereGeometry args={[0.35]} />
         <meshBasicMaterial color="black" /> 
      </mesh>

      {/* --- თვალები */}
      <group position={[0, 0.5, 0.4]}>
         <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -0.1]} material={eyeMat}> 
             <capsuleGeometry args={[0.04, 0.12]} />
             <pointLight ref={lightRef1} distance={0.6} intensity={2} />
         </mesh>
         <mesh position={[0.12, 0, 0]} rotation={[0, 0, 0.1]} material={eyeMat}>
             <capsuleGeometry args={[0.04, 0.12]} />
             <pointLight ref={lightRef2} distance={0.6} intensity={2} />
         </mesh>
      </group>

      {/* ხელები და ცელი */}
      <mesh position={[0.35, 0.1, 0.2]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#050505" />
      </mesh>

      <group ref={scytheRef} position={[0.35, 0.1, 0.2]} rotation={[0, 0, -0.15]}>
         <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 2.2]} />
            <meshStandardMaterial color="#3b2415" roughness={0.9} />
         </mesh>
         <mesh position={[0.03, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.012, 0.15]} />
            <meshStandardMaterial color="#3b2415" roughness={0.9} />
         </mesh>
         <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.023, 0.023, 0.2]} />
            <meshStandardMaterial color="#2c1a10" roughness={1} />
         </mesh>
         <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.5} />
         </mesh>
         <group position={[0, 1.15, 0]}>
            <mesh position={[0, 0, -0.005]}>
                <extrudeGeometry args={[bladeShape, extrudeSettings]} />
                <meshStandardMaterial color="#616161" metalness={0.7} roughness={0.65} />
            </mesh>
         </group>
      </group>
    </group>
  );
};