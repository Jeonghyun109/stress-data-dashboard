import React from 'react';
import { formatTime } from '@/utils/timelineUtils';
import type { TimelineBucket } from '@/utils/timelineBuckets';

type TimelineTimeLabelsProps = {
  buckets: TimelineBucket[];
};

const TimelineTimeLabels: React.FC<TimelineTimeLabelsProps> = ({ buckets }) => {
  const colTemplate = `repeat(${buckets.length}, minmax(0, 1fr))`;
  const colPct = 100 / Math.max(1, buckets.length);
  const every = Math.max(1, Math.floor(buckets.length / 6));

  return (
    <div
      className="grid gap-0 mt-2 text-xs font-medium text-gray-600"
      style={{
        gridTemplateColumns: colTemplate,
        paddingRight: `${colPct / 4}%`,
        boxSizing: 'border-box',
      }}
    >
      {buckets.map((b, i) => (
        <div key={`lbl-${i}`} className="text-center font-bold">
          {(i % every === 0 || i === buckets.length - 1) ? formatTime(b.startMs) : ''}
        </div>
      ))}
    </div>
  );
};

export default TimelineTimeLabels;
