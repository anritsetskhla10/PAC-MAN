import { useMemo } from 'react';
import { Shape, ExtrudeGeometry } from 'three';

export const Life3D = () => {
  const heartGeometry = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new Shape();
    heartShape.moveTo( x + 0.25, y + 0.25 );
    heartShape.bezierCurveTo( x + 0.25, y + 0.25, x + 0.20, y, x, y );
    heartShape.bezierCurveTo( x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35 );
    heartShape.bezierCurveTo( x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95 );
    heartShape.bezierCurveTo( x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35 );
    heartShape.bezierCurveTo( x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y );
    heartShape.bezierCurveTo( x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25 );
    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    return new ExtrudeGeometry( heartShape, extrudeSettings );
  }, []);

  return (
    <group scale={[0.2, 0.4, 0.4]} rotation={[Math.PI, 0, 0]} position={[0, 0.2, 0]}>
      <mesh geometry={heartGeometry} position={[-0.25, -0.25, 0]}>
        <meshStandardMaterial 
          color="#ec4899" 
          emissive="#be185d" 
          emissiveIntensity={0.5} 
          roughness={0.2} 
          metalness={0.3} 
        />
      </mesh>
    </group>
  );
};