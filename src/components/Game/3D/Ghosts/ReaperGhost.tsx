import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Shape } from 'three';

interface GhostProps {
  color: string;
}

export const ReaperGhost = ({ color }: GhostProps) => {
  const groupRef = useRef<Group>(null);
  const scytheRef = useRef<Group>(null);
  
  // დანის ახალი, სწორი გეომეტრია (აღარ სჭირდება ამოტრიალება)
  const { bladeShape, extrudeSettings } = useMemo(() => {
    const shape = new Shape();
    // დანის ქუსლი (ზუსტად ერგება ხის ტარს)
    shape.moveTo(-0.03, 0.06);
    shape.lineTo(-0.03, -0.06);
    // შიდა, ბასრი მხარე (მიდის წვერისკენ და ქვემოთ)
    shape.quadraticCurveTo(0.5, -0.05, 1.1, -0.5);
    // გარე, ყუა (ბრუნდება უკან ტარისკენ)
    shape.quadraticCurveTo(0.5, 0.15, -0.03, 0.06);
    
    return {
      bladeShape: shape,
      extrudeSettings: {
        depth: 0.01,         // დანის სისქე (ძალიან თხელი და ბასრი)
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
        // ცელის მსუბუქი რხევა მოჩვენების ხელში
        scytheRef.current.rotation.z = -0.15 + Math.sin(t * 1.5) * 0.05;
        scytheRef.current.rotation.x = 0.1 + Math.sin(t * 1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* --- მანტია --- */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.55, 1.3, 32, 1, true]} />
        <meshStandardMaterial color="#050505" side={2} roughness={1} /> 
      </mesh>
      
      {/* --- კაპიუშონი --- */}
      <mesh position={[0, 0.4, 0]} rotation={[0.2, 0, 0]}>
        <dodecahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial color="#050505" roughness={1} side={2} />
      </mesh>

      {/* --- სიბნელე კაპიუშონში --- */}
      <mesh position={[0, 0.45, 0.15]} scale={[0.8, 0.8, 0.8]}>
         <sphereGeometry args={[0.35]} />
         <meshBasicMaterial color="black" /> 
      </mesh>

      {/* --- თვალები --- */}
      <group position={[0, 0.5, 0.4]}>
         <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -0.1]}> 
             <capsuleGeometry args={[0.04, 0.12]} />
             <meshBasicMaterial color={color} toneMapped={false} />
             <pointLight distance={0.6} intensity={2} color={color} />
         </mesh>
         <mesh position={[0.12, 0, 0]} rotation={[0, 0, 0.1]}>
             <capsuleGeometry args={[0.04, 0.12]} />
             <meshBasicMaterial color={color} toneMapped={false} />
             <pointLight distance={0.6} intensity={2} color={color} />
         </mesh>
      </group>

      {/* --- ხელები --- */}
      <mesh position={[0.35, 0.1, 0.2]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#050505" />
      </mesh>

      {/* --- ცელი (სრულყოფილად აწყობილი) --- */}
      <group ref={scytheRef} position={[0.35, 0.1, 0.2]} rotation={[0, 0, -0.15]}>
         
         {/* 1. მთავარი ხის ტარი */}
         <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 2.2]} />
            <meshStandardMaterial color="#3b2415" roughness={0.9} />
         </mesh>

         {/* 2. პატარა ხის სახელური შუაში (Snath Peg) */}
         <mesh position={[0.03, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.012, 0.15]} />
            <meshStandardMaterial color="#3b2415" roughness={0.9} />
         </mesh>
         
         {/* 3. ტყავის შემოხვევა დანის ყელთან */}
         <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.023, 0.023, 0.2]} />
            <meshStandardMaterial color="#2c1a10" roughness={1} />
         </mesh>
         
         {/* 4. მეტალის დამჭერი რგოლი სულ თავში */}
         <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.5} />
         </mesh>

         {/* 5. ჟანგიანი დანა (ზუსტად ტყავის და რგოლის გასწვრივ გამოდის) */}
         <group position={[0, 1.15, 0]}>
            {/* -0.005 Z ღერძზე აცენტრებს დანას ტარის მიმართ */}
            <mesh position={[0, 0, -0.005]}>
                <extrudeGeometry args={[bladeShape, extrudeSettings]} />
                <meshStandardMaterial color="#616161" metalness={0.7} roughness={0.65} />
            </mesh>
         </group>

      </group>
    </group>
  );
};