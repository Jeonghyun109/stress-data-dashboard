import { useEffect, useState } from 'react';
import { getRange, isFiniteNumber, mean, toNumber } from '@/utils/dataUtils';
import { fetchCsvRows } from '@/utils/csvUtils';
import { filterRowsByPid, normalizePid } from '@/utils/pidUtils';

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

const rawToDiffLevel = (value: number) => {
  if (!isFiniteNumber(value)) return 0;
  return Math.max(-4, Math.min(4, Math.round(value * 4)));
};

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

        const rows = await fetchCsvRows<Record<string, any>>(csvUrl);
        // PID로 먼저 필터링 (있을 때만)
        const filteredRows = filterRowsByPid(rows, pid);

        const byDay = new Map<string, {
          psychVals: number[];
          rmssdVals: number[];
        }>();
        const rawByDate = new Map<string, Array<Record<string, any>>>(); // now will contain feature objects per row

        for (const r of filteredRows) {
          const rowPid = normalizePid(r.pid ?? r.participant_id ?? r.user_id);
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
            perceived_diff: isFiniteNumber(perceived_diff) ? perceived_diff : undefined,
            physio_diff: isFiniteNumber(physio_diff) ? physio_diff : undefined,
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
          if (isFiniteNumber(psych)) entry.psychVals.push(psych);
          if (isFiniteNumber(rmssd_forAgg)) entry.rmssdVals.push(rmssd_forAgg);
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
          const psychRaw = isFiniteNumber(d.psychMean) ? d.psychMean : NaN;

          const components: number[] = [];
          const rmssd_abs_max = Math.max(Math.abs(rmssdRange.min), Math.abs(rmssdRange.max));
          const nrmssd = isFiniteNumber(d.rmssdMean) ? d.rmssdMean / rmssd_abs_max : NaN;
          if (isFiniteNumber(nrmssd)) components.push(nrmssd);
          const physRaw = components.length ? components.reduce((s, v) => s + v, 0) / components.length : NaN;

          const psychLevel = isFiniteNumber(psychRaw) ? Math.round(psychRaw) : 0;
          const physLevel = isFiniteNumber(physRaw) ? rawToDiffLevel(physRaw) : 0;

          out.set(d.iso, {
            psych: psychLevel,
            phys: physLevel,
            psychRaw: isFiniteNumber(psychRaw) ? psychRaw : undefined,
            physRaw: isFiniteNumber(physRaw) ? physRaw : undefined,
            count: d.count,
          });
        }

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
