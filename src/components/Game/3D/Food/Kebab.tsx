import * as THREE from 'three';
import { useRef, useLayoutEffect } from 'react';

const lavashGeo = (() => {
  const geo = new THREE.CylinderGeometry(0.13, 0.13, 0.75, 16, 8, true);
  const positions = geo.attributes.position;
  const v = new THREE.Vector3();
  const colors = new Float32Array(positions.count * 3);
  const tempColor = new THREE.Color();
  const doughColor = new THREE.Color("#FFF8DC"); 
  const burnColor = new THREE.Color("#8B4513"); 

  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    const crumple = Math.sin(v.y * 30 + v.x * 20) * 0.004; 
    v.addScaledVector(v.clone().normalize(), crumple);
    positions.setXYZ(i, v.x, v.y, v.z);

    let noise = Math.sin(v.x * 15 + v.z * 15) * Math.sin(v.y * 25);
    noise += Math.sin(i * 0.9) * 0.3; 
    const burnFactor = Math.max(0, (noise - 0.4) * 3);
    tempColor.copy(doughColor).lerp(burnColor, Math.min(1, burnFactor));

    colors[i * 3] = tempColor.r;
    colors[i * 3 + 1] = tempColor.g;
    colors[i * 3 + 2] = tempColor.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
})();

const meatGeo = new THREE.CapsuleGeometry(0.11, 0.92, 4, 8);
const meatMat = new THREE.MeshPhysicalMaterial({
  color: "#771313", roughness: 0.65, metalness: 0.0, reflectivity: 0.5    
});
const lavashMat = new THREE.MeshStandardMaterial({
  vertexColors: true, side: THREE.DoubleSide, roughness: 1, metalness: 0
});

export const Kebab = () => {
  const groupRef = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(
        Math.PI / 8,                
        Math.random() * Math.PI * 2, 
        Math.PI / 6                 
      );
    }
  }, []);

  return (
    <group ref={groupRef}>
      <mesh geometry={meatGeo} material={meatMat} />
      <mesh geometry={lavashGeo} material={lavashMat} />
    </group>
  );
};