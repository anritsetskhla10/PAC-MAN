import { useState, useEffect } from 'react';
import { debounce } from '../utils/debounce'; 

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      const check = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(check);
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};