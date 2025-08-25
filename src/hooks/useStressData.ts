import { useEffect, useState } from 'react';
import Papa from 'papaparse';

type DailyStress = {
  psych: number;     // 0..4
  phys: number;      // 0..4
  psychRaw?: number; // 0..1 normalized raw
  physRaw?: number;  // 0..1 normalized raw
  count: number;
};

type UseStressDataResult = {
  loading: boolean;
  error: string | null;
  dailyMap: Map<string, DailyStress>;
  getForDate: (isoDate: string) => DailyStress | undefined;
  getRowsForDate: (isoDate: string) => Array<Record<string, any>>;
  getInterventionsForDate: (isoDate: string) => Array<{ name: string; time: string }>;
};

/* --- helpers --- */
const toNumber = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};
const mean = (arr: number[]) => arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : NaN;
const getRange = (vals: number[]) => {
  const clean = vals;
  if (!clean.length) return { min: NaN, max: NaN };
  return { min: Math.min(...clean), max: Math.max(...clean) };
};
const normalize = (v: number, min: number, max: number) => {
  if (max === min) return NaN;
  return (v - min) / (max - min);
};
const rawToLevel = (x: number) => {
  return Math.max(0, Math.min(4, Math.round(x * 4)));
};
// helper to coerce boolean-like / True/False / 1/0 to 1 or 0
const boolTo1 = (v: unknown) => {
  if (v === true) return 1;
  if (v === 'True' || v === 'true') return 1;
  if (v === 1 || v === '1') return 1;
  return 0;
};
/* --- end helpers --- */

