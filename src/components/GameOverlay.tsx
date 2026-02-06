import { useGame } from '../context/GameContext';
import { formatTime } from '../utils/formatTime'; 
import { useTranslation } from 'react-i18next';

export const GameOverlay = () => {
  const { gameStatus, score, level, elapsedTime, startGame, resumeGame, restartGame, startRound, nextLevel } = useGame();
  const { t } = useTranslation();

  if (gameStatus === 'playing') return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* IDLE / MAIN MENU  */}
      {gameStatus === 'idle' && (
        <div className="text-center flex flex-col items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
              {t('game.title')}
            </h1>
            <p className="text-white/60 text-lg tracking-widest uppercase">{t('game.subtitle')}</p>
          </div>
          
          <button 
            onClick={startGame}
            className="group relative px-12 py-4 bg-blue-600 text-white text-xl font-bold rounded-full overflow-hidden shadow-[0_0_30px_blue] hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">{t('game.start_btn')}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* GET READY SCREEN  */}
      {gameStatus === 'ready' && (
        <div className="text-center space-y-4 animate-pulse">
            <h2 className="text-6xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] tracking-widest">
                {t('game.get_ready')}
            </h2>
            <p className="text-white/70 text-2xl uppercase tracking-[0.2em]">{t('game.level')} {level}</p>
            
            <button 
                onClick={startRound}
                className="mt-12 px-10 py-3 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold rounded-full hover:bg-yellow-400 hover:text-black transition-all text-xl cursor-pointer"
            >
                {t('game.tap_start')}
            </button>
        </div>
      )}

      {/* PAUSE MENU  */}
      {gameStatus === 'paused' && (
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-bold text-blue-400 tracking-[0.2em] drop-shadow-[0_0_10px_blue]">{t('game.paused')}</h2>
          <div className="flex flex-col gap-4 w-64">
            <button 
              onClick={resumeGame}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-500/30"
            >
              {t('game.resume')}
            </button>
            <button 
              onClick={restartGame}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-red-500/30"
            >
              {t('game.quit')}
            </button>
          </div>
        </div>
      )}

      {/* VICTORY / NEXT LEVEL MENU  */}
      {gameStatus === 'won' && (
        <div className="text-center space-y-6 animate-in zoom-in duration-500">
          <h1 className="text-6xl md:text-7xl font-black bg-clip-text bg-linear-to-r from-green-400 to-emerald-600 drop-shadow-[0_0_25px_rgba(34,197,94,0.8)] animate-bounce">
            {t('game.level_cleared')}
          </h1>
          
          <div className="bg-white/10 p-8 rounded-2xl border border-green-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                    <p className="text-white/70 text-sm uppercase tracking-wider mb-2">{t('game.current_score')}</p>
                    <p className="text-6xl font-black text-yellow-400 drop-shadow-lg">{score}</p>
                </div>
                {/* Time Display */}
                <div>
                    <p className="text-white/70 text-sm uppercase tracking-wider mb-2">{t('game.time')}</p>
                    <p className="text-6xl font-black text-blue-400 font-mono drop-shadow-lg">
                        {formatTime(elapsedTime)}
                    </p>
                </div>
            </div>
          </div>

          <button 
            onClick={nextLevel}
            className="px-12 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-green-400 hover:text-white hover:scale-105 transition-all shadow-[0_0_20px_white] hover:shadow-[0_0_40px_rgba(74,222,128,0.6)]"
          >
            {t('game.next_level')}
          </button>
        </div>
      )}

      {/* GAME OVER MENU  */}
      {gameStatus === 'gameover' && (
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-bold text-red-600 drop-shadow-[0_0_25px_red] animate-pulse">{t('game.game_over')}</h1>
          
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
             <div className="flex justify-between items-center gap-12">
                <div className="text-center">
                    <p className="text-white/70 text-sm uppercase tracking-wider mb-2">{t('game.final_score')}</p>
                    <p className="text-5xl font-bold text-yellow-400">{score}</p>
                </div>
                {/* Time Display */}
                <div className="text-center">
                    <p className="text-white/70 text-sm uppercase tracking-wider mb-2">{t('game.total_time')}</p>
                    <p className="text-5xl font-bold text-red-400 font-mono">
                        {formatTime(elapsedTime)}
                    </p>
                </div>
             </div>
          </div>

          <button 
            onClick={restartGame}
            className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_white]"
          >
            {t('game.try_again')}
          </button>
        </div>
      )}
    </div>
  );
};