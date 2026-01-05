import { Board } from './components/Game/Board';
import { SettingsPanel } from './components/SettingsPanel';
import { ThemeProvider } from './context/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-main text-text-main font-poppins transition-colors duration-300 flex flex-col items-center justify-center gap-8 p-4">
        
        <h1 className="text-3xl font-bold text-primary">Pac-Man</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <Board />
          <SettingsPanel />
        </div>

      </div>
    </ThemeProvider>
  );
}

export default App;