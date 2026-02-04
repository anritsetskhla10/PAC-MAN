import useSound from 'use-sound';
import { useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useGameAudio = () => {
  const { settings } = useTheme();
  const { masterMuted, sfxVolume, musicVolume } = settings.audio;

  //  Music 
  const [playIntroRaw, { stop: stopIntro }] = useSound('/sounds/intro.mp3', { 
    volume: masterMuted ? 0 : musicVolume 
  });

  // Chomp
  const [playChomp] = useSound('/sounds/chomp.mp3', { 
    volume: masterMuted ? 0 : sfxVolume * 0.4, 
    interrupt: true 
  });
  
  // Death
  const [playDeath] = useSound('/sounds/death.wav', { 
    volume: masterMuted ? 0 : sfxVolume * 0.5 
  });
  
  // Eat Ghost
  const [playEatGhost] = useSound('/sounds/eat_ghost.wav', { 
    volume: masterMuted ? 0 : sfxVolume * 0.5 
  });
  
  // Extra Life 
  const [playExtraLife] = useSound('/sounds/extra_life.wav', { 
    volume: masterMuted ? 0 : sfxVolume * 0.6 
  });

  // Eat Fruit
  const [playFruit] = useSound('/sounds/eat_fruit.wav', { 
    volume: masterMuted ? 0 : sfxVolume * 0.6 
  });
  // Level Up 
  const [playLevelUp] = useSound('/sounds/level_up.mp3', { 
    volume: 0.5, 
  });

  const playIntro = useCallback(() => {
    if (!masterMuted && musicVolume > 0) {
      stopIntro();
      playIntroRaw();
    }
  }, [masterMuted, musicVolume, playIntroRaw, stopIntro]);

  useEffect(() => {
    if (masterMuted || musicVolume === 0) {
        stopIntro();
    }
  }, [masterMuted, musicVolume, stopIntro]);

  return {
    playIntro,
    stopIntro,
    playChomp: !masterMuted && sfxVolume > 0 ? playChomp : () => {},
    playDeath: !masterMuted && sfxVolume > 0 ? playDeath : () => {},
    playEatGhost: !masterMuted && sfxVolume > 0 ? playEatGhost : () => {},
    playExtraLife: !masterMuted && sfxVolume > 0 ? playExtraLife : () => {},
    playFruit: !masterMuted && sfxVolume > 0 ? playFruit : () => {},
    playLevelUp: !masterMuted && musicVolume > 0 ? playLevelUp : () => {}, 
  };
};