interface GhostProps {
  size?: number;
  isScared?: boolean;
}

export const Janela2D = ({ size = 100, isScared }: GhostProps) => {
  const bgColor = isScared ? "#2121DE" : "#ec4899";
  const strokeColor = isScared ? "#2121DE" : "#be185d";
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="circleViewJanela">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          <radialGradient id="faceGradientJanela" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
            <stop offset="0%" stopColor="#f5d0b0" />
            <stop offset="100%" stopColor="#d4a085" />
          </radialGradient>
        </defs>

        {/* ფონი */}
        <circle cx="50" cy="50" r="48" fill={bgColor} stroke={strokeColor} strokeWidth="2" />

          <g clipPath="url(#circleViewJanela)">
            
            {/* კისერი */}
            <path d="M38 65 L 38 95 L 62 95 L 62 65 Z" fill="#c28e73" />

            {/* სიცარიელის ამომავსებელი */}
            <path d="M36 85 L 64 85 L 50 100 Z" fill="#FFFFFF" />

            {/* თმები */}
            <path d="M31 40 Q 29 48 30 58 L 33 58 Q 34 48 31 40 Z" fill="#5d4037" opacity="0.8" />
            <path d="M69 40 Q 71 48 70 58 L 67 58 Q 66 48 69 40 Z" fill="#5d4037" opacity="0.8" />

            {/*თავის ფორმა */}
            <path 
              d="M30 45 C 30 22 35 15 50 15 C 65 15 70 22 70 42 C 70 62 62 78 50 78 C 38 78 30 62 30 42 Z" 
              fill="url(#faceGradientJanela)" 
            />
            {/* ტანსაცმელი: პიჯაკი და პერანგი */}
            <path d="M10 88 Q 50 100 90 88 V 110 H 10 Z" fill="#111111" />
            <path d="M38 85 L 50 95 L 62 85 V 110 H 38 Z" fill="#FFFFFF" />
            
            {/* ბაფთა  */}
            <path d="M42 87 L 50 90 L 58 87 L 58 93 L 50 90 L 42 93 Z" fill="#000000" />
            <circle cx="50" cy="90" r="1.5" fill="#000000" />

            {/* სახის დეტალები */}
            <circle cx="41" cy="46" r="2" fill="#1a1a1a" />
            <circle cx="59" cy="46" r="2" fill="#1a1a1a" />
            
            <path d="M36 50 Q 40 52 44 50" stroke="#bcaaa4" strokeWidth="0.5" fill="none" />
            <path d="M56 50 Q 60 52 64 50" stroke="#bcaaa4" strokeWidth="0.5" fill="none" />

            <path d="M36 42 Q 40 39 45 41" stroke="#5d4037" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M55 41 Q 60 39 64 42" stroke="#5d4037" strokeWidth="1.2" fill="none" opacity="0.8" />

            <path d="M47 56 Q 50 60 53 56" stroke="#b37e66" strokeWidth="1.5" fill="none" />
            <path d="M50 46 V 55" stroke="#b37e66" strokeWidth="0.5" fill="none" opacity="0.5" />

            {/* წვერი */}
            <path 
              d="M32 60 Q 50 62 68 60 C 68 70 60 76 50 79 C 40 76 32 70 32 60 Z" 
              fill="#6d4c41" 
              opacity="0.5" 
            />
            
            <path 
              d="M38 63 Q 50 65 62 63" 
              stroke="#3e2723" 
              strokeWidth="1.5" 
              fill="none" 
              strokeLinecap="round"
            />

          </g>
      </svg>
    </div>
  );
};