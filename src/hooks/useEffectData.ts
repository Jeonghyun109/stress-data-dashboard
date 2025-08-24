import { useEffect, useState } from "react";
import Papa from "papaparse";

type DiffRow = {
  pid: string | number;
  interventionName: string;
  perceived_diff?: number | null;
  physio_diff?: number | null;
};

type UseEffectDataResult = {
  loading: boolean;
  error: string | null;
  categories: string[]; // interventionName order (original csv order)
  perceivedSeries: number[]; // values aligned with categories
  physioSeries: number[];    // values aligned with categories
  apexSeries: { name: string; data: number[] }[];
  // sorted (descending) views for charts
  categoriesPerceivedSorted: string[];
  perceivedSeriesSorted: number[];
  categoriesPhysioSorted: string[];
  physioSeriesSorted: number[];
};

export default function useEffectData(csvUrl = "/data/diff_rate.csv", pid?: string | number): UseEffectDataResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [perceivedSeries, setPerceivedSeries] = useState<number[]>([]);
  const [physioSeries, setPhysioSeries] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    const pidKey = String(pid ?? "");
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const resp = await fetch(csvUrl);
        if (!resp.ok) throw new Error(`fetch failed: ${resp.status}`);
        const text = await resp.text();

        const parsed = Papa.parse<Record<string, any>>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        const rows = (parsed.data as Record<string, any>[]).map(r => ({
          pid: r.pid,
          interventionName: (r.interventionName ?? r.intervention ?? "").toString(),
          perceived_diff: r.perceived_diff === "" || r.perceived_diff == null ? undefined : Number(r.perceived_diff),
          physio_diff: r.physio_diff === "" || r.physio_diff == null ? undefined : Number(r.physio_diff),
        })) as DiffRow[];

        const filtered = pid !== undefined && pid !== null && pidKey !== ""
          ? rows.filter(r => String(r.pid) === pidKey)
          : rows;

        // group by interventionName and compute mean for each metric
        const map = new Map<string, { cnt: number; perceivedSum: number; physioSum: number; perceivedCnt: number; physioCnt: number }>();
        for (const r of filtered) {
          const name = r.interventionName?.trim() || "(unknown)";
          if (!map.has(name)) map.set(name, { cnt: 0, perceivedSum: 0, physioSum: 0, perceivedCnt: 0, physioCnt: 0 });
          const entry = map.get(name)!;
          entry.cnt += 1;
          if (typeof r.perceived_diff === "number" && !Number.isNaN(r.perceived_diff)) {
            entry.perceivedSum += r.perceived_diff;
            entry.perceivedCnt += 1;
          }
          if (typeof r.physio_diff === "number" && !Number.isNaN(r.physio_diff)) {
            entry.physioSum += r.physio_diff;
            entry.physioCnt += 1;
          }
        }

        // preserve insertion order from csv: use map keys order
        const cats = Array.from(map.keys());
        const perceived: number[] = cats.map(k => {
          const e = map.get(k)!;
          return e.perceivedCnt ? e.perceivedSum / e.perceivedCnt : 0;
        });
        const physio: number[] = cats.map(k => {
          const e = map.get(k)!;
          return e.physioCnt ? e.physioSum / e.physioCnt : 0;
        });

        if (mounted) {
          setCategories(cats);
          setPerceivedSeries(perceived);
          setPhysioSeries(physio);
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

  // create sorted views (descending)
  const makeSorted = (cats: string[], values: number[]) => {
    const arr = cats.map((c, i) => ({ c, v: Number(values[i] ?? 0) }));
    arr.sort((a, b) => b.v - a.v);
    return {
      categoriesSorted: arr.map(x => x.c),
      valuesSorted: arr.map(x => x.v),
    };
  };

  const perceivedSorted = makeSorted(categories, perceivedSeries);
  const physioSorted = makeSorted(categories, physioSeries);

  const apexSeries = [
    { name: "인지 (perceived_diff)", data: perceivedSeries },
    { name: "신체 (physio_diff)", data: physioSeries },
  ];

  return {
    loading,
    error,
    categories,
    perceivedSeries,
    physioSeries,
    apexSeries,
    categoriesPerceivedSorted: perceivedSorted.categoriesSorted,
    perceivedSeriesSorted: perceivedSorted.valuesSorted,
    categoriesPhysioSorted: physioSorted.categoriesSorted,
    physioSeriesSorted: physioSorted.valuesSorted,
  };
}

