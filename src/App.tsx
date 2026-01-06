import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider'; 
import { GameProvider } from './context/GameProvider';   
import { Header } from './components/Header';
import { GamePage } from './pages/GamePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <GameProvider> 
        <BrowserRouter>
          <div className="min-h-screen bg-bg-main text-text-main font-poppins transition-colors duration-300">
            <Header />
            <main className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<GamePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;