import { useMemo } from 'react';
import * as THREE from 'three';

export const Khinkali = () => {
  const geometry = useMemo(() => {
    const pleatCount = 19; 
    const radialSegments = pleatCount * 12; 
    const heightSegments = 100; 
    
    const totalHeight = 0.45;
    const bellyRadius = 0.22;     
    const neckRadius = 0.035;      
    const headRadius = 0.03;     

    // ზონები
    const smoothBaseEnd = 0.15;   
    const bellyEnd = 0.45;        
    const neckStart = 0.88;       

    const positions = [];
    const indices = [];

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      
      // სიმაღლის კორექცია
      let heightPos = v * totalHeight;
      if (v < bellyEnd) {
         const t = v / bellyEnd;
         heightPos = (1 - Math.cos(t * Math.PI / 2)) * (totalHeight * 0.35);
      }

      let currentRadius = 0;
      let pleatStrength = 0;

      // ფორმის პროფილის გამოთვლა
      if (v < bellyEnd) {
        const t = v / bellyEnd;
        currentRadius = Math.sin(t * Math.PI / 2) * bellyRadius;
      } 
      else if (v < neckStart) {
        const t = (v - bellyEnd) / (neckStart - bellyEnd);
        currentRadius = THREE.MathUtils.lerp(bellyRadius, neckRadius, Math.pow(t, 0.9));
      } 
      else if (v < 0.98) { 
        const t = (v - neckStart) / (0.98 - neckStart);
        currentRadius = THREE.MathUtils.lerp(neckRadius, headRadius, t);
      }
      else {
        const t = (v - 0.98) / 0.02;
        currentRadius = headRadius * (1 - t); 
      }

      //  ნაკეცების სიღრმე
      if (v < smoothBaseEnd) {
          pleatStrength = 0;
      }
      else if (v < bellyEnd) {
          const t = (v - smoothBaseEnd) / (bellyEnd - smoothBaseEnd);
          pleatStrength = t * 0.04; 
      }
      else if (v < neckStart) {
          const t = (v - bellyEnd) / (neckStart - bellyEnd);
          pleatStrength = 0.04 * (1 - t * 0.9); 
      }
      else {
          pleatStrength = 0;
      }

      //  წრეზე ტრიალი 
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const angle = u * Math.PI * 2;

        const foldShape = Math.abs(Math.sin(angle * pleatCount / 2));
        
        let offset = foldShape * pleatStrength;

        if (v > bellyEnd) {
             offset *= 1.2;
        }

        let finalR = currentRadius + offset;
        
        if (v < 0.05 || v > 0.99) finalR = currentRadius;

        const posX = Math.cos(angle) * finalR;
        const posZ = Math.sin(angle) * finalR;
        const posY = heightPos;

        positions.push(posX, posY, posZ);
      }
    }

    // ინდექსები 
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
    <group scale={1.0}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
            color="#FDF5E6"
            roughness={0.6}
            metalness={0.1}
            flatShading={false}
            side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
};