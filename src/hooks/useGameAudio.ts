import useSound from 'use-sound';
import { useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useGameAudio = () => {
  const { settings } = useTheme();
  const { masterMuted, sfxVolume, musicVolume } = settings.audio;

  const effectiveMusicVol = masterMuted ? 0 : musicVolume;
  const effectiveSfxVol = masterMuted ? 0 : sfxVolume;

  const [playIntroRaw, { stop: stopIntro }] = useSound('/sounds/intro.mp3', { 
    volume: effectiveMusicVol
  });

  const [playLevelUp] = useSound('/sounds/level_up.mp3', { 
    volume: effectiveMusicVol * 0.8, 
  });

  const [playChomp] = useSound('/sounds/chomp.mp3', { 
    volume: effectiveSfxVol * 1, 
    interrupt: true,
  });
  
  const [playDeath] = useSound('/sounds/death.wav', { 
    volume: effectiveSfxVol * 0.6 
  });
  
  const [playEatGhost] = useSound('/sounds/eat_ghost.wav', { 
    volume: effectiveSfxVol * 0.6 
  });
  
  const [playExtraLife] = useSound('/sounds/extra_life.wav', { 
    volume: effectiveSfxVol * 0.7 
  });

  const [playFruit] = useSound('/sounds/eat_fruit.wav', { 
    volume: effectiveSfxVol * 0.6 
  });

  const playIntro = useCallback(() => {
    if (effectiveMusicVol > 0) {
      stopIntro();
      playIntroRaw();
    }
  }, [effectiveMusicVol, playIntroRaw, stopIntro]);

  useEffect(() => {
    if (effectiveMusicVol === 0) {
        stopIntro();
    }
  }, [effectiveMusicVol, stopIntro]);

  return {
    playIntro,
    stopIntro,
    playChomp: effectiveSfxVol > 0 ? playChomp : () => {},
    playDeath: effectiveSfxVol > 0 ? playDeath : () => {},
    playEatGhost: effectiveSfxVol > 0 ? playEatGhost : () => {},
    playExtraLife: effectiveSfxVol > 0 ? playExtraLife : () => {},
    playFruit: effectiveSfxVol > 0 ? playFruit : () => {},
    playLevelUp: effectiveMusicVol > 0 ? playLevelUp : () => {}, 
  };
};