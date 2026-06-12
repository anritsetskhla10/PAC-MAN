import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { GamePage } from '../pages/GamePage'; 
import * as GameContext from '../context/GameContext';
import * as ThemeContext from '../context/ThemeContext';

type GameOverrides = Record<string, unknown>;
type ThemeContextType = ReturnType<typeof ThemeContext.useTheme>;

vi.mock('../components/Game/3D/Board3D', () => ({
  Board3D: () => <div data-testid="mock-board-3d">3D Board Placeholder</div>
}));

vi.mock('../components/Game/2D/Board', () => ({
  Board: () => <div data-testid="mock-board-2d">2D Board Placeholder</div>
}));

vi.mock('../components/MobileControls', () => ({
  MobileControls: () => <div data-testid="mobile-controls">Controls</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const metricsSpy = vi.spyOn(GameContext, 'useGameMetrics');
const sessionSpy = vi.spyOn(GameContext, 'useGameSession');
const actionsSpy = vi.spyOn(GameContext, 'useGameActions');
const refsSpy = vi.spyOn(GameContext, 'useGameRefs');
const useThemeSpy = vi.spyOn(ThemeContext, 'useTheme');

describe('GamePage UI (Sidebar & HUD)', () => {

  const setupMocks = (gameOverrides: GameOverrides = {}, themeOverrides: Partial<ThemeContextType['settings']> = {}) => {
    const game = {
      score: 5000,
      level: 3,
      lives: 3,
      elapsedTime: 75,
      gameStatus: 'playing',
      remainingFood: 10,
      pauseGame: vi.fn(),
      resumeGame: vi.fn(),
      startGame: vi.fn(),
      restartGame: vi.fn(),
      nextLevel: vi.fn(),
      movePlayer: vi.fn(),
      startRound: vi.fn(),
      ...gameOverrides,
    } as Record<string, unknown>;

    metricsSpy.mockReturnValue({ score: game.score, lives: game.lives, remainingFood: game.remainingFood, elapsedTime: game.elapsedTime } as ReturnType<typeof GameContext.useGameMetrics>);
    sessionSpy.mockReturnValue({ gameStatus: game.gameStatus, level: game.level } as ReturnType<typeof GameContext.useGameSession>);
    actionsSpy.mockReturnValue({
      movePlayer: game.movePlayer,
      startGame: game.startGame,
      startRound: game.startRound,
      pauseGame: game.pauseGame,
      resumeGame: game.resumeGame,
      restartGame: game.restartGame,
      nextLevel: game.nextLevel,
    } as ReturnType<typeof GameContext.useGameActions>);

    refsSpy.mockReturnValue({
      playerPosRef: { current: { x: 1, z: 1 } },
      ghostsPosRef: { current: [] },
      layoutRef: { current: [[1]] },
      subscribeToPositions: () => () => {},
    } as unknown as ReturnType<typeof GameContext.useGameRefs>);

    useThemeSpy.mockReturnValue({
      settings: {
        is3DMode: false,
        gameTheme: 'classic',
        wallColor: '#1e3a8a',
        foodColor: '#fef08a',
        gameBg: '#000000',
        isDarkMode: true,
        isSpectatorMode: false,
        ghostVariant: 1,
        ghostColor: '#FF0000',
        difficulty: 'MEDIUM',
        playerModel: 'classic',
        audio: {
          masterMuted: false,
          musicVolume: 0.5,
          sfxVolume: 1.0,
        },
        ...themeOverrides,
      },
      updateSetting: vi.fn(),
      resetTheme: vi.fn(),
    } as unknown as ThemeContextType);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correct Score, Level, and formatted Time', () => {
    setupMocks({
      score: 5000,
      level: 3,
      elapsedTime: 75, 
    });

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );

    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); 
    expect(screen.getByText('01:15')).toBeInTheDocument(); 
  });

  it('should render correct number of Lives (active vs inactive)', () => {
    setupMocks({ lives: 2 }); 

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );

    expect(screen.getByText('game.lives')).toBeInTheDocument();
  });

  it('should toggle between 2D and 3D modes based on settings', async () => {
    setupMocks({}, { is3DMode: true });
    const { unmount } = render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
    // Board3D is lazy-loaded behind Suspense, so resolve it asynchronously.
    expect(await screen.findByTestId('mock-board-3d')).toBeInTheDocument();
    unmount();

    setupMocks({}, { is3DMode: false });
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('mock-board-2d')).toBeInTheDocument();
  });

  it('should call pauseGame when pause button is clicked', () => {
    const pauseGameMock = vi.fn();
    setupMocks({ gameStatus: 'playing', pauseGame: pauseGameMock });

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
    
    const pauseButton = screen.getByText('⏸');
    fireEvent.click(pauseButton);
    expect(pauseGameMock).toHaveBeenCalled();
  });
});