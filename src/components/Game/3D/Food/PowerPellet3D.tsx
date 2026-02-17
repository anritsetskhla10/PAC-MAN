import { useTheme } from '../../../../context/ThemeContext';

export const PowerPellet3D = () => {
  const { settings } = useTheme();
  const color = settings?.foodColor ?? '#fef08a';

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>
      <pointLight distance={1} intensity={2} color={color} />
    </group>
  );
};