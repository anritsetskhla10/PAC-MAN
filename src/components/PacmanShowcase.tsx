import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';
import { Pacman2D } from './Game/Player/Pacman2D'; 
import { Pacman3D } from './Game/Player/Pacman3D'; 

export const PacmanShowcase = () => {
  const [is3DMode, setIs3DMode] = useState(true); 
  const { settings } = useTheme();
  const isDark = settings.isDarkMode;

  return (
    <div className={`w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden transition-colors duration-300 
      ${isDark ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      {/* --- Sidebar --- */}
      <div className={`w-full md:w-80 p-6 flex flex-col gap-6 z-10 shadow-xl overflow-y-auto border-r transition-colors duration-300
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'}`}
      >
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Pacman Lab 🟡</h1>
    
        <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg flex mb-4">
            <button 
                onClick={() => setIs3DMode(false)}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${!is3DMode ? 'bg-white dark:bg-gray-600 shadow-md text-primary' : 'text-gray-500'}`}
            >
                2D Mode
            </button>
            <button 
                onClick={() => setIs3DMode(true)}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${is3DMode ? 'bg-white dark:bg-gray-600 shadow-md text-primary' : 'text-gray-500'}`}
            >
                3D Mode
            </button>
        </div>
      </div>

      {/* --- Main Display Area --- */}
      <div className="flex-1 relative transition-colors duration-300 flex items-center justify-center">
         <div className={`absolute inset-0 transition-opacity duration-300 ${
            isDark 
            ? 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800 via-black to-black' 
            : 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-white'
        }`} />

        {is3DMode ? (
            <Canvas camera={{ position: [4, 4, 4], fov: 45 }}>
                <OrbitControls enablePan={false} autoRotate autoRotateSpeed={3} />
                <ambientLight intensity={1} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, -5]} intensity={0.5} />
            
                <group scale={[2.5, 2.5, 2.5]} position={[0, 0, 0]}>
                    <Pacman3D isShowcase={true} />
                </group>
                
                <gridHelper args={[10, 10, isDark ? '#444' : '#ccc', isDark ? '#222' : '#e5e5e5']} position={[0, -1.2, 0]} />
            </Canvas>
        ) : (
            <div className="z-10 transform scale-150 p-10 bg-black/10 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                 <Pacman2D size={200} />
            </div>
        )}
      </div>
    </div>
  );
};