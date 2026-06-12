import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameOverlay } from '../components/UI/GameOverlay';
import * as GameContext from '../context/GameContext';

// Mock Translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const metricsSpy = vi.spyOn(GameContext, 'useGameMetrics');
const sessionSpy = vi.spyOn(GameContext, 'useGameSession');
const actionsSpy = vi.spyOn(GameContext, 'useGameActions');

const mockGame = (overrides: Record<string, unknown> = {}) => {
  const game = {
    gameStatus: 'idle',
    score: 0,
    level: 1,
    elapsedTime: 0,
    startGame: vi.fn(),
    startRound: vi.fn(),
    resumeGame: vi.fn(),
    restartGame: vi.fn(),
    nextLevel: vi.fn(),
    movePlayer: vi.fn(),
    pauseGame: vi.fn(),
    ...overrides,
  } as Record<string, unknown>;

  metricsSpy.mockReturnValue({ score: game.score, lives: 3, remainingFood: 0, elapsedTime: game.elapsedTime } as ReturnType<typeof GameContext.useGameMetrics>);
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

  return game;
};

describe('GameOverlay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display START GAME button when gameStatus is "idle"', () => {
    const startGameMock = vi.fn();

    mockGame({ gameStatus: 'idle', score: 0, level: 1, elapsedTime: 0, startGame: startGameMock });

    render(<GameOverlay />);
    
    const startButton = screen.getByText('game.start_btn');
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);
    expect(startGameMock).toHaveBeenCalled();
  });

  it('should display GAME OVER screen with score and time', () => {
    const restartGameMock = vi.fn();

    mockGame({ gameStatus: 'gameover', score: 1500, level: 5, elapsedTime: 125, restartGame: restartGameMock });

    render(<GameOverlay />);

    expect(screen.getByText('game.game_over')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('02:05')).toBeInTheDocument();
    
    const retryBtn = screen.getByText('game.try_again');
    fireEvent.click(retryBtn);
    expect(restartGameMock).toHaveBeenCalled();
  });

  it('should display VICTORY screen (won status)', () => {
    const nextLevelMock = vi.fn();

    mockGame({ gameStatus: 'won', score: 3000, elapsedTime: 60, nextLevel: nextLevelMock });

    render(<GameOverlay />);

    expect(screen.getByText('game.level_cleared')).toBeInTheDocument();
    
    const nextBtn = screen.getByText('game.next_level');
    fireEvent.click(nextBtn);
    expect(nextLevelMock).toHaveBeenCalled();
  });

  it('should return null (no overlay) when gameStatus is "playing"', () => {
    mockGame({ gameStatus: 'playing' });
    const { container } = render(<GameOverlay />);
    expect(container).toBeEmptyDOMElement();
  });
});