interface Khachapuri2DProps {
  size: number;
}

export const Khachapuri2D = ({ size }: Khachapuri2DProps) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        
        {/*ცომი*/}
        <path 
          d="
            M 20,40           
            Q 50,10 80,40     
            Q 95,45 95,50     
            Q 95,55 80,60     
            Q 50,90 20,60     
            Q 5,55 5,50       
            Q 5,45 20,40      
            Z
          " 
          fill="#D2691E" 
          stroke="#8B4513" 
          strokeWidth="3" 
          strokeLinejoin="round"
        />
        
        {/*ყველი*/}
        <path 
          d="
            M 25,45 
            Q 50,25 75,45 
            Q 85,50 75,55 
            Q 50,75 25,55 
            Q 15,50 25,45 
            Z
          " 
          fill="#FFFACD" 
          opacity="0.95"
        />
        
        {/*კვერცხის გული*/}
        <circle cx="50" cy="50" r="13" fill="#FFA500" stroke="#FF8C00" strokeWidth="1" />
        
        {/*კარაქი*/}
        <rect 
            x="35" 
            y="40" 
            width="10" 
            height="8" 
            rx="1" 
            fill="#FFFFE0" 
            stroke="#F0E68C" 
            strokeWidth="0.5" 
            transform="rotate(-15 40 44)" 
        />
        
        {/*დეტალები*/}
        <circle cx="20" cy="50" r="1.5" fill="#8B4513" opacity="0.5" />
        <circle cx="80" cy="50" r="1.5" fill="#8B4513" opacity="0.5" />
      </svg>
    </div>
  );
};