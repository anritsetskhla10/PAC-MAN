import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

const randomGrain = (x: number, y: number, z: number) => {
  return Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 53.53) * 43758.5453) % 1;
};

export const Mchadi = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.13, 128, 128);
    
    const positions = geo.attributes.position;
    const count = positions.count;
    const vertex = new THREE.Vector3();
    
    const colors = new Float32Array(count * 3);
    
    const tempColor = new THREE.Color();
    
    const doughColor = new THREE.Color("#FCEEB5"); 
    const goldenColor = new THREE.Color("#E3B04B"); 
    const burntColor = new THREE.Color("#A35622"); 

    for (let i = 0; i < count; i++) {
      vertex.fromBufferAttribute(positions, i);

      const warp = Math.sin(vertex.x * 3) * Math.sin(vertex.z * 3) * 0.02;

      const grain = randomGrain(vertex.x, vertex.y, vertex.z);
      const surfaceNoise = grain * 0.008; 

      vertex.addScaledVector(vertex.clone().normalize(), warp + surfaceNoise);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);

      tempColor.copy(doughColor);

      if (grain > 0.6) {
        tempColor.lerp(goldenColor, 0.6);
      }
      if (grain > 0.85) {
        tempColor.lerp(burntColor, 0.7);
      }

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    
    return geo;
  }, []);

  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.random() * Math.PI * 2;
    }
  }, []);

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry} 
      scale={[1.5, 0.55, 1.15]} 
    >
      <meshStandardMaterial
        vertexColors={true}
        roughness={1}
        metalness={0.0}
        emissive={"#8B4513"} 
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};