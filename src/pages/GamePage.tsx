import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Game/Board';
import { Board3D } from '../components/Game/3D/Board3D';
import { GameOverlay } from '../components/GameOverlay';
import { SwipeControls } from '../components/SwipeControls';
import { cn } from '../utils/cn';
import { usePlayerHeading } from '../hooks/usePlayerHeading'; 
import { useIsMobile } from '../hooks/useIsMobile'; 

export const GamePage = () => {
  const { settings, updateSetting } = useTheme();
  const { score, gameStatus, pauseGame } = useGame();
  const playerHeading = usePlayerHeading();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && settings.is3DMode && !settings.isSpectatorMode) {
      updateSetting('isSpectatorMode', true);
    }
  }, [isMobile, settings.is3DMode, settings.isSpectatorMode, updateSetting]);

  const toggleCameraMode = () => {
    updateSetting('isSpectatorMode', !settings.isSpectatorMode);
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black flex flex-col items-center justify-center">
      
      {/*  HEADER (მენიუ)  */}
      <div className="absolute top-4 left-0 right-0 z-50 flex justify-between items-center px-4 w-full pointer-events-none safe-area-inset-top landscape:hidden">
        
        <div className="flex gap-2 pointer-events-auto">
             <h2 className="text-xl font-bold text-primary drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur border border-primary/20">
              {settings.is3DMode ? "3D" : "2D"}
            </h2>

            {settings.is3DMode && !isMobile && (
                <button 
                    onClick={toggleCameraMode}
                    className="bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg hover:bg-blue-500 transition-colors backdrop-blur pointer-events-auto"
                >
                    {settings.isSpectatorMode ? "🎥 Spectator" : "👀 First Person"}
                </button>
            )}
        </div>
        
        <div className="flex items-center gap-3 pointer-events-auto">
           <div className="bg-primary/20 border border-primary/50 px-4 py-1 rounded-full backdrop-blur shadow-lg">
              <span className="text-primary font-bold text-lg tracking-wider">
                {score}
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

      {/*  LANDSCAPE ONLY SCORE  */}
      <div className="hidden landscape:flex absolute top-2 right-4 z-50 gap-4 pointer-events-none">
          <span className="text-primary font-bold text-md bg-black/60 px-3 py-1 rounded border border-primary/30">
            Score: {score}
          </span>
          {gameStatus === 'playing' && (
             <button onClick={pauseGame} className="pointer-events-auto bg-gray-800/80 text-white px-3 rounded border border-white/20">⏸</button>
          )}
      </div>

      {/* GAME AREA */}
      <div className={cn(
        "relative w-full h-full transition-all duration-300",
        !settings.is3DMode && "flex items-center justify-center",
        !settings.is3DMode && "landscape:scale-[0.55] sm:landscape:scale-75 md:landscape:scale-100" 
      )}>
        
        <GameOverlay /> 
        <SwipeControls />

        {settings.is3DMode ? (
          <div className="w-full h-full">
             <Board3D heading={playerHeading} />
          </div>
        ) : (
          <div className="relative w-fit mx-auto z-10 origin-center">
             <Board heading={playerHeading} />
          </div>
        )}
      </div>

    </div>
  );
};