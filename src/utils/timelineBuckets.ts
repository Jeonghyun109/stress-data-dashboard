import { getRange, isFiniteNumber, mean, normalize, rawToLevel } from '@/utils/dataUtils';

export type TimelineBucket = {
  idx: number;
  startMs: number;
  endMs: number;
  rows: Array<Record<string, any>>;
  avgInternal?: number;
  avgPhysical?: number;
  summary: Record<string, any>;
};

type BuildBucketsParams = {
  rows: Array<Record<string, any>>;
  baseDate: Date;
  slotsCount: number;
  dayStartHour: number;
  dayEndHour: number;
  dayOffsetMs?: number;
  mapStressorLabel?: (code: string) => string;
};

export const buildTimelineBuckets = ({
  rows,
  baseDate,
  slotsCount,
  dayStartHour,
  dayEndHour,
  dayOffsetMs = 0,
  mapStressorLabel,
}: BuildBucketsParams): TimelineBucket[] => {
  const out: TimelineBucket[] = [];

  if (!rows || rows.length === 0) {
    const dayStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), dayStartHour, 0, 0).getTime() + dayOffsetMs;
    const dayEnd = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), dayEndHour, 0, 0).getTime() + dayOffsetMs;
    const span = Math.max(1, dayEnd - dayStart);
    for (let i = 0; i < slotsCount; i++) {
      const s = Math.floor(dayStart + (i * span) / slotsCount);
      const e = Math.floor(dayStart + ((i + 1) * span) / slotsCount);
      out.push({ idx: i, startMs: s, endMs: e, rows: [], summary: {} });
    }
    return out;
  }

  const epochs = rows.map((r) => Date.parse(r.isoTime));
  let startMs: number;
  let endMs: number;
  if (epochs.length === 0) {
    startMs = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), dayStartHour, 0, 0).getTime() + dayOffsetMs;
    endMs = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), dayEndHour, 0, 0).getTime() + dayOffsetMs;
  } else {
    const minE = Math.min(...epochs);
    const maxE = Math.max(...epochs);
    startMs = minE;
    endMs = maxE;
  }
  const span = Math.max(1, endMs - startMs);

  for (let i = 0; i < slotsCount; i++) {
    const s = Math.floor(startMs + (i * span) / slotsCount);
    const e = Math.floor(startMs + ((i + 1) * span) / slotsCount);
    out.push({ idx: i, startMs: s, endMs: e, rows: [], summary: {} });
  }

  for (const r of rows) {
    const epoch = Date.parse(r.isoTime);
    if (Number.isNaN(epoch)) continue;
    const rawIdx = Math.floor(((epoch - startMs) / span) * slotsCount);
    const idx = Math.min(Math.max(rawIdx, 0), out.length - 1);
    if (!out[idx]) {
      out[Math.max(0, Math.min(out.length - 1, idx))].rows.push(r);
    } else {
      out[idx].rows.push(r);
    }
  }

  const rmssdVals = rows.map((r) => Number(r.rmssd)).filter(isFiniteNumber);
  const rmssdRange = getRange(rmssdVals);

  for (const b of out) {
    const internalVals: number[] = [];
    const rmssdBucketVals: number[] = [];

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
      hr_mean: [] as number[],
      acc_mean: [] as number[],
      humidity_mean: [] as number[],
      co2_mean: [] as number[],
      tvoc_mean: [] as number[],
      temperature_mean: [] as number[],
      daily_arousal: [] as number[],
      daily_valence: [] as number[],
      daily_tiredness: [] as number[],
      daily_general_health: [] as number[],
      daily_general_sleep: [] as number[],
    };

    for (const r of b.rows) {
      const s = Number(r.stress ?? NaN);
      if (!Number.isNaN(s)) internalVals.push(Math.max(0, Math.min(4, s)));

      const rmssd = Number(r.rmssd ?? NaN);
      if (!Number.isNaN(rmssd)) rmssdBucketVals.push(rmssd);

      const pushIfNum = (k: string, v: any) => {
        const n = Number(v);
        if (!Number.isNaN(n)) (summaryAcc[k] as number[]).push(n);
      };
      pushIfNum('workload', r.workload);
      pushIfNum('arousal', r.arousal);
      pushIfNum('valence', r.valence);
      pushIfNum('tiredness', r.tiredness ?? r.daily_tiredness);
      pushIfNum('surface_acting', r.surface_acting);
      if (r.call_type_angry) summaryAcc.call_type_angry += 1;

      const stressorFlags = [
        'stressor_lack_ability', 'stressor_difficult_work', 'stressor_eval_pressure', 'stressor_work_bad', 'stressor_hard_communication',
        'stressor_rude_customer', 'stressor_time_pressure', 'stressor_noise', 'stressor_peer_conflict', 'stressor_other',
      ];
      for (const f of stressorFlags) {
        if (r[f]) {
          summaryAcc.stressor_sum += 1;
          summaryAcc.stressor.push(f);
        }
      }
      pushIfNum('steps', r.steps);
      pushIfNum('skintemp', r.skintemp ?? r.skintemp_diff);
      pushIfNum('hr_mean', r.hr_mean);
      pushIfNum('acc_mean', r.acc_mean);
      pushIfNum('humidity_mean', r.humidity_mean);
      pushIfNum('co2_mean', r.co2_mean);
      pushIfNum('tvoc_mean', r.tvoc_mean);
      pushIfNum('temperature_mean', r.temperature_mean);

      pushIfNum('daily_arousal', r.daily_arousal);
      pushIfNum('daily_valence', r.daily_valence);
      pushIfNum('daily_tiredness', r.daily_tiredness);
      pushIfNum('daily_general_health', r.daily_general_health);
      pushIfNum('daily_general_sleep', r.daily_general_sleep);
    }

    const avgInternal = internalVals.length ? mean(internalVals) : NaN;
    const avgRmssd = rmssdBucketVals.length ? mean(rmssdBucketVals) : NaN;
    const avgPhysRaw = isFiniteNumber(avgRmssd) && isFiniteNumber(rmssdRange.min) && isFiniteNumber(rmssdRange.max)
      ? normalize(avgRmssd, rmssdRange.min, rmssdRange.max)
      : NaN;
    const avgPhysical = isFiniteNumber(avgPhysRaw) ? rawToLevel(1 - avgPhysRaw) : NaN;

    const summary: Record<string, any> = {};
    for (const k of Object.keys(summaryAcc)) {
      const v = (summaryAcc as any)[k];
      if (k === 'stressor') {
        if (Array.isArray(v) && v.length) {
          const uniqueCodes = Array.from(new Set(v)).filter(Boolean) as string[];
          const mapped = mapStressorLabel
            ? uniqueCodes.map((code) => mapStressorLabel(code)).filter(Boolean)
            : uniqueCodes;
          summary[k] = mapped.length ? mapped : undefined;
        } else {
          summary[k] = undefined;
        }
      } else if (Array.isArray(v)) {
        summary[k] = v.length ? mean(v) : undefined;
      } else {
        summary[k] = v;
      }
    }

    b.avgInternal = Number.isNaN(avgInternal) ? undefined : avgInternal;
    b.avgPhysical = Number.isNaN(avgPhysical) ? undefined : avgPhysical;
    b.summary = summary;
  }

  return out;
};
