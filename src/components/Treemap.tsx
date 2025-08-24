'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { NAMES, STRESSORS, ENV, CONTEXT, CONTENT } from '@/data/stressWhy';
import useCorrelationData, { TreemapGroup } from '@/hooks/useCorrelationData';

// SSR에서 window 참조 오류 방지
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TreemapDatum = { x: string; y: number };
type TreemapSeries = { name?: string, data: TreemapDatum[] }[];

/*
    TODOs
    1. 데이터 값에 따라 다른 map 간에도 크기 다르게 보여주기
    2. LLM으로 설명문 추가
*/
const BasicTreemap: React.FC<{ pid: string }> = ({ pid }) => {
  const { loading, error, groupedByType } = useCorrelationData('/data/correlation.csv', pid);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getSeries = (topType: string, type: 'psychological' | 'physiological') => {
    const raw = (groupedByType as any)[topType]?.[type] ?? [];
    // clone groups and map each datum.x using appropriate label map
    const labelMap = topType === 'stressor' ? STRESSORS : topType === 'env' ? ENV : topType === 'context' ? CONTEXT : undefined;
    return raw.map((group: TreemapGroup) => ({
      name: group.name,
      data: group.data.map(datum => {
        const mapped = labelMap && (labelMap as any)[datum.x] ? (labelMap as any)[datum.x] : datum.x;
        return { ...datum, x: mapped };
      })
    }));
  };

  const options = (color: string): ApexOptions => ({
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
  });

  return (
    <div className="w-full my-4 flex gap-20 justify-between">
        {/* 인지 스트레스 */}
        <div className="w-1/2">
            <div className="font-semibold text-2xl">{CONTENT.BODY_1.TITLE}</div>
            {CONTENT.BODY_1.CATEGORY.map((item, psy_idx) => (
                <div className="flex flex-col" key={item.NAME}>
                    <div className="flex flex-row gap-4 justify-between">
                        <div className="h-full my-auto font-bold w-[94px] text-center">{item.NAME}</div>
                        <ReactApexChart options={options(item.COLOR)} series={getSeries(NAMES[psy_idx], 'psychological') as any} type="treemap" width={490} height={200}/>
                    </div>
                </div>
            ))}
        </div>
        {/* 신체 스트레스 */}
        <div className="w-1/2">
            <div className="font-semibold text-2xl">{CONTENT.BODY_2.TITLE}</div>
            {CONTENT.BODY_2.CATEGORY.map((item, phy_idx) => (
                <div className="flex flex-col" key={item.NAME}>
                    <div className="flex flex-row gap-4 justify-between">
                        <div className="h-full my-auto font-bold w-[94px] text-center">{item.NAME}</div>
                        <ReactApexChart options={options(item.COLOR)} series={getSeries(NAMES[phy_idx], 'physiological') as any} type="treemap" width={490} height={200}/>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
export default BasicTreemap;