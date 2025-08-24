import React from 'react';
import useStressData from '@/hooks/useStressData';

// Props reuse shared StressDataPoint type from data module
interface TimelineProps {
  pid?: string;
  selectedDate: Date;
}

// Constants
const SLOTS_COUNT = 30;
const GRID_WIDTH_PCT = 100;

const STRESS_COLORS = {
  internal: {
    0: 'bg-violet-50',
    1: 'bg-violet-100',
    2: 'bg-violet-200',
    3: 'bg-violet-300',
    4: 'bg-violet-400',
  },
  physical: {
    0: 'bg-yellow-100',
    1: 'bg-yellow-200',
    2: 'bg-yellow-300',
    3: 'bg-yellow-400',
    4: 'bg-yellow-500',
  },
} as const;

const ADDITIONAL_ITEMS = ['CO2', '온도', '습도', '콜 유형', '수면의 질', '각성/흥분 정도', '정서적 긍부정 정도', '피로도', '감정을 숨기려는 노력'];

const LEGEND_DATA = {
  internal: [
    { level: 0, color: 'bg-violet-50', label: '0: 전혀 느끼지 않음' },
    { level: 1, color: 'bg-violet-100', label: '1: 약간 느낌' },
    { level: 2, color: 'bg-violet-200', label: '2: 어느 정도 느낌' },
    { level: 3, color: 'bg-violet-300', label: '3: 꽤 느낌' },
    { level: 4, color: 'bg-violet-400', label: '4: 매우 느낌' },
  ],
  physical: [
    { level: 0, color: 'bg-yellow-100', label: '0: 없음 (0-20)' },
    { level: 1, color: 'bg-yellow-200', label: '1: 조금 (20-40)' },
    { level: 2, color: 'bg-yellow-300', label: '2: 중간 (40-60)' },
    { level: 3, color: 'bg-yellow-400', label: '3: 꽤 높음 (60-80)' },
    { level: 4, color: 'bg-yellow-500', label: '4: 매우 높음 (80-100)' },
  ],
};

// small helpers (duplicated from hook for per-bar processing)
const mean = (arr: number[]) => arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : NaN;
const isValid = (v: number) => !Number.isNaN(v);
const normalize = (v: number, min: number, max: number) => {
  if (!isValid(v) || !isValid(min) || !isValid(max) || max === min) return NaN;
  return (v - min) / (max - min);
};
const rawToLevel = (x: number) => {
  if (!isValid(x)) return 0;
  return Math.max(0, Math.min(4, Math.round(x * 4)));
};
const getRange = (vals: number[]) => {
  const clean = vals.filter(isValid);
  if (!clean.length) return { min: NaN, max: NaN };
  return { min: Math.min(...clean), max: Math.max(...clean) };
};

// helper: 포맷 HH:MM (로컬)
const pad2 = (n: number) => String(n).padStart(2, '0');
const formatTime = (ms: number) => {
  if (Number.isNaN(ms)) return '';
  const d = new Date(ms);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};
  
const getStressColor = (level: number, type: 'internal' | 'physical'): string => {
  return STRESS_COLORS[type][level as keyof typeof STRESS_COLORS[typeof type]] || 'bg-gray-100';
};

// UI components unchanged (Header, LegendGroup, Legend)
const Header: React.FC<{ date: Date }> = ({ date }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일에 받은 스트레스</h2>
  </div>
);

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

