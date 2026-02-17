import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShowcaseLayout } from '../../components/layout/ShowcaseLayout';
import { ShowcaseCanvas } from '../../components/UI/ShowcaseCanvas';
import { ModeToggle, SelectionButton, ColorButton, ShowcaseSectionTitle } from '../../components/UI/ShowcaseUI';
import { useTranslation } from 'react-i18next';
import { ClassicGhost } from '../../components/Game/3D/Ghosts/ClassicGhost';
import { ReaperGhost } from '../../components/Game/3D/Ghosts/ReaperGhost';
import { Eyes3D } from '../../components/Game/3D/Ghosts/Eyes3D';
import { Model as KakabaModel } from '../../components/Game/3D/Models/Kakaba';
import { Model as JanelaModel } from '../../components/Game/3D/Models/Janela';
import { Model as IkoModel } from '../../components/Game/3D/Models/Iko';
import { Model as JafaraModel } from '../../components/Game/3D/Models/Jafara';
import { Ghost2D } from '../../components/Game/2D/Ghost2D';

const ColorSquare = ({ color }: { color: string }) => (
  <div 
    className="w-5 h-5 rounded-md shadow-sm border border-white/20" 
    style={{ backgroundColor: color }} 
  />
);

export const GhostShowcase = () => {
  const { settings, updateSetting } = useTheme();
  const { t } = useTranslation();
  const [previewState, setPreviewState] = useState<string>('IDLE');

  const variant = settings.ghostVariant; 
  const ghostColor = settings.ghostColor; 
  const isDark = settings.isDarkMode;
  
  const [is3D, setIs3D] = useState(settings.is3DMode);

  const colors = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852', '#00FF00', '#FFFFFF'];

  let yPos = 0;
  if (variant === 2) yPos = 0.6;
  if (variant === 3) yPos = 0.3;
  if (variant >= 4) yPos = -0.9;

  const Sidebar = (
    <div>
       <ModeToggle is3D={is3D} onToggle={setIs3D} isDark={isDark} />
       
       {variant >= 4 && is3D && ( 
         <div className="mb-6">
           <ShowcaseSectionTitle title="Animation Test" />
           <div className="flex gap-2">
             <button 
               onClick={() => setPreviewState('IDLE')}
               className={`px-3 py-1 text-xs rounded border ${previewState === 'IDLE' ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-400 border-gray-600'}`}
             >
               Idle
             </button>
             <button 
               onClick={() => setPreviewState('CHASING')}
               className={`px-3 py-1 text-xs rounded border ${previewState === 'CHASING' ? 'bg-green-500 text-white border-green-500' : 'text-gray-400 border-gray-600'}`}
             >
               Run
             </button>
             <button 
               onClick={() => setPreviewState('SCARED')}
               className={`px-3 py-1 text-xs rounded border ${previewState === 'SCARED' ? 'bg-purple-500 text-white border-purple-500' : 'text-gray-400 border-gray-600'}`}
             >
               Scared
             </button>
           </div>
         </div>
       )}

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

          <div className="h-px bg-white/10 my-2 mx-4" />
          <p className="text-xs text-gray-500 mb-2 px-1 uppercase font-bold tracking-wider">Kacebi Squad</p>

          <SelectionButton 
            label="Kakaba" 
            icon={<ColorSquare color="#ef4444" />} 
            color="red" isDark={isDark}
            isActive={variant === 4} onClick={() => updateSetting('ghostVariant', 4)} 
          />
          
          <SelectionButton 
            label="Janela" 
            icon={<ColorSquare color="#ec4899" />} 
            color="pink" isDark={isDark}
            isActive={variant === 5} onClick={() => updateSetting('ghostVariant', 5)} 
          />
          
          <SelectionButton 
            label="Iko" 
            icon={<ColorSquare color="#06b6d4" />} 
            color="cyan" isDark={isDark}
            isActive={variant === 6} onClick={() => updateSetting('ghostVariant', 6)} 
          />
          
          <SelectionButton 
            label="Jafara" 
            icon={<ColorSquare color="#f97316" />} 
            color="orange" isDark={isDark}
            isActive={variant === 7} onClick={() => updateSetting('ghostVariant', 7)} 
          />
       </div>

       {variant < 3 && (
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
       
       {variant >= 4 && is3D && (
           <div className="text-xs text-gray-400 mt-2 text-center">
               Kacebi Squad models use their original textures.
           </div>
       )}
    </div>
  );

  const MainContent = is3D ? (
    // 3D VIEW
    <ShowcaseCanvas isDark={isDark} scale={variant >= 4 ? 1.6 : 1.8} position={[0, yPos, 0]}>
        {variant === 1 && <ClassicGhost color={ghostColor} />}
        {variant === 2 && <ReaperGhost color={ghostColor} />}
        {variant === 3 && <Eyes3D />}

        {variant === 4 && <KakabaModel ghostState={previewState} />}
        {variant === 5 && <JanelaModel ghostState={previewState} />}
        {variant === 6 && <IkoModel ghostState={previewState} />}
        {variant === 7 && <JafaraModel ghostState={previewState} />}
    </ShowcaseCanvas>
  ) : (
    //2D VIEW 
    <div className="flex items-center justify-center h-full">
         <div className="z-10 transform scale-150 p-12 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <Ghost2D variant={variant} color={ghostColor} size={150} />
         </div>
    </div>
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