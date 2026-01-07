import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Game/Board';
import { Board3D } from '../components/Game/3D/Board3D';

export const GamePage = () => {
  const { settings } = useTheme();
  const { score, isGameOver, restartGame } = useGame(); 

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] pt-20 pb-10 gap-6">
      
      {/* --- GAME OVER OVERLAY --- */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <h1 className="text-6xl font-bold text-red-600 mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
            GAME OVER
          </h1>
          <p className="text-white text-xl mb-8">Final Score: {score}</p>
          <button 
            onClick={restartGame}
            className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/80 transition-all transform hover:scale-105 shadow-[0_0_20px_var(--primary)]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* სათაური და ქულა */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl px-4 gap-4">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          {settings.is3DMode ? "3D  Mode" : "Classic Mode"}
        </h2>
        
        <div className="bg-primary/10 border border-primary/50 px-6 py-2 rounded-full backdrop-blur-sm">
            <span className="text-primary font-bold text-xl tracking-wider">
              SCORE: {score}
            </span>
        </div>
      </div>

      {settings.is3DMode ? (
        <Board3D />
      ) : (
        <div className="p-8 bg-card-bg/50 backdrop-blur rounded-2xl border border-white/10 shadow-2xl">
           <Board />
        </div>
      )}
      
      <p className="text-sm text-text-muted mt-4">
        {settings.is3DMode 
          ? "Use WASD or Arrows to move. Mouse click to lock/look." 
          : "Use Arrow keys to move."}
      </p>

    </div>
  );
};