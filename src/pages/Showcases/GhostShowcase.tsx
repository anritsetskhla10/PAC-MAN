import { useTheme } from '../../context/ThemeContext';
import { ShowcaseLayout } from '../../components/layout/ShowcaseLayout';
import { ShowcaseCanvas } from '../../components/UI/ShowcaseCanvas';
import { ModeToggle, SelectionButton, ColorButton, ShowcaseSectionTitle } from '../../components/UI/ShowcaseUI';
// მოდელები
import { ClassicGhost } from '../../components/Game/3D/Ghosts/ClassicGhost';
import { ReaperGhost } from '../../components/Game/3D/Ghosts/ReaperGhost';
import { Eyes3D } from '../../components/Game/3D/Ghosts/Eyes3D';
import { useTranslation } from 'react-i18next';

export const GhostShowcase = () => {
  const { settings, updateSetting } = useTheme();
  const { t } = useTranslation();
  
  const variant = settings.ghostVariant; 
  const ghostColor = settings.ghostColor; 
  const isDark = settings.isDarkMode;
  const is3D = settings.is3DMode; 

  const colors = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852', '#00FF00', '#FFFFFF'];

  let yPos = 0;
  if (variant === 2) yPos = 0.6;
  if (variant === 3) yPos = 0.3;

  const Sidebar = (
    <div>
       <ModeToggle is3D={is3D} onToggle={(v) => updateSetting('is3DMode', v)} isDark={isDark} />

       <ShowcaseSectionTitle title={t('showcase.choose_style')} />
       <div className="flex flex-col gap-2 mb-6">
          <SelectionButton 
            label={t('items.classic_ghost')} icon="👻" color="blue" isDark={isDark}
            isActive={variant === 1} onClick={() => updateSetting('ghostVariant', 1)} 
          />
          <SelectionButton 
            label={t('items.reaper_ghost')} icon="💀" color="purple" isDark={isDark}
            isActive={variant === 2} onClick={() => updateSetting('ghostVariant', 2)} 
          />
          <SelectionButton 
            label={t('items.eyes_ghost')} icon="👀" color="indigo" isDark={isDark}
            isActive={variant === 3} onClick={() => updateSetting('ghostVariant', 3)} 
          />
       </div>

       {variant !== 3 && (
         <>
            <ShowcaseSectionTitle title={t('showcase.choose_color')} />
            <div className="flex gap-3 flex-wrap">
              {colors.map(c => (
                <ColorButton 
                  key={c} color={c} isDark={isDark}
                  isActive={ghostColor === c} 
                  onClick={() => updateSetting('ghostColor', c)} 
                />
              ))}
            </div>
         </>
       )}
    </div>
  );

  const MainContent = (
    <ShowcaseCanvas isDark={isDark} scale={1.8} position={[0, yPos, 0]}>
        {variant === 1 && <ClassicGhost color={ghostColor} />}
        {variant === 2 && <ReaperGhost color={ghostColor} />}
        {variant === 3 && <Eyes3D />}
    </ShowcaseCanvas>
  );

  return (
    <ShowcaseLayout 
      title={t('nav.ghost_lab')} 
      icon="🧪" 
      sidebarContent={Sidebar} 
      mainContent={MainContent} 
    />
  );
};