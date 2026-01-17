export const Eyes3D = () => {
  return (
    <group>
      {/* --- მარცხენა თვალი --- */}
      <mesh position={[-0.16, 0.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-0.16, 0.2, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#0000FF" />
      </mesh>

      {/* --- მარჯვენა თვალი --- */}
      <mesh position={[0.16, 0.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0.16, 0.2, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#0000FF" />
      </mesh>
    </group>
  );
};