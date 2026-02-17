interface Strawberry2DProps {
  size: number;
}

export const Strawberry2D = ({ size }: Strawberry2DProps) => {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        {/* მარწყვის ტანი */}
        <path d="M50 95 C 20 70, 5 50, 15 30 C 20 20, 35 20, 50 35 C 65 20, 80 20, 85 30 C 95 50, 80 70, 50 95 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
        
        {/* კურკები */}
        <circle cx="30" cy="40" r="1.5" fill="#fef08a" /><circle cx="45" cy="45" r="1.5" fill="#fef08a" /><circle cx="70" cy="40" r="1.5" fill="#fef08a" />
        <circle cx="25" cy="55" r="1.5" fill="#fef08a" /><circle cx="50" cy="65" r="1.5" fill="#fef08a" /><circle cx="75" cy="55" r="1.5" fill="#fef08a" />
        <circle cx="40" cy="80" r="1.5" fill="#fef08a" /><circle cx="60" cy="80" r="1.5" fill="#fef08a" />
        
        {/* ფოთლები */}
        <path d="M50 35 L 40 20 L 25 25 L 35 35 L 50 35 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 35 L 60 20 L 75 25 L 65 35 L 50 35 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 35 L 50 15 L 45 25 L 55 25 L 50 15 Z" fill="#22c55e" />
      </svg>
    </div>
  );
};