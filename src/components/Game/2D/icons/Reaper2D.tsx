interface Reaper2DProps {
  size?: number;
  color?: string;
}

export const Reaper2D = ({ size = 100, color = '#ef4444' }: Reaper2DProps) => {
  return (
    <div style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 150 150" 
        className="w-full h-full drop-shadow-lg" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="robeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>

          <linearGradient id="bladeMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(25, 25)">
            
            {/*  ცელის ტარი  */}
            <line 
            x1="20" y1="0"  
            x2="20" y2="100" 
            stroke="#5D4037" 
            strokeWidth="4" 
            strokeLinecap="round" 
            />
            
            {/*  ცელის პირი  */}
            <path 
            d="M 20 5 Q 55 -5 85 20 L 75 25 Q 50 10 22 12 Z" 
            fill="url(#bladeMetal)" 
            stroke="#374151" 
            strokeWidth="1"
            />
            <rect x="18" y="8" width="5" height="6" fill="#4B5563" />


            {/*  სხეული  */}
            <path 
            d="M 55 20 
                C 35 20, 30 45, 35 95 
                L 45 90 L 55 95 L 65 90 L 75 95 
                C 80 50, 85 30, 62 20 Z" 
            fill="url(#robeGradient)" 
            stroke="#000" 
            strokeWidth="1"
            />

            {/* კაპიუშონის შიდა მხარე */}
            <path 
            d="M 40 30 
                C 40 30, 55 20, 70 30 
                C 70 55, 65 65, 55 65 
                C 45 65, 40 55, 40 30 Z" 
            fill="#000000" 
            opacity="0.9"
            />

            {/*  თვალები  */}
            <g filter="url(#eyeGlow)">
            <circle cx="48" cy="45" r="3" fill={color} />
            <circle cx="62" cy="45" r="3" fill={color} />
            </g>


            {/*  ხელი და მკლავი  */}
            <path 
            d="M 40 60 Q 30 60 20 60" 
            stroke="#050505" 
            strokeWidth="6" 
            strokeLinecap="round" 
            />
            <circle cx="20" cy="60" r="4.5" fill="#050505" />
            <path d="M 18 58 L 22 58" stroke="#444" strokeWidth="1" />
            <path d="M 18 60 L 22 60" stroke="#444" strokeWidth="1" />
            <path d="M 18 62 L 22 62" stroke="#444" strokeWidth="1" />
        </g>

      </svg>
    </div>
  );
};