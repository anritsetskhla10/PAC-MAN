import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShowcaseLayout } from '../../components/layout/ShowcaseLayout';
import { ShowcaseCanvas } from '../../components/UI/ShowcaseCanvas';
import { ModeToggle, SelectionButton, ShowcaseSectionTitle } from '../../components/UI/ShowcaseUI';
import { Food3D } from '../../components/Game/Foods/Food3D';
import { Food2D } from '../../components/Game/Foods/Food2D';
import { useTranslation } from 'react-i18next';

type FoodType = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';
type ThemeVariant = 'classic' | 'labadze';

type ButtonColor = 'red' | 'yellow' | 'gray' | 'pink' | 'blue' | 'green';

interface FoodItemConfig {
  label: string;
  type: FoodType;
  theme: ThemeVariant;
  icon: string;
  color?: ButtonColor; 
}

export const FoodShowcase = () => {
  const { settings } = useTheme();
  const { t } = useTranslation();
  const isDark = settings.isDarkMode;
  
  const [selectedItem, setSelectedItem] = useState<FoodItemConfig>({ 
    label: 'Classic Cherry', 
    type: 'cherry', 
    theme: 'classic', 
    icon: '🍒',
    color: 'red'
  });

  const [localIs3D, setLocalIs3D] = useState(true);

  const allFoods: FoodItemConfig[] = [
    // --- Dots ---
    { label: 'Dot', type: 'dot', theme: 'classic', icon: '•', color: 'gray' },
    { label: 'Mchadi', type: 'dot', theme: 'labadze', icon: '🌽', color: 'yellow' },
    
    // --- Power ---
    { label: 'Power', type: 'power', theme: 'classic', icon: '⚡', color: 'gray' },
    { label: 'Kebab', type: 'power', theme: 'labadze', icon: '🍢', color: 'yellow' },

    // --- Cherry / Khinkali ---
    { label: 'Cherry', type: 'cherry', theme: 'classic', icon: '🍒', color: 'red' },
    { label: 'Khinkali', type: 'cherry', theme: 'labadze', icon: '🥟', color: 'yellow' },

    // --- Strawberry / Khachapuri ---
    { label: 'Strawberry', type: 'strawberry', theme: 'classic', icon: '🍓', color: 'red' },
    { label: 'Khachapuri', type: 'strawberry', theme: 'labadze', icon: '🧀', color: 'yellow' },

    // --- Life ---
    { label: 'Life', type: 'life', theme: 'classic', icon: '❤️', color: 'pink' },
  ];

  const Sidebar = (
    <div>
      <ModeToggle is3D={localIs3D} onToggle={setLocalIs3D} isDark={isDark} />

      <ShowcaseSectionTitle title={t('showcase.inspect')} />
      
      <div className="flex flex-col gap-2 h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
        {allFoods.map((item, index) => {
          const isActive = selectedItem.type === item.type && selectedItem.theme === item.theme;
          
          return (
            <SelectionButton
              key={`${item.type}-${item.theme}-${index}`}
              label={item.label}
              icon={item.icon}
              color={item.color || 'gray'} 
              isDark={isDark}
              isActive={isActive}
              onClick={() => setSelectedItem(item)}
            />
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        {t('showcase.visual_disclaimer')}
      </div>
    </div>
  );

  const MainContent = localIs3D ? (
    <ShowcaseCanvas isDark={isDark} scale={3}>
        <Food3D 
            consumableVariant={selectedItem.type} 
            themeOverride={selectedItem.theme} 
        />
    </ShowcaseCanvas>
  ) : (
    <div className="flex items-center justify-center h-full">
         <div className="z-10 transform scale-150 p-12 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center gap-4">
            <Food2D type={selectedItem.type} size={150} />
            <p className="text-white/50 text-sm font-mono">
                (2D View always uses Classic sprites)
            </p>
         </div>
    </div>
  );

  return (
    <ShowcaseLayout 
      title={t('nav.food_lab')} 
      icon="🍽️" 
      sidebarContent={Sidebar} 
      mainContent={MainContent} 
    />
  );
};