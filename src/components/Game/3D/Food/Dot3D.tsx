import { useTheme } from '../../../../context/ThemeContext';

export const Dot3D = () => {
  const { settings } = useTheme();
  const color = settings?.foodColor ?? '#fef08a';

  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <icosahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5} 
        roughness={0.3} 
      />
    </mesh>
  );
};