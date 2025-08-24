import useCorrelationData, { TreemapCategory } from "@/hooks/useCorrelationData";
import { NAMES, labelMap } from "@/data/stressWhy";
import { useMemo } from "react";
import { josa } from "es-hangul";

const weirdRelationCheck = [
  { name: 'stressor_lack_ability', type: 'stressor', negative: false },
  { name: 'stressor_difficult_work', type: 'stressor', negative: false },
  { name: 'stressor_eval_pressure', type: 'stressor', negative: false },
  { name: 'stressor_work_bad', type: 'stressor', negative: false },
  { name: 'stressor_hard_communication', type: 'stressor', negative: false },
  { name: 'stressor_rude_customer', type: 'stressor', negative: false },
  { name: 'stressor_time_pressure', type: 'stressor', negative: false },
  { name: 'stressor_noise', type: 'stressor', negative: false },
  { name: 'stressor_peer_conflict', type: 'stressor', negative: false },
  { name: 'stressor_other', type: 'stressor', negative: false },
  { name: 'valence', type: 'context', negative: true },
  { name: 'tiredness', type: 'context', negative: false },
  { name: 'workload', type: 'context', negative: false },
  { name: 'surface_acting', type: 'context', negative: false },
  { name: 'call_type_angry', type: 'context', negative: false },
  { name: 'daily_stress', type: 'daily_context', negative: false },
  { name: 'daily_valence', type: 'daily_context', negative: true },
  { name: 'daily_tiredness', type: 'daily_context', negative: false },
  { name: 'daily_general_sleep_quality', type: 'daily_context', negative: true },
  { name: 'daily_general_health', type: 'daily_context', negative: true },
]

const getTopNFromData = (data: { x: string, y: number }[], n: number) => {
  const sortedData = data.sort((a: { x: string, y: number }, b: { x: string, y: number }) => b.y - a.y);
  const nthScore = sortedData[n - 1]?.y || 0;

  const topItems = sortedData.filter((item: { x: string, y: number }, index: number) => {
    if (index < n) return true; // Top N은 항상 포함
    return Math.abs(item.y / nthScore) >= 0.85 * index / n; // N등과 비슷한 점수인 항목들도 포함
  });

  return topItems.map((item: { x: string, y: number, type?: TreemapCategory }) => ({ name: item.x, type: item.type }));
}

