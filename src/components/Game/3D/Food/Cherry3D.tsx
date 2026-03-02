import * as THREE from 'three';

const cherryGeo = new THREE.SphereGeometry(0.15, 32, 32);
const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.6);
const topGeo = new THREE.SphereGeometry(0.018);

const cherryFleshMaterial = new THREE.MeshStandardMaterial({ color: "#be123c", roughness: 0.1, metalness: 0.4 }); 
const stemMaterial = new THREE.MeshStandardMaterial({ color: "#a16207", roughness: 0.8 });

export const Cherry3D = () => {
  return (
    <group position={[0, 0.1, 0]}>
      <group position={[-0.16, -0.2, 0]} rotation={[0, 0, 0.2]}>
        <mesh geometry={cherryGeo} material={cherryFleshMaterial} />
      </group>
      <group position={[0.16, -0.2, 0]} rotation={[0, 0, -0.2]}>
        <mesh geometry={cherryGeo} material={cherryFleshMaterial} />
      </group>
      <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]} geometry={stemGeo} material={stemMaterial} />
      <mesh position={[0.08, 0.08, 0]} rotation={[0, 0, 0.3]} geometry={stemGeo} material={stemMaterial} />
      <mesh position={[0, 0.36, 0]} geometry={topGeo} material={stemMaterial} />
    </group>
  );
};