import { useRef, useEffect, useCallback } from 'react';

export const useGameTimers = () => {
  const powerModeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bonusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waveTimerRef = useRef<number>(0);

  const clearPowerTimers = useCallback(() => {
    if (powerModeTimerRef.current) clearTimeout(powerModeTimerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
  }, []);

  const clearBonusTimer = useCallback(() => {
    if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
  }, []);

  const clearAllTimers = useCallback(() => {
    clearPowerTimers();
    clearBonusTimer();
  }, [clearPowerTimers, clearBonusTimer]);

  const resetWaveTimer = useCallback(() => {
    waveTimerRef.current = 0;
  }, []);

  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return {
    powerModeTimerRef,
    flashTimerRef,
    bonusTimerRef,
    waveTimerRef,
    clearPowerTimers,
    clearBonusTimer,
    clearAllTimers,
    resetWaveTimer
  };
};