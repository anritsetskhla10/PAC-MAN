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

  const handlePause = () => {
    pauseGame();
    if (settings.is3DMode && document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  return (
    <div className="h-dvh w-full bg-black overflow-hidden flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      
      <header className="flex-none z-50 w-full px-4 py-2 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 shrink-0">
      
        <div className="flex gap-3 items-center">
             <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-primary/20">
                <span className="text-lg md:text-xl">
                    {settings.is3DMode ? "🎮" : "🕹️"}
                </span>
                <span className="text-primary font-bold text-sm md:text-base">
                    {settings.is3DMode ? "3D Mode" : "2D Mode"}
                </span>
            </div>

            {settings.is3DMode && !isMobile && (
                <button 
                    onClick={toggleCameraMode}
                    className="hidden sm:block bg-blue-600/80 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg hover:bg-blue-500 transition-colors border border-blue-400/30"
                >
                    {settings.isSpectatorMode ? "🎥 Spectator" : "👀 First Person"}
                </button>
            )}
        </div>
        <div className="flex items-center gap-3 md:gap-4">
           <div className="bg-primary/10 border border-primary/40 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.2)]">
              <span className="text-primary font-bold text-sm md:text-lg tracking-wider whitespace-nowrap">
                SCORE: {score}
              </span>
          </div>

          {gameStatus === 'playing' && (
            <button 
              onClick={handlePause}
              className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 border border-white/20 transition-all active:scale-95 shadow-lg"
              aria-label="Pause Game"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 relative w-full overflow-hidden flex items-center justify-center bg-black">
        
        <div className="absolute inset-0 z-40 pointer-events-none">
            <div className="pointer-events-auto w-full h-full">
                <GameOverlay />
                <SwipeControls />
            </div>
        </div>
        <div className={cn(
            "relative transition-transform duration-300 origin-center flex items-center justify-center",
            settings.is3DMode ? "w-full h-full" : "w-auto h-auto",
            
            !settings.is3DMode && "scale-100 landscape:scale-[0.55] sm:landscape:scale-75 md:landscape:scale-90 lg:scale-100"
        )}>
            {settings.is3DMode ? (
              <Board3D heading={playerHeading} />
            ) : (
              <Board heading={playerHeading} />
            )}
        </div>
      </main>

    </div>
  );
};