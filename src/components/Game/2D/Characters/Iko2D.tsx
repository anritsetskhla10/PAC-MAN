interface GhostProps {
  size?: number;
  isScared?: boolean;
}

export const Iko2D = ({ size = 100, isScared }: GhostProps) => {
  const color = isScared ? '#2121DE' : '#1f90d1';

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="circleViewIko">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          
          <radialGradient id="faceGradientIko" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
            <stop offset="0%" stopColor="#f5d0b0" />
            <stop offset="100%" stopColor="#d4a085" />
          </radialGradient>

          <linearGradient id="hairGradientIko" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c1b14" />
            <stop offset="100%" stopColor="#1a0f0a" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill={color} stroke="#166a9c" strokeWidth="2" />

        {!isScared && (
          <g clipPath="url(#circleViewIko)">
            
            {/* კისერი */}
            <path d="M40 70 L 40 95 L 60 95 L 60 70 Z" fill="#c28e73" />

            {/* სიცარიელის ამომავსებელი */}
            <path d="M38 85 L 62 85 L 50 100 Z" fill="#FFFFFF" />

            {/* ყურები */}
            <path d="M31 44 Q 26 48 32 56" fill="#d4a085" /> 
            <path d="M69 44 Q 74 48 68 56" fill="#d4a085" />

            {/* თავის ფორმა */}
            <path 
              d="M31 45 C 31 22 36 20 50 20 C 64 20 69 22 69 45 C 69 65 62 80 50 80 C 38 80 31 65 31 45 Z" 
              fill="url(#faceGradientIko)" 
            />

            {/* თმა */}
            <path 
              d="M31 45 L31 38 Q32 20 45 15 Q50 13 55 15 Q68 20 69 38 L69 45 Q66 40 64 34 Q50 30 36 34 Q34 40 31 45 Z" 
              fill="url(#hairGradientIko)" 
            />
            
            {/* თმის ტექსტურა */}
            <path d="M42 18 Q45 25 44 32" stroke="#1a0f0a" strokeWidth="0.8" fill="none" opacity="0.3" />
            <path d="M50 16 Q52 24 50 31" stroke="#1a0f0a" strokeWidth="0.8" fill="none" opacity="0.3" />
            <path d="M58 18 Q56 25 57 32" stroke="#1a0f0a" strokeWidth="0.8" fill="none" opacity="0.3" />
          
            {/* ტანსაცმელი */}
            <path d="M10 90 Q 50 105 90 90 V 110 H 10 V 90 Z" fill="#111111" />
            <path d="M40 85 L 50 95 L 60 85 V 110 H 40 V 85 Z" fill="#FFFFFF" />
            <path d="M44 86 L 50 89 L 56 86 L 56 92 L 50 89 L 44 92 V 86 Z" fill="#000000" />
            <circle cx="50" cy="89" r="1.5" fill="#000000" />

            {/* სახის დეტალები */}
            <circle cx="41" cy="48" r="2.2" fill="#1a1a1a" />
            <circle cx="59" cy="48" r="2.2" fill="#1a1a1a" />
            <path d="M35 42 Q 40 40 45 42" stroke="#1a0f0a" strokeWidth="2" fill="none" />
            <path d="M55 42 Q 60 40 65 42" stroke="#1a0f0a" strokeWidth="2" fill="none" />
            <path d="M50 48 V 56 L 48 58 H 52" fill="#bf8a70" opacity="0.5" />
            <path d="M47 58 Q 50 61 53 58" stroke="#8d6e63" strokeWidth="1" fill="none" />

            {/*  წვერი და ულვაში*/}
           <path 
              d="M33 60 Q 50 64 67 60 C 67 74 62 85 50 85 C 38 85 33 74 33 60 Z" 
              fill="url(#hairGradientIko)" 
            />
            {/* ულვაში */}
            <path d="M38 62 Q 50 65 62 62" stroke="#1a0f0a" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* პირი და ტუჩები */}
            <path d="M44 65 Q 50 66 56 65" stroke="#d4a085" strokeWidth="1.5" fill="none" />
            <path d="M44 66 Q 50 67 56 66" stroke="#3e2723" strokeWidth="1" fill="none" />
            <path d="M45 67 Q 50 69 55 67" stroke="#e57373" strokeWidth="1.5" fill="none" opacity="0.6" />
            
            {/* ტუჩის ქვედა წვერი */}
            <path d="M49 70 L 50 71 L 51 70" fill="#1a0f0a" opacity="0.8" />

          </g>
        )}

        {isScared && (
            <g>
               <circle cx="35" cy="45" r="5" fill="white" />
               <circle cx="65" cy="45" r="5" fill="white" />
               <circle cx="35" cy="45" r="2" fill="blue" />
               <circle cx="65" cy="45" r="2" fill="blue" />
               <path d="M35 65 Q 50 55 65 65" stroke="white" strokeWidth="2" fill="none" />
               <path d="M30 65 L 35 60 L 40 65 L 45 60 L 50 65 L 55 60 L 60 65 L 65 60 L 70 65" stroke="white" strokeWidth="1" fill="none" />
            </g>
        )}
      </svg>
    </div>
  );
};