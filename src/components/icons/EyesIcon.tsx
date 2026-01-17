import { cn } from '../../utils/cn';

interface EyesIconProps {
  className?: string;
}

export const EyesIcon = ({ className }: EyesIconProps) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("fill-none", className)}
    >
      {/* მარცხენა თვალი */}
      <circle cx="35" cy="45" r="15" fill="white" />
      <circle cx="35" cy="45" r="6" fill="blue" />

      {/* მარჯვენა თვალი */}
      <circle cx="65" cy="45" r="15" fill="white" />
      <circle cx="65" cy="45" r="6" fill="blue" />
    </svg>
  );
};