export default function useStressData(csvUrl = '/data/feature_full.csv', pid?: string): UseStressDataResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyMap, setDailyMap] = useState<Map<string, DailyStress>>(new Map());
  const [rowsByDate, setRowsByDate] = useState<Map<string, Array<Record<string, any>>>>(new Map());
  const [interventionsByDate, setInterventionsByDate] = useState<Map<string, Array<{ name: string; time: string }>>>(new Map());

  useEffect(() => {
    console.log('useStressData received PID ', pid);
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(csvUrl);
        if (!resp.ok) throw new Error(`fetch failed: ${resp.status}`);
        const text = await resp.text();

        const parsed = Papa.parse<Record<string, string | number>>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        const rows = parsed.data as Array<Record<string, any>>;
        // isValid column으로 필터랑
        const validRows = rows.filter(r => r.isValid === 'True' || r.isValid === 'TRUE' || r.isValid === true || r.isValid === 1);
        // PID로 먼저 필터링 (있을 때만)
        const filteredRows = pid
          ? validRows.filter(r => {
            const rowPid = String(r.pid ?? '');
            return rowPid === pid;
          })
          : validRows;
        // console.log(filteredRows);

        // Intervention Records
        const interventionRecords = filteredRows.filter(r => r.surveyName === "after_intervention_survey");
        // build interventionsByDate map (date -> [{name, time}, ...])
        const _interventionsByDate = new Map<string, Array<{ name: string, time: string }>>();
        for (const rec of interventionRecords) {
          const t = rec.surveyTime ? new Date(rec.surveyTime) : null;
          const iso = t ? t.toISOString().slice(0, 10) : (rec.surveyTimeString ? String(rec.surveyTimeString).slice(0, 10) : null);
          const name = String(rec.interventionName ?? '');
          if (!iso) continue;
          if (!_interventionsByDate.has(iso)) _interventionsByDate.set(iso, []);
          _interventionsByDate.get(iso)!.push({ name, time: t ? t.toISOString() : String(rec.surveyTime) });
        }

        // will set state later once mounted

        const byDay = new Map<string, {
          psychVals: number[];
          rmssdVals: number[];
        }>();
        const rawByDate = new Map<string, Array<Record<string, any>>>(); // now will contain feature objects per row

        for (const r of filteredRows) {
          const rowPid = String(r.pid ?? r.participant_id ?? r.user_id ?? '');
          const tRaw = new Date(r.surveyTime);
          // Use local date string to avoid UTC offset issues
          // const iso = `${tRaw.getFullYear()}-${String(tRaw.getMonth() + 1).padStart(2, '0')}-${String(tRaw.getDate()).padStart(2, '0')}`; // 'YYYY-MM-DD'
          const iso = tRaw.toISOString().slice(0, 10);
          const calls = new Date(r.callEndTime).toISOString();

          // build feature object for this row (pick requested fields)
          const stress = toNumber(r.stress ?? NaN); // cognitive stress 0..4
          const rmssd = toNumber(r.rmssd ?? NaN); // physiological (IBI-derived)
          const workload = toNumber(r.workload ?? NaN);
          const arousal = toNumber(r.arousal ?? NaN);
          const valence = toNumber(r.valence ?? NaN);
          const tiredness = toNumber(r.tiredness ?? NaN);
          const surface_acting = toNumber(r.surface_acting ?? NaN);

          const call_type_angry = boolTo1(r.call_type_angry ?? 0);

          // stressor flags (columns in CSV like stressor_lack_ability ...)
          const lack_ability = boolTo1(r.stressor_lack_ability ?? r.lack_ability ?? 0);
          const difficult_work = boolTo1(r.stressor_difficult_work ?? r.difficult_work ?? 0);
          const eval_pressure = boolTo1(r.stressor_eval_pressure ?? r.eval_pressure ?? 0);
          const work_bad = boolTo1(r.stressor_work_bad ?? r.work_bad ?? 0);
          const hard_communication = boolTo1(r.stressor_hard_communication ?? r.hard_communication ?? 0);
          const rude_customer = boolTo1(r.stressor_rude_customer ?? r.rude_customer ?? 0);
          const time_pressure = boolTo1(r.stressor_time_pressure ?? r.time_pressure ?? 0);
          const noise = boolTo1(r.stressor_noise ?? r.noise ?? 0);
          const peer_conflict = boolTo1(r.stressor_peer_conflict ?? r.peer_conflict ?? 0);
          const stressor_other = boolTo1(r.stressor_other ?? 0);

          // daily context
          const daily_arousal = toNumber(r.daily_arousal ?? NaN);
          const daily_valence = toNumber(r.daily_valence ?? NaN);
          const daily_tiredness = toNumber(r.daily_tiredness ?? r.daily_tirednesss ?? NaN);
          const daily_general_health = toNumber(r.daily_general_health ?? NaN);
          const daily_general_sleep = toNumber(r.daily_general_sleep_quality ?? r.daily_general_sleep ?? NaN);

          // physiological
          const steps = toNumber(r.steps ?? NaN);
          const skinTemp = toNumber(r.skintemp ?? r.skinTemp ?? NaN);
          const skinTempDiff = toNumber(r.skintemp_diff ?? NaN);
          const hr_min = toNumber(r.hr_min ?? NaN);
          const hr_max = toNumber(r.hr_max ?? NaN);
          const hr_mean = toNumber(r.hr_mean ?? NaN);
          const hr_minmax = hr_max - hr_min;
          const acc_mean = toNumber(r.acc_mean ?? NaN);
          const acc_std = toNumber(r.acc_std ?? NaN);

          // environmental
          const humidity_mean = toNumber(r.humidity_mean ?? r.humiditiy_mean ?? NaN);
          const co2_mean = toNumber(r.co2_mean ?? NaN);
          const tvoc_mean = toNumber(r.tvoc_mean ?? NaN);
          const temperature_mean = toNumber(r.temperature_mean ?? NaN);

          const featureRow: Record<string, any> = {
            pid: rowPid,
            iso,
            isoTime: tRaw.toISOString(), // 추가된 필드
            calls,
            // stress
            stress,
            // physiological
            rmssd,
            // call context
            workload,
            arousal,
            valence,
            tiredness,
            surface_acting,
            call_type_angry,
            // stressor flags
            stressor_lack_ability: lack_ability,
            stressor_difficult_work: difficult_work,
            stressor_eval_pressure: eval_pressure,
            stressor_work_bad: work_bad,
            stressor_hard_communication: hard_communication,
            stressor_rude_customer: rude_customer,
            stressor_time_pressure: time_pressure,
            stressor_noise: noise,
            stressor_peer_conflict: peer_conflict,
            stressor_other,
            // daily
            daily_arousal: daily_arousal,
            daily_valence: daily_valence,
            daily_tiredness: daily_tiredness,
            daily_general_health: daily_general_health,
            daily_general_sleep: daily_general_sleep,
            // phys signals
            steps: steps,
            skintemp: skinTemp,
            skintemp_diff: skinTempDiff,
            hr_min: hr_min,
            hr_max: hr_max,
            hr_mean: hr_mean,
            hr_minmax: hr_minmax,
            acc_mean: acc_mean,
            acc_std: acc_std,
            // environment
            humidity_mean: humidity_mean,
            co2_mean: co2_mean,
            tvoc_mean: tvoc_mean,
            temperature_mean: temperature_mean,
            // intervention info (if this row is an intervention survey)
            interventionName: r.surveyName === 'after_intervention_survey' ? (r.interventionName ?? r.intervention ?? undefined) : undefined,
            interventionTime: r.surveyName === 'after_intervention_survey' ? (tRaw.toISOString()) : undefined,
            // keep original row for reference (optional)
            _raw: r,
          };

          if (!rawByDate.has(iso)) rawByDate.set(iso, []);
          rawByDate.get(iso)!.push(featureRow);


          // existing aggregation inputs (keep same as before)
          const psych = toNumber(r.stress ?? NaN) - 1;
          const rmssd_forAgg = toNumber(r.rmssd ?? NaN);

          if (!byDay.has(iso)) {
            byDay.set(iso, { psychVals: [], rmssdVals: [] });
          }
          const entry = byDay.get(iso)!;
          entry.psychVals.push(psych);
          entry.rmssdVals.push(rmssd_forAgg);
        }

        // 각 날짜별 배열을 isoTime에 따라 정렬
        for (const [date, rows] of rawByDate.entries()) {
          rawByDate.set(date, rows.sort((a, b) => new Date(a.isoTime).getTime() - new Date(b.isoTime).getTime()));
        }

        console.log(rawByDate)

        // 날짜별로 묶인 행들을 콘솔에 출력
        // console.log('=== rows grouped by date ===');
        // for (const [date, rowsForDate] of rawByDate.entries()) {
        //   console.log(date, rowsForDate);
        // }
        // console.log('=== end grouped rows ===');

        // per-day aggregates
        const days = Array.from(byDay.entries()).map(([iso, arr]) => ({
          iso,
          psychMean: mean(arr.psychVals),
          rmssdMean: mean(arr.rmssdVals),
          count: arr.psychVals.length
        }));

        // ranges
        const rmssdRange = getRange(days.map(d => d.rmssdMean));

        const out = new Map<string, DailyStress>();
        for (const d of days) {
          const psychRaw = d.psychMean;

          const components: number[] = [];
          const nrmssd = normalize(d.rmssdMean, rmssdRange.min, rmssdRange.max);
          components.push(1 - nrmssd); // inverse
          const physRaw = components.length ? components.reduce((s, v) => s + v, 0) / components.length : NaN;

          const psychLevel = Math.round(psychRaw);
          const physLevel = rawToLevel(physRaw);

          const psychPresent = d.psychMean;
          const physPresent = !Number.isNaN(d.rmssdMean);

          out.set(d.iso, {
            psych: psychLevel,
            phys: physLevel,
            psychRaw: psychRaw,
            physRaw: physRaw,
            count: d.count,
          });
        }

        if (mounted) {
          setDailyMap(out);
          setRowsByDate(rawByDate); // now returns feature rows per date
          setInterventionsByDate(_interventionsByDate);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [csvUrl, pid]);

  const getForDate = (isoDate: string) => dailyMap.get(isoDate);
  const getRowsForDate = (isoDate: string) => rowsByDate.get(isoDate) ?? [];
  const getInterventionsForDate = (isoDate: string) => interventionsByDate.get(isoDate) ?? [];

  return { loading, error, dailyMap, getForDate, getRowsForDate, getInterventionsForDate };
}