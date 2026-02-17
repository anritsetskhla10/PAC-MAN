
interface GhostIconProps {
  color: string;
  className?: string;
}

export const GhostIcon = ({ color, className }: GhostIconProps) => {
  return (
    <svg 
      viewBox="0 0 14 14" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- ტანი (თავი + ტალღოვანი ფეხები) --- */}
      <path 
        d="M1,7 L1,13 L3,11 L5,13 L7,11 L9,13 L11,11 L13,13 L13,7 C13,3.686 10.314,1 7,1 C3.686,1 1,3.686 1,7 Z" 
        fill={color} 
      />

      {/* --- მარცხენა თვალი --- */}
      <circle cx="4.5" cy="6" r="2" fill="white" />
      <circle cx="5.5" cy="6" r="1" fill="#0000CC" /> 

      {/* --- მარჯვენა თვალი --- */}
      <circle cx="9.5" cy="6" r="2" fill="white" />
      <circle cx="10.5" cy="6" r="1" fill="#0000CC" /> 
    </svg>
  );
};