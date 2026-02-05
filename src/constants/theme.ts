import type { StressLevel, StressType, LegendItem } from '@/types';

/**
 * Central constants and theme configuration
 */

// Grid and layout constants
export const GRID_CONSTANTS = {
  SLOTS_COUNT: 30,
  WIDTH_PCT: 100,
} as const;

// Stress color schemes
export const STRESS_COLORS: Record<StressType, Record<StressLevel, string>> = {
  internal: {
    0: 'bg-violet-50',
    1: 'bg-violet-100',
    2: 'bg-violet-200',
    3: 'bg-violet-300',
    4: 'bg-violet-400',
  },
  physical: {
    0: 'bg-yellow-100',
    1: 'bg-yellow-200',
    2: 'bg-yellow-300',
    3: 'bg-yellow-400',
    4: 'bg-yellow-500',
  },
} as const;

// Chart color themes
export const CHART_COLORS = {
  internal: '#8b5cf6', // violet
  physical: '#f59e0b', // yellow
  negative: '#f87171', // red
} as const;

// Legend configurations
export const LEGEND_DATA: Record<StressType, LegendItem[]> = {
  internal: [
    { level: 0, color: STRESS_COLORS.internal[0], label: '0: Not at all' },
    { level: 1, color: STRESS_COLORS.internal[1], label: '1: A little' },
    { level: 2, color: STRESS_COLORS.internal[2], label: '2: Somewhat' },
    { level: 3, color: STRESS_COLORS.internal[3], label: '3: Quite a bit' },
    { level: 4, color: STRESS_COLORS.internal[4], label: '4: Very much' },
  ],
  physical: [
    { level: 0, color: STRESS_COLORS.physical[0], label: '0: None (0-20)' },
    { level: 1, color: STRESS_COLORS.physical[1], label: '1: Slight (20-40)' },
    { level: 2, color: STRESS_COLORS.physical[2], label: '2: Moderate (40-60)' },
    { level: 3, color: STRESS_COLORS.physical[3], label: '3: High (60-80)' },
    { level: 4, color: STRESS_COLORS.physical[4], label: '4: Very high (80-100)' },
  ],
} as const;

// Default data endpoints
export const DATA_ENDPOINTS = {
  FEATURE_FULL: '/data/feature_full.csv',
  DIFF_RATE: '/data/diff_rate.csv',
  CORRELATION: '/data/correlation.csv',
  DIFF_FULL: '/data/diff_full.csv',
} as const;

// Text color classes for consistent theming
export const TEXT_COLORS = {
  internal: 'text-violet-500',
  physical: 'text-orange-500',
  neutral: '',
} as const;