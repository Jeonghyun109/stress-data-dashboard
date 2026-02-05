import type { StressDataPoint } from '@/types';

export const getDataPointAtTime = (
  data: StressDataPoint[], 
  targetTime: string
): StressDataPoint | undefined => {
  return data.find(point => point.time === targetTime);
};

export const getAverageStressLevel = (data: StressDataPoint[]): number => {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, point) => sum + point.level, 0);
  return total / data.length;
};
