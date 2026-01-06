import { NavLink } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="w-full h-16 border-b border-border-color bg-card-bg/80 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 z-50">
      
      <div className="text-xl font-bold text-primary tracking-wide">
        PAC-MAN
      </div>

      <nav className="flex items-center gap-6">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-text-muted'}`
          }
        >
          Game
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-text-muted'}`
          }
        >
          Settings
        </NavLink>
      </nav>
    </header>
  );
};