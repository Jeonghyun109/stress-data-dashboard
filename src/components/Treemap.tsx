'use client';

import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { NAMES, CONTENT, labelMap } from '@/data/stressWhy';
import useCorrelationData, { TreemapCategory, TreemapGroup } from '@/hooks/useCorrelationData';
import TreeMapInfo from './report/TreeMapReport';

// SSR에서 window 참조 오류 방지
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TreemapDatum = { x: string; y: number, raw: number };

/*
    TODOs
    1. 데이터 값에 따라 다른 map 간에도 크기 다르게 보여주기
    2. LLM으로 설명문 추가
*/
const BasicTreemap: React.FC<{ pid: string }> = ({ pid }) => {
  const { loading, error, groupedByType } = useCorrelationData('/data/correlation.csv', pid);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getSeries = (topType: TreemapCategory, type: 'psychological' | 'physiological'): ApexAxisChartSeries => {
    const raw = groupedByType[topType]?.[type] ?? [];
    // clone groups and map each datum.x using appropriate label map
    const result = raw.map((group: TreemapGroup) => ({
      name: group.name,
      data: group.data.map(datum => {
        const mapped = labelMap(datum.x);
        return { x: mapped, y: datum.raw * 100, raw: datum.raw, fill: { type: 'image', opacity: 0, pattern: { style: 'verticalLines' } } };
      })
    }))

    return result
  };

  const psycho_sum: number[] = NAMES.map(v => groupedByType[v as TreemapCategory]['psychological'][0].data.map(d => d.y).reduce((acc: number, curr: number) => acc + curr, 0))
  const physio_sum: number[] = NAMES.map(v => groupedByType[v as TreemapCategory]['physiological'][0].data.map(d => d.y).reduce((acc: number, curr: number) => acc + curr, 0))

  const options = (color: string): ApexOptions => {
    // const series = getSeries(topType, type)
    // const fillType = series[0].data.map(({ raw }) => raw > 0 ? 'solid' : 'pattern')
    // console.log(fillType)

    return {
      legend: { show: true },
      chart: {
        type: 'treemap',
        toolbar: { show: false },
        parentHeightOffset: 0,          // 부모 높이 오프셋 제거
      },
      grid: {                           // 내부 패딩 0
        padding: { top: -20, bottom: 0, left: 0, right: 0 },
      },
      colors: [color],
      tooltip: {
        y: {
          formatter: function (value) {
            return value.toFixed(2) + '점'
          }
        }
      },
      fill: {
        // type: fillType,
        pattern: {
          width: 2,
          height: 2,
          strokeWidth: 1.5,
          style: "verticalLines",
        }
      },
    }
  };

  return (
    <div className="w-full my-4 flex gap-20 justify-between">
      {/* 인지 스트레스 */}
      <div className="w-1/2">
        <div className="font-semibold text-2xl mb-4">{CONTENT.BODY_1.TITLE}</div>
        {CONTENT.BODY_1.CATEGORY.map((item, psy_idx) => (
          <div className="flex flex-col" key={item.NAME}>
            <div className="flex flex-row gap-4 justify-start">
              <div className="h-full my-auto font-bold w-[94px] text-center">{item.NAME}</div>
              <ReactApexChart options={options(item.COLOR)} series={getSeries(NAMES[psy_idx], 'psychological')} type="treemap" width={490 * psycho_sum[psy_idx] / Math.max(...psycho_sum)} height={200} />
            </div>
          </div>
        ))}
        <div className="mt-4 w-full">
          <TreeMapInfo pid={pid} type="psychological" />
        </div>
      </div>
      {/* 신체 스트레스 */}
      <div className="w-1/2">
        <div className="font-semibold text-2xl mb-4">{CONTENT.BODY_2.TITLE}</div>
        {CONTENT.BODY_2.CATEGORY.map((item, phy_idx) => (
          <div className="flex flex-col" key={item.NAME}>
            <div className="flex flex-row gap-4 justify-start">
              <div className="h-full my-auto font-bold w-[94px] text-center">{item.NAME}</div>
              <ReactApexChart options={options(item.COLOR)} series={getSeries(NAMES[phy_idx], 'physiological')} type="treemap" width={490 * physio_sum[phy_idx] / Math.max(...physio_sum)} height={200} />
            </div>
          </div>
        ))}
        <div className="mt-4 w-full">
          <TreeMapInfo pid={pid} type="physiological" />
        </div>
      </div>
    </div>
  );
};
export default BasicTreemap;