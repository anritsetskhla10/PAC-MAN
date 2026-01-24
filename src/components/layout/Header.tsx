import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useTheme();
  const isDark = settings.isDarkMode;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-medium transition-colors hover:text-primary py-2 md:py-0 ${
      isActive ? 'text-primary font-bold' : isDark ? 'text-gray-400' : 'text-gray-600'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) => 
    `text-xl font-medium transition-colors hover:text-primary py-2 ${
      isActive ? 'text-primary font-bold' : 'text-gray-200'
    }`;

  return (
    <>
      {/* HEADER BAR */}
      <header 
        className={`w-full h-16 border-b backdrop-blur-md flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-100 transition-colors duration-300
        ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/90 border-gray-200'}`}
      >
        
        {/* Logo */}
        <div className="text-xl font-bold text-primary tracking-wide z-101 flex items-center gap-2">
          <span>PAC-MAN</span>
          <span className="text-xs bg-primary text-black px-1.5 py-0.5 rounded font-bold">LAB</span>
        </div>

        {/* Desktop Nav (Hidden on Mobile)*/}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks linkClass={desktopLinkClass} onClick={() => {}} />
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden z-101 p-2 text-primary focus:outline-none relative"
          aria-label="Toggle Menu"
        >
          <div className="w-6 flex flex-col items-end gap-1.5">
            <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`} />
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-90 transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
         <div className="flex flex-col items-center gap-6 text-center">
            <NavLinks linkClass={mobileLinkClass} onClick={closeMenu} />
         </div>
      </div>
    </>
  );
};

const NavLinks = ({ linkClass, onClick }: { linkClass: (state: { isActive: boolean }) => string, onClick: () => void }) => (
  <>
    <NavLink to="/" onClick={onClick} className={linkClass}>Game</NavLink>
    <NavLink to="/ghost-lab" onClick={onClick} className={linkClass}>Ghost Lab</NavLink>
    <NavLink to="/pacman-lab" onClick={onClick} className={linkClass}>Pacman Lab</NavLink>
    <NavLink to="/food-lab" onClick={onClick} className={linkClass}>Food Lab</NavLink>
    <NavLink to="/settings" onClick={onClick} className={linkClass}>Settings</NavLink>
  </>
);