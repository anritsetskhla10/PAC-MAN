interface Kakaba2DProps {
  size?: number;
  isScared?: boolean; 
}

export const Kakaba2D = ({ size = 100, isScared }: Kakaba2DProps) => {
  const bgColor = isScared ? "#2121DE" : "#ef4444";
  const strokeColor = isScared ? "#2121DE" : "#b91c1c";
  return (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="circleViewKakaba">
        <circle cx="50" cy="50" r="48" />
      </clipPath>
      <radialGradient id="faceGradient" cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
        <stop offset="0%" stopColor="#eec5b3" />
        <stop offset="100%" stopColor="#d4a085" />
      </radialGradient>
    </defs>

    {/* ფონი  */}
    <circle cx="50" cy="50" r="48" fill={bgColor} stroke={strokeColor} strokeWidth="2" />

    <g clipPath="url(#circleViewKakaba)">
      
      {/* კისერი */}
      <path d="M40 70 L 40 95 L 60 95 L 60 70 Z" fill="#c28e73" />

      {/* სიცარიელის ამომავსებელი */}
      <path d="M38 85 L 62 85 L 50 100 Z" fill="#FFFFFF" />

      {/* თავის ფორმა */}
      <path d="M30 45C30 25 35 18 50 18C65 18 70 25 70 45C70 65 62 82 50 82C38 82 30 65 30 45Z" fill="url(#faceGradient)" />

      {/* ტანსაცმელი: თეთრი პერანგი და შავი პიჯაკი */}
      <path d="M10 90 Q 50 105 90 90 V 110 H 10 V 90 Z" fill="#111111" /> 
      
      {/* პერანგი  */}
      <path d="M40 85 L 50 95 L 60 85 V 110 H 40 V 85 Z" fill="#FFFFFF" />
      
      {/* ბაფთა */}
      <path d="M44 86 L 50 89 L 56 86 L 56 92 L 50 89 L 44 92 V 86 Z" fill="#000000" />
      <circle cx="50" cy="89" r="1.5" fill="#000000" />

      {/* სახის დეტალები (ცხვირი, ნაოჭები) */}
      <path d="M47 55C47 55 48 62 50 62C52 62 53 55 53 55" stroke="#b37e66" strokeWidth="1.5" fill="none" />
      <path d="M44 52C42 52 40 53 38 55" stroke="#b37e66" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M56 52C58 52 60 53 62 55" stroke="#b37e66" strokeWidth="0.5" fill="none" opacity="0.5" />

      {/* გაუმჯობესებული პირი */}
      {/* მთავარი ღიმილი */}
      <path d="M44 69 Q50 72 56 69" stroke="#3e2723" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* ქვედა ტუჩის მინიშნება */}
      <path d="M47 72 Q50 73 53 72" stroke="#d4a085" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />

      {/* თვალები */}
      <circle cx="41" cy="48" r="2" fill="#1a1a1a" />
      <circle cx="59" cy="48" r="2" fill="#1a1a1a" />
      
      {/* სათვალე */}
      <g stroke="#222222" strokeWidth="0.8" fill="none">
        <circle cx="41" cy="48" r="9" />
        <circle cx="59" cy="48" r="9" />
        <path d="M50 48Q50 48 50 48" strokeWidth="1" />
        <line x1="50" y1="48" x2="50" y2="48" />
        <path d="M32 48L28 46" strokeWidth="0.6" />
        <path d="M68 48L72 46" strokeWidth="0.6" />
        <path d="M48.5 45C50 44 50 44 51.5 45" strokeWidth="1.2" />
      </g>
    </g>
  </svg>
);
}