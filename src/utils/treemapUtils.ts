import type { ApexOptions } from 'apexcharts';
import { NAMES, labelMap } from '@/data/stressWhy';
import type { TreemapCategory, TreemapGroup } from '@/hooks/useCorrelationData';

export const buildTreemapOptions = (color: string): ApexOptions => ({
  legend: { show: true },
  chart: {
    type: 'treemap',
    toolbar: { show: false },
    parentHeightOffset: 0,
  },
  grid: {
    padding: { top: -20, bottom: 0, left: 0, right: 0 },
  },
  colors: [color],
  tooltip: {
    y: {
      formatter: (value) => value.toFixed(2),
    },
  },
  fill: {
    pattern: {
      width: 2,
      height: 2,
      strokeWidth: 1.5,
      style: 'verticalLines',
    },
  },
});

export const buildTreemapSeries = (
  groupedByType: Record<string, any>,
  topType: TreemapCategory,
  type: 'psychological' | 'physiological'
): ApexAxisChartSeries => {
  const raw = groupedByType[topType]?.[type] ?? [];
  return raw.map((group: TreemapGroup) => ({
    name: group.name,
    data: group.data.map((datum) => ({
      x: labelMap(datum.x),
      y: datum.y,
      raw: datum.raw,
      fill: { type: 'image', opacity: 0, pattern: { style: 'verticalLines' } },
    })),
  }));
};

export const getTreemapTypeSums = (
  groupedByType: Record<string, any>,
  type: 'psychological' | 'physiological'
) => {
  return NAMES.map((v) => {
    const groups = groupedByType[v as TreemapCategory]?.[type] ?? [];
    const first = groups[0]?.data ?? [];
    return first.reduce((acc: number, curr: { y: number }) => acc + curr.y, 0);
  });
};
