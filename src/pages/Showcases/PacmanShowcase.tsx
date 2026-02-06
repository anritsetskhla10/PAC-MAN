import { useTheme } from '../../context/ThemeContext';
import { ShowcaseLayout } from '../../components/layout/ShowcaseLayout';
import { ShowcaseCanvas } from '../../components/UI/ShowcaseCanvas';
import { ModeToggle, SelectionButton, ShowcaseSectionTitle } from '../../components/UI/ShowcaseUI';
import { Pacman3D } from '../../components/Game/Player/Pacman3D';
import { Pacman2D } from '../../components/Game/Player/Pacman2D';
import { useTranslation } from 'react-i18next';

export const PacmanShowcase = () => {
  const { settings, updateSetting } = useTheme();
  const { t } = useTranslation();
  const isDark = settings.isDarkMode;
  const is3D = settings.is3DMode;
  
  const model = settings.playerModel || 'classic'; 

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
            isActive={model === 'classic'} 
            onClick={() => updateSetting('playerModel', 'classic')} 
        />
      </div>
    </div>
  );

  const MainContent = is3D ? (
    <ShowcaseCanvas isDark={isDark} scale={model === 'avatar' ? 1.8 : 2.5}>
        <Pacman3D isShowcase={true} />
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