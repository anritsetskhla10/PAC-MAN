import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext'; 
import { ClassicGhost } from './Game/3D/Ghosts/ClassicGhost';
import { ReaperGhost } from './Game/3D/Ghosts/ReaperGhost';

export const GhostShowcase = () => {
  const { settings, updateSetting } = useTheme(); 
  
  const variant = settings.ghostVariant;
  const ghostColor = settings.ghostColor; 
  const isDark = settings.isDarkMode; 

  const colors = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852', '#00FF00', '#FFFFFF'];
  const yPos = variant === 1 ? 0 : 0.6;

  return (
    <div className={`w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden transition-colors duration-300 
      ${isDark ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className={`w-full md:w-80 p-6 flex flex-col gap-6 z-10 shadow-xl overflow-y-auto border-r transition-colors duration-300
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-gray-200 border-gray-400'}`}
      >
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Ghost Lab 🧪</h1>
        
        <div>
            <h3 className={`text-sm uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              აირჩიე სტილი
            </h3>
            <div className="grid grid-cols-1 gap-2">
                <button
                    onClick={() => updateSetting('ghostVariant', 1)}
                    className={`p-4 rounded-lg text-left transition-all border flex items-center ${
                        variant === 1
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105' 
                        : isDark ? 'bg-neutral-700 border-transparent text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                    }`}
                >
                    <span className="text-xl mr-3">👻</span> Classic Scary
                </button>

                <button
                    onClick={() => updateSetting('ghostVariant', 2)}
                    className={`p-4 rounded-lg text-left transition-all border flex items-center ${
                        variant === 2
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-105' 
                        : isDark ? 'bg-neutral-700 border-transparent text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                    }`}
                >
                    <span className="text-xl mr-3">💀</span> Dark Reaper
                </button>
            </div>
        </div>

        <div>
            <h3 className={`text-sm uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              აირჩიე ფერი 
            </h3>
            <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                    <button
                        key={c}
                        onClick={() => updateSetting('ghostColor', c)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform ${
                            ghostColor === c 
                                ? `scale-125 shadow-lg ${isDark ? 'border-white' : 'border-gray-800'}` 
                                : 'border-transparent scale-100'
                        }`}
                        style={{ backgroundColor: c, boxShadow: ghostColor === c ? `0 0 15px ${c}` : 'none' }}
                    />
                ))}
            </div>
        </div>
      </div>

      <div className="flex-1 relative transition-colors duration-300 overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-300 ${
            isDark 
            ? 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800 via-black to-black' 
            : 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-white'
        }`} />
        
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
          <color attach="background" args={[isDark ? '#171717' : '#f0f0f0']} />
          <OrbitControls 
            enablePan={false}           
            minDistance={2}             
            maxDistance={8}             
            autoRotate                 
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2} 
          />
                    
          <ambientLight intensity={isDark ? 0.7 : 1} />
          <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color={isDark ? "blue" : "white"} />

          <group scale={[1.8, 1.8, 1.8]} position={[0, yPos, 0]}>
             {variant === 1 && <ClassicGhost color={ghostColor} />}
             {variant === 2 && <ReaperGhost color={ghostColor} />}
          </group>

          <gridHelper args={[20, 20, isDark ? '#444' : '#ccc', isDark ? '#222' : '#e5e5e5']} position={[0, -1, 0]} />
        </Canvas>
      </div>
    </div>
  );
};