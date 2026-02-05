import React from 'react';
import Image from 'next/image';

type MonthNavigationProps = {
  year: number;
  month: number;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  year,
  month,
  isPrevDisabled,
  isNextDisabled,
  onPrev,
  onNext,
}) => (
  <div className="flex justify-between items-center mb-3 px-16">
    <button
      className={`bg-transparent border-none text-[20px] flex items-center justify-center ${isPrevDisabled ? 'opacity-40' : 'cursor-pointer'}`}
      aria-label="Previous Month"
      disabled={isPrevDisabled}
      onClick={onPrev}
    >
      <Image src="/icons/chevron-left.svg" alt="Previous Month" width={24} height={24} />
    </button>
    <span className="font-semibold text-[20px]">{year}.{month + 1}</span>
    <button
      className={`bg-transparent border-none text-[20px] flex items-center justify-center ${isNextDisabled ? 'opacity-40' : 'cursor-pointer'}`}
      aria-label="Next Month"
      disabled={isNextDisabled}
      onClick={onNext}
    >
      <Image src="/icons/chevron-right.svg" alt="Next Month" width={24} height={24} />
    </button>
  </div>
);

export default MonthNavigation;
