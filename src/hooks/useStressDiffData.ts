import { useEffect, useState } from 'react';
import Papa from 'papaparse';

type DailyStressDiff = {
  psych: number;     // 0..4
  phys: number;      // 0..4
  psychRaw?: number; // 0..1 normalized raw
  physRaw?: number;  // 0..1 normalized raw
  count: number;
};

type UseStressDiffDataResult = {
  loading: boolean;
  error: string | null;
  dailyMap: Map<string, DailyStressDiff>;
  getForDate: (isoDate: string) => DailyStressDiff | undefined;
  getRowsForDate: (isoDate: string) => Array<Record<string, any>>;
};

/* --- helpers --- */
const toNumber = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};
const isValid = (v: number) => !Number.isNaN(v);
const mean = (arr: number[]) => arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : NaN;
const getRange = (vals: number[]) => {
  const clean = vals.filter(isValid);
  if (!clean.length) return { min: NaN, max: NaN };
  return { min: Math.min(...clean), max: Math.max(...clean) };
};
const rawToLevel = (x: number) => {
  if (!isValid(x)) return 0;
  return Math.max(-4, Math.min(4, Math.round(x * 4)));
};
/* --- end helpers --- */

export default function useStressDiffData(csvUrl = '/data/diff_full.csv', pid?: string): UseStressDiffDataResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyMap, setDailyMap] = useState<Map<string, DailyStressDiff>>(new Map());
  const [rowsByDate, setRowsByDate] = useState<Map<string, Array<Record<string, any>>>>(new Map());

  useEffect(() => {
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
        // PID로 먼저 필터링 (있을 때만)
        const filteredRows = pid
          ? rows.filter(r => {
            const rowPid = String(r.pid ?? r.participant_id ?? r.user_id ?? '');
            return rowPid === pid;
          })
          : rows;

        const byDay = new Map<string, {
          psychVals: number[];
          rmssdVals: number[];
        }>();
        const rawByDate = new Map<string, Array<Record<string, any>>>(); // now will contain feature objects per row

        for (const r of filteredRows) {
          const rowPid = String(r.pid ?? r.participant_id ?? r.user_id ?? '');
          const tRaw = new Date(r.surveyTime);
          const iso = tRaw.toISOString().slice(0, 10); // 'YYYY-MM-DD'

          // build feature object for this row (pick requested fields)
          const perceived_diff = toNumber(r.perceived_diff ?? NaN);
          const physio_diff = toNumber(r.physio_diff ?? NaN);

          const featureRow: Record<string, any> = {
            pid: rowPid,
            iso,
            isoTime: tRaw.toISOString(), // 추가된 필드
            // stress
            perceived_diff: isValid(perceived_diff) ? perceived_diff : undefined,
            physio_diff: isValid(physio_diff) ? physio_diff : undefined,
          };

          if (!rawByDate.has(iso)) rawByDate.set(iso, []);
          rawByDate.get(iso)!.push(featureRow);

          // existing aggregation inputs (keep same as before)
          const psych = toNumber(r.perceived_diff ?? NaN);
          const rmssd_forAgg = toNumber(r.physio_diff ?? NaN);

          if (!byDay.has(iso)) {
            byDay.set(iso, { psychVals: [], rmssdVals: [] });
          }
          const entry = byDay.get(iso)!;
          if (isValid(psych)) entry.psychVals.push(psych);
          if (isValid(rmssd_forAgg)) entry.rmssdVals.push(rmssd_forAgg);
        }

        // per-day aggregates
        const days = Array.from(byDay.entries()).map(([iso, arr]) => ({
          iso,
          psychMean: mean(arr.psychVals),
          rmssdMean: mean(arr.rmssdVals),
          count: arr.psychVals.length
        }));

        // ranges
        const rmssdRange = getRange(days.map(d => d.rmssdMean));

        const out = new Map<string, DailyStressDiff>();
        for (const d of days) {
          const psychRaw = isValid(d.psychMean) ? d.psychMean : NaN;

          const components: number[] = [];
          const rmssd_abs_max = Math.max(Math.abs(rmssdRange.min), Math.abs(rmssdRange.max));
          const nrmssd = isValid(d.rmssdMean) ? d.rmssdMean / rmssd_abs_max : NaN;
          if (isValid(nrmssd)) components.push(nrmssd);
          const physRaw = components.length ? components.reduce((s, v) => s + v, 0) / components.length : NaN;

          const psychLevel = isValid(psychRaw) ? Math.round(psychRaw) : 0;
          const physLevel = isValid(physRaw) ? rawToLevel(physRaw) : 0;

          out.set(d.iso, {
            psych: psychLevel,
            phys: physLevel,
            psychRaw: isValid(psychRaw) ? psychRaw : undefined,
            physRaw: isValid(physRaw) ? physRaw : undefined,
            count: d.count,
          });
        }

        console.log('rawByDate', rawByDate)

        if (mounted) {
          setDailyMap(out);
          setRowsByDate(rawByDate); // now returns feature rows per date
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

  return { loading, error, dailyMap, getForDate, getRowsForDate };
}