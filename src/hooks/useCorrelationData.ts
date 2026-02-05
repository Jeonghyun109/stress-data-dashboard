import { useEffect, useState } from "react";
import { fetchCsvRows } from "@/utils/csvUtils";
import { filterRowsByPid, normalizePid } from "@/utils/pidUtils";
// import { stressor_list as STRESSOR_MAP, env_list as ENV_MAP, context_list as CONTEXT_MAP } from "@/data/stressWhy";

export type CorRow = {
  pid: string;
  feature: string;
  category: string;
  stress?: number | null; // psychological correlation
  rmssd?: number | null;  // physiological correlation
};

export type TreemapDatum = { x: string; y: number; raw?: number | null };
export type TreemapGroup = { name: string; data: TreemapDatum[] };
export type TreemapCategory = "stressor" | "env" | "context" | "daily_context" | "other";

type GroupedByType = {
  stressor: { psychological: TreemapGroup[]; physiological: TreemapGroup[] };
  env: { psychological: TreemapGroup[]; physiological: TreemapGroup[] };
  context: { psychological: TreemapGroup[]; physiological: TreemapGroup[] };
  daily_context: { psychological: TreemapGroup[]; physiological: TreemapGroup[] };
  other: { psychological: TreemapGroup[]; physiological: TreemapGroup[] };
};

type UseCorrelationResult = {
  loading: boolean;
  error: string | null;
  rows: CorRow[];
  // series grouped by category, ready to pass to ApexCharts treemap:
  psychologicalSeries: TreemapGroup[];
  physiologicalSeries: TreemapGroup[];
  // separated top-level groups
  groupedByType: GroupedByType;
  // convenience getters
  getRowsForPid: (pid?: string) => CorRow[];
  getSeriesForPid: (pid?: string) => { psychological: TreemapGroup[]; physiological: TreemapGroup[] };
};

/**
 * useCorrelationData
 * - csvUrl default: '/data/correlation.csv' (public/data/correlation.csv)
 * - pid optional: if provided, only rows with matching pid are included
 *
 * Treemap groups are created by 'category' (empty -> 'uncategorized').
 * Each datum.y is the absolute correlation magnitude scaled to 0..100 (|r| * 100),
 * which suits treemap sizing. The raw signed correlation is kept in datum.raw.
 */
