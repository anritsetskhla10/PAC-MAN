import { describe, it, expect } from 'vitest';
import { formatTime } from '../utils/formatTime'; 

describe('formatTime Utility', () => {
  it('should format 0 seconds as "00:00"', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('should format single digit seconds correctly (e.g., 9s -> "00:09")', () => {
    expect(formatTime(9)).toBe('00:09');
  });

  it('should format double digit seconds correctly (e.g., 45s -> "00:45")', () => {
    expect(formatTime(45)).toBe('00:45');
  });

  it('should format minutes correctly (e.g., 65s -> "01:05")', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('should handle large times correctly (e.g., 3600s -> "60:00")', () => {
    expect(formatTime(3600)).toBe('60:00');
  });
});