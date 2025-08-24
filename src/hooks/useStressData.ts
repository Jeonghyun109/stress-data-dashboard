import { useEffect, useState } from 'react';
import Papa from 'papaparse';

type DailyStress = {
  psych: number;     // 0..3
  phys: number;      // 0..3
  psychRaw?: number; // 0..1 normalized raw
  physRaw?: number;  // 0..1 normalized raw
  count: number;
};

type UseStressDataResult = {
  loading: boolean;
  error: string | null;
  dailyMap: Map<string, DailyStress>;
  // convenience getter
  getForDate: (isoDate: string) => DailyStress | undefined;
  // raw rows for a specific date (if you need time-of-day data)
  getRowsForDate: (isoDate: string) => Array<Record<string, any>>;
};

export default function useStressData(csvUrl = '/data/feature_full.csv', pid?: string): UseStressDataResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyMap, setDailyMap] = useState<Map<string, DailyStress>>(new Map());
  const [rowsByDate, setRowsByDate] = useState<Map<string, Array<Record<string, any>>>>(new Map());

  useEffect(() => {
    console.log("useStressData received PID ", pid)
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

        // collect per-day raw lists
        const byDay = new Map<string, {
          psychVals: number[];
          hrVals: number[];
          rmssdVals: number[];
          accVals: number[];
        }>();
        // also keep original rows per local-date for timeline use
        const rawByDate = new Map<string, Array<Record<string, any>>>();

        for (const r of rows) {
          // filter by pid if provided
          const rowPid = String(r.pid ?? r.participant_id ?? r.user_id ?? '');
          if (pid && rowPid !== pid) continue;

          // prefer windowStartTime -> surveyTime -> callEndTime (epoch). normalize to ms and use local date
          const tRaw = Number(r.windowStartTime ?? r.surveyTime ?? r.callEndTime);
          if (!tRaw || Number.isNaN(tRaw)) continue;
          const epochMs = tRaw < 1e12 ? tRaw * 1000 : tRaw;
          const dt = new Date(epochMs);
          const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

          // store raw row for that local date
          if (!rawByDate.has(iso)) rawByDate.set(iso, []);
          rawByDate.get(iso)!.push({ ...r, __epochMs: epochMs });

          const psych = Number(r.stress ?? r.daily_stress ?? r.psych ?? NaN);
          const hr = Number(r.hr_mean ?? NaN);
          const rmssd = Number(r.rmssd ?? NaN);
          const acc = Number(r.acc_mean ?? NaN);

          if (!byDay.has(iso)) {
            byDay.set(iso, { psychVals: [], hrVals: [], rmssdVals: [], accVals: [] });
          }
          const entry = byDay.get(iso)!;
          if (!Number.isNaN(psych)) entry.psychVals.push(psych);
          if (!Number.isNaN(hr)) entry.hrVals.push(hr);
          if (!Number.isNaN(rmssd)) entry.rmssdVals.push(rmssd);
          if (!Number.isNaN(acc)) entry.accVals.push(acc);
        }

        // compute per-day raw aggregates
        const days = Array.from(byDay.entries()).map(([iso, arr]) => {
          const mean = (a: number[]) => a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN;
          return {
            iso,
            psychMean: mean(arr.psychVals),
            hrMean: mean(arr.hrVals),
            rmssdMean: mean(arr.rmssdVals),
            accMean: mean(arr.accVals),
          };
        });

        // compute min/max for normalization (skip NaN)
        const getRange = (vals: number[]) => {
          const filtered = vals.filter(v => !Number.isNaN(v));
          if (!filtered.length) return { min: NaN, max: NaN };
          return { min: Math.min(...filtered), max: Math.max(...filtered) };
        };

        const psychRange = getRange(days.map(d => d.psychMean));
        const hrRange = getRange(days.map(d => d.hrMean));
        const rmssdRange = getRange(days.map(d => d.rmssdMean));
        const accRange = getRange(days.map(d => d.accMean));

        const normalize = (v: number, min: number, max: number) => {
          if (Number.isNaN(v) || Number.isNaN(min) || Number.isNaN(max) || max === min) return NaN;
          return (v - min) / (max - min);
        };

        const mapOut = new Map<string, DailyStress>();
        for (const d of days) {
          // psych normalized 0..1
          const psychRaw = Number.isNaN(d.psychMean) ? NaN : normalize(d.psychMean, psychRange.min, psychRange.max);

          // phys: combine normalized hr (higher = more stress), inverse rmssd (lower rmssd -> more stress),
          // and acc (higher = more movement/stress). We average available normalized components.
          const components: number[] = [];
          const nh = Number.isNaN(d.hrMean) ? NaN : normalize(d.hrMean, hrRange.min, hrRange.max);
          if (!Number.isNaN(nh)) components.push(nh);
          const nrmssd = Number.isNaN(d.rmssdMean) ? NaN : normalize(d.rmssdMean, rmssdRange.min, rmssdRange.max);
          if (!Number.isNaN(nrmssd)) components.push(1 - nrmssd); // inverse: smaller rmssd -> larger stress => 1 - norm
          const nacc = Number.isNaN(d.accMean) ? NaN : normalize(d.accMean, accRange.min, accRange.max);
          if (!Number.isNaN(nacc)) components.push(nacc);

          const physRaw = components.length ? components.reduce((s, v) => s + v, 0) / components.length : NaN;

          // map raw(0..1) -> level 0..3
          const rawToLevel = (x: number) => {
            if (Number.isNaN(x)) return 0;
            return Math.max(0, Math.min(3, Math.round(x * 3)));
          };

          const psychLevel = Number.isNaN(psychRaw) ? 0 : rawToLevel(psychRaw);
          const physLevel = Number.isNaN(physRaw) ? 0 : rawToLevel(physRaw);

          mapOut.set(d.iso, {
            psych: psychLevel,
            phys: physLevel,
            psychRaw: Number.isNaN(psychRaw) ? undefined : psychRaw,
            physRaw: Number.isNaN(physRaw) ? undefined : physRaw,
            count:
              (Number.isNaN(d.psychMean) ? 0 : 1) +
              (Number.isNaN(d.hrMean) && Number.isNaN(d.rmssdMean) && Number.isNaN(d.accMean) ? 0 : 1),
          });
        }

        if (mounted) {
          setDailyMap(mapOut);
          setRowsByDate(rawByDate);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message ?? String(err));
          setLoading(false);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [csvUrl, pid]); // pid 포함

  const getForDate = (isoDate: string) => dailyMap.get(isoDate);
  const getRowsForDate = (isoDate: string) => rowsByDate.get(isoDate) ?? [];

  return { loading, error, dailyMap, getForDate, getRowsForDate };
}