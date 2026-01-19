interface Pacman2DProps {
  size: number;
}

export const Pacman2D = ({ size }: Pacman2DProps) => {
  const duration = "0.25s";

  return (
    <div 
      style={{ width: size, height: size }} 
      className="relative z-20"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path fill="#FFD700">
          <animate 
            attributeName="d" 
            values="
              M50 50 L100 50 A50 50 0 1 1 100 49.9 Z;
              M50 50 L85 85 A50 50 0 1 1 85 15 Z;
              M50 50 L100 50 A50 50 0 1 1 100 49.9 Z
            "
            dur={duration}
            repeatCount="indefinite"
            keyTimes="0; 0.5; 1"
            calcMode="discrete" 
          />
        </path>
      </svg>
    </div>
  );
};