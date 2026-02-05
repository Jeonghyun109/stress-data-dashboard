import type { StressLevel } from '@/types';

/**
 * Utility functions for data processing and calculations
 */

// Number utilities
export const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
};

export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const mean = (numbers: number[]): number => {
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : NaN;
};

export const getRange = (values: number[]): { min: number; max: number } => {
  const cleanValues = values.filter(v => Number.isFinite(v));
  if (!cleanValues.length) return { min: NaN, max: NaN };
  return { 
    min: Math.min(...cleanValues), 
    max: Math.max(...cleanValues) 
  };
};

export const normalize = (value: number, min: number, max: number): number => {
  if (max === min) return NaN;
  return (value - min) / (max - min);
};

export const rawToLevel = (rawValue: number): StressLevel => {
  const level = Math.max(0, Math.min(4, Math.round(rawValue * 4)));
  return level as StressLevel;
};

// Boolean conversion utility
export const booleanToNumber = (value: unknown): 0 | 1 => {
  if (value === true || value === 'True' || value === 'true' || value === 1 || value === '1') {
    return 1;
  }
  return 0;
};

// Time utilities
export const formatTime = (timeString: string): string => {
  // Ensure consistent time formatting
  return timeString.includes(':') ? timeString : `${timeString}:00`;
};

export const parseTimeSlot = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

// Data validation
export const isValidStressLevel = (level: unknown): level is StressLevel => {
  return typeof level === 'number' && level >= 0 && level <= 4 && Number.isInteger(level);
};

export const clampStressLevel = (level: number): StressLevel => {
  return Math.max(0, Math.min(4, Math.round(level))) as StressLevel;
};

// Array utilities
export const removeDuplicates = <T>(array: T[], keySelector?: (item: T) => string | number): T[] => {
  if (!keySelector) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