export default function useCorrelationData(csvUrl = "/data/correlation.csv", pid: string): UseCorrelationResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CorRow[]>([]);
  const [psychSeries, setPsychSeries] = useState<TreemapGroup[]>([]);
  const [physSeries, setPhysSeries] = useState<TreemapGroup[]>([]);
  const [groupedByType, setGroupedByType] = useState<GroupedByType>({
    stressor: { psychological: [], physiological: [] },
    env: { psychological: [], physiological: [] },
    context: { psychological: [], physiological: [] },
    daily_context: { psychological: [], physiological: [] },
    other: { psychological: [], physiological: [] },
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const rawRows = await fetchCsvRows<Record<string, any>>(
          csvUrl,
          undefined,
          { errorPrefix: "Failed to fetch CSV" }
        );

        const parsedRows: CorRow[] = rawRows.map((r) => ({
          pid: normalizePid(r.pid),
          feature: String(r.feature ?? ""),
          category: r.feature.startsWith("daily_") ? "daily_context" : (String(r.category ?? "").trim() || "uncategorized"),
          stress: typeof r.stress === "number" ? r.stress : (r.stress === "" || r.stress == null ? undefined : Number(r.stress)),
          rmssd: typeof r.rmssd === "number" ? r.rmssd : (r.rmssd === "" || r.rmssd == null ? undefined : Number(r.rmssd)),
        }));

        const filtered = filterRowsByPid(parsedRows, pid);
        // group by category (legacy behavior)
        const psychGroups = new Map<string, TreemapDatum[]>();
        const physGroups = new Map<string, TreemapDatum[]>();

        // top-level type buckets (stressor / env / context / other) -> category groups inside each
        const typePsych = {
          stressor: new Map<string, TreemapDatum[]>(),
          env: new Map<string, TreemapDatum[]>(),
          context: new Map<string, TreemapDatum[]>(),
          daily_context: new Map<string, TreemapDatum[]>(),
          other: new Map<string, TreemapDatum[]>(),
        };
        const typePhys = {
          stressor: new Map<string, TreemapDatum[]>(),
          env: new Map<string, TreemapDatum[]>(),
          context: new Map<string, TreemapDatum[]>(),
          daily_context: new Map<string, TreemapDatum[]>(),
          other: new Map<string, TreemapDatum[]>(),
        };

        for (const r of filtered) {
          const cat = (r.category || "uncategorized").trim().toLowerCase();
          // Use category column directly: accept only 'stressor', 'env' (or 'environment'), 'context'
          let topType: TreemapCategory = "other";
          if (cat === "stressor") topType = "stressor";
          else if (cat === "daily_context") topType = "daily_context";
          else if (cat === "context") topType = "context";
          else if (cat === "env" || cat === "environment") topType = "env";

          if (r.stress !== undefined && r.stress !== null && !Number.isNaN(Number(r.stress))) {
            const val = Math.abs(Number(r.stress)) * 100; // scale to 0..100 for treemap sizing
            const datum: TreemapDatum = { x: r.feature || "(unknown)", y: Number(val) || 0, raw: Number(r.stress) };
            if (!psychGroups.has(cat)) psychGroups.set(cat, []);
            psychGroups.get(cat)!.push(datum);

            // add to top-type bucket
            const bucket = typePsych[topType];
            const groupName = cat || topType;
            if (!bucket.has(groupName)) bucket.set(groupName, []);
            bucket.get(groupName)!.push(datum);
          }
          if (r.rmssd !== undefined && r.rmssd !== null && !Number.isNaN(Number(r.rmssd))) {
            const val = Math.abs(Number(r.rmssd)) * 100;
            const datum: TreemapDatum = { x: r.feature || "(unknown)", y: Number(val) || 0, raw: Number(r.rmssd) };
            if (!physGroups.has(cat)) physGroups.set(cat, []);
            physGroups.get(cat)!.push(datum);

            // add to top-type bucket
            const bucket2 = typePhys[topType];
            const groupName2 = cat || topType;
            if (!bucket2.has(groupName2)) bucket2.set(groupName2, []);
            bucket2.get(groupName2)!.push(datum);
          }
        }

        const psychSeriesOut: TreemapGroup[] = Array.from(psychGroups.entries()).map(([name, data]) => ({
          name,
          data,
        }));

        const physSeriesOut: TreemapGroup[] = Array.from(physGroups.entries()).map(([name, data]) => ({
          name,
          data,
        }));

        // convert top-type maps to TreemapGroup arrays
        const makeGroups = (m: Map<string, TreemapDatum[]>) => Array.from(m.entries()).map(([name, data]) => ({ name, data }));
        const groupedOut = {
          stressor: { psychological: makeGroups(typePsych.stressor), physiological: makeGroups(typePhys.stressor) },
          env: { psychological: makeGroups(typePsych.env), physiological: makeGroups(typePhys.env) },
          context: { psychological: makeGroups(typePsych.context), physiological: makeGroups(typePhys.context) },
          daily_context: { psychological: makeGroups(typePsych.daily_context), physiological: makeGroups(typePhys.daily_context) },
          other: { psychological: makeGroups(typePsych.other), physiological: makeGroups(typePhys.other) },
        };

        if (mounted) {
          setRows(filtered);
          setPsychSeries(psychSeriesOut);
          setPhysSeries(physSeriesOut);
          setGroupedByType(groupedOut);
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
    return () => {
      mounted = false;
    };
  }, [csvUrl, pid]);

  const getRowsForPid = (qpid?: string) => filterRowsByPid(rows, qpid);
  const getSeriesForPid = (qpid?: string) => {
    if (!qpid) return { psychological: psychSeries, physiological: physSeries };
    // compute on the fly for the requested pid
    const pidRows = filterRowsByPid(rows, qpid);
    const g1 = new Map<string, TreemapDatum[]>();
    const g2 = new Map<string, TreemapDatum[]>();
    for (const r of pidRows) {
      const cat = r.category || "uncategorized";
      if (r.stress !== undefined && r.stress !== null && !Number.isNaN(Number(r.stress))) {
        const val = Math.abs(Number(r.stress)) * 100;
        if (!g1.has(cat)) g1.set(cat, []);
        g1.get(cat)!.push({ x: r.feature, y: val, raw: r.stress });
      }
      if (r.rmssd !== undefined && r.rmssd !== null && !Number.isNaN(Number(r.rmssd))) {
        const val = Math.abs(Number(r.rmssd)) * 100;
        if (!g2.has(cat)) g2.set(cat, []);
        g2.get(cat)!.push({ x: r.feature, y: val, raw: r.rmssd });
      }
    }
    return {
      psychological: Array.from(g1.entries()).map(([name, data]) => ({ name, data })),
      physiological: Array.from(g2.entries()).map(([name, data]) => ({ name, data })),
    };
  };

  return {
    loading,
    error,
    rows,
    psychologicalSeries: psychSeries,
    physiologicalSeries: physSeries,
    groupedByType,
    getRowsForPid,
    getSeriesForPid,
  };
}
