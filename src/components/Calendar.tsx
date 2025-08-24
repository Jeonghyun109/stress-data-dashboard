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
      <ToggleSwitch active={showPsych} onToggle={() => setShowPsych(!showPsych)} color="#A78BFA" label="인지 스트레스 점수" />
      <ToggleSwitch active={showPhys} onToggle={() => setShowPhys(!showPhys)} color="#F59E0B" label="신체 스트레스 점수" />
    </div>
  </div>
);

/*
  TODOs
  1. 설명문
  2. 드래그 해서 여러 날짜 선택
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

  // Timeline과 동일한 클래스 매핑 (0..4)
  const STRESS_CLASSES = {
    'Psychological': ['bg-white', 'bg-violet-50', 'bg-violet-100', 'bg-violet-200', 'bg-violet-400'],
    'Physiological': ['bg-white', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-500'],
  } as const;

  // 동일 매핑의 대략적인 HEX 값(그라디언트 생성용)
  const STRESS_HEX = {
    'Psychological': ['#ffffff', '#F5F3FF', '#EDE9FE', '#C4B5FD', '#A78BFA'],
    'Physiological': ['#ffffff', '#FFFBEB', '#FEF3C7', '#FDE68A', '#F59E0B'],
  } as const;

  // 기존 levelToHex 제거/대체 — 클래스 또는 hex 반환용 헬퍼
  const levelToClass = (type: Stress, lvl: number) => {
    if (lvl < 0) return '';
    return STRESS_CLASSES[type][lvl] ?? '';
  };
  const levelToHex = (type: Stress, lvl: number) => {
    if (lvl < 0) return '#e5e7eb';
    return STRESS_HEX[type][lvl] ?? '#e5e7eb';
  };

  const getDateStyle = (date: Date) => {
    if (date.getMonth() !== month) return { className: 'text-gray-400', style: { backgroundColor: '#F3F4F6' } };

    const key = date.toISOString().slice(0, 10);
    const data = getForDate(key) ?? { psych: -1, phys: -1 };
    const psych = data.psych;
    const phys = data.phys;

    // when both toggles off -> neutral
    if (!showPsych && !showPhys) return { className: '', style: { backgroundColor: '#ffffff' } };

    // only psych -> apply Tailwind bg class
    if (showPsych && !showPhys) {
      const cls = levelToClass('Psychological' as Stress, psych);

      return { className: cls, style: {} };
    }

    // only phys -> apply Tailwind bg class
    if (!showPsych && showPhys) {
      const cls = levelToClass('Physiological' as Stress, phys);

      return { className: cls, style: {} };
    }

    // both shown -> split gradient (left phys, right psych) using HEX equivalents
    const physHex = levelToHex('Physiological' as Stress, phys);
    const psychHex = levelToHex('Psychological' as Stress, psych);
    return {
      className: '',
      style: {
        backgroundImage: `linear-gradient(-45deg, ${physHex} 50%, ${psychHex} 50%)`,
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
              'w-[40px] h-[40px] first:rounded-tl-xl nth-7:rounded-tr-xl nth-36:rounded-bl-xl last:rounded-br-xl text-center leading-[40px] mx-auto';
            const ds = getDateStyle(date);
            return (
              <button 
                key={idx} 
                className={`${base} padding-2 ${getDateStyle(date).className} ${date === selectedDate ? 'font-bold' : 'font-medium'}`} 
                onClick={() => {
                  if (date.getMonth() < minMonth || date.getMonth() > maxMonth) return;
                  if (date.getMonth() !== month){
                    setMonth(date.getMonth());
                  }
                  else setSelectedDate(date);
                }}
                style={ds.style}
                disabled={!getForDate(date.toISOString().slice(0, 10))}
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
