'use client';

import dynamic from 'next/dynamic';
import { NAMES, CONTENT } from '@/data/stressWhy';
import useCorrelationData, { TreemapCategory } from '@/hooks/useCorrelationData';
import TreeMapInfo from './report/TreeMapReport';
import { buildTreemapOptions, buildTreemapSeries, getTreemapTypeSums } from '@/utils/treemapUtils';

// SSR에서 window 참조 오류 방지
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TreemapColumnProps = {
  title: typeof CONTENT.BODY_1.TITLE;
  categories: typeof CONTENT.BODY_1.CATEGORY;
  type: 'psychological' | 'physiological';
  sums: number[];
  groupedByType: Record<string, any>;
  pid: string;
};

const TreemapColumn: React.FC<TreemapColumnProps> = ({ title, categories, type, sums, groupedByType, pid }) => {
  const maxSum = Math.max(1, ...sums);
  return (
    <div className="w-1/2">
      <div className="font-semibold text-2xl mb-4">
        {title.map((part, index) => (
          <span key={index} className={part.color}>{part.txt}</span>
        ))}
      </div>
      {categories.map((item, idx) => (
        <div className="flex flex-col" key={item.NAME}>
          <div className="flex flex-row gap-4 justify-start">
            <div className="h-full my-auto font-bold w-[94px] text-center">{item.NAME}</div>
            <ReactApexChart
              options={buildTreemapOptions(item.COLOR)}
              series={buildTreemapSeries(groupedByType, NAMES[idx], type)}
              type="treemap"
              width={(490 * sums[idx]) / maxSum}
              height={200}
            />
          </div>
        </div>
      ))}
      <div className="mt-8 w-full">
        <TreeMapInfo pid={pid} type={type} />
      </div>
    </div>
  );
};

const BasicTreemap: React.FC<{ pid: string }> = ({ pid }) => {
  const { loading, error, groupedByType } = useCorrelationData('/data/correlation.csv', pid);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const psychoSum = getTreemapTypeSums(groupedByType, 'psychological');
  const physioSum = getTreemapTypeSums(groupedByType, 'physiological');

  return (
    <div className="w-full my-4 flex gap-20 justify-between">
      {/* 인지 스트레스 */}
      <TreemapColumn
        title={CONTENT.BODY_1.TITLE}
        categories={CONTENT.BODY_1.CATEGORY}
        type="psychological"
        sums={psychoSum}
        groupedByType={groupedByType}
        pid={pid}
      />
      {/* 신체 스트레스 */}
      <TreemapColumn
        title={CONTENT.BODY_2.TITLE}
        categories={CONTENT.BODY_2.CATEGORY}
        type="physiological"
        sums={physioSum}
        groupedByType={groupedByType}
        pid={pid}
      />
    </div>
  );
};
export default BasicTreemap;
