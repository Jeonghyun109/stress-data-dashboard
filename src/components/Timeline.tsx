import React from 'react';
import useStressData from '@/hooks/useStressData';
import { stressor_list, STRESSORS } from '@/data/stressWhy';
import type { TimelineProps } from '@/types';
import { GRID_CONSTANTS, STRESS_COLORS } from '@/constants/theme';
import { formatTime, getIsoDateKey } from '@/utils/timelineUtils';
import { buildTimelineBuckets, TimelineBucket } from '@/utils/timelineBuckets';
import TimelineHeader from './timeline/TimelineHeader';
import TimelineLegend from './timeline/TimelineLegend';
import TimelineTooltip from './timeline/TimelineTooltip';
import TimelineOverlays from './timeline/TimelineOverlays';
import TimelineTimeLabels from './timeline/TimelineTimeLabels';

// Constants
const SLOTS_COUNT = GRID_CONSTANTS.SLOTS_COUNT;
const GRID_WIDTH_PCT = GRID_CONSTANTS.WIDTH_PCT;

const getStressColor = (level: number, type: 'internal' | 'physical'): string => {
  return STRESS_COLORS[type][level as keyof typeof STRESS_COLORS[typeof type]] || 'bg-gray-100';
};

// TimelineChart receives bar buckets (30) and aggregated summaries per bucket
const TimelineChart: React.FC<{
  buckets: TimelineBucket[];
  callLog: Array<string>;
  interventions: Array<{ name: string; time: string; }>;
}> = ({ buckets, callLog, interventions }) => {
  const colPct = 100 / buckets.length;
  const [tooltip, setTooltip] = React.useState<null | { leftPercent: number; bucketIdx: number }>(null);

  const openTooltip = (idx: number) => {
    const leftPercent = (idx + 0.5) * colPct;
    setTooltip({ leftPercent, bucketIdx: idx });
  };
  const closeTooltip = () => setTooltip(null);

  React.useEffect(() => {
    const onClick = () => closeTooltip();
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  const colTemplate = `repeat(${buckets.length}, minmax(0, 1fr))`;
  return (
    <>
      <div className="relative w-full" onClick={(e) => { e.stopPropagation(); }}>
        {/* Row labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between w-28 pr-4 my-12">
          <div className="font-medium text-gray-700 text-center leading-tight">
            <div className="font-bold text-purple-600">Perceived stress</div>
          </div>
          <div className="text-center text-sm">Call record</div>
          <div className="font-medium text-gray-700 text-center leading-tight">
            <div className="font-bold text-yellow-600">Physiological stress</div>
          </div>
        </div>

        <div className="ml-28 mr-4">
          <div className="relative w-full">
            {/* Bars rendered as two rows (internal / physical) */}
            {/* 그리드 너비를 부모의 GRID_WIDTH_PCT%로 제한해 바가 부모를 넘지 않도록 함 */}
            <div className="relative w-full">
              {/* allow overlays (intervention lines / call dots / tooltip) to extend outside grid */}
              <div style={{ width: `${GRID_WIDTH_PCT}%`, margin: '0 auto', overflow: 'visible', boxSizing: 'border-box', position: 'relative' }}>
                <div className="grid gap-2" style={{ gridTemplateColumns: colTemplate }}>
                  {buckets.map((b, i) => {
                    const level = b.avgInternal && Number.isFinite(b.avgInternal) ? Math.max(0, Math.min(4, Math.round(b.avgInternal))) : undefined;
                    const cls = level !== undefined ? getStressColor(level, 'internal') : 'bg-white';
                    return (
                      <div
                        key={`int-${i}`}
                        className={`${cls} h-32 ${level ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                          if (!level) return;
                          if (tooltip !== null && tooltip.bucketIdx === i) closeTooltip();
                          else openTooltip(i);
                        }}
                      />
                    );
                  })}
                </div>

                {/* 콜 응대 표시: 버킷 정렬에 무관하게 시간 위치에 작은 점으로 렌더 */}
                <div className="absolute w-[734px] h-[2px] bg-gray-700" style={{ top: '46%' }}></div>
                <div className="absolute inset-0 pointer-events-none">
                  <TimelineOverlays buckets={buckets} callLog={callLog} interventions={interventions} />
                </div>

                <div className="grid gap-2 mt-6" style={{ gridTemplateColumns: colTemplate }}>
                  {buckets.map((b, i) => {
                    const level = b.avgPhysical && Number.isFinite(b.avgPhysical) ? Math.max(0, Math.min(4, Math.round(b.avgPhysical))) : undefined;
                    const cls = level !== undefined ? getStressColor(level, 'physical') : 'bg-white';
                    return (
                      <div
                        key={`phy-${i}`}
                        className={`${cls} h-32 ${level ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                          if (!level) return;
                          if (tooltip !== null && tooltip.bucketIdx === i) closeTooltip();
                          else openTooltip(i);
                        }}
                      />
                    );
                  })}
                </div>

                {/* Time labels below (approx. show some labels) */}
                <TimelineTimeLabels buckets={buckets} />
              </div>
            </div>


          </div>
        </div>
      </div>
      {/* Tooltip */}
      {tooltip && <TimelineTooltip bucket={buckets[tooltip.bucketIdx]} />}
    </>
  );
};

const Timeline: React.FC<TimelineProps> = ({
  pid,
  selectedDate,
}) => {
  // load csv (filtered by pid)
  const dateString = getIsoDateKey(selectedDate, { addHours: 9 });

  // const fixedDate = new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1))
  const { getRowsForDate, getInterventionsForDate } = useStressData('/data/feature_full.csv', pid);
  const rows = getRowsForDate(dateString);
  const interventions = getInterventionsForDate(dateString);

  // prepare buckets
  const buckets = React.useMemo(
    () => buildTimelineBuckets({
      rows,
      baseDate: selectedDate,
      slotsCount: SLOTS_COUNT,
      dayStartHour: 8,
      dayEndHour: 20,
      dayOffsetMs: 9 * 60 * 60 * 1000,
      mapStressorLabel: (code) =>
        (STRESSORS as any)?.[code] ?? (stressor_list as any)?.[code] ?? String(code).replace(/^stressor_/, '').replace(/_/g, ' '),
    }),
    [rows, selectedDate]
  );

  const call_log = rows.map(r => r.calls);

  return (
    <div className="w-full p-6 mb-24">
      <TimelineHeader date={selectedDate ?? new Date()} />
      <TimelineLegend />
      <TimelineChart buckets={buckets} callLog={call_log} interventions={interventions} />
    </div>
  );
};

export default Timeline;
