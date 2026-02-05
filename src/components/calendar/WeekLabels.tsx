import React from 'react';

type WeekLabelsProps = {
  labels: string[];
  className?: string;
};

const WeekLabels: React.FC<WeekLabelsProps> = ({ labels, className = 'mt-3' }) => (
  // <div className="grid [grid-template-columns:repeat(7,minmax(0,1fr))_1.6fr] gap-0.5 mt-6"></div>
  <div className={`grid grid-cols-7 gap-0.5 ${className}`}>
    {labels.map((day, i) => (
      <div
        key={day + i}
        className="font-medium text-[#888] text-center text-[15px] mb-1"
      >
        {day}
      </div>
    ))}
    {/* <div className="w-[400px] font-medium text-[#888] text-center text-[15px] mb-1">주간 요약</div> */}
  </div>
);

export default WeekLabels;
