interface Heart2DProps {
  size: number;
}

export const Heart2D = ({ size }: Heart2DProps) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center animate-pulse">
       <svg viewBox="0 0 100 100" fill="none" className="drop-shadow-lg w-full h-full">
         <path 
           d="M50 88.9 L44.2 83.6 C23.6 64.9 10 52.6 10 37.5 C10 25.2 19.7 15.5 32 15.5 C38.9 15.5 45.6 18.7 50 23.8 C54.4 18.7 61.1 15.5 68 15.5 C80.3 15.5 90 25.2 90 37.5 C90 52.6 76.4 64.9 55.8 83.6 L50 88.9Z" 
           fill="#ec4899" 
           stroke="#be185d" 
           strokeWidth="3"
         />
         <ellipse cx="30" cy="30" rx="8" ry="4" fill="white" fillOpacity="0.4" transform="rotate(-30 30 30)" />
      </svg>
    </div>
  );
};