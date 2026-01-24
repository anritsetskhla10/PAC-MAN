import { type ReactNode, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ShowcaseLayoutProps {
  title: string;
  icon?: string;
  sidebarContent: ReactNode; 
  mainContent: ReactNode;    
}

export const ShowcaseLayout = ({ title, icon, sidebarContent, mainContent }: ShowcaseLayoutProps) => {
  const { settings } = useTheme();
  const isDark = settings.isDarkMode;
  const [isPanelOpen, setIsPanelOpen] = useState(true); 

  return (
    <div className={`relative w-full h-[calc(100vh-4rem)] overflow-hidden transition-colors duration-300 
      ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}
    >
      
      {/*  MAIN CONTENT (3D View) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
         {/* Background Gradient */}
         <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            isDark 
            ? 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800 via-black to-black' 
            : 'bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-white'
        }`} />

        <div className="relative w-full h-full">
            {mainContent}
        </div>
      </div>

      {/*  FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`absolute top-4 left-4 z-30 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center
          ${isDark 
            ? 'bg-neutral-800 text-white border border-white/10 hover:bg-neutral-700' 
            : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-100'
          } ${isPanelOpen ? 'opacity-0 pointer-events-none transform -translate-x-full' : 'opacity-100 translate-x-0'}
        `}
        title="Open Settings"
      >
        {/* Settings Icon  */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>

      {/* SLIDING SIDEBAR PANEL */}
      <div className={`absolute top-0 left-0 h-full z-20 transition-transform duration-500 ease-in-out
          ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         {/* Backdrop blur panel container */}
         <div className={`h-full w-80 sm:w-96 flex flex-col p-6 shadow-2xl backdrop-blur-xl border-r
            ${isDark 
              ? 'bg-neutral-900/80 border-white/10 text-white' 
              : 'bg-white/80 border-gray-200 text-gray-900'
            }
         `}>
            {/* Header of Sidebar */}
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-2xl font-bold flex items-center gap-2">
                  {title} <span className="text-2xl animate-pulse">{icon}</span>
               </h1>
               
               {/* Close Button */}
               <button 
                 onClick={() => setIsPanelOpen(false)}
                 className={`p-2 rounded-lg transition-colors ${
                   isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-black'
                 }`}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18"></line>
                     <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {sidebarContent}
            </div>

            {/* Footer / Hint */}
            <div className={`mt-4 pt-4 border-t text-xs text-center
               ${isDark ? 'border-white/10 text-gray-500' : 'border-black/5 text-gray-400'}
            `}>
               Press 'X' to close this panel
            </div>
         </div>
      </div>

    </div>
  );
};