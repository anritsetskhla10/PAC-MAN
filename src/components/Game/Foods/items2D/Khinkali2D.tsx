interface Khinkali2DProps {
  size: number;
}

export const Khinkali2D = ({ size }: Khinkali2DProps) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* კუჭი */}
        <path d="M42,20 L58,20 L55,35 L45,35 Z" fill="#F5F5DC" stroke="#D2B48C" strokeWidth="1" />
        
        {/* ტანი */}
        <path 
          d="M50,35 C25,35 15,50 15,65 C15,85 30,90 50,90 C70,90 85,85 85,65 C85,50 75,35 50,35 Z" 
          fill="#F5F5DC" 
          stroke="#D2B48C" 
          strokeWidth="2" 
        />
        
        {/* ნაოჭები */}
        <path d="M50,35 L50,80" stroke="#D2B48C" strokeWidth="1" fill="none" />
        <path d="M40,36 L30,70" stroke="#D2B48C" strokeWidth="1" fill="none" />
        <path d="M60,36 L70,70" stroke="#D2B48C" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};