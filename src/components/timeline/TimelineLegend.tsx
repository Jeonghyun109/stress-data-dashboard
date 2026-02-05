import React from 'react';
import { LEGEND_DATA } from '@/constants/theme';

type TimelineLegendProps = {
  className?: string;
};

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

const TimelineLegend: React.FC<TimelineLegendProps> = ({ className = 'mb-6' }) => (
  <div className={`${className} space-y-4`}>
    <div className="flex justify-end pr-3">
      <div className="flex gap-8 text-xs">
        <LegendGroup items={LEGEND_DATA.internal} />
      </div>
    </div>
    <div className="flex justify-end pr-3">
      <div className="flex gap-8 text-xs">
        <LegendGroup items={LEGEND_DATA.physical} />
      </div>
    </div>
  </div>
);

export default TimelineLegend;