const Legend: React.FC = () => (
  <div className="mb-6 space-y-4">
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

// TimelineChart now receives bar buckets (30) and aggregated summaries per bucket
const TimelineChart: React.FC<{
  pid: string;
  buckets: Array<{
    idx: number;
    startMs: number;
    endMs: number;
    rows: Array<Record<string, any>>;
    avgInternal?: number;
    avgPhysical?: number;
    summary: Record<string, any>;
  }>;
}> = ({ pid, buckets }) => {
  const colPct = 100 / buckets.length;
  const [tooltip, setTooltip] = React.useState<null | { leftPercent: number; bucketIdx: number }>(null);

  const openTooltip = (idx: number) => {
    const leftPercent = (idx + 0.5) * colPct;
    setTooltip({ leftPercent, bucketIdx: idx });
  };
  const closeTooltip = () => setTooltip(null);

  React.useEffect(() => {
    const onScroll = () => closeTooltip();
    const onClick = () => closeTooltip();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
    };
  }, []);

  const colTemplate = `repeat(${buckets.length}, minmax(0, 1fr))`;
  
  return (
    <div className="relative w-full" onClick={(e) => { e.stopPropagation(); tooltip && closeTooltip(); }}>
      {/* Row labels */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between w-28 pr-4 my-4">
        <div className="text-sm font-medium text-gray-700 text-center leading-tight">
          내가 체감한 <br />인지 스트레스
        </div>
        <div className="text-sm font-medium text-gray-700 text-center leading-tight">
          내 몸이 느낀 <br />신체 스트레스
        </div>
      </div>

      <div className="ml-28 mr-4">
        <div className="relative w-full">
          {/* Bars rendered as two rows (internal / physical) */}
          {/* 그리드 너비를 부모의 GRID_WIDTH_PCT%로 제한해 바가 부모를 넘지 않도록 함 */}
          <div className="relative w-full">
            <div style={{ width: `${GRID_WIDTH_PCT}%`, margin: '0 auto', overflow: 'hidden', boxSizing: 'border-box', position: 'relative' }}>
              <div className="grid gap-2" style={{ gridTemplateColumns: colTemplate }}>
                {buckets.map((b, i) => {
                  const level = b.avgInternal && Number.isFinite(b.avgInternal) ? Math.max(0, Math.min(4, Math.round(b.avgInternal))) : undefined;
                  const cls = level !== undefined ? getStressColor(level, 'internal') : 'bg-white';
                  return (
                    <div
                      key={`int-${i}`}
                      className={`${cls} h-16 ${level ? 'cursor-pointer' : ''}`}
                      onClick={() => level && openTooltip(i)}
                    />
                  );
                })}
              </div>

              {/* 콜 응대 기록: callSegments를 타임라인 범위에 맞춰 절대 위치로 렌더 */}
 
              <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: colTemplate }}>
                {buckets.map((b, i) => {
                  const level = b.avgPhysical && Number.isFinite(b.avgPhysical) ? Math.max(0, Math.min(4, Math.round(b.avgPhysical))) : undefined;
                  const cls = level !== undefined ? getStressColor(level, 'physical') : 'bg-white';
                  return (
                    <div
                      key={`phy-${i}`}
                      className={`${cls} h-16 ${level ? 'cursor-pointer' : ''}`}
                      onClick={() => level && openTooltip(i)}
                    />
                  );
                })}
              </div>

              {/* Time labels below (approx. show some labels) */}
              <div
                className="grid gap-0 mt-4 text-xs font-medium text-gray-600"
                style={{
                  gridTemplateColumns: colTemplate,
                  // 오른쪽 끝 라벨가 잘리지 않도록 컬럼 폭의 절반만큼 오른쪽 패딩 추가
                  paddingRight: `${colPct / 4}%`,
                  boxSizing: 'border-box',
                }}
              >
                {buckets.map((b, i) => {
                  // show label every Nth bucket to avoid crowd
                  const every = Math.max(1, Math.floor(buckets.length / 6));
                  return (
                    <div key={`lbl-${i}`} className="text-center">
                      {(i % every === 0 || i === buckets.length - 1) ? formatTime(b.startMs) : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (() => {
            const b = buckets[tooltip.bucketIdx];
            const summary = b?.summary ?? {};
            return (
              <div
                className="absolute z-30 bg-white border rounded shadow-lg p-2 text-xs"
                style={{ left: `${tooltip.leftPercent}%`, top: '60%', transform: 'translate(-50%, 8px)', minWidth: 220 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="font-medium mb-1">추가 데이터 ({b.rows.length}번 응답)</div>
                <div className="text-xs text-gray-700 space-y-1">
                  {/* Exclude psych/phys from list; show other aggregated features */}
                  {/* <div>행 수: {b.rows.length}</div> */}
                  {summary.workload !== undefined && <div>Workload: {summary.workload.toFixed(2)}</div>}
                  {summary.arousal !== undefined && <div>Arousal: {summary.arousal.toFixed(2)}</div>}
                  {summary.valence !== undefined && <div>Valence: {summary.valence.toFixed(2)}</div>}
                  {summary.tiredness !== undefined && <div>Tiredness: {summary.tiredness.toFixed(2)}</div>}
                  {summary.surface_acting !== undefined && <div>Surface acting: {summary.surface_acting.toFixed(2)}</div>}
                  <div>Call type angry count: {summary.call_type_angry ?? 0}</div>
                  <div>Stressor count (sum flags): {summary.stressor_sum ?? 0}</div>
                  {summary.steps !== undefined && <div>Steps (avg): {Math.round(summary.steps)}</div>}
                  {summary.skintemp !== undefined && <div>SkinTemp (avg): {summary.skintemp.toFixed(2)}</div>}
                  {summary.hr_minmax !== undefined && <div>HR range (avg): {summary.hr_minmax.toFixed(2)}</div>}
                  {summary.acc_mean !== undefined && <div>Acc mean: {summary.acc_mean.toFixed(3)}</div>}
                  {summary.humidity_mean !== undefined && <div>Humidity: {summary.humidity_mean.toFixed(2)}</div>}
                  {summary.co2_mean !== undefined && <div>CO2: {summary.co2_mean.toFixed(1)}</div>}
                  {summary.tvoc_mean !== undefined && <div>TVOC: {summary.tvoc_mean.toFixed(1)}</div>}
                  {summary.temperature_mean !== undefined && <div>Temperature: {summary.temperature_mean.toFixed(2)}</div>}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({
  pid,
  selectedDate,
}) => {
  // load csv (filtered by pid)
  const { loading, getForDate, getRowsForDate } = useStressData('/data/feature_full.csv', pid);
  const rows = getRowsForDate(selectedDate.toISOString().slice(0, 10));

  // prepare buckets
  const buckets = React.useMemo(() => {
    const out: Array<{
      idx: number;
      startMs: number;
      endMs: number;
      rows: Array<Record<string, any>>;
      avgInternal?: number;
      avgPhysical?: number;
      summary: Record<string, any>;
    }> = [];

    if (!rows || rows.length === 0) {
      // create empty buckets across working-day heuristic
      const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 8, 0, 0).getTime();
      const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 18, 0, 0).getTime();
      const span = Math.max(1, dayEnd - dayStart);
      for (let i = 0; i < SLOTS_COUNT; i++) {
        const s = Math.floor(dayStart + (i * span) / SLOTS_COUNT);
        const e = Math.floor(dayStart + ((i + 1) * span) / SLOTS_COUNT);
        out.push({ idx: i, startMs: s, endMs: e, rows: [], summary: {} });
      }
      return out;
    }

    // compute actual start/end from data
    const epochs = rows.map(r => Number(r.__epochMs ?? r.windowStartTime ?? r.callEndTime ?? r.surveyTime)).filter(e => !Number.isNaN(e));
    const minE = Math.min(...epochs);
    const maxE = Math.max(...epochs);
    // if timestamps seem in seconds (small), convert
    const startMs = minE < 1e12 ? minE * 1000 : minE;
    const endMs = maxE < 1e12 ? maxE * 1000 : maxE;
    const span = Math.max(1, endMs - startMs);

    // create empty buckets
    for (let i = 0; i < SLOTS_COUNT; i++) {
      const s = Math.floor(startMs + (i * span) / SLOTS_COUNT);
      const e = Math.floor(startMs + ((i + 1) * span) / SLOTS_COUNT);
      out.push({ idx: i, startMs: s, endMs: e, rows: [], summary: {} });
    }

    // place rows into buckets
    for (const r of rows) {
      const eRaw = Number(r.__epochMs ?? r.windowStartTime ?? r.callEndTime ?? r.surveyTime);
      const epoch = (eRaw < 1e12 ? eRaw * 1000 : eRaw);
      let idx = Math.floor(((epoch - startMs) / span) * SLOTS_COUNT);
      if (idx < 0) idx = 0;
      if (idx >= SLOTS_COUNT) idx = SLOTS_COUNT - 1;
      out[idx].rows.push(r);
    }

    // compute ranges for physical normalization using only this date's rows
    const hrVals = rows.map(r => Number(r.hr_mean)).filter(v => !Number.isNaN(v));
    const rmssdVals = rows.map(r => Number(r.rmssd)).filter(v => !Number.isNaN(v));
    const accVals = rows.map(r => Number(r.acc_mean)).filter(v => !Number.isNaN(v));
    const hrRange = getRange(hrVals);
    const rmssdRange = getRange(rmssdVals);
    const accRange = getRange(accVals);

    // aggregate per bucket
    for (const b of out) {
      const internalVals: number[] = [];
      const physRawVals: number[] = [];

      // summary accumulators
      const summaryAcc: Record<string, any> = {
        workload: [] as number[],
        arousal: [] as number[],
        valence: [] as number[],
        tiredness: [] as number[],
        surface_acting: [] as number[],
        call_type_angry: 0,
        stressor_sum: 0,
        steps: [] as number[],
        skintemp: [] as number[],
        hr_minmax: [] as number[],
        acc_mean: [] as number[],
        humidity_mean: [] as number[],
        co2_mean: [] as number[],
        tvoc_mean: [] as number[],
        temperature_mean: [] as number[],
      };

      for (const r of b.rows) {
        // internal stress
        const s = Number(r.stress ?? r.psych ?? NaN);
        if (!Number.isNaN(s)) internalVals.push(Math.max(0, Math.min(4, s)));

        // physical raw: combine hr (normalized), inverted rmssd (normalized), acc (normalized)
        const hr = Number(r.hr_mean ?? NaN);
        const rmssd = Number(r.rmssd ?? NaN);
        const acc = Number(r.acc_mean ?? NaN);
        const comps: number[] = [];
        const nh = !Number.isNaN(hr) ? normalize(hr, hrRange.min, hrRange.max) : NaN;
        if (!Number.isNaN(nh)) comps.push(nh);
        const nrm = !Number.isNaN(rmssd) ? normalize(rmssd, rmssdRange.min, rmssdRange.max) : NaN;
        if (!Number.isNaN(nrm)) comps.push(1 - nrm);
        const na = !Number.isNaN(acc) ? normalize(acc, accRange.min, accRange.max) : NaN;
        if (!Number.isNaN(na)) comps.push(na);
        if (comps.length) physRawVals.push(mean(comps));

        // accumulate summaries (exclude psych/phys)
        const pushIfNum = (k: string, v: any) => { const n = Number(v); if (!Number.isNaN(n)) (summaryAcc[k] as number[]).push(n); };
        pushIfNum('workload', r.workload);
        pushIfNum('arousal', r.arousal);
        pushIfNum('valence', r.valence);
        pushIfNum('tiredness', r.tiredness ?? r.daily_tiredness);
        pushIfNum('surface_acting', r.surface_acting);
        if (r.call_type_angry) summaryAcc.call_type_angry += 1;
        // stressor flags sum
        const stressorFlags = [
          'stressor_lack_ability','stressor_difficult_work','stressor_eval_pressure','stressor_work_bad','stressor_hard_communication',
          'stressor_rude_customer','stressor_time_pressure','stressor_noise','stressor_peer_conflict','stressor_other'
        ];
        for (const f of stressorFlags) { if (r[f]) summaryAcc.stressor_sum += 1; }
        pushIfNum('steps', r.steps);
        pushIfNum('skintemp', r.skintemp ?? r.skintemp_diff);
        pushIfNum('hr_minmax', r.hr_minmax);
        pushIfNum('acc_mean', r.acc_mean);
        pushIfNum('humidity_mean', r.humidity_mean);
        pushIfNum('co2_mean', r.co2_mean);
        pushIfNum('tvoc_mean', r.tvoc_mean);
        pushIfNum('temperature_mean', r.temperature_mean);
      }

      const avgInternal = internalVals.length ? mean(internalVals) : NaN;
      const avgPhysRaw = physRawVals.length ? mean(physRawVals) : NaN;
      const avgPhysical = isValid(avgPhysRaw) ? rawToLevel(avgPhysRaw) : NaN;

      // summarize numeric lists to means
      const summary: Record<string, any> = {};
      for (const k of Object.keys(summaryAcc)) {
        const v = (summaryAcc as any)[k];
        if (Array.isArray(v)) summary[k] = v.length ? mean(v) : undefined;
        else summary[k] = v;
      }

      b.avgInternal = Number.isNaN(avgInternal) ? undefined : avgInternal;
      b.avgPhysical = Number.isNaN(avgPhysical) ? undefined : avgPhysical;
      b.summary = summary;
    }

    return out;
  }, [rows, selectedDate]);

  // provide fallback empty arrays if external props not provided
  const internalSeries = [];
  const physicalSeries = [];

  return (
    <div className="w-full p-6 ">
      <Header date={selectedDate ?? new Date()} />
      <Legend />
      <TimelineChart pid={pid} buckets={buckets} />
    </div>
  );
};

export default Timeline;