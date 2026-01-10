import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ClassicGhost } from './Game/3D/Ghosts/ClassicGhost';
import { ReaperGhost } from './Game/3D/Ghosts/ReaperGhost';

export const GhostShowcase = () => {
  const [variant, setVariant] = useState(1); 
  const [ghostColor, setGhostColor] = useState('#FF0000'); 

  const colors = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852', '#00FF00', '#FFFFFF'];

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col md:flex-row text-white overflow-hidden fixed top-0 left-0 z-50">
      
      {/* მარცხენა პანელი */}
      <div className="w-full md:w-80 p-6 bg-neutral-800 flex flex-col gap-6 z-10 shadow-xl overflow-y-auto border-r border-neutral-700">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Ghost Lab</h1>
        
        <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">აირჩიე სტილი</h3>
            <div className="grid grid-cols-1 gap-2">
                <button
                    onClick={() => setVariant(1)}
                    className={`p-4 rounded-lg text-left transition-all border ${
                        variant === 1
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105' 
                        : 'bg-neutral-700 border-transparent hover:bg-neutral-600 text-gray-300'
                    }`}
                >
                     Classic Scary Ghost
                </button>

                <button
                    onClick={() => setVariant(2)}
                    className={`p-4 rounded-lg text-left transition-all border ${
                        variant === 2
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-105' 
                        : 'bg-neutral-700 border-transparent hover:bg-neutral-600 text-gray-300'
                    }`}
                >
                     Dark Reaper
                </button>
            </div>
        </div>

        <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">აირჩიე ფერი</h3>
            <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                    <button
                        key={c}
                        onClick={() => setGhostColor(c)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform ${
                            ghostColor === c ? 'scale-125 border-white shadow-glow' : 'border-transparent scale-100'
                        }`}
                        style={{ backgroundColor: c, boxShadow: ghostColor === c ? `0 0 10px ${c}` : 'none' }}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* მარჯვენა მხარე */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
        
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate autoRotateSpeed={1} />
          
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="blue" />

          <group scale={[1.8, 1.8, 1.8]}>
             {variant === 1 && <ClassicGhost color={ghostColor} />}
             {variant === 2 && <ReaperGhost color={ghostColor} />}
          </group>

          <gridHelper args={[20, 20, '#333', '#111']} position={[0, -1, 0]} />
        </Canvas>
      </div>
    </div>
  );
};