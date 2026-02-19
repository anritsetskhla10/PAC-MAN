interface Labadze2DProps {
  size?: number;
}

export const Labadze2D = ({ size = 100 }: Labadze2DProps) => {
  const bgColor = "#FFD700";
  const strokeColor = "#ffbb00";
  const skinGradientId = "skinGradientMassiveForeheadAnimation";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="circleViewLabadzeAnimated">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <radialGradient id={skinGradientId} cx="50%" cy="30%" r="70%" fx="50%" fy="15%">
          <stop offset="0%" stopColor="#f5d0c5" />
          <stop offset="70%" stopColor="#dcb3a3" />
          <stop offset="100%" stopColor="#cfa695" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill={bgColor} stroke={strokeColor} strokeWidth="2" />

      <g clipPath="url(#circleViewLabadzeAnimated)">
        
        {/* შუბლი და თხემი */}
        <path d="M 16 50 C 10 -10, 90 -10, 84 50 C 80 88, 68 96, 50 96 C 32 96, 20 88, 16 50 Z" fill={`url(#${skinGradientId})`} />

        {/* თმის ღინღლები */}
        <g stroke="#9ca3af" strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round">
            <path d="M 17 40 Q 15 38 16 36 M 18 32 Q 15 30 17 28 M 20 25 Q 18 23 20 21 M 23 18 Q 21 15 24 14" />
            <path d="M 83 40 Q 85 38 84 36 M 82 32 Q 85 30 83 28 M 80 25 Q 82 23 80 21 M 77 18 Q 79 15 76 14" />
            <path d="M 30 14 Q 31 11 33 13 M 38 10 Q 39 7 41 9 M 48 8 Q 50 5 52 7 M 58 8 Q 59 5 61 7 M 68 12 Q 69 9 71 11" />
            <path d="M 25 22 Q 26 20 28 21 M 35 17 Q 36 15 38 16 M 45 14 Q 46 12 48 13 M 55 14 Q 56 12 58 13 M 65 17 Q 66 15 68 16 M 75 22 Q 74 20 72 21" opacity="0.4" />
        </g>

        {/* სახის ნაკვთები */}
        <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M 30 48 Q 38 43 46 48" stroke="#4a332a" strokeWidth="3" fill="none" />
            <path d="M 54 48 Q 62 43 70 48" stroke="#4a332a" strokeWidth="3" fill="none" />

            <ellipse cx="38" cy="56" rx="5" ry="3.5" fill="#ffffff" />
            <circle cx="38" cy="56" r="2.2" fill="#6b8e9e" />
            <circle cx="38" cy="56" r="1" fill="#000000" />
            <ellipse cx="62" cy="56" rx="5" ry="3.5" fill="#ffffff" />
            <circle cx="62" cy="56" r="2.2" fill="#6b8e9e" />
            <circle cx="62" cy="56" r="1" fill="#000000" />
            
            <path d="M 33 61 Q 38 65 43 61" stroke="#cfa695" strokeWidth="1.2" fill="none" opacity="0.7"/>
            <path d="M 57 61 Q 62 65 67 61" stroke="#cfa695" strokeWidth="1.2" fill="none" opacity="0.7"/>
            <path d="M 50 51 L 50 72" stroke="#cfa695" strokeWidth="2" fill="none" />
            <path d="M 44 74 Q 50 80 56 74" stroke="#b37e66" strokeWidth="2" fill="none" />
            <path d="M 36 70 Q 30 82 36 90" stroke="#b37e66" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M 64 70 Q 70 82 64 90" stroke="#b37e66" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* ანიმირებული პირი */}
            <g>
              <path d="M 38 84 Q 50 87 62 84" stroke="#8c5e4a" strokeWidth="2.2" fill="none" />
              <ellipse cx="50" cy="85" rx="11" fill="#3e2723">
                <animate
                  attributeName="ry"
                  values="0.5; 7; 0.5"
                  dur="0.25s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
                />
              </ellipse>
            </g>
        </g>

        {/* ტანი */}
        <g transform="translate(0, 94)">
            <path d="M 25 0 Q 50 6 75 0 L 85 20 H 15 Z" fill="#1a1a1a" />
            <path d="M 42 0 L 50 4 L 58 0 V 10 H 42 Z" fill="#FFFFFF" />
            <g fill="#111111">
                <path d="M 50 3 L 44 1 V 5 L 50 3 Z" />
                <path d="M 50 3 L 56 1 V 5 L 50 3 Z" />
                <rect x="48.5" y="2" width="3" height="2" rx="0.5" />
            </g>
        </g>
      </g>
    </svg>
  );
};