interface Mchadi2DProps {
  size: number;
}

export const Mchadi2D = ({ size }: Mchadi2DProps) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          {/*  ძირითადი ფერი */}
          <radialGradient id="realMchadiGradient" cx="50%" cy="50%" r="55%" fx="50%" fy="50%">
            <stop offset="40%" stopColor="#FDD835" />  
            <stop offset="80%" stopColor="#FBC02D" />  
            <stop offset="100%" stopColor="#E65100" /> 
          </radialGradient>

          {/* ტექსტურა*/}
          <filter id="grainyTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.4  0 0 0 0 0.2  0 0 0 0.3 0" />
            <feComposite operator="in" in2="SourceGraphic" result="composite" />
            <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
          </filter>

          {/* ბუნდოვანება ჩამწვარი ლაქებისთვის */}
          <filter id="charBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>

        {/* დაჯგუფება და როტაცია */}
        <g transform="rotate(-35 50 50)">
            
            {/* ძირითადი ფორმა: არასწორი ოვალი ) */}
            <path 
              d="
                M 10,50 
                C 10,25 35,18 50,18 
                C 75,18 95,30 95,50 
                C 95,75 70,82 50,82 
                C 30,82 10,70 10,50 
                Z
              " 
              fill="url(#realMchadiGradient)" 
              stroke="#BF360C" 
              strokeWidth="0.5"
              strokeOpacity="0.4"
              filter="url(#grainyTexture)" 
            />

            {/* ჩამწვარი ლაქები  */}
            <g fill="#3E2723" opacity="0.6" filter="url(#charBlur)" style={{ mixBlendMode: 'multiply' }}>
               {/* დიდი ლაქა ცენტრში/მარცხნივ */}
               <path d="M 35,45 Q 45,40 50,50 Q 45,60 35,55 Z" />
               
               {/* პატარა ლაქები */}
               <circle cx="70" cy="40" r="4" />
               <circle cx="60" cy="65" r="3" />
               <ellipse cx="25" cy="50" rx="4" ry="6" />
               <circle cx="80" cy="55" r="2.5" />
            </g>

            {/* ბზარები */}
            <path d="M 12,50 Q 20,50 25,52" stroke="#E65100" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 93,50 Q 85,50 80,48" stroke="#E65100" strokeWidth="0.5" fill="none" opacity="0.5" />
            <path d="M 50,82 Q 50,75 52,70" stroke="#E65100" strokeWidth="0.5" fill="none" opacity="0.3" />

        </g>
      </svg>
    </div>
  );
};