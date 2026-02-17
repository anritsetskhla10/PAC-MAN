interface Cherry2DProps {
  size: number;
}

export const Cherry2D = ({ size }: Cherry2DProps) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <path d="M50 15 Q 65 40 75 65" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 15 Q 35 40 25 65" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" />
        
        <circle cx="50" cy="15" r="3" fill="#4d7c0f" />
        
        {/* მარცხენა ალუბალი */}
        <circle cx="25" cy="70" r="18" fill="#dc2626" />
        <ellipse cx="18" cy="65" rx="4" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-20 18 65)" /> 
        
        {/* მარჯვენა ალუბალი */}
        <circle cx="75" cy="70" r="18" fill="#dc2626" />
        <ellipse cx="68" cy="65" rx="4" ry="6" fill="white" fillOpacity="0.4" transform="rotate(-20 68 65)" /> 
        
        {/* ფოთოლი */}
        <path d="M50 15 C 60 5, 75 15, 70 25 C 65 35, 55 25, 50 15" fill="#65a30d"/>
      </svg>
    </div>
  );
};