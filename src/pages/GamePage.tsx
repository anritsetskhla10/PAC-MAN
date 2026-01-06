import { useTheme } from '../context/ThemeContext';
import { Board } from '../components/Game/Board';    
import { Board3D } from '../components/Game/3D/Board3D'; 

export const GamePage = () => {
  const { settings } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] pt-20 pb-10 gap-6">
      <h2 className="text-2xl font-bold text-text-main">
        {settings.is3DMode ? "3D Arcade Mode" : "Classic 2D Mode"}
      </h2>
      
      {settings.is3DMode ? <Board3D /> : <Board />}
      
    </div>
  );
};