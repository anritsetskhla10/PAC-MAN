import { Kakaba2D } from '../2D/Characters/Kakaba2D';
import { Janela2D } from '../2D/Characters/Janela2D';
import { Iko2D } from '../2D/Characters/Iko2D';
import { Jafara2D } from '../2D/Characters/Jafara2D';
import { GhostIcon } from './icons/GhostIcon';
import { EyesIcon } from './icons/EyesIcon';

interface Ghost2DProps {
  variant: number;
  color: string;
  size?: number;
}

export const Ghost2D = ({ variant, color, size = 100 }: Ghost2DProps) => {
  switch (variant) {
    case 1:
      return <GhostIcon className='' color={color} />;
    case 2:
      return <div style={{color: 'white'}}></div>;
    case 3:
      return <EyesIcon className='' />;
    case 4:
      return <Kakaba2D size={size} />;
    case 5:
      return <Janela2D size={size} />;
    case 6:
      return <Iko2D size={size} />;
    case 7:
      return <Jafara2D size={size} />;
    default:
      return null;
  }
};