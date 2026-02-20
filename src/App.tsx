import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider'; 
import { GameProvider } from './context/GameProvider';   
import { Header } from './components/layout/Header';
import { Loader } from './components/UI/Loader'; 
const GamePage = lazy(() => import('./pages/GamePage').then(m => ({ default: m.GamePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const GhostShowcase = lazy(() => import('./pages/Showcases/GhostShowcase').then(m => ({ default: m.GhostShowcase })));
const FoodShowcase = lazy(() => import('./pages/Showcases/FoodShowcase').then(m => ({ default: m.FoodShowcase })));
const PacmanShowcase = lazy(() => import('./pages/Showcases/PacmanShowcase').then(m => ({ default: m.PacmanShowcase })));

function App() {
  return (
    <ThemeProvider>
      <GameProvider> 
        <BrowserRouter>
          <div className="min-h-screen bg-bg-main text-text-main font-poppins transition-colors duration-300">
            <Header />
            <main className="w-full pt-[calc(4rem+env(safe-area-inset-top))]">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<GamePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/ghost-lab" element={<GhostShowcase />} />
                  <Route path="/food-lab" element={<FoodShowcase />} />
                  <Route path="/pacman-lab" element={<PacmanShowcase />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;