import React from 'react';
import useStressData from '@/hooks/useStressData';

// Props reuse shared StressDataPoint type from data module
interface TimelineProps {
  pid: string;
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
  const d = new Date(ms - 9 * 60 * 60 * 1000);
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
  callLog: Array<string>;
  interventions: Array<{ name: string; time: string; }>;
}> = ({ pid, buckets, callLog, interventions }) => {
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
    <div className="relative w-full" onClick={(e) => { e.stopPropagation(); }}>
      {/* Row labels */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between w-28 pr-4 my-12">
        <div className="font-medium text-gray-700 text-center leading-tight">
          내가 체감한 <div className="font-bold text-purple-600">인지 스트레스</div>
        </div>
        <div className="text-center text-sm">콜 응대 기록</div>
        <div className="font-medium text-gray-700 text-center leading-tight">
          내 몸이 느낀 <div className="font-bold text-yellow-600">신체 스트레스</div>
        </div>
      </div>

      <div className="ml-28 mr-4">
        <div className="relative w-full">
          {/* Bars rendered as two rows (internal / physical) */}
          {/* 그리드 너비를 부모의 GRID_WIDTH_PCT%로 제한해 바가 부모를 넘지 않도록 함 */}
          <div className="relative w-full">
            {/* allow overlays (intervention lines / call dots / tooltip) to extend outside grid */}
            <div style={{ width: `${GRID_WIDTH_PCT}%`, margin: '0 auto', overflow: 'visible', boxSizing: 'border-box', position: 'relative' }}>
              <div className="grid gap-2" style={{ gridTemplateColumns: colTemplate }}>
                {buckets.map((b, i) => {
                  const level = b.avgInternal && Number.isFinite(b.avgInternal) ? Math.max(0, Math.min(4, Math.round(b.avgInternal))) : undefined;
                  const cls = level !== undefined ? getStressColor(level, 'internal') : 'bg-white';
                  return (
                    <div
                      key={`int-${i}`}
                      className={`${cls} h-32 ${level ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (!level) return;
                        if (tooltip !== null && tooltip.bucketIdx === i) closeTooltip();
                        else openTooltip(i);
                      }}
                    />
                  );
                })}
              </div>

              {/* 콜 응대 표시: 버킷 정렬에 무관하게 시간 위치에 작은 점으로 렌더 */}
              <div className="absolute w-[734px] h-[2px] bg-gray-700" style={{ top: '46%' }}></div>
              <div className="absolute inset-0 pointer-events-none">
                {(() => {
                  if (!buckets || buckets.length === 0 || (!callLog || !callLog.length) && (!interventions || !interventions.length)) return null;
                  const timelineStart = buckets[0].startMs;
                  const timelineEnd = buckets[buckets.length - 1].endMs;
                  const span = Math.max(1, timelineEnd - timelineStart);

                  const DOT_HALF_PX = 6;

                  const parseTime = (v: unknown): number => {
                    if (typeof v === 'number') return v < 1e12 ? v * 1000 : v;
                    if (typeof v === 'string') {
                      const n = Number(v);
                      if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n;
                      const p = Date.parse(v);
                      return Number.isNaN(p) ? NaN : p;
                    }
                    return NaN;
                  };

                  return (
                    <>
                     {/* interventions: 시간 위치에 수직 점선 표시 */}
                     {interventions && interventions.length > 0 && interventions.map((iv, j) => {
                       const tI = parseTime(iv.time);
                       if (Number.isNaN(tI)) return null;
                       const leftPctI = Math.min(100, Math.max(0, ((tI - timelineStart) / span) * 100));
                       return (
                         <React.Fragment key={`iv-${j}`}>
                           {/* vertical dashed line */}
                           <div
                             title={`${iv.name ?? 'intervention'} ${formatTime(tI)}`}
                             style={{
                               position: 'absolute',
                               left: `calc(${leftPctI}% )`,
                               top: '-5%',
                               bottom: '-10%',
                               borderLeft: '2px dashed #7ccf00',
                               borderRight: '2px dashed #7ccf00',
                               transform: 'translateX(-1px)', // roughly center the 2px line
                               pointerEvents: 'auto',
                               overflow: 'visible',
                               zIndex: 15,
                             }}
                           />
                           {/* label under the line */}
                           <div
                             style={{
                               position: 'absolute',
                               left: `calc(${leftPctI}% )`,
                               top: '120%', // 위치는 필요시 조정
                               transform: 'translateX(-50%)',
                               pointerEvents: 'auto',
                               zIndex: 16,
                               whiteSpace: 'nowrap',
                             }}
                           />
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
                })()}
              </div>

              <div className="grid gap-2 mt-6" style={{ gridTemplateColumns: colTemplate }}>
                {buckets.map((b, i) => {
                  const level = b.avgPhysical && Number.isFinite(b.avgPhysical) ? Math.max(0, Math.min(4, Math.round(b.avgPhysical))) : undefined;
                  const cls = level !== undefined ? getStressColor(level, 'physical') : 'bg-white';
                  return (
                    <div
                      key={`phy-${i}`}
                      className={`${cls} h-32 ${level ? 'cursor-pointer' : ''}`}
                      onClick={() => {
                        if (!level) return;
                        if (tooltip !== null && tooltip.bucketIdx === i) closeTooltip();
                        else openTooltip(i);
                      }}
                    />
                  );
                })}
              </div>

              {/* Time labels below (approx. show some labels) */}
              <div
                className="grid gap-0 mt-2 text-xs font-medium text-gray-600"
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
                    <div key={`lbl-${i}`} className="text-center font-bold">
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

            console.log(summary)
            return (
              <div
                className="absolute z-30 bg-white border rounded shadow-lg p-2 text-sm"
                style={{ left: `${tooltip.leftPercent}%`, top: '70%', transform: 'translate(-50%, 8px)', minWidth: 220 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center font-bold mb-1">{formatTime(b.startMs)}~{formatTime(b.endMs)}에 수집된 데이터</div>
                <div className="text-sm text-gray-700 space-y-1">
                  {/* Exclude psych/phys from list; show other aggregated features */}
                  {/* <div>행 수: {b.rows.length}</div> */}
                  <div className="font-bold">스트레스 데이터</div>
                  {b.avgInternal !== undefined && <div>인지 스트레스 레벨: {b.avgInternal}</div>}
                  {b.avgPhysical !== undefined && <div>신체 스트레스 레벨: {b.avgPhysical}</div>}
                  <div className="h-[1px]" />

                  {summary.stressor?.length > 0 && <div className="font-bold">스트레스 요인</div>}
                  {summary.stressor?.length > 0 && <div>{summary.stressor.join(', ')}</div>}
                  {summary.stressor?.length > 0 && <div className="h-[1px]" />}

                  <div className="font-bold">환경 데이터</div>
                  {summary.workload !== undefined && <div>업무량: {summary.workload.toFixed(2)}/5</div>}
                  {summary.arousal !== undefined && <div>감정의 강도: {summary.arousal.toFixed(2)}/5</div>}
                  {summary.valence !== undefined && <div>감정의 긍정도: {summary.valence.toFixed(2)}/5</div>}
                  {summary.tiredness !== undefined && <div>피로도: {summary.tiredness.toFixed(2)}/5</div>}
                  {summary.surface_acting !== undefined && <div>감정을 숨기려는 노력: {summary.surface_acting.toFixed(2)}/5</div>}
                  <div>직전 콜 유형: {summary.call_type_angry ? '불만' : '일반'}</div>
                  {/* <div>Stressor count (sum flags): {summary.stressor_sum ?? 0}</div> */}
                  {summary.steps !== undefined && <div>평균 걸음수: {Math.round(summary.steps)}회</div>}
                  {summary.skintemp !== undefined && <div>SkinTemp (avg): {summary.skintemp.toFixed(2)}</div>}
                  {summary.hr_minmax !== undefined && <div>HR range (avg): {summary.hr_minmax.toFixed(2)}</div>}
                  {summary.acc_mean !== undefined && <div>Acc mean: {summary.acc_mean.toFixed(3)}</div>}
                  {summary.humidity_mean !== undefined && <div>습도: {summary.humidity_mean.toFixed(2)}%</div>}
                  {summary.co2_mean !== undefined && <div>이산화탄소 농도: {summary.co2_mean.toFixed(1)}%</div>}
                  {summary.tvoc_mean !== undefined && <div>공기질: {summary.tvoc_mean.toFixed(1)}ppm</div>}
                  {summary.temperature_mean !== undefined && <div>실내 온도: {summary.temperature_mean.toFixed(2)}도</div>}
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
  const { loading, getForDate, getRowsForDate, getInterventionsForDate } = useStressData('/data/feature_full.csv', pid);
  const rows = getRowsForDate(selectedDate.toISOString().slice(0, 10));
  const interventions = getInterventionsForDate(selectedDate.toISOString().slice(0, 10));
  console.log(rows)

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

    // collect candidate epochs from common fields (preserve local ms)
    const epochs = rows
      .map(r => Date.parse(r.isoTime));

    // fallback to working-day heuristic when no timestamps present
    let startMs: number;
    let endMs: number;
    if (epochs.length === 0) {
      startMs = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 8, 0, 0).getTime();
      endMs = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 18, 0, 0).getTime();
    } else {
      const minE = Math.min(...epochs);
      const maxE = Math.max(...epochs);
      startMs = minE;
      endMs = maxE;
    }
    const span = Math.max(1, endMs - startMs);

    // create empty buckets (evenly split timeline [startMs, endMs])
    for (let i = 0; i < SLOTS_COUNT; i++) {
      const s = Math.floor(startMs + (i * span) / SLOTS_COUNT);
      const e = Math.floor(startMs + ((i + 1) * span) / SLOTS_COUNT);
      out.push({ idx: i, startMs: s, endMs: e, rows: [], summary: {} });
    }

    // place rows into buckets (defensive clamping)
    for (const r of rows) {
      const epoch = Date.parse(r.isoTime);
      if (Number.isNaN(epoch)) continue;

      const rawIdx = Math.floor(((epoch - startMs) / span) * SLOTS_COUNT);
      const idx = Math.min(Math.max(rawIdx, 0), out.length - 1);
      // defensive ensure
      if (!out[idx]) {
        out[Math.max(0, Math.min(out.length - 1, idx))].rows.push(r);
      } else {
        out[idx].rows.push(r);
      }
    }

    console.log(out);

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
      // rmssd 기반으로만 신체 스트레스 계산
      const rmssdBucketVals: number[] = [];

      // summary accumulators
      const summaryAcc: Record<string, any> = {
        workload: [] as number[],
        arousal: [] as number[],
        valence: [] as number[],
        tiredness: [] as number[],
        surface_acting: [] as number[],
        call_type_angry: 0,
        stressor_sum: 0,
        stressor: [] as string[],
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
        const s = Number(r.stress ?? NaN);
        if (!Number.isNaN(s)) internalVals.push(Math.max(0, Math.min(4, s)));

        // 신체 스트레스는 rmssd(IBI 기반)만 사용: 버킷별 rmssd 평균을 취함
        const rmssd = Number(r.rmssd ?? NaN);
        if (!Number.isNaN(rmssd)) rmssdBucketVals.push(rmssd);

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
        for (const f of stressorFlags) { 
          if (r[f]) {
            summaryAcc.stressor_sum += 1; 
            summaryAcc.stressor.push(f);
            console.log(f)
            console.log(summaryAcc.stressor)
          }
        }
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
      // rmssd 평균을 정규화(normalize)하고 역수(1 - norm)를 사용해 스트레스 수준으로 변환
      const avgRmssd = rmssdBucketVals.length ? mean(rmssdBucketVals) : NaN;
      const avgPhysRaw = isValid(avgRmssd) ? normalize(avgRmssd, rmssdRange.min, rmssdRange.max) : NaN;
      const avgPhysical = isValid(avgPhysRaw) ? rawToLevel(1 - avgPhysRaw) : NaN;

      // summarize numeric lists to means
      const summary: Record<string, any> = {};
      for (const k of Object.keys(summaryAcc)) {
        const v = (summaryAcc as any)[k];
        if (Array.isArray(v) && k !== "stressor") summary[k] = v.length ? mean(v) : undefined;
        else summary[k] = v;
      }

      b.avgInternal = Number.isNaN(avgInternal) ? undefined : avgInternal;
      b.avgPhysical = Number.isNaN(avgPhysical) ? undefined : avgPhysical;
      b.summary = summary;
    }

    return out;
  }, [rows, selectedDate]);

  const call_log = rows.map(r => r.calls);

  return (
    <div className="w-full p-6 mb-24">
      <Header date={selectedDate ?? new Date()} />
      <Legend />
      <TimelineChart pid={pid} buckets={buckets} callLog={call_log} interventions={interventions}/>
    </div>
  );
};

export default Timeline;