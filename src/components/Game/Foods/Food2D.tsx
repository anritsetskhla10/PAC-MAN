import { useTheme } from '../../../context/ThemeContext';
import { Mchadi2D } from '../Foods/items2D/Mchadi2D';
import { Kebab2D } from '../Foods/items2D//Kebab2D';
import { Khinkali2D } from '../Foods/items2D//Khinkali2D';
import { Khachapuri2D } from '../Foods/items2D/Khachapuri2D'; 
import { Dot2D } from '../Foods/items2D/Dot2D';
import { PowerPellet2D } from '../Foods/items2D/PowerPellet2D';
import { Cherry2D } from '../Foods/items2D/Cherry2D';
import { Strawberry2D } from '../Foods/items2D/Strawberry2D';
import { Heart2D } from '../Foods/items2D/Heart2D';

type ConsumableVariant = 'dot' | 'power' | 'cherry' | 'strawberry' | 'life';

interface Food2DProps {
  type: ConsumableVariant;
  size?: number;
  themeOverride?: 'classic' | 'labadze'; 
}

export const Food2D = ({ type, size = 100, themeOverride }: Food2DProps) => {
  const { settings } = useTheme();
  
  const currentTheme = themeOverride || settings.gameTheme;
  const isLabadze = currentTheme === 'labadze';

  if (isLabadze) {
      switch (type) {
          case 'dot':
              return <Mchadi2D size={size * 1.8} />;
          case 'power':
              return <Kebab2D size={size * 1.5} />;
          case 'cherry':
              return <Khinkali2D size={size * 1.2} />;
          case 'strawberry':
              return <Khachapuri2D size={size * 1.3} />; 
          case 'life':
              return <Heart2D size={size} />;
          default:
              return null;
      }
  }
  switch (type) {
      case 'dot':
          return <Dot2D size={size} />;
      case 'power':
          return <PowerPellet2D size={size} />;
      case 'cherry':
          return <Cherry2D size={size} />;
      case 'strawberry':
          return <Strawberry2D size={size} />;
      case 'life':
          return <Heart2D size={size} />;
      default:
          return null;
  }
};