import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Shape, ExtrudeGeometry, MathUtils, PositionalAudio as ThreePositionalAudio } from 'three'; 
import { MeshDistortMaterial, PositionalAudio } from '@react-three/drei';
import { useTheme } from '../../../context/ThemeContext';

type ConsumableVariant = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';

interface Food3DProps {
  consumableVariant: ConsumableVariant;
}

const PRECALCULATED_STRAWBERRY_SEEDS = (() => {
    const seedPositions: [number, number, number][] = [];
    const totalSeeds = 60;
    const strawberryRadius = 0.235;
    for (let i = 0; i < totalSeeds; i++) {
        const phi = Math.acos(-1 + (2 * i) / totalSeeds);
        const theta = Math.sqrt(totalSeeds * Math.PI) * phi;
        const verticalAdjust = phi > 1.5 ? 0.9 : 1; 
        const x = strawberryRadius * Math.sin(phi) * Math.cos(theta) * verticalAdjust;
        const y = (strawberryRadius * Math.sin(phi) * Math.sin(theta) * verticalAdjust) - 0.05;
        const z = strawberryRadius * Math.cos(phi);
        seedPositions.push([x, y, z]);
    }
    return seedPositions;
})();

export const Food3D = ({ consumableVariant }: Food3DProps) => {
  const meshGroupRef = useRef<Group>(null);
  const audioRef = useRef<ThreePositionalAudio>(null!); 
  const { settings } = useTheme();
  
  const themeDerivedPelletColor = settings?.foodColor ?? '#fef08a';
  
  // Audio Logic
  const masterMuted = settings.audio.masterMuted;
  const sfxVolume = settings.audio.sfxVolume;
  const isSfxEnabled = !masterMuted && sfxVolume > 0;
  const isBonus = ['cherry', 'strawberry', 'life'].includes(consumableVariant);

  useEffect(() => {
    if (audioRef.current) {
        const targetVol = isSfxEnabled ? sfxVolume * 0.8 : 0;
        audioRef.current.setVolume(targetVol);
    }
  }, [sfxVolume, isSfxEnabled]);

  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();
    meshGroupRef.current.rotation.y += 0.015;
    meshGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.05;
    if (consumableVariant === 'power' || consumableVariant === 'life') {
        const pulseScale = 1 + Math.sin(elapsedTime * 8) * 0.15;
        meshGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
  });

  const heartGeometry = useMemo(() => {
      const x = 0, y = 0;
      const heartShape = new Shape();
      heartShape.moveTo( x + 0.25, y + 0.25 );
      heartShape.bezierCurveTo( x + 0.25, y + 0.25, x + 0.20, y, x, y );
      heartShape.bezierCurveTo( x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35 );
      heartShape.bezierCurveTo( x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95 );
      heartShape.bezierCurveTo( x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35 );
      heartShape.bezierCurveTo( x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y );
      heartShape.bezierCurveTo( x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25 );
      const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
      return new ExtrudeGeometry( heartShape, extrudeSettings );
  }, []);

  const renderMesh = () => {
      if (consumableVariant === 'dot') {
        return <mesh rotation={[0.5, 0.5, 0]}><icosahedronGeometry args={[0.15, 0]} /><meshStandardMaterial color={themeDerivedPelletColor} emissive={themeDerivedPelletColor} emissiveIntensity={0.5} roughness={0.3} /></mesh>;
      }
      if (consumableVariant === 'power') {
        return <><mesh><sphereGeometry args={[0.2, 32, 32]} /><meshStandardMaterial color={themeDerivedPelletColor} emissive={themeDerivedPelletColor} emissiveIntensity={2} toneMapped={false} /></mesh><pointLight distance={1} intensity={2} color={themeDerivedPelletColor} /></>;
      }
      if (consumableVariant === 'cherry') {
        const cherryFleshMaterial = { color: "#be123c", roughness: 0.1, metalness: 0.4 }; 
        const stemMaterial = { color: "#a16207", roughness: 0.8 };
        return <group position={[0, 0.1, 0]}><group position={[-0.16, -0.2, 0]} rotation={[0, 0, 0.2]}><mesh><sphereGeometry args={[0.15, 32, 32]} /><meshStandardMaterial {...cherryFleshMaterial} /></mesh></group><group position={[0.16, -0.2, 0]} rotation={[0, 0, -0.2]}><mesh><sphereGeometry args={[0.15, 32, 32]} /><meshStandardMaterial {...cherryFleshMaterial} /></mesh></group><mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.008, 0.008, 0.6]} /><meshStandardMaterial {...stemMaterial} /></mesh><mesh position={[0.08, 0.08, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.008, 0.008, 0.6]} /><meshStandardMaterial {...stemMaterial} /></mesh><mesh position={[0, 0.36, 0]}><sphereGeometry args={[0.018]} /><meshStandardMaterial {...stemMaterial} /></mesh></group>;
      }
      if (consumableVariant === 'strawberry') {
        const strawberryRed = "#d32f2f"; const seedYellow = "#ffdb70"; const leafGreen = "#2e7d32";
        return <group scale={[0.9, 0.9, 0.9]}><mesh position={[0, 0, 0]} scale={[0.95, 1.15, 0.95]}><sphereGeometry args={[0.25, 64, 64]} /><MeshDistortMaterial color={strawberryRed} roughness={0.4} metalness={0.1} distort={0.25} speed={0} /></mesh><group position={[0, 0.22, 0]}><mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.03, 0.04, 0.1]} /><meshStandardMaterial color={leafGreen} roughness={0.8} /></mesh>{[0, 72, 144, 216, 288].map((degreeAngle, index) => (<group key={index} rotation={[0.4, MathUtils.degToRad(degreeAngle), 0]}><mesh position={[0, 0.02, 0.08]} scale={[1, 0.1, 1.5]} rotation={[-0.2, 0, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color={leafGreen} roughness={0.7} side={2} /></mesh></group>))}</group>{PRECALCULATED_STRAWBERRY_SEEDS.map((position, index) => (<mesh key={`seed-${index}`} position={position}><sphereGeometry args={[0.012, 8, 8]} /><meshStandardMaterial color={seedYellow} roughness={0.5} /></mesh>))}</group>;
      }
      if (consumableVariant === 'life') {
        return <group scale={[0.2, 0.4, 0.4]} rotation={[Math.PI, 0, 0]} position={[0, 0.2, 0]}><mesh geometry={heartGeometry} position={[-0.25, -0.25, 0]}><meshStandardMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.5} roughness={0.2} metalness={0.3} /></mesh></group>;
      }
      return null;
  }

  const soundFile = consumableVariant === 'life' 
      ? '/sounds/extra_life.wav' 
      : '/sounds/eat_fruit.wav';

  return (
    <group ref={meshGroupRef}>
        {renderMesh()}
        {isBonus && (
           <PositionalAudio
             ref={audioRef}
             url={soundFile} 
             distance={3}
             loop={false}
             autoplay
           />
        )}
    </group>
  );
};