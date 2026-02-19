interface Jafara2DProps {
  size?: number;
  isScared?: boolean;
}

export const Jafara2D = ({ size = 100, isScared }: Jafara2DProps) => {
  const bgColor = isScared ? "#2121DE" : "#F28C28";
  const strokeColor = isScared ? "#2121DE" : "#c2410c";
  return (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="circleViewJafara">
        <circle cx="50" cy="50" r="48" />
      </clipPath>
      
      <radialGradient id="faceGradientJafara" cx="50%" cy="35%" r="65%" fx="50%" fy="30%">
        <stop offset="0%" stopColor="#ffe0d0" />
        <stop offset="100%" stopColor="#e8b99a" />
      </radialGradient>

      {/* იშვიათი თმის ეფექტი ზედა ნაწილში */}
      <pattern id="stubblePattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.7" fill="#1a1a1a" opacity="0.4" />
      </pattern>
    </defs>

    {/*ფონი */}
    <circle cx="50" cy="50" r="48" fill={bgColor} stroke={strokeColor} strokeWidth="2" />

    <g clipPath="url(#circleViewJafara)">
      
      {/* კისერი */}
      <path d="M42 75 L 42 95 L 58 95 L 58 75 Z" fill="#d19a78" />

      {/* პერანგის საყელო */}
      <path d="M38 88 L 62 88 L 50 100 Z" fill="#FFFFFF" />

      {/*  თავის ფორმა: მომრგვალებული ქალა და ვიწრო ნიკაპი  */}
      <path 
        d="M25 40 
           C 25 10, 75 10, 75 40 
           C 75 55, 65 85, 50 85 
           C 35 85, 25 55, 25 40 Z" 
        fill="url(#faceGradientJafara)" 
      />

      {/*  ტანსაცმელი  */}
      <path d="M5 92 Q 50 105 95 92 V 110 H 5 V 92 Z" fill="#1a1a1a" /> 
      <path d="M40 88 L 50 98 L 60 88 V 110 H 40 V 88 Z" fill="#FFFFFF" />
      <path d="M44 90 L 50 93 L 56 90 L 56 95 L 50 93 L 44 95 V 90 Z" fill="#000000" />
      <circle cx="50" cy="93" r="1.2" fill="#333333" />

      {/* იშვიათი თმა ქალაზე */}
      <path 
      d="M26 38 C 26 12, 74 12, 74 38 C 74 22, 26 22, 26 38 Z" 
      fill="url(#stubblePattern)" 
    />

      {/* წარბები */}
      <path d="M32 38 Q 40 34 46 37" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M54 37 Q 60 34 68 38" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* თვალები */}
      <circle cx="39" cy="46" r="2.8" fill="#2d1b0e" />
      <circle cx="61" cy="46" r="2.8" fill="#2d1b0e" />

      {/* ცხვირი */}
      <path d="M50 45 Q 48 58 46 60 L 50 63 L 54 60" fill="none" stroke="#d19a78" strokeWidth="1.8" opacity="0.8" />

      {/*  წვერი და ულვაში: ზუსტად მიყვება ვიწრო ნიკაპს  */}
      <g fill="#1a1a1a">
        {/* ულვაში */}
        <path d="M35 60 Q 50 56 65 60 L 67 64 Q 50 61 33 64 Z" 
        transform="translate(0, 5)"
        />
        
        {/* სრული წვერი, რომელიც ვიწროვდება ნიკაპთან */}
        <path d="M28 55 
                 C 28 75, 40 85, 50 85 
                 C 60 85, 72 75, 72 55 
                 L 66 58 
                 C 62 70, 55 75, 50 75 
                 C 45 75, 38 70, 34 58 
                 Z" />
                 
        {/* დამაკავშირებელი ხაზი (Goatee ჩარჩო) */}
        <path d="M35 60 L 37 68 M 65 60 L 63 68" stroke="#1a1a1a" strokeWidth="2.5" />
      </g>

      {/*  პირი და ტუჩები  */}
      <g transform="translate(0, 2)">
        <path d="M43 66 Q 50 67 57 66" stroke="#d19a78" strokeWidth="1.2" fill="none" />
        <path d="M43 67 Q 50 68 57 67" stroke="#3e2723" strokeWidth="1" fill="none" />
        <path d="M44 68 Q 50 71 56 68" stroke="#e57373" strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* ნიკაპის ჩრდილი წვერის ქვეშ */}
        <path d="M49 71 L 50 72 L 51 71" fill="#000" opacity="0.6" />
      </g>

    </g>
  </svg>
);
}