/**
 * Central type definitions for the stress data dashboard
 */

// Base data types
export interface StressDataPoint {
  time: string;
  level: number;
  note?: string;
}

export type StressLevel = 0 | 1 | 2 | 3 | 4;

export interface DailyStress {
  psych: StressLevel;
  phys: StressLevel;
  psychRaw?: number; // 0..1 normalized raw
  physRaw?: number;  // 0..1 normalized raw
  count: number;
}

// Content structure types
export interface ContentText {
  txt: string;
  color: string;
}

export interface StyledText {
  TXT: string;
  BOLD: boolean;
}

export interface ContentSection {
  TITLE: string | ContentText[];
  DESCRIPTION?: StyledText[];
}

export interface PageContent {
  TITLE: string;
  BODY_1: ContentSection;
  BODY_2: ContentSection;
}

// Hook return types
export interface UseStressDataResult {
  loading: boolean;
  error: string | null;
  dailyMap: Map<string, DailyStress>;
  getForDate: (isoDate: string) => DailyStress | undefined;
  getRowsForDate: (isoDate: string) => Array<Record<string, any>>;
  getInterventionsForDate: (isoDate: string) => Array<{ name: string; time: string }>;
}

// Component props
export interface TimelineProps {
  pid: string;
  selectedDate: Date;
}

export interface BarChartProps {
  pid?: string | number;
}

// Utility types
export type StressType = 'internal' | 'physical';

export interface LegendItem {
  level: StressLevel;
  color: string;
  label: string;
}