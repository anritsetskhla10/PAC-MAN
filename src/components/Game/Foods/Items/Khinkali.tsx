import { useMemo } from 'react';
import * as THREE from 'three';

export const Khinkali = () => {
  const geometry = useMemo(() => {
    const pleatCount = 19; 
    const radialSegments = pleatCount * 12; 
    const heightSegments = 100; 
    
    const totalHeight = 0.55;     
    const bellyRadius = 0.28;     
    const neckRadius = 0.04;      
    const headRadius = 0.035;     

    const smoothBaseEnd = 0.12;   
    const bellyEnd = 0.35;       
    const bodyEnd = 0.88;        

    const positions = [];
    const indices = [];

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;

      let heightPos = v * totalHeight;
      if (v < bellyEnd) {
         const t = v / bellyEnd;
         heightPos = (1 - Math.cos(t * Math.PI / 2)) * (totalHeight * 0.3);
      }

      let currentRadius = 0;
      let pleatDepth = 0;
      if (v < bellyEnd) {
        const t = v / bellyEnd;
        currentRadius = Math.sin(t * Math.PI / 2) * bellyRadius;
      } 
      else if (v < bodyEnd) {
        const t = (v - bellyEnd) / (bodyEnd - bellyEnd);
        currentRadius = THREE.MathUtils.lerp(bellyRadius, neckRadius, Math.pow(t, 0.9));
      } 
      else if (v < 0.98) { 

        const t = (v - bodyEnd) / (0.98 - bodyEnd);
        currentRadius = THREE.MathUtils.lerp(neckRadius, headRadius, t);
      }
      else {
        const t = (v - 0.98) / 0.02;
        currentRadius = headRadius * (1 - t); 
      }
      
      if (v < smoothBaseEnd) {
          pleatDepth = 0;
      }
      else if (v < bellyEnd) {
          const t = (v - smoothBaseEnd) / (bellyEnd - smoothBaseEnd);
          pleatDepth = Math.pow(t, 2) * 0.07;
      }
      else if (v < bodyEnd) {
          const t = (v - bellyEnd) / (bodyEnd - bellyEnd);
          pleatDepth = 0.08 * Math.sin((1 - t) * Math.PI / 2);
      }
      else {
          pleatDepth = 0;
      }

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const angle = u * Math.PI * 2;

        let offset = Math.cos(angle * pleatCount) * pleatDepth;

        if (offset < 0) offset *= 1.6; 

        const finalR = currentRadius + offset;
        
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

        indices.push(a, d, b);
        indices.push(a, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals(); 

    return geo;
  }, []);

  return (
    <group scale={1.2}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
            color="#FDF5E6"
            roughness={0.5} 
            metalness={0.1}
            flatShading={false}
            side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
};