const TreemapTemplate: React.FC<{
  type: 'psychological' | 'physiological',
  top3: { name: string, type: TreemapCategory }[],
  topData: { [key in TreemapCategory]: string[] }
  weirdRelations: { name: string, type: TreemapCategory, negative: boolean }[]
}> = ({ type, top3, topData, weirdRelations }) => {
  const stressType = type === 'psychological' ? <strong className="text-violet-500">인지 스트레스</strong> : <strong className="text-orange-500">신체 스트레스</strong>;

  const getColoredComponent = (item: { name: string, type: TreemapCategory }) => {
    if (item.type === 'stressor') return <strong style={{ color: '#A93F55' }}>{item.name}</strong>
    else if (item.type === 'env') return <strong style={{ color: '#52B12C' }}>{item.name}</strong>
    else if (item.type === 'context') return <strong style={{ color: '#33A1FD' }}>{item.name}</strong>
    else if (item.type === 'daily_context') return <strong style={{ color: '#1c1e7a' }}>{item.name}</strong>
  }

  const getJoinedColoredComponent = (items: { name: string, type: TreemapCategory }[]) => {
    return items.map((item, idx) => <span key={idx}>{getColoredComponent(item)}{idx !== items.length - 1 ? ', ' : ''}</span>)
  }

  const positiveWeirdRelations = weirdRelations.filter(v => v.negative)
  const negativeWeirdRelations = weirdRelations.filter(v => !v.negative)

  return <>
    당신의 {stressType}와 가장 연관성이 높은 항목은 {getJoinedColoredComponent(top3)}{josa.pick(top3.at(-1)?.name ?? '', '이였습니다/였습니다')}.<br />

    데이터의 종류 별로 봤을 때, <strong style={{ color: '#A93F55' }}>스트레스 요인</strong> 중 가장 연관성이 높은 항목은 <strong style={{ color: '#A93F55' }}>{topData.stressor?.join()}</strong>{josa.pick(topData.stressor?.at(-1) ?? '', '이였습니다/였습니다')}.&nbsp;
    <strong style={{ color: '#52B12C' }}>환경 데이터</strong>에서는 <strong style={{ color: '#52B12C' }}>{topData.env?.join(', ')}</strong>,&nbsp;
    <strong style={{ color: '#33A1FD' }}>상황 데이터</strong>에서는 <strong style={{ color: '#33A1FD' }}>{topData.context?.join(', ')}</strong>{josa.pick(topData.context?.at(-1) ?? '', '이/가')} 가장 관련이 있었습니다.&nbsp;
    <strong style={{ color: '#1c1e7a' }}>일일 상황 데이터</strong>에서는 <strong style={{ color: '#1c1e7a' }}>{topData.daily_context?.join(', ')}</strong>{josa.pick(topData.daily_context?.at(-1) ?? '', '이/가')} 가장 연관이 있었습니다. <br /><br />

    {weirdRelations.length > 0 && <>
      몇몇 데이터의 경우, 특이하게도 {stressType} 점수가 높을 수록 오히려
      {positiveWeirdRelations.length > 0 && negativeWeirdRelations.length == 0 ? <> 높아지는({getJoinedColoredComponent(positiveWeirdRelations)}) </> : ''}
      {positiveWeirdRelations.length == 0 && negativeWeirdRelations.length > 0 ? <> 낮아지는({getJoinedColoredComponent(negativeWeirdRelations)}) </> : ''}
      {positiveWeirdRelations.length > 0 && negativeWeirdRelations.length > 0 ? <> 높아지거나({getJoinedColoredComponent(positiveWeirdRelations)}) 낮아지는({getJoinedColoredComponent(negativeWeirdRelations)}) </> : ''}
      경향성을 보였습니다. <br /><br />
    </>}
    관련도 점수를 더 자세히 보고 싶으시다면, 차트 위에 마우스를 올려보세요!
  </>
}

const TreeMapInfo: React.FC<{ pid: string, type: 'psychological' | 'physiological' }> = ({ pid, type }) => {
  const { loading, error, groupedByType } = useCorrelationData('/data/correlation.csv', pid);

  const topNCnt = {
    'stressor': 1,
    'env': 1,
    'context': 2,
    'daily_context': 2,
    'other': 1
  }

  const top3Data = useMemo(() => {
    if (loading) return []
    const flatData = NAMES.map((item) => groupedByType[item][type][0].data.map((v) => ({ ...v, type: item }))).flat()
    const top3 = getTopNFromData(flatData, 3)
    return top3.map((item) => ({ name: labelMap(item.name), type: item.type ?? 'other' }))
  }, [groupedByType, type, loading])

  const weirdRelations = useMemo(() => {
    if (loading) return []
    const flatData = NAMES.map((item) => groupedByType[item][type][0].data.map((v) => ({ ...v, type: item }))).flat()
    const maxScore = Math.max(...flatData.map(v => v.y))
    const weirdRelations = weirdRelationCheck.filter(v => flatData.some(v2 => v2.x === v.name && v2.y / maxScore > 0.2 && ((v2.raw ?? 0) * (type === 'psychological' ? 1 : -1) > 0 === v.negative)))
    return weirdRelations.map((item) => ({ name: labelMap(item.name), type: item.type ?? 'other', negative: item.negative }))
  }, [groupedByType, type, loading])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const topData = NAMES.reduce((acc, item) => {
    acc[item] = getTopNFromData(groupedByType[item][type][0].data, topNCnt[item]).map((v) => labelMap(v.name));
    return acc;
  }, {} as { [key: string]: string[] });
  // const globalTop3 = getTopNFromData(NAMES.map((item) => groupedByType[item][type][0].data.map((v) => ({ ...v, type: item }))).flat(), 3).map((item) => labelMap(item.type))
  // console.log(globalTop3)

  return <TreemapTemplate type={type} top3={top3Data} topData={topData} weirdRelations={weirdRelations} />
};

export default TreeMapInfo;