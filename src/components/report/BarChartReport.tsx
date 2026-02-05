import useEffectData from "@/hooks/useEffectData";
import { useMemo } from "react";
import { josa } from "es-hangul";
import { INTERVENTION_LABELS } from "@/constants/components";
import { getTopNByValue } from "@/utils/reportUtils";

const BarChartTemplate: React.FC<{
  type: 'psychological' | 'physiological',
  topInterventions: { name: string, value: number }[],
  worstInterventions: { name: string, value: number }[],
}> = ({ type, topInterventions, worstInterventions }) => {
  const stressType = type === 'psychological'
    ? <strong className="text-violet-500">perceived stress</strong>
    : <strong className="text-orange-500">physiological stress</strong>;
  const stressTypeText = type === 'psychological' ? 'perceived stress' : 'physiological stress';

  const toLabel = (name: string) => INTERVENTION_LABELS[name] ?? name;
  const topInterventionNames = topInterventions.map(item => `${toLabel(item.name)} (${item.value.toFixed(1)}%)`);
  const worstInterventionNames = worstInterventions.map(item => `${toLabel(item.name)} (${item.value.toFixed(1)}% reduction, i.e., an increase)`);

  return <>
    Your {stressType} decreased the most with <strong style={{ color: '#14b8a6' }}>{topInterventionNames.join(' and ')}</strong>{josa.pick(topInterventionNames.at(-1) ?? '', '')}. <br />

    {worstInterventions.length > 0 && worstInterventions[0]?.value < 0 && <>
      In contrast, <strong style={{ color: '#f87171' }}>{worstInterventionNames.join(', ')}</strong> was associated with higher {stressTypeText}.<br />
    </>}
  </>
}

const BarChartInfo: React.FC<{ pid: string, type: 'psychological' | 'physiological' }> = ({ pid, type }) => {
  const { loading, error, categories, perceivedSeries, physioSeries } = useEffectData('/data/diff_rate.csv', pid);

  const interventionData = useMemo(() => {
    if (loading) return [];

    const series = type === 'psychological' ? perceivedSeries : physioSeries;
    return categories.map((name, index) => ({
      name,
      value: series[index] || 0
    })).filter(item => !isNaN(item.value));
  }, [categories, perceivedSeries, physioSeries, type, loading]);

  const topInterventions = useMemo(() => {
    if (loading) return [];
    return getTopNByValue(interventionData, 2, (item) => item.value);
  }, [interventionData, loading]);

  const worstInterventions = useMemo(() => {
    if (loading) return [];
    const sortedData = interventionData.map(v => ({ ...v, value: -v.value }));
    return getTopNByValue(sortedData, 1, (item) => item.value).map(v => ({ ...v, value: -v.value }));
  }, [interventionData, loading]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (interventionData.length === 0) return <div>데이터가 없습니다.</div>;

  return <BarChartTemplate
    type={type}
    topInterventions={topInterventions}
    worstInterventions={worstInterventions}
  />;
};

export default BarChartInfo;
