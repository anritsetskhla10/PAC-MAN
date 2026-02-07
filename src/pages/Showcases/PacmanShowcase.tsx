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
  
  const [selectedModel, setSelectedModel] = useState<'classic' | 'labadze'>(settings.playerModel === 'avatar' ? 'labadze' : 'classic');

  const handleModelChange = (model: 'classic' | 'labadze') => {
    setSelectedModel(model);
    updateSetting('playerModel', model === 'labadze' ? 'avatar' : 'classic'); 
  };

  const Sidebar = (
    <div>
      <ModeToggle is3D={is3D} onToggle={(v) => updateSetting('is3DMode', v)} isDark={isDark} />

      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-400 mb-6">
          <p>{t('showcase.model_disclaimer')}</p>
      </div>

      <ShowcaseSectionTitle title={t('showcase.select_char')} />
      <div className="flex flex-col gap-2">
        <SelectionButton 
            label={t('items.classic_pacman')} icon="🟡" color="yellow" isDark={isDark}
            isActive={selectedModel === 'classic'} 
            onClick={() => handleModelChange('classic')} 
        />
        <SelectionButton 
            label="Labadze" icon="👨‍💼" color="blue" isDark={isDark}
            isActive={selectedModel === 'labadze'} 
            onClick={() => handleModelChange('labadze')} 
        />
      </div>
    </div>
  );

  const MainContent = is3D ? (
    <ShowcaseCanvas isDark={isDark} scale={selectedModel === 'labadze' ? 1.8 : 2.5} position={[0, -0.9, 0]}>
        {selectedModel === 'labadze' ? (
           <LabadzeModel />
        ) : (
           <Pacman3D isShowcase={true} />
        )}
    </ShowcaseCanvas>
  ) : (
    <div className="flex items-center justify-center h-full">
         <div className="z-10 transform scale-150 p-12 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <Pacman2D size={150} />
         </div>
    </div>
  );

  return (
    <ShowcaseLayout 
      title={t('nav.pacman_lab')} 
      icon="🟡" 
      sidebarContent={Sidebar} 
      mainContent={MainContent} 
    />
  );
};