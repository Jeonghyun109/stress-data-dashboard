import React from 'react';
import useStressData from '@/hooks/useStressData';
import {
  StressDataPoint,
  DEFAULT_INTERNAL_DATA,
  DEFAULT_PHYSICAL_DATA,
} from '../data/stressData';

// Props reuse shared StressDataPoint type from data module
interface TimelineProps {
  pid?: string;
  selectedDate: Date;
  internalStressData?: StressDataPoint[];
  physicalStressData?: StressDataPoint[];
}

// Constants
const TIME_CONFIG = {
  START_HOUR: 8,
  END_HOUR: 18,
  INTERVAL_MINUTES: 20,
};

const LABEL_TIMES = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
const HIGHLIGHT_TIMES = ['9:10', '15:30', '18:00'];

// Labels to show under each highlighted vertical line (can include \n for multi-line)
const HIGHLIGHT_LABELS: Record<string, string> = {
  '9:10': '간식 섭취\n솔루션 수행',
  '15:30': '호흡하기\n솔루션 수행',
  '18:00': '지금 듣고 싶은 말\n솔루션 수행',
};

const STRESS_COLORS = {
  internal: {
    0: 'bg-gray-50',
    1: 'bg-red-100',
    2: 'bg-red-200',
    3: 'bg-red-300',
    4: 'bg-red-400',
  },
  physical: {
    0: 'bg-gray-50',
    1: 'bg-blue-100',
    2: 'bg-blue-200',
    3: 'bg-blue-300',
    4: 'bg-blue-400',
  },
} as const;

const ADDITIONAL_ITEMS = ['CO2', '온도', '습도', '콜 유형', '수면의 질', '각성/흥분 정도', '정서적 긍부정 정도', '피로도', '감정을 숨기려는 노력'];

const LEGEND_DATA = {
  internal: [
    { level: 0, color: 'bg-red-50', label: '0: 전혀 느끼지 않음' },
    { level: 1, color: 'bg-red-100', label: '1: 약간 느낌' },
    { level: 2, color: 'bg-pink-200', label: '2: 어느 정도 느낌' },
    { level: 3, color: 'bg-red-300', label: '3: 꽤 느낌' },
    { level: 4, color: 'bg-red-400', label: '4: 매우 느낌' },
  ],
  physical: [
    { level: 0, color: 'bg-gray-50', label: '0: 없음 (0-20)' },
    { level: 1, color: 'bg-blue-100', label: '1: 조금 (20-40)' },
    { level: 2, color: 'bg-blue-200', label: '2: 중간 (40-60)' },
    { level: 3, color: 'bg-blue-300', label: '3: 꽤 높음 (60-80)' },
    { level: 4, color: 'bg-blue-400', label: '4: 매우 높음 (80-100)' },
  ],
};

// Utility functions
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = TIME_CONFIG.START_HOUR; hour <= TIME_CONFIG.END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += TIME_CONFIG.INTERVAL_MINUTES) {
      if (hour === TIME_CONFIG.END_HOUR && minute > 0) break;
      const timeString = `${hour}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const getStressColor = (level: number, type: 'internal' | 'physical'): string => {
  return STRESS_COLORS[type][level as keyof typeof STRESS_COLORS[typeof type]] || 'bg-gray-100';
};

const getDataForTime = (time: string, data: StressDataPoint[]): StressDataPoint | undefined => {
  return data.find(item => item.time === time);
};

// Sub-components
const Header: React.FC<{ date: Date }> = ({ date }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일에 받은 스트레스</h2>
  </div>
);

const LegendGroup: React.FC<{ items: typeof LEGEND_DATA.internal }> = ({ items }) => (
  <div className="flex gap-4">
    {items.map((item) => (
      <div key={item.level} className="flex items-center gap-1">
        <div className={`w-3 h-3 ${item.color} rounded`}></div>
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

const Legend: React.FC = () => (
  <div className="mb-6 space-y-4">
    <div className="flex justify-end pr-3">
      <div className="flex gap-8 text-xs">
        <LegendGroup items={LEGEND_DATA.internal} />
        {/* <LegendGroup items={LEGEND_DATA.internal.slice(3)} /> */}
      </div>
    </div>
    <div className="flex justify-end pr-3">
      <div className="flex gap-8 text-xs">
        <LegendGroup items={LEGEND_DATA.physical} />
        {/* <LegendGroup items={LEGEND_DATA.physical.slice(3)} /> */}
      </div>
    </div>
  </div>
);

const StressBar: React.FC<{
  time: string;
  index: number;
  data: StressDataPoint | undefined;
  type: 'internal' | 'physical';
  totalSlots: number;
}> = ({ time, index, data, type, totalSlots }) => {
  if (!data) return null;

  const position = (index / (totalSlots - 1)) * 100;

  return (
    <div 
      key={`${type}-${time}`} 
      className="absolute" 
      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
    >
      <div className={`w-2 h-30 ${getStressColor(data.level, type)}`}></div>
    </div>
  );
};

const TimelineChart: React.FC<{
  timeSlots: string[];
  internalStressData: StressDataPoint[];
  physicalStressData: StressDataPoint[];
}> = ({ timeSlots, internalStressData, physicalStressData }) => {
  const colPct = 100 / timeSlots.length;
  const [tooltip, setTooltip] = React.useState<null | { leftPercent: number; time: string }>(null);

  const openTooltip = (time: string) => {
    const idx = timeSlots.indexOf(time);
    if (idx === -1) return;
    const leftPercent = (idx + 0.5) * colPct;
    setTooltip({ leftPercent, time });
  };

  const closeTooltip = () => setTooltip(null);

  React.useEffect(() => {
    const onScroll = () => closeTooltip();
    const onClick = () => closeTooltip();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="relative w-full" onClick={(e) => { e.stopPropagation(); tooltip && closeTooltip(); }}>
      {/* Row labels */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between w-28 pr-4 my-4">
        <div className="text-sm font-medium text-gray-700 text-center leading-tight">
          내가 체감한 <br />인지 스트레스
        </div>
        <div className="text-sm font-medium text-gray-700 text-center leading-tight">
          내 몸이 느낀 <br />신체 스트레스
        </div>
      </div>

      {/* Main timeline area (responsive width) */}
      <div className="ml-24 mr-4">
        <div className="relative w-full">
          {/* Horizontal timeline line */}
          <div className="absolute left-0 right-0 top-18 h-px bg-gray-400 z-0" />

          {/* Internal stress row (percentage columns) */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${timeSlots.length}, ${colPct/1.65}%)` }}>
            {timeSlots.map((time) => {
              const d = getDataForTime(time, internalStressData);
              const cls = d ? getStressColor(d.level, 'internal') : 'bg-gray-50';
              return (
                <div
                  key={`int-${time}`}
                  className={`${cls} h-16 cursor-pointer`}
                  onClick={() => openTooltip(time)}
                />
              );
            })}
          </div>

          {/* Physical stress row (percentage columns) */}
          <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: `repeat(${timeSlots.length}, ${colPct/1.65}%)` }}>
            {timeSlots.map((time) => {
              const d = getDataForTime(time, physicalStressData);
              const cls = d ? getStressColor(d.level, 'physical') : 'bg-gray-50';
              return (
                <div
                  key={`phy-${time}`}
                  className={`${cls} h-16 cursor-pointer`}
                  onClick={() => openTooltip(time)}
                />
              );
            })}
          </div>

          {/* Time labels (percentage grid) */}
          <div className="grid gap-0 mt-4 text-xs font-medium text-gray-600" style={{ gridTemplateColumns: `repeat(${timeSlots.length}, ${colPct}%)` }}>
            {timeSlots.map((time) => (
              <div key={`lbl-${time}`} className="text-center">
                {LABEL_TIMES.includes(time) ? time : ''}
              </div>
            ))}
          </div>

          {/* Right side indicator - aligned with timeline width */}
          <div className="absolute right-[-70px] top-18 transform -translate-y-1/2 z-20">
            <span className="text-xs text-gray-500">콜 응대 기록</span>
          </div>
          {/* Tooltip for additional items */}
          {tooltip && (
            <div
              className="absolute z-30 bg-white border rounded shadow-lg p-2 text-xs"
              style={{ left: `${tooltip.leftPercent}%`, top: '60%', transform: 'translate(-50%, 8px)', minWidth: 160 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-medium mb-1">추가 데이터</div>
              <div className="text-xs text-gray-700 space-y-1">
                {ADDITIONAL_ITEMS.map((it) => (
                  <div key={it}>• {it}: ----</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      
      {/* Highlight vertical lines and captions (percentage-based) */}
      {timeSlots.map((time, index) => {
        if (!HIGHLIGHT_TIMES.includes(time)) return null;
        const leftPercent = (index) * colPct;
        const caption = HIGHLIGHT_LABELS[time];

        return (
          <React.Fragment key={`hl-${time}`}>
            <div
              className="absolute top-0 bottom-0 w-[1px] border-l-2 border-dashed border-green-500 z-0"
              style={{ left: `${leftPercent}%` }}
            />
            {caption && (
              <div
                className="absolute text-[10px] text-center whitespace-pre-line text-green-600 z-20"
                style={{ left: `${leftPercent}%`, top: '100%', transform: 'translate(-50%, 8px)' }}
              >
                {caption}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
// Additional info now shown in per-bar tooltip

const Timeline: React.FC<TimelineProps> = ({
  pid,
  selectedDate,
  internalStressData,
  physicalStressData,
}) => {
  const timeSlots = generateTimeSlots();
  // load csv (filtered by pid)
  const { loading, getForDate, getRowsForDate } = useStressData('/data/feature_full.csv', pid);
  console.log(getRowsForDate('2025-08-01'));

  // helper: build StressDataPoint[] from raw rows for a given date
  const buildSeriesFromRows = (rows: Array<Record<string, any>>) : {time: string, level: number}[] => {
    // initialize all slots empty
    const buckets: Record<string, { internal?: number; physical?: number }> = {};
    timeSlots.forEach(t => (buckets[t] = {}));

    // simple mapping heuristics:
    const hrToLevel = (hr?: number) => {
      if (hr == null || Number.isNaN(hr)) return undefined;
      if (hr <= 50) return 0;
      if (hr <= 60) return 1;
      if (hr <= 70) return 2;
      if (hr <= 80) return 3;
      return 4;
    };

    const timeIndexOf = (hhmm: string) => timeSlots.indexOf(hhmm);

    for (const r of rows) {
      const dt = new Date(r.__epochMs ?? Number(r.windowStartTime ?? r.surveyTime ?? r.callEndTime));
      const hhmm = `${dt.getHours()}:${String(dt.getMinutes()).padStart(2,'0')}`;
      // find closest slot
      let best = 0;
      let bestDiff = Infinity;
      timeSlots.forEach((slot, i) => {
        const [sh, sm] = slot.split(':').map(Number);
        const slotMinutes = sh * 60 + sm;
        const rMinutes = dt.getHours() * 60 + dt.getMinutes();
        const diff = Math.abs(slotMinutes - rMinutes);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      });
      const slotKey = timeSlots[best];
      // internal: prefer r.stress / r.psych (assume 0..4 or 0..3)
      const rawPsych = Number(r.stress ?? r.psych ?? NaN);
      if (!Number.isNaN(rawPsych)) buckets[slotKey].internal = Math.max(0, Math.min(4, Math.round(rawPsych)));
      // physical: try hr_mean -> rmssd (inverse) -> acc_mean
      const hr = Number(r.hr_mean ?? NaN);
      const plev = hrToLevel(Number.isNaN(hr) ? undefined : hr);
      if (plev !== undefined) buckets[slotKey].physical = plev;
    }

    // produce StressDataPoint[]
    const internal: { time: string; level: number }[] = [];
    const physical: { time: string; level: number }[] = [];
    timeSlots.forEach((t) => {
      const b = buckets[t];
      if (b.internal !== undefined) internal.push({ time: t, level: b.internal });
      if (b.physical !== undefined) physical.push({ time: t, level: b.physical });
    });
    // if empty, fallback to daily-level (getForDate)
    return { internal, physical } as any;
  };

  // final data used by chart — if props provided, prefer them, else build from rows/day
  let internalSeries = internalStressData;
  let physicalSeries = physicalStressData;
  if (!internalSeries || !physicalSeries) {
    const iso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
    const rows = getRowsForDate(iso);
    const built = buildSeriesFromRows(rows);
    // buildSeriesFromRows returns object with arrays
    internalSeries = built.internal?.length ? built.internal : DEFAULT_INTERNAL_DATA;
    physicalSeries = built.physical?.length ? built.physical : DEFAULT_PHYSICAL_DATA;
  }

  return (
    <div className="w-full p-6 ">
      {/* <div className="w-full bg-white p-6 rounded-lg shadow-sm"></div> */}
      <Header date={selectedDate ?? new Date()} />
      <Legend />
      <TimelineChart 
        timeSlots={timeSlots}
        internalStressData={internalStressData}
        physicalStressData={physicalStressData}
      />
  {/* additional info moved into per-bar tooltip */}
    </div>
  );
};

export default Timeline;