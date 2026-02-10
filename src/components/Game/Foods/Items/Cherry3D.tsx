export const Cherry3D = () => {
  const cherryFleshMaterial = { color: "#be123c", roughness: 0.1, metalness: 0.4 }; 
  const stemMaterial = { color: "#a16207", roughness: 0.8 };

  return (
    <group position={[0, 0.1, 0]}>
      <group position={[-0.16, -0.2, 0]} rotation={[0, 0, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial {...cherryFleshMaterial} />
        </mesh>
      </group>
      <group position={[0.16, -0.2, 0]} rotation={[0, 0, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial {...cherryFleshMaterial} />
        </mesh>
      </group>
      <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.008, 0.008, 0.6]} />
        <meshStandardMaterial {...stemMaterial} />
      </mesh>
      <mesh position={[0.08, 0.08, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.008, 0.008, 0.6]} />
        <meshStandardMaterial {...stemMaterial} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.018]} />
        <meshStandardMaterial {...stemMaterial} />
      </mesh>
    </group>
  );
};