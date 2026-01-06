import { useTheme } from '../context/ThemeContext';
import { Board } from '../components/Game/Board';
import { Board3D } from '../components/Game/3D/Board3D';

export const GamePage = () => {
  const { settings } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] pt-20 pb-10 gap-6">
      
      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
        {settings.is3DMode ? (
          <>3D  Mode</>
        ) : (
          <>Classic  Mode</>
        )}
      </h2>

      {settings.is3DMode ? (
        <Board3D />
      ) : (
        <div className="p-8 bg-card-bg/50 backdrop-blur rounded-2xl border border-white/10 shadow-2xl">
           <Board />
        </div>
      )}
      
      <p className="text-sm text-text-muted mt-4">
        {settings.is3DMode 
          ? "Use WASD or Arrows to move. Mouse to look around." 
          : "Use Arrow keys to move."}
      </p>

    </div>
  );
};