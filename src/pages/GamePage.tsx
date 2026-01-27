import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Game/Board';
import { Board3D } from '../components/Game/3D/Board3D';
import { GameOverlay } from '../components/GameOverlay';
import { SwipeControls } from '../components/SwipeControls';
import { cn } from '../utils/cn';
import { usePlayerHeading } from '../hooks/usePlayerHeading'; 
import { useIsMobile } from '../hooks/useIsMobile'; 
import { Link } from 'react-router-dom'; 

export const GamePage = () => {
  const { settings, updateSetting } = useTheme();
  const { score, gameStatus, pauseGame } = useGame();
  const playerHeading = usePlayerHeading();
  const isMobile = useIsMobile();
  
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measureBoardArea = () => {
        if (boardContainerRef.current) {
            setBoardDimensions({
                width: boardContainerRef.current.clientWidth,
                height: boardContainerRef.current.clientHeight
            });
        }
    };
    // პატარა დაყოვნება, რომ რენდერი დასრულდეს
    setTimeout(measureBoardArea, 100);
    window.addEventListener('resize', measureBoardArea);
    return () => window.removeEventListener('resize', measureBoardArea);
  }, []);

  // Mobile 3D Auto-Spectator
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
    if (settings.is3DMode && document.pointerLockElement) document.exitPointerLock();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden z-100 flex flex-col landscape:max-lg:flex-row pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      
      <div className={cn(
          "relative z-50 flex items-center justify-between p-3 bg-black/60 backdrop-blur-md border-white/10 shrink-0 transition-all",
          
          "w-full border-b flex-row h-16 md:h-20",

          "landscape:max-lg:w-20 landscape:max-lg:h-full landscape:max-lg:flex-col landscape:max-lg:border-r landscape:max-lg:border-b-0 landscape:max-lg:py-6"
      )}>
        
        <div className="flex landscape:max-lg:flex-col gap-3 items-center">
             <Link to="/settings" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                ⚙️
             </Link>

             <div 
               className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-primary/20 cursor-pointer hover:bg-white/10 transition-colors" 
               onClick={() => updateSetting('is3DMode', !settings.is3DMode)}
             >
                <span className="text-lg">{settings.is3DMode ? "🎮" : "🕹️"}</span>
                <span className="text-primary font-bold text-xs md:text-sm landscape:max-lg:hidden">
                    {settings.is3DMode ? "3D" : "2D"}
                </span>
            </div>
        </div>
        <div className="flex landscape:max-lg:flex-col items-center gap-2 landscape:max-lg:gap-1 landscape:max-lg:my-auto">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest landscape:max-lg:writing-vertical-rl landscape:max-lg:rotate-180">
             Score
           </span>
           <div className="bg-primary/10 border border-primary/40 px-4 py-1 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.2)]">
              <span className="text-primary font-bold text-lg md:text-xl landscape:max-lg:writing-vertical-rl landscape:max-lg:rotate-180">
                {score}
              </span>
          </div>
        </div>

        <div className="flex landscape:max-lg:flex-col gap-4 items-center">
           {settings.is3DMode && !isMobile && (
                <button onClick={toggleCameraMode} className="text-2xl hover:scale-110 transition-transform" title="Change Camera">
                    {settings.isSpectatorMode ? "🎥" : "👀"}
                </button>
            )}

            {gameStatus === 'playing' && (
                <button 
                onClick={handlePause}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-red-600/90 text-white rounded-full shadow-lg active:scale-95 border-2 border-white/20"
                >
                ⏸
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
        
        <div className="absolute inset-0 z-40 pointer-events-none">
            <div className="pointer-events-auto w-full h-full">
                <GameOverlay />
                <SwipeControls />
            </div>
        </div>

        <div ref={boardContainerRef} className="w-full h-full flex items-center justify-center p-2 md:p-6 lg:p-8">
            {settings.is3DMode ? (
               <div className="w-full h-full rounded-xl overflow-hidden border border-white/5 shadow-2xl relative bg-black/50">
                 <Board3D heading={playerHeading} />
               </div>
            ) : (
               <Board 
                 heading={playerHeading} 
                 parentWidth={boardDimensions.width} 
                 parentHeight={boardDimensions.height} 
               />
            )}
        </div>
      </div>

    </div>
  );
};