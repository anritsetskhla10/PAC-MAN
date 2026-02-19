import useSound from 'use-sound';
import { useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useGameAudio = () => {
  const { settings } = useTheme();
  const { masterMuted, sfxVolume, musicVolume } = settings.audio;

  const effectiveMusicVol = masterMuted ? 0 : musicVolume;
  const effectiveSfxVol = masterMuted ? 0 : sfxVolume;


  const isLabadze = settings.gameTheme === 'labadze';

  const introSrc = isLabadze ? '/sounds/kacebi/labadze_intro.mp3' : '/sounds/intro.mp3';
  const levelUpSrc = isLabadze ? '/sounds/kacebi/labadze_level_up.mp3' : '/sounds/level_up.mp3';
  const chompSrc = isLabadze ? '/sounds/kacebi/labadze_chomp.mp3' : '/sounds/chomp.mp3';
  const deathSrc = isLabadze ? '/sounds/kacebi/labadze_death.mp3' : '/sounds/death.wav';
  const eatGhostSrc = isLabadze ? '/sounds/kacebi/labadze_eat_ghost.mp3' : '/sounds/eat_ghost.wav';
  const extraLifeSrc = isLabadze ? '/sounds/extra_life.wav' : '/sounds/extra_life.wav';
  const fruitSrc = isLabadze ? '/sounds/kacebi/labadze_eat_fruit.mp3' : '/sounds/eat_fruit.wav';
  const powerPelletSrc = isLabadze ? '/sounds/kacebi/labadze_power_pellet.mp3' : '/sounds/chomp.mp3';

  const [playIntroRaw, { stop: stopIntro }] = useSound(introSrc, { 
    volume: effectiveMusicVol
  });

  const [playLevelUp] = useSound(levelUpSrc, { 
    volume: effectiveMusicVol * 0.8, 
  });

  const [playChomp] = useSound(chompSrc, { 
    volume: effectiveSfxVol * 1, 
    interrupt: true,
  });
  
  const [playDeath] = useSound(deathSrc, { 
    volume: effectiveSfxVol * 0.6 
  });
  
  const [playEatGhost] = useSound(eatGhostSrc, { 
    volume: effectiveSfxVol * 0.6 
  });
  
  const [playExtraLife] = useSound(extraLifeSrc, { 
    volume: effectiveSfxVol * 0.7 
  });

  const [playFruit] = useSound(fruitSrc, { 
    volume: effectiveSfxVol * 0.6 
  });

  const [playPowerPellet] = useSound(powerPelletSrc, { 
    volume: effectiveSfxVol * 0.8,
    interrupt: true,
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
    playLevelUp,
    playChomp,
    playDeath,
    playEatGhost,
    playExtraLife,
    playFruit,
    playPowerPellet,
  };
};