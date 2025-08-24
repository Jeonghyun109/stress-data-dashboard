import useCorrelationData, { TreemapCategory } from "@/hooks/useCorrelationData";
import { NAMES, STRESSORS, ENV, CONTEXT, DAILY_CONTEXT } from "@/data/stressWhy";
import { useMemo } from "react";

const TreemapTemplate: React.FC<{
  type: 'psychological' | 'physiological',
  top3: { name: string, type: TreemapCategory }[],
  topData: { [key: string]: string[] }
}> = ({ type, top3, topData }) => {
  const stressType = type === 'psychological' ? <strong className="text-violet-500">인지 스트레스</strong> : <strong className="text-orange-500">신체 스트레스</strong>;

  const top3Component = top3.map((item: { name: string, type: TreemapCategory }, idx: number) => {
    if (item.type === 'stressor') return <strong key={idx} style={{ color: '#A93F55' }}>{item.name}</strong>
    else if (item.type === 'env') return <strong key={idx} style={{ color: '#52B12C' }}>{item.name}</strong>
    else if (item.type === 'context') return <strong key={idx} style={{ color: '#33A1FD' }}>{item.name}</strong>
    else if (item.type === 'daily_context') return <strong key={idx} style={{ color: '#1c1e7a' }}>{item.name}</strong>
  })

  return <>
    당신의 {stressType}와 가장 연관성이 높은 항목은 {
      top3Component.map((item, idx) => <span key={idx}>{item} {idx !== top3Component.length - 1 ? ', ' : ''}</span>)
    }였습니다. <br />

    데이터의 종류 별로 봤을 때, <strong style={{ color: '#A93F55' }}>스트레스 요인</strong> 중 가장 연관성이 높은 항목은 <strong style={{ color: '#A93F55' }}>{topData.stressor?.join()}</strong>이였습니다.
    <strong style={{ color: '#52B12C' }}>환경 데이터</strong>에서는 <strong style={{ color: '#52B12C' }}>{topData.env?.join(', ')}</strong>,
    상황 데이터에서는 <strong style={{ color: '#33A1FD' }}>{topData.context?.join(', ')}</strong>가 가장 관련이 있었습니다.
    일일 상황 데이터에서는 <strong style={{ color: '#1c1e7a' }}>{topData.daily_context?.join(', ')}</strong>가 가장 연관이 있었습니다. <br /><br />

    관련도 점수를 더 자세히 보고 싶으시다면, 차트 위에 마우스를 올려보세요!
  </>
}

const TreeMapInfo: React.FC<{ pid: string, type: 'psychological' | 'physiological' }> = ({ pid, type }) => {
  const { loading, error, groupedByType } = useCorrelationData('/data/correlation.csv', pid);

  const labelMap = (topType: TreemapCategory) => {
    if (topType === 'stressor') return STRESSORS;
    if (topType === 'env') return ENV;
    if (topType === 'context') return CONTEXT;
    if (topType === 'daily_context') return DAILY_CONTEXT;
    return undefined;
  }

  const topNCnt = {
    'stressor': 1,
    'env': 1,
    'context': 2,
    'daily_context': 2,
    'other': 1
  }

  const getTopNFromData = (data: { x: string, y: number }[], n: number) => {
    const sortedData = data.sort((a: { x: string, y: number }, b: { x: string, y: number }) => b.y - a.y);
    const nthScore = sortedData[n - 1]?.y || 0;

    // 데이터 분포를 고려한 동적 임계값 설정
    const scores = sortedData.map(item => item.y);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // 표준편차의 0.5배를 임계값으로 사용 (분포에 따라 적응적)

    const topItems = sortedData.filter((item: { x: string, y: number }, index: number) => {
      if (index < n) return true; // Top N은 항상 포함
      return item.y / nthScore >= 0.85 * index / n; // N등과 비슷한 점수인 항목들도 포함
    });

    return topItems.map((item: { x: string, y: number, type?: TreemapCategory }) => ({ name: item.x, type: item.type }));
  }

  const top3Data = useMemo(() => {
    if (loading) return []
    const flatData = NAMES.map((item) => groupedByType[item][type][0].data.map((v) => ({ ...v, type: item }))).flat()
    const top3 = getTopNFromData(flatData, 3)
    return top3.map((item) => ({ name: labelMap(item.type ?? 'other')[item.name], type: item.type ?? 'other' }))
  }, [groupedByType, type, loading])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const topData = NAMES.reduce((acc, item) => {
    acc[item] = getTopNFromData(groupedByType[item][type][0].data, topNCnt[item]).map((v) => labelMap(item)[v.name]);
    return acc;
  }, {} as { [key: string]: string[] });
  // const globalTop3 = getTopNFromData(NAMES.map((item) => groupedByType[item][type][0].data.map((v) => ({ ...v, type: item }))).flat(), 3).map((item) => labelMap(item.type))
  // console.log(globalTop3)

  return <TreemapTemplate type={type} top3={top3Data} topData={topData} />
};

export default TreeMapInfo;