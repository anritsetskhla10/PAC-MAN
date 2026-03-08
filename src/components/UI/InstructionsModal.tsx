import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal = ({ onClose }: InstructionsModalProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="bg-[#111] border-2 border-primary/50 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-[0_0_30px_rgba(0,212,255,0.2)] text-white overflow-y-auto max-h-[85vh] custom-scrollbar">
        
        <h2 className="text-3xl md:text-4xl font-black text-center text-primary mb-8 tracking-widest drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">
          {t('instructions.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Gameplay Rules */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-white/20 pb-2 mb-4 text-gray-300 uppercase tracking-wider">
              Gameplay
            </h3>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 className="text-yellow-400 font-bold text-base mb-1 flex items-center gap-2">
                🎮 {t('instructions.controls')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isMobile ? t('instructions.mobile_controls') : t('instructions.desktop_controls')}
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 className="text-green-400 font-bold text-base mb-1 flex items-center gap-2">
                🎯 {t('instructions.objective')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('instructions.objective_desc')}
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 className="text-blue-400 font-bold text-base mb-1 flex items-center gap-2">
                ⚡ {t('instructions.power_pellets')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('instructions.power_desc')}
              </p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 className="text-pink-400 font-bold text-base mb-1 flex items-center gap-2">
                🍒 {t('instructions.bonuses')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('instructions.bonuses_desc')}
              </p>
            </div>
          </div>

          {/* Right Column: Features & Settings */}
          <div className="space-y-4">
             <h3 className="text-xl font-bold border-b border-white/20 pb-2 mb-4 text-gray-300 uppercase tracking-wider">
              Features & Settings
            </h3>

            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors">
              <h4 className="text-primary font-bold text-base mb-1 flex items-center gap-2">
                🕹️ {t('instructions.modes_title')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('instructions.modes_desc')}
              </p>
            </div>

            <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
              <h4 className="text-purple-400 font-bold text-base mb-1 flex items-center gap-2">
                🎥 {t('instructions.camera_title')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {t('instructions.camera_desc')}
              </p>
              
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-2 flex items-start gap-2">
                <span className="text-sm mt-0.5">🖱️</span>
                <p className="text-purple-200 text-xs leading-relaxed font-medium">
                  {t('instructions.camera_note')}
                </p>
              </div>
            </div>

            <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
              <h4 className="text-orange-400 font-bold text-base mb-1 flex items-center gap-2">
                ⚙️ {t('instructions.settings_title')}
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('instructions.settings_desc')}
              </p>
            </div>
          </div>

        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-primary text-black font-black text-xl rounded-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)]"
        >
          {t('instructions.got_it')}
        </button>
      </div>
    </div>
  );
};