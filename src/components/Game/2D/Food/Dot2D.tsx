import { useTheme } from '../../../../context/ThemeContext';

interface Dot2DProps {
  size: number;
}

export const Dot2D = ({ size }: Dot2DProps) => {
  const { settings } = useTheme();
  const color = settings?.foodColor ?? '#fef08a';

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <div 
        className="w-[25%] h-[25%] rounded-sm shadow-sm transition-colors duration-300" 
        style={{ backgroundColor: color }}
      />
    </div>
  );
};