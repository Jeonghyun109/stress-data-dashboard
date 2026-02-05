import React from 'react';
import { INTERVENTION_LABELS } from '@/constants/components';
import { formatTime, parseTime } from '@/utils/timelineUtils';
import type { TimelineBucket } from '@/utils/timelineBuckets';

type OverlayIntervention = { name: string; time: string };

type TimelineOverlaysProps = {
  buckets: TimelineBucket[];
  callLog: Array<string>;
  interventions: OverlayIntervention[];
  showInterventionLabels?: boolean;
  interventionLabelRender?: (args: { name: string; timeMs: number; leftPct: number; index: number }) => React.ReactNode;
  onInterventionHover?: (index: number | null, leftPct?: number) => void;
};

const TimelineOverlays: React.FC<TimelineOverlaysProps> = ({
  buckets,
  callLog,
  interventions,
  showInterventionLabels = false,
  interventionLabelRender,
  onInterventionHover,
}) => {
  if (!buckets || buckets.length === 0 || ((!callLog || !callLog.length) && (!interventions || !interventions.length))) {
    return null;
  }

  const timelineStart = buckets[0].startMs;
  const timelineEnd = buckets[buckets.length - 1].endMs;
  const span = Math.max(1, timelineEnd - timelineStart);
  const DOT_HALF_PX = 6;

  return (
    <>
      {/* interventions: 시간 위치에 수직 점선 표시 */}
      {interventions && interventions.length > 0 && interventions.map((iv, j) => {
        const tI = parseTime(iv.time);
        if (Number.isNaN(tI)) return null;
        const leftPctI = Math.min(100, Math.max(0, ((tI - timelineStart) / span) * 100));
        return (
          <React.Fragment key={`iv-${j}`}>
            <div
              title={`${INTERVENTION_LABELS[iv.name] ?? 'intervention'} ${formatTime(tI)}`}
              style={{
                position: 'absolute',
                left: `calc(${leftPctI}% )`,
                top: '-5%',
                bottom: '-5%',
                borderLeft: '2px dashed #7ccf00',
                borderRight: '2px dashed #7ccf00',
                transform: 'translateX(-1px)',
                pointerEvents: 'auto',
                overflow: 'visible',
                zIndex: 15,
              }}
              onMouseEnter={() => onInterventionHover?.(j, leftPctI)}
              onMouseLeave={() => onInterventionHover?.(null)}
            />
            {showInterventionLabels && (
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${leftPctI}% )`,
                  top: '120%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'auto',
                  zIndex: 16,
                  whiteSpace: 'nowrap',
                }}
              >
                {interventionLabelRender
                  ? interventionLabelRender({ name: iv.name, timeMs: tI, leftPct: leftPctI, index: j })
                  : null}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* call dots */}
      {callLog && callLog.length > 0 && callLog.map((callTime, i) => {
        const t = parseTime(callTime);
        if (Number.isNaN(t)) return null;
        const leftPct = Math.min(100, Math.max(0, ((t - timelineStart) / span) * 100));
        return (
          <div
            key={`call-dot-${i}`}
            title={`콜 ${formatTime(t)}`}
            style={{
              position: 'absolute',
              left: `calc(${leftPct}% - ${DOT_HALF_PX}px)`,
              top: '46%',
              transform: 'translateY(-50%)',
              pointerEvents: 'auto',
              overflow: 'visible',
              zIndex: 10,
            }}
          >
            <div className="w-3 h-3 bg-gray-700 rounded-sm" />
          </div>
        );
      })}
    </>
  );
};

export default TimelineOverlays;
