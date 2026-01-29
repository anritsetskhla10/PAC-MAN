import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider'; 
import { GameProvider } from './context/GameProvider';   
import { Header } from './components/layout/Header';
import { GamePage } from './pages/GamePage';
import { SettingsPage } from './pages/SettingsPage';
import { GhostShowcase } from './pages/Showcases/GhostShowcase';
import { FoodShowcase } from './pages/Showcases/FoodShowcase'; 
import { PacmanShowcase } from './pages/Showcases/PacmanShowcase';

function App() {
  return (
    <ThemeProvider>
      <GameProvider> 
        <BrowserRouter>
          <div className="min-h-screen bg-bg-main text-text-main font-poppins transition-colors duration-300">
            <Header />
            <main className="w-full pt-[calc(4rem+env(safe-area-inset-top))]">
              <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/ghost-lab" element={<GhostShowcase />} />
                <Route path="/food-lab" element={<FoodShowcase />} />
                <Route path="/pacman-lab" element={<PacmanShowcase />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;