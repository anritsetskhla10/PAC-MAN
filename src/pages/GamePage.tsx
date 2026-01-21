import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Game/Board';
import { Board3D } from '../components/Game/3D/Board3D';
import { GameOverlay } from '../components/GameOverlay';
import { cn } from '../utils/cn';

export const GamePage = () => {
  const { settings } = useTheme();
  const { score, gameStatus, pauseGame } = useGame();

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black flex flex-col items-center justify-center">
      
      <div className="absolute top-4 left-0 right-0 z-50 flex justify-between items-center px-4 w-full pointer-events-none">
        
        <h2 className="text-xl font-bold text-primary drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur pointer-events-auto">
          {settings.is3DMode ? "🎮 3D" : "🕹️ 2D"}
        </h2>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-primary/20 border border-primary/50 px-4 py-1 rounded-full backdrop-blur shadow-lg">
              <span className="text-primary font-bold text-lg tracking-wider">
                SCORE: {score}
              </span>
          </div>

          {gameStatus === 'playing' && (
            <button 
              onClick={() => {
                pauseGame();
                if (settings.is3DMode && document.pointerLockElement) {
                  document.exitPointerLock();
                }
              }}
              className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 border border-white/20 transition-all shadow-md active:scale-95"
            >
              ⏸
            </button>
          )}
        </div>
      </div>

      <div className={cn(
        "relative w-full h-full transition-all duration-300",
        !settings.is3DMode && "flex items-center justify-center p-4" 
      )}>
        
        <GameOverlay /> 

        {settings.is3DMode ? (
          <div className="w-full h-full">
             <Board3D />
          </div>
        ) : (
          <div className="relative max-w-200 max-h-200 aspect-square w-full shadow-2xl border-4 border-primary/30 rounded-xl overflow-hidden bg-black/40 backdrop-blur">
             <Board />
          </div>
        )}
      </div>

    </div>
  );
};