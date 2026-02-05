import React from 'react';
import { monthLabel } from '@/utils/timelineUtils';

type TimelineHeaderProps = {
  date: Date;
};

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ date }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Stress on {monthLabel(date.getMonth() + 1)} {date.getDate()}, {date.getFullYear()}
    </h2>
  </div>
);

export default TimelineHeader;
