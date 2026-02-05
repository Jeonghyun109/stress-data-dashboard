import React, { useMemo, useState } from 'react';
import useStressData from '@/hooks/useStressData';
import CalendarHeader from './calendar/CalendarHeader';
import MonthNavigation from './calendar/MonthNavigation';
import WeekLabels from './calendar/WeekLabels';

interface CalendarProps {
  pid: string | undefined;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

type Stress = "Psychological" | "Physiological";

const MIN_MONTH = 6; // July
const MAX_MONTH = 7; // August
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const OUTSIDE_MONTH_STYLE = { backgroundColor: '#F3F4F6' };
const NEUTRAL_STYLE = { backgroundColor: '#ffffff' };

// Timeline과 동일한 클래스 매핑 (0..4)
const STRESS_CLASSES = {
  Psychological: ['bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-300', 'bg-violet-400'],
  Physiological: ['bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500'],
} as const;

// 동일 매핑의 대략적인 HEX 값(그라디언트 생성용)
const STRESS_HEX = {
  Psychological: ['#f5f3ff', '#ede9fe', '#ddd6ff', '#c4b4ff', '#a684ff'],
  Physiological: ['#fef9c2', '#fff085', '#ffdf20', '#fcc800', '#efb100'],
} as const;

const clampLevel = (lvl: number) => (lvl < 0 ? -1 : Math.min(4, lvl));

const levelToClass = (type: Stress, lvl: number) => {
  if (lvl < 0) return 'bg-white';
  return STRESS_CLASSES[type][clampLevel(lvl)] ?? 'bg-white';
};

const levelToHex = (type: Stress, lvl: number) => {
  if (lvl < 0) return '#ffffff';
  return STRESS_HEX[type][clampLevel(lvl)] ?? '#ffffff';
};

const buildCalendarDates = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - firstDay);
  const slots: Array<Date> = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    slots.push(d);
  }
  return slots;
};

const splitWeeks = (slots: Date[]) => {
  const weeks: Date[][] = [];
  for (let i = 0; i < slots.length; i += 7) {
    weeks.push(slots.slice(i, i + 7));
  }
  return weeks;
};

const getDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const Calendar: React.FC<CalendarProps> = ({ pid, selectedDate, setSelectedDate }) => {
  const [year, setYear] = useState<number>(selectedDate?.getFullYear() ?? 2025);
  const [month, setMonth] = useState<number>(selectedDate?.getMonth() ?? 7);

  const [showPsych, setShowPsych] = useState<boolean>(true);
  const [showPhys, setShowPhys] = useState<boolean>(false);

  const { getForDate } = useStressData('/data/feature_full.csv', pid);
  const dates = useMemo(() => buildCalendarDates(year, month), [year, month]);
  const weeks = useMemo(() => splitWeeks(dates), [dates]);

  // Example: restrict navigation to current year only
  const isPrevDisabled = month <= MIN_MONTH;
  const isNextDisabled = month >= MAX_MONTH;

  const getDateStyle = (date: Date) => {
    if (date.getMonth() !== month) return { className: 'text-gray-400', style: OUTSIDE_MONTH_STYLE };
    // Use local date string for key to match useStressData
    const key = getDateKey(date);
    const data = getForDate(key) ?? { psych: -1, phys: -1 };
    const psych = data.psych;
    const phys = data.phys;

    // when both toggles off -> neutral
    if (!showPsych && !showPhys) return { className: '', style: NEUTRAL_STYLE };

    // only psych -> apply Tailwind bg class
    if (showPsych && !showPhys) {
      return { className: levelToClass('Psychological', psych), style: {} };
    }

    // only phys -> apply Tailwind bg class
    if (!showPsych && showPhys) {
      return { className: levelToClass('Physiological', phys), style: {} };
    }

    // both shown -> split gradient (left phys, right psych) using HEX equivalents
    const physHex = levelToHex('Physiological', phys);
    const psychHex = levelToHex('Psychological', psych);
    return {
      className: '',
      style: {
        backgroundImage: `linear-gradient(-45deg, ${physHex} 50%, ${psychHex} 50%)`,
        backgroundRepeat: 'no-repeat',
      },
    };
  };

  return (
    <div className="w-[338px] mx-auto font-sans py-6 pl-0 pr-6">
      <CalendarHeader showPsych={showPsych} setShowPsych={setShowPsych} showPhys={showPhys} setShowPhys={setShowPhys} />
      <MonthNavigation
        year={year}
        month={month}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        onPrev={() => setMonth(month - 1)}
        onNext={() => setMonth(month + 1)}
      />
      <WeekLabels labels={WEEK_DAYS} />
      <div className="grid grid-cols-7 gap-0.25 rounded-xl p-[1px] mt-1 bg-gray-200 text-sm">
        {weeks.map((week, w_idx) => (
          <React.Fragment key={`week-${w_idx}`}>
            {week.map((date, idx) => {
              const base = 'w-[44px] h-[40px] first:rounded-tl-xl nth-7:rounded-tr-xl nth-36:rounded-bl-xl last:rounded-br-xl text-center leading-[40px] mx-auto hover:font-bold';
              const ds = getDateStyle(date);
              const isOutOfRange = date.getMonth() < MIN_MONTH || date.getMonth() > MAX_MONTH;
              return (
                <button
                  key={idx}
                  className={`${base} padding-2 ${ds.className} ${date === selectedDate ? 'font-bold' : 'font-medium'}`}
                  onClick={() => {
                    if (isOutOfRange) return;
                    if (date.getMonth() !== month) {
                      setMonth(date.getMonth());
                    }
                    else setSelectedDate(date);
                  }}
                  style={ds.style}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
