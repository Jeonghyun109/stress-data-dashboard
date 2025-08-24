// Shared data and types for timeline
export interface StressDataPoint {
  time: string;
  level: number;
  note?: string;
}

export const DEFAULT_INTERNAL_DATA: StressDataPoint[] = [
  { time: '8:00', level: 0 }, { time: '8:20', level: 1 }, { time: '8:40', level: 1 }, 
  { time: '9:00', level: 1 }, { time: '9:20', level: 2 }, { time: '9:40', level: 2 }, 
  { time: '10:00', level: 2 }, { time: '10:20', level: 3 }, { time: '10:40', level: 3 },
  { time: '11:00', level: 3 }, { time: '11:20', level: 4 }, { time: '11:40', level: 4 },
  { time: '12:00', level: 4 }, { time: '12:20', level: 3 }, { time: '12:40', level: 2 },
  { time: '13:00', level: 4 }, { time: '13:20', level: 4 }, { time: '13:40', level: 3 },
  { time: '14:00', level: 3 }, { time: '14:20', level: 4 }, { time: '14:40', level: 4 },
  { time: '15:00', level: 4 }, { time: '15:20', level: 4 }, { time: '15:40', level: 4 }, 
  { time: '16:00', level: 4 }, { time: '16:20', level: 4 }, { time: '16:40', level: 4 },
  { time: '17:00', level: 3 }, { time: '17:20', level: 4 }, { time: '17:40', level: 4 },
  { time: '18:00', level: 4 }
];

export const DEFAULT_PHYSICAL_DATA: StressDataPoint[] = [
  { time: '8:00', level: 3 }, { time: '8:20', level: 3 }, { time: '8:40', level: 3 },
  { time: '9:00', level: 3 }, { time: '9:20', level: 3 }, { time: '9:40', level: 2 }, 
  { time: '10:00', level: 2 }, { time: '10:20', level: 3 }, { time: '10:40', level: 3 }, 
  { time: '11:00', level: 3 }, { time: '11:20', level: 3 }, { time: '11:40', level: 3 }, 
  { time: '12:00', level: 2 }, { time: '12:20', level: 2 }, { time: '12:40', level: 1 }, 
  { time: '13:00', level: 3 }, { time: '13:20', level: 3 }, { time: '13:40', level: 3 }, 
  { time: '14:00', level: 3 }, { time: '14:20', level: 4 }, { time: '14:40', level: 4 }, 
  { time: '15:00', level: 4 }, { time: '15:20', level: 4 }, { time: '15:40', level: 4 }, 
  { time: '16:00', level: 4 }, { time: '16:20', level: 3 }, { time: '16:40', level: 3 }, 
  { time: '17:00', level: 3 }, { time: '17:20', level: 3 }, { time: '17:40', level: 3 }, 
  { time: '18:00', level: 3 }
];
