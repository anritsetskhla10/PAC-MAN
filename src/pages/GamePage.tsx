import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Game/2D/Board';
import { GameOverlay } from '../components/UI/GameOverlay';
import { MobileControls } from '../components/layout/MobileControls';
import { cn } from '../utils/cn';
import { usePlayerHeading } from '../hooks/usePlayerHeading'; 
import { useIsMobile } from '../hooks/useIsMobile'; 
import { Link } from 'react-router-dom'; 
import { formatTime } from '../utils/formatTime'; 
import { useTranslation } from 'react-i18next';

const Board3D = lazy(() => import('../components/Game/3D/Board3D').then(m => ({ default: m.Board3D })));

export const GamePage = () => {
  const { settings, updateSetting } = useTheme();
  const { score, gameStatus, pauseGame, lives, level, elapsedTime } = useGame();
  const playerHeading = usePlayerHeading();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardDimensions, setBoardDimensions] = useState({ width: 0, height: 0 });

  const [prevScore, setPrevScore] = useState(score);
  const [addedScore, setAddedScore] = useState<{ amount: number; id: number } | null>(null);

  if (score !== prevScore) {
    if (score > prevScore) {
      const difference = score - prevScore;
      setAddedScore({ amount: difference, id: score });
    }
    setPrevScore(score);
  }

  useEffect(() => {
    if (addedScore) {
      const timer = setTimeout(() => {
        setAddedScore(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [addedScore]);

  useEffect(() => {
    const measureBoardArea = () => {
        if (boardContainerRef.current) {
            setBoardDimensions({
                width: boardContainerRef.current.clientWidth,
                height: boardContainerRef.current.clientHeight
            });
        }
    };

    const handleResize = () => {
        measureBoardArea(); 
        setTimeout(measureBoardArea, 100);
        setTimeout(measureBoardArea, 500); 
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

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
      
      {/* SIDEBAR */}
      <div className={cn(
          "relative z-50 flex items-center justify-between p-3 bg-black/60 backdrop-blur-md border-white/10 shrink-0 transition-all",
          "w-full border-b flex-row h-16 md:h-20",
          "landscape:max-lg:w-20 landscape:max-lg:h-full landscape:max-lg:flex-col landscape:max-lg:border-r landscape:max-lg:border-b-0 landscape:max-lg:py-6"
      )}>
        
        {/* Left Controls (Settings/Mode) */}
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

        {/* Center Info (Lives, Level, Score) */}
        <div className="flex landscape:max-lg:flex-col items-center gap-4 landscape:max-lg:gap-6 landscape:max-lg:my-auto">
           
           {/* Lives Display */}
           <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest landscape:max-lg:hidden">
                    {t('game.lives')}
                </span>
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`
                        w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/20 transition-all duration-300
                        ${i < lives 
                            ? 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)] scale-100' 
                            : 'bg-white/5 opacity-20 scale-75'}
                        `}
                        style={i < lives ? { clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%, 0% 100%, 0% 0%)', transform: 'rotate(-45deg)' } : {}}
                    />
                    ))}
                </div>
           </div>

           {/* Score Display */}
           <div className="flex flex-col items-center relative">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest landscape:max-lg:writing-vertical-rl">
                    {t('game.score')}
                </span>
                <div className="bg-primary/10 border border-primary/40 px-4 py-1 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.2)] relative">
                    <span className="text-primary font-bold text-lg md:text-xl landscape:max-lg:writing-vertical-rl landscape:max-lg:rotate-180">
                        {score}
                    </span>
                    {addedScore && (
                        <span
                            key={addedScore.id}
                            className="score-popup-anim absolute -top-4 right-0 text-[#4ade80] font-black text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-50 landscape:max-lg:-right-6 landscape:max-lg:top-2 landscape:max-lg:rotate-90"
                        >
                            +{addedScore.amount}
                        </span>
                    )}
                </div>
           </div>

           {/* Timer Display */}
           <div className="flex flex-col items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest landscape:max-lg:hidden">
                    {t('game.time')}
                </span>
                <span className="text-white font-mono font-bold text-lg tabular-nums tracking-wider">
                    {formatTime(elapsedTime)}
                </span>
           </div>

           {/* Level Indicator */}
           <div className="flex flex-col items-center">
               <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest landscape:max-lg:hidden">
                    {t('game.level')}
               </span>
               <span className="text-white font-bold text-lg">{level}</span>
           </div>

        </div>

        {/* Right Controls (Pause/Camera) */}
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

      {/* GAME AREA */}
      <div className="flex-1 relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
        
        <div className="absolute inset-0 z-40 pointer-events-none">
            <div className="pointer-events-auto w-full h-full">
                <GameOverlay />
            </div>
        </div>

        <div ref={boardContainerRef} className="w-full h-full flex items-center justify-center p-2 landscape:max-lg:p-0 md:p-6 lg:p-8">
            {settings.is3DMode ? (
               <div className="w-full h-full rounded-xl overflow-hidden border border-white/5 shadow-2xl relative bg-black/50">
                 <Suspense fallback={
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 animate-pulse bg-black/80">
                        <span className="text-4xl mb-4">🧊</span>
                        <p className="text-sm font-bold tracking-widest uppercase">Loading 3D Engine...</p>
                    </div>
                 }>
                   <Board3D heading={playerHeading} />
                 </Suspense>
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

      <MobileControls />

    </div>
  );
};