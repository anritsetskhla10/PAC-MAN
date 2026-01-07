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
    <div className="relative flex flex-col items-center min-h-screen pt-24 pb-10 gap-6 bg-bg-main transition-colors duration-300">
      
      {/* HEADER: Score & Pause Button */}
      <div className={cn(
        "flex justify-between items-center w-full px-4 gap-4 z-40 transition-all duration-300",
        settings.is3DMode ? "max-w-[95%]" : "max-w-4xl"
      )}>
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2 drop-shadow-md">
          {settings.is3DMode ? "🎮 3D Mode" : "🕹️ 2D Mode"}
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 border border-primary/50 px-6 py-2 rounded-full backdrop-blur-md shadow-lg">
              <span className="text-primary font-bold text-xl tracking-wider">
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
              className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 border border-white/20 transition-all shadow-md"
              title="Pause (Esc)"
            >
              ⏸
            </button>
          )}
        </div>
      </div>

      {/* GAME AREA CONTAINER */}
      <div className={cn(
        "relative transition-all duration-500 ease-in-out border-4 border-primary/30 rounded-xl overflow-hidden shadow-2xl",
        settings.is3DMode 
          ? "w-[95%] h-[calc(100vh-180px)]" 
          : "w-auto h-auto max-w-4xl"
      )}>
        
        <GameOverlay /> 

        {settings.is3DMode ? (
          <Board3D />
        ) : (
          <div className="p-1 bg-black/40 backdrop-blur">
             <Board />
          </div>
        )}
      </div>

      <p className="text-sm text-text-muted font-mono opacity-70">
        {gameStatus === 'idle' ? "PRESS START TO PLAY" : "PRESS [ESC] TO PAUSE"}
      </p>

    </div>
  );
};