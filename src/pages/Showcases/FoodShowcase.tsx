import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShowcaseLayout } from '../../components/layout/ShowcaseLayout';
import { ShowcaseCanvas } from '../../components/UI/ShowcaseCanvas';
import { ModeToggle, SelectionButton, ShowcaseSectionTitle } from '../../components/UI/ShowcaseUI';
import { Food3D } from '../../components/Game/Foods/Food3D';
import { Food2D } from '../../components/Game/Foods/Food2D';
import { useTranslation } from 'react-i18next';

type FoodType = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';

export const FoodShowcase = () => {
  const { settings } = useTheme();
  const { t } = useTranslation();
  const isDark = settings.isDarkMode;
  
  const [foodType, setFoodType] = useState<FoodType>('cherry');
  const [localIs3D, setLocalIs3D] = useState(true);

  const Sidebar = (
    <div>
      <ModeToggle is3D={localIs3D} onToggle={setLocalIs3D} isDark={isDark} />

      <ShowcaseSectionTitle title={t('showcase.inspect')} />
      <div className="flex flex-col gap-2">
        {(['dot', 'power', 'cherry', 'strawberry', 'life'] as const).map((type) => (
           <SelectionButton
              key={type}
              label={type}
              icon={type === 'cherry' ? '🍒' : type === 'strawberry' ? '🍓' : type === 'power' ? '⚡' : type === 'life' ? '❤️' : '•'}
              color="red"
              isDark={isDark}
              isActive={foodType === type}
              onClick={() => setFoodType(type)}
           />
        ))}
      </div>
      
      <div className="mt-6 text-xs text-gray-400 text-center">
        {t('showcase.visual_disclaimer')}
      </div>
    </div>
  );

  const MainContent = localIs3D ? (
    <ShowcaseCanvas isDark={isDark} scale={3}>
        <Food3D consumableVariant={foodType} />
    </ShowcaseCanvas>
  ) : (
    <div className="flex items-center justify-center h-full">
         <div className="z-10 transform scale-150 p-12 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <Food2D type={foodType} size={150} />
         </div>
    </div>
  );

  return (
    <ShowcaseLayout 
      title={t('nav.food_lab')} 
      icon="🍒" 
      sidebarContent={Sidebar} 
      mainContent={MainContent} 
    />
  );
};