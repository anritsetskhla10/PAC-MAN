import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShowcaseLayout } from '../../components/layout/ShowcaseLayout';
import { ShowcaseCanvas } from '../../components/UI/ShowcaseCanvas';
import { ModeToggle, SelectionButton, ShowcaseSectionTitle } from '../../components/UI/ShowcaseUI';
import { Pacman2D } from '../../components/Game/Player/Pacman2D';
import { useTranslation } from 'react-i18next';
import { Model as LabadzeModel } from '../../components/Game/3D/Models/Labadze';
import { Pacman3D } from '../../components/Game/Player/Pacman3D';

export const PacmanShowcase = () => {
  const { settings, updateSetting } = useTheme();
  const { t } = useTranslation();
  const isDark = settings.isDarkMode;
  const is3D = settings.is3DMode;

  const [animationState, setAnimationState] = useState<string>('IDLE');

  const [selectedModel, setSelectedModel] = useState<'classic' | 'labadze'>(settings.playerModel === 'avatar' ? 'labadze' : 'classic');

  const handleModelChange = (model: 'classic' | 'labadze') => {
    setSelectedModel(model);
  };

  const Sidebar = (
    <div>
      <ModeToggle is3D={is3D} onToggle={(v) => updateSetting('is3DMode', v)} isDark={isDark} />

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-400 mb-6">
          <p>{t('showcase.model_disclaimer')}</p>
      </div>

      {selectedModel === 'labadze' && is3D && (
         <div className="mb-6">
           <ShowcaseSectionTitle title="Animation Test" />
           <div className="flex gap-2">
             <button 
               onClick={() => setAnimationState('IDLE')}
               className={`px-3 py-1 text-xs rounded border ${animationState === 'IDLE' ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-400 border-gray-600'}`}
             >
               Idle
             </button>
             <button 
               onClick={() => setAnimationState('MOVING')}
               className={`px-3 py-1 text-xs rounded border ${animationState === 'MOVING' ? 'bg-green-500 text-white border-green-500' : 'text-gray-400 border-gray-600'}`}
             >
               Run
             </button>
             <button 
               onClick={() => setAnimationState('DYING')}
               className={`px-3 py-1 text-xs rounded border ${animationState === 'DYING' ? 'bg-red-500 text-white border-red-500' : 'text-gray-400 border-gray-600'}`}
             >
               Death
             </button>
           </div>
         </div>
       )}

      <ShowcaseSectionTitle title={t('showcase.select_char')} />
      <div className="flex flex-col gap-2">
        <SelectionButton 
            label={t('items.classic_pacman')} icon="ᗧ" color="yellow" isDark={isDark}
            isActive={selectedModel === 'classic'} 
            onClick={() => handleModelChange('classic')} 
        />
        <SelectionButton 
            label="Labadze" icon="🏃‍♂️" color="blue" isDark={isDark}
            isActive={selectedModel === 'labadze'} 
            onClick={() => handleModelChange('labadze')} 
        />
      </div>
    </div>
  );

  const MainContent = is3D ? (
    <ShowcaseCanvas isDark={isDark} scale={selectedModel === 'labadze' ? 1.8 : 2.5} position={[0, -0.9, 0]}>
        {selectedModel === 'labadze' ? (
           <LabadzeModel playerState={animationState} />
        ) : (
           <Pacman3D isShowcase={true} forceModel={selectedModel} />
        )}
    </ShowcaseCanvas>
  ) : (
    <div className="flex items-center justify-center h-full">
         <div className="z-10 transform scale-150 p-12 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <Pacman2D size={150} heading="RIGHT" forceModel={selectedModel}/>
         </div>
    </div>
  );

  return (
    <ShowcaseLayout 
      title={t('nav.pacman_lab')} 
      icon="ᗧ" 
      sidebarContent={Sidebar} 
      mainContent={MainContent} 
    />
  );
};