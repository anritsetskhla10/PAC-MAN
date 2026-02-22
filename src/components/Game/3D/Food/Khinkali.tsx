import { useMemo } from 'react';
import * as THREE from 'three';

export const Khinkali = () => {
  const geometry = useMemo(() => {
    const pleatCount = 19; 
    const radialSegments = pleatCount * 16; 
    const heightSegments = 30; 
    
    const totalHeight = 0.55;
    const baseRadius = 0.15;   
    const bellyRadius = 0.28;  
    const neckRadius = 0.05;   
    const headRadius = 0.045;  
    const neckStart = 0.88; 

    const positions = [];
    const indices = [];

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      
      let currentRadius = 0;
      let heightPos = v * totalHeight;

      if (v < 0.2) {
        const t = v / 0.2;
        currentRadius = THREE.MathUtils.lerp(baseRadius, bellyRadius, Math.sin(t * Math.PI / 2));
        heightPos = (1 - Math.cos(t * Math.PI / 2)) * (totalHeight * 0.2);
      } else if (v < neckStart) {
        const t = (v - 0.2) / (neckStart - 0.2);
        currentRadius = THREE.MathUtils.lerp(bellyRadius, neckRadius, Math.pow(t, 1.2));
      } else {
        const t = (v - neckStart) / (1 - neckStart);
        currentRadius = THREE.MathUtils.lerp(neckRadius, headRadius, t);
      }

      let pleatDepth = 0;
      
      if (v > 0.05 && v < neckStart) {
        const strengthT = (v - 0.05) / (neckStart - 0.05); 
        pleatDepth = 0.04 * Math.sin(strengthT * Math.PI); 
      } else {
        pleatDepth = 0; 
      }

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const angle = u * Math.PI * 2;

        const foldShape = Math.abs(Math.sin(angle * pleatCount / 2));
        
        let offset = foldShape * pleatDepth;
        const deepCrease = 1 - foldShape;
        offset -= deepCrease * (pleatDepth * 2.0); 

        let finalR = currentRadius + offset;
        
        if (v > 0.98) {
            finalR *= (1 - (v - 0.98) / 0.02);
        }
        if (y === 0) finalR = 0;

        const posX = Math.cos(angle) * finalR;
        const posZ = Math.sin(angle) * finalR;
        const posY = heightPos;

        positions.push(posX, posY, posZ);
      }
    }

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = y * (radialSegments + 1) + x;
        const b = a + 1;
        const c = (y + 1) * (radialSegments + 1) + x;
        const d = c + 1;
        indices.push(a, d, b, a, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals(); 
    return geo;
  }, []);

  return (
    <group scale={1.0} position={[0, -0.27, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
            color="#E8E2D5" 
            roughness={0.7} 
            metalness={0.0}
            flatShading={false}
            side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
};