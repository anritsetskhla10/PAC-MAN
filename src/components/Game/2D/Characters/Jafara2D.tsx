
interface JafaraProps {
  size?: number;
  isScared?: boolean;
}

export const Jafara2D = ({ size = 100, isScared }: JafaraProps) => {
  // ნარინჯისფერი ფონი (Jafara Theme)
  const bgColor = isScared ? '#1a1a2e' : '#F28C28';

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="circleClipJafara">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          
          {/* სახის კანის ტონი */}
          <radialGradient id="skinGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#e8b99a" />
            <stop offset="100%" stopColor="#d19a78" />
          </radialGradient>

          {/* პიჯაკის გრადიენტი */}
          <linearGradient id="suitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e2445" />
            <stop offset="100%" stopColor="#101428" />
          </linearGradient>
        </defs>

        {/* ნარინჯისფერი ჩარჩო/ფონი */}
        <circle cx="50" cy="50" r="48" fill={bgColor} stroke="#2d2d2d" strokeWidth="1" />

        {!isScared && (
          <g clipPath="url(#circleClipJafara)">
            
            {/* პიჯაკი (Suit) */}
            <path d="M10 90 Q 50 75 90 90 L 100 110 L 0 110 Z" fill="url(#suitGradient)" />
            
            {/* პერანგი (Shirt) */}
            <path d="M38 82 L 50 98 L 62 82 L 50 110 Z" fill="#FFFFFF" />
            
            {/* ჰალსტუხი (Tie) */}
            <path d="M47 90 L 50 94 L 53 90 L 53 110 L 47 110 Z" fill="#1a1a1a" />
            <path d="M47 88 L 53 88 L 52 92 L 48 92 Z" fill="#1a1a1a" />

            {/* კისერი */}
            <path d="M42 75 L 42 85 Q 50 90 58 85 L 58 75 Z" fill="#c28e73" />

            {/* თავის ფორმა (უფრო მასიური) */}
            <path 
              d="M32 40 C 32 15 38 12 50 12 C 62 12 68 15 68 40 C 68 65 62 82 50 82 C 38 82 32 65 32 40 Z" 
              fill="url(#skinGradient)" 
            />

            {/* თმა (მოკლე, კლასიკური) */}
            <path 
              d="M32 35 Q 32 12 50 12 Q 68 12 68 35 L 68 40 Q 50 32 32 40 Z" 
              fill="#261a12" 
            />
            
            {/* წვერი (Jafara's Signature Beard) */}
            <path 
              d="M32 50 Q 32 85 50 85 Q 68 85 68 50 Q 50 55 32 50 Z" 
              fill="#261a12" 
            />

            {/* ულვაში */}
            <path 
              d="M38 58 Q 50 65 62 58 Q 50 60 38 58" 
              fill="#1a110a" 
            />

            {/* თვალები */}
            <circle cx="42" cy="45" r="2.2" fill="#1a1a1a" />
            <circle cx="58" cy="45" r="2.2" fill="#1a1a1a" />

            {/* წარბები (უფრო მკვეთრი) */}
            <path d="M36 40 Q 42 37 46 39" stroke="#1a110a" strokeWidth="2" fill="none" />
            <path d="M54 39 Q 58 37 64 40" stroke="#1a110a" strokeWidth="2" fill="none" />

            {/* ცხვირი */}
            <path d="M48 58 Q 50 62 52 58" stroke="#8d6e63" strokeWidth="1" fill="none" />

          </g>
        )}

        {isScared && (
          <g clipPath="url(#circleClipJafara)">
             {/* "შეშინებული" ვერსია პიჯაკში */}
             <path d="M10 90 Q 50 75 90 90 L 100 110 L 0 110 Z" fill="#111" />
             <circle cx="35" cy="45" r="6" fill="white" />
             <circle cx="65" cy="45" r="6" fill="white" />
             <circle cx="35" cy="45" r="2" fill="#2121DE" />
             <circle cx="65" cy="45" r="2" fill="#2121DE" />
             <path d="M40 70 Q 50 60 60 70" stroke="white" strokeWidth="2" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};