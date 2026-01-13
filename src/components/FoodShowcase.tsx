import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';
import { Food2D } from './Game/Foods/Food2D'; 
import { Food3D } from './Game/Foods/Food3D'; 

export const FoodShowcase = () => {
  const [foodType, setFoodType] = useState<'dot' | 'power' | 'cherry' | 'strawberry'>('cherry');
  const [is3DMode, setIs3DMode] = useState(true); 
  const { settings } = useTheme();
  const isDark = settings.isDarkMode;

  return (
    <div className={`w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden transition-colors duration-300 
      ${isDark ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      {/* Sidebar */}
      <div className={`w-full md:w-80 p-6 flex flex-col gap-6 z-10 shadow-xl overflow-y-auto border-r transition-colors duration-300
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'}`}
      >
        <h1 className="text-2xl font-bold text-red-500 mb-2">Food Lab 🍒</h1>

        {/* --- MODE TOGGLE --- */}
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

        <div>
            <h3 className={`text-sm uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              აირჩიე ობიექტი
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {(['dot', 'power', 'cherry', 'strawberry'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFoodType(type)}
                        className={`p-3 rounded-lg text-left border flex items-center transition-all capitalize ${
                            foodType === type 
                            ? 'bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:text-red-200 dark:border-red-700' 
                            : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="flex-1 relative transition-colors duration-300 flex items-center justify-center">
         <div className={`absolute inset-0 transition-opacity duration-300 ${
            isDark 
            ? 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800 via-black to-black' 
            : 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-white'
        }`} />

        {/* --- 3D VIEW --- */}
        {is3DMode ? (
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <OrbitControls enablePan={false} autoRotate autoRotateSpeed={2} />
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <group scale={[3, 3, 3]}>
                    <Food3D type={foodType} />
                </group>
                <gridHelper args={[10, 10, isDark ? '#444' : '#ccc', isDark ? '#222' : '#e5e5e5']} position={[0, -1, 0]} />
            </Canvas>
        ) : (
            // --- 2D VIEW ---
            <div className="z-10 transform scale-150 p-10 bg-black/10 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                 <Food2D type={foodType} size={200} />
            </div>
        )}
      </div>
    </div>
  );
};