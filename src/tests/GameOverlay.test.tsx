import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameOverlay } from '../components/GameOverlay';
import * as GameContext from '../context/GameContext';

type GameContextType = ReturnType<typeof GameContext.useGame>;

// Mock Translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const useGameSpy = vi.spyOn(GameContext, 'useGame');

describe('GameOverlay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display START GAME button when gameStatus is "idle"', () => {
    const startGameMock = vi.fn();
    
    useGameSpy.mockReturnValue({
      gameStatus: 'idle',
      score: 0,
      level: 1,
      elapsedTime: 0,
      startGame: startGameMock,
    } as unknown as GameContextType); 

    render(<GameOverlay />);
    
    const startButton = screen.getByText('game.start_btn');
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);
    expect(startGameMock).toHaveBeenCalled();
  });

  it('should display GAME OVER screen with score and time', () => {
    const restartGameMock = vi.fn();

    useGameSpy.mockReturnValue({
      gameStatus: 'gameover',
      score: 1500,
      level: 5,
      elapsedTime: 125,
      restartGame: restartGameMock,
    } as unknown as GameContextType); 

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

    useGameSpy.mockReturnValue({
      gameStatus: 'won',
      score: 3000,
      elapsedTime: 60,
      nextLevel: nextLevelMock,
    } as unknown as GameContextType); 

    render(<GameOverlay />);

    expect(screen.getByText('game.level_cleared')).toBeInTheDocument();
    
    const nextBtn = screen.getByText('game.next_level');
    fireEvent.click(nextBtn);
    expect(nextLevelMock).toHaveBeenCalled();
  });

  it('should return null (no overlay) when gameStatus is "playing"', () => {
    useGameSpy.mockReturnValue({
      gameStatus: 'playing',
    } as unknown as GameContextType); 
    const { container } = render(<GameOverlay />);
    expect(container).toBeEmptyDOMElement();
  });
});