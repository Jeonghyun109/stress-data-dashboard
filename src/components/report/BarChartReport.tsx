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
  const stressType = type === 'psychological' ? <strong className="text-violet-500">perceived stress</strong> : <strong className="text-orange-500">physiological stress</strong>;
  const stressTypeText = type === 'psychological' ? 'perceived stress' : 'physiological stress';
  const INTERVENTION_LABELS_EN: Record<string, string> = {
    "스트레칭": "Stretching",
    "당 충전하기": "Sugar Boost",
    "지금 듣고 싶은 말": "Words I Need Right Now",
    "호흡하기": "Deep Breathing",
    "나를 지켜줘": "Protect Me",
    "화 먹는 요정": "Anger-Eating Fairy",
    "나 잘했지?": "I Did Well, Right?",
    "지금, 나 때문일까?": "Is It Because of Me?",
  };
  const topInterventionNames = topInterventions.map(item => `${INTERVENTION_LABELS_EN[item.name]} (${item.value.toFixed(1)}%)`);
  const worstInterventionNames = worstInterventions.map(item => `${INTERVENTION_LABELS_EN[item.name]} (${item.value.toFixed(1)}% reduction, i.e., an increase)`);

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
