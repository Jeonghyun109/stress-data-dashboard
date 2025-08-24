import React, { useState, useEffect, useMemo } from 'react';
import useStressData from '@/hooks/useStressData';

interface CalendarProps {
  pid: string | undefined;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

type Stress = "Psychological" | "Physiological";


const ToggleSwitch: React.FC<{ active: boolean; onToggle: () => void; color?: string; label: string }> = ({ active, onToggle, color = '#2563EB', label }) => {
  const bgActive = color;
  const bgInactive = '#E5E7EB';
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center gap-3 cursor-pointer focus:outline-none"
    >
      <span
        className={`w-9 h-5 rounded-full relative transition-colors duration-150`}
        style={{ backgroundColor: active ? bgActive : bgInactive }}
      >
        <span
          className={`block w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-150`}
          style={{ transform: active ? 'translateX(20px)' : 'translateX(3px)' }}
        />
      </span>
      <span className={`text-sm ${active ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
};

const Header: React.FC<{
  showPsych: boolean;
  setShowPsych: (v: boolean) => void;
  showPhys: boolean;
  setShowPhys: (v: boolean) => void;
}> = ({ showPsych, setShowPsych, showPhys, setShowPhys }) => (
  <div className="mb-6 flex flex-col items-center justify-between">
    <h2 className="text-2xl font-bold text-gray-800">일간 스트레스 변화 캘린더</h2>
    <div className="w-full flex flex-col items-end gap-2">
      <ToggleSwitch active={showPsych} onToggle={() => setShowPsych(!showPsych)} color="#2563EB" label="인지 스트레스 점수" />
      <ToggleSwitch active={showPhys} onToggle={() => setShowPhys(!showPhys)} color="#DC2626" label="신체 스트레스 점수" />
    </div>
  </div>
);

/*
  TODOs
  1. LLM 주간 요약
  2. 설명문
  3. 드래그 해서 여러 날짜 선택
*/
const Calendar: React.FC<CalendarProps> = ({ pid, selectedDate, setSelectedDate }) => {
  const today = new Date();

  const [year, setYear] = useState<number>(selectedDate?.getFullYear() ?? today.getFullYear());
  const [month, setMonth] = useState<number>(selectedDate?.getMonth() ?? today.getMonth());
  const [firstDay, setFirstDay] = useState<number>(new Date(year, month, 1).getDay());
  const [dates, setDates] = useState<Array<Date>>([]);

  const [showPsych, setShowPsych] = useState<boolean>(true);
  const [showPhys, setShowPhys] = useState<boolean>(false);
  
  const { loading, dailyMap, getForDate } = useStressData('/data/feature_full.csv', pid);
  console.log(dailyMap)

  useEffect(() => {
    const first = new Date(year, month, 1).getDay();
    setFirstDay(first);

    // Generate dates array with nulls for empty slots
    const start = new Date(year, month, 1-first);
    let slots: Array<Date> = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      slots.push(d);
    }
    setDates(slots);
  }, [month]);


  // Example: restrict navigation to current year only
  const minMonth = 6; // July
  const maxMonth = 7; // August
  const isPrevDisabled = month <= minMonth;
  const isNextDisabled = month >= maxMonth;

  const splitWeeks: (slots: Date[]) => Date[][] = (slots) => {
    const weeks: Date[][] = [];
    for (let i = 0; i < slots.length; i += 7) {
      weeks.push(slots.slice(i, i + 7));
    }
    return weeks;
  };

  // Placeholder for coloring logic
  const getDateColor = (date: Date) => {
    if (date.getDate() === today.getDate()) return 'bg-red-100';
    if (date.getMonth() !== month) return 'text-gray-400 bg-gray-100';
    return 'bg-white';
  };

  // deterministic synthetic stress data per date (replace with real data later)
  const stressData = useMemo(() => {
    const map = new Map<string, { psych: number; phys: number }>();
    for (const d of dates) {
      const key = d.toISOString().slice(0, 10);
      // deterministic pseudo-values:
      const psych = (d.getDate() + d.getMonth()) % 4; // 0..3
      const phys = (3*d.getDate() + (d.getMonth() + 1)) % 4; // 0..3
      map.set(key, { psych, phys });
    }
    return map;
  }, [dates]);

  const levelToHex = (type: Stress, lvl: number) => {
    // hex colors for levels (0 = none -> white/transparent)
    const scales = {
      Psychological: ['#ffffff', '#F5F3FF', '#DDD6FE', '#7C3AED'], // none -> light -> medium -> strong (purple)
      Physiological: ['#ffffff', '#FFFBEB', '#FEF3C7', '#F59E0B'], // none -> light -> medium -> strong (amber)
    } as Record<Stress, string[]>;
    return lvl === -1 ? '#c6c6c6' : scales[type][lvl];
  };

  const getDateStyle = (date: Date) => {
    if (date.getMonth() !== month) return { className: 'text-gray-400', style: { backgroundColor: '#F3F4F6' } };

    const key = date.toISOString().slice(0, 10);
    // const data = stressData.get(key) ?? { psych: 0, phys: 0 };
    const data = getForDate(key) ?? { psych: -1, phys: -1 };
    const psychColor = levelToHex('Psychological', data.psych);
    const physColor = levelToHex('Physiological', data.phys);

    // when both toggles off -> neutral
    if (!showPsych && !showPhys) return { className: '', style: { backgroundColor: '#ffffff' } };

    // only psych
    if (showPsych && !showPhys) return { className: '', style: { backgroundColor: psychColor } };

    // only phys
    if (!showPsych && showPhys) return { className: '', style: { backgroundColor: physColor } };

    // both shown -> split gradient (left phys, right psych)
    return {
      className: '',
      style: {
        backgroundImage: `linear-gradient(-45deg, ${physColor} 50%, ${psychColor} 50%)`,
        backgroundRepeat: 'no-repeat',
      },
    };
  };

  const MonthNavigation = () => {
    return (
      <div className="flex justify-between items-center mb-3 px-16">
        <button
          className={`bg-transparent border-none text-[20px] flex items-center justify-center ${isPrevDisabled ? 'opacity-40' : 'cursor-pointer'}`}
          aria-label="Previous Month"
          disabled={isPrevDisabled}
          onClick={() => setMonth(month - 1)}
        >
          <img src="/icons/chevron-left.svg" alt="Previous Month" width={24} height={24} />
        </button>
        <span className="font-semibold text-[20px]">{year}.{month + 1}</span>
        <button
          className={`bg-transparent border-none text-[20px] flex items-center justify-center ${isNextDisabled ? 'opacity-40' : 'cursor-pointer'}`}
          aria-label="Next Month"
          disabled={isNextDisabled}
          onClick={() => setMonth(month + 1)} 
        >
          <img src="/icons/chevron-right.svg" alt="Next Month" width={24} height={24} />
        </button>
      </div>
    );
  }

  const WeekLabels = () => (
    // <div className="grid [grid-template-columns:repeat(7,minmax(0,1fr))_1.6fr] gap-0.5 mt-6"></div>
    <div className="grid grid-cols-7 gap-0.5 mt-6">
      {['월', '화', '수', '목', '금', '토', '일'].map((day, i) => (
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

  let summary = { 'avg': 1, 'min': 0, 'max': 2 };

  return (
    // <div className="w-[658px] mx-auto font-sans p-6">
    <div className="w-[338px] mx-auto font-sans p-6">
      <Header showPsych={showPsych} setShowPsych={setShowPsych} showPhys={showPhys} setShowPhys={setShowPhys} />
      <MonthNavigation />
      <WeekLabels />
      <div className="grid grid-cols-7 gap-0.25 rounded-xl p-[1px] mt-1 bg-gray-200 text-sm">
      {/* <div className="grid [grid-template-columns:repeat(7,minmax(0,1fr))_1.6fr] gap-0.25 rounded-xl p-[1px] mt-1 bg-gray-200 text-sm"> */}
        {splitWeeks(dates).map((week, w_idx) => (
          <React.Fragment key={`week-${w_idx}`}>
          {week.map((date, idx) => {
            let base =
              'w-[40px] h-[40px] first:rounded-tl-xl nth-7:rounded-tr-xl nth-36:rounded-bl-xl last:rounded-br-xl text-center leading-[40px] mx-auto hover:font-bold';
            const ds = getDateStyle(date);
            return (
              <button 
                key={idx} 
                className={`${base} padding-2 ${getDateColor(date)} ${date === selectedDate ? 'font-bold' : 'font-medium'}`} 
                onClick={() => {
                  if (date.getMonth() < minMonth || date.getMonth() > maxMonth) return;
                  console.log(date.getMonth(), month)
                  if (date.getMonth() !== month){
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
          {/* <div className={`h-[44px] w-[360px] ${w_idx === 0 ? 'rounded-tr-xl' : w_idx === splitWeeks(dates).length - 1 ? 'rounded-br-xl' : ''} bg-white px-2 py-1`}>
            {summary.avg === null ? (
            <span className="text-gray-500">데이터 없음</span>
            ) : (
            <div className="text-gray-700">이번주는 평균 {summary.avg} / 최저 {summary.min} / 최고 {summary.max}의 스트레스를 받으셨네요! 평소보다 스트레스를 많이 받으셨던 것으로 보입니다.</div>
            )}
          </div> */}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
