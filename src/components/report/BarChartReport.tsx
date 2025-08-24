import useEffectData from "@/hooks/useEffectData";
import { useMemo } from "react";
import { josa } from "es-hangul";

const getTopNFromData = (data: { name: string, value: number }[], n: number) => {
  const sortedData = data.sort((a, b) => b.value - a.value);
  const nthScore = sortedData[n - 1]?.value || 0;

  const topItems = sortedData.filter((item, index) => {
    if (index < n) return true; // Top N은 항상 포함
    return item.value - nthScore >= 0.85 * index / n; // N등과 비슷한 점수인 항목들도 포함
  });
  return topItems;
}

const BarChartTemplate: React.FC<{
  type: 'psychological' | 'physiological',
  topInterventions: { name: string, value: number }[],
  worstInterventions: { name: string, value: number }[],
}> = ({ type, topInterventions, worstInterventions }) => {
  const stressType = type === 'psychological' ? <strong className="text-violet-500">인지 스트레스</strong> : <strong className="text-orange-500">신체 스트레스</strong>;
  const stressTypeText = type === 'psychological' ? '인지 스트레스' : '신체 스트레스';

  const topInterventionNames = topInterventions.map(item => item.name);
  const worstInterventionNames = worstInterventions.map(item => item.name);

  return <>
    당신의 {stressType}는 <strong style={{ color: '#14b8a6' }}>{topInterventionNames.join(', ')}</strong>{josa.pick(topInterventionNames.at(-1) ?? '', '을/를')} 했을 때 많이 저감되었습니다. <br />

    {worstInterventions.length > 0 && worstInterventions[0]?.value < 0 && <>
      반면, <strong style={{ color: '#f87171' }}>{worstInterventionNames.join(', ')}</strong>를 했을 때는 오히려 {stressTypeText}가 증가하는 경향을 보였습니다.<br />
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
    return getTopNFromData(interventionData, 2);
  }, [interventionData, loading]);

  const worstInterventions = useMemo(() => {
    if (loading) return [];
    const sortedData = interventionData.map(v => ({ ...v, value: -v.value }));
    return getTopNFromData(sortedData, 1).map(v => ({ ...v, value: -v.value }));
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
