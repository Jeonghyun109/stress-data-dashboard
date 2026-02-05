'use client';

import dynamic from 'next/dynamic';
import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts';
import React from 'react';
import useEffectData from '@/hooks/useEffectData';
import { CONTENT } from '@/data/stressEffect';
import BarChartReport from './report/BarChartReport';
import type { BarChartProps, ContentText } from '@/types';
import { DATA_ENDPOINTS, CHART_COLORS } from '@/constants/theme';
import { CHART_DIMENSIONS, INTERVENTION_LABELS, getLoadingComponent, getErrorComponent } from '@/constants/components';

// SSR(window) 회피
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const baseOptions = (color: string, categoriesForChart: string[]): ApexOptions => ({
  chart: { type: 'bar', toolbar: { show: false }, parentHeightOffset: 0 },
  plotOptions: { bar: { dataLabels: { position: 'top' }, columnWidth: '35%' } },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Number(val).toFixed(1)}%`,
    offsetY: -20,
    style: { fontSize: '12px', colors: [(params: any) => params.series[params.seriesIndex][params.dataPointIndex] < 0 ? CHART_COLORS.negative : color] },
  },
  xaxis: {
    categories: categoriesForChart,
    axisBorder: { show: false },
    axisTicks: { show: false },
    // labels: { rotate: 0 },
    tooltip: { enabled: false },
  },
  yaxis: {
    max: 100,
    min: -100,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { show: false, formatter: (val: number) => `${Number(val).toFixed(1)}%` },
  },
  grid: { padding: { top: 0, bottom: 0, left: 0, right: -10 } },
  colors: [({ value }: { value: number }) => value < 0 ? CHART_COLORS.negative : color],
});

const renderTitle = (title: string | ContentText[]) => {
  if (!Array.isArray(title)) return title;
  return title.map((part: ContentText, index: number) => (
    <span key={index} className={part.color}>{part.txt}</span>
  ));
};

type ChartSectionProps = {
  title: string | ContentText[];
  color: string;
  categories: string[];
  series: ApexAxisChartSeries;
  reportType: 'psychological' | 'physiological';
  pid: string;
};

const ChartSection: React.FC<ChartSectionProps> = ({ title, color, categories, series, reportType, pid }) => (
  <div className="w-1/2">
    <div className="font-semibold text-2xl">{renderTitle(title)}</div>
    <ReactApexChart
      options={baseOptions(color, categories)}
      series={series}
      type="bar"
      height={CHART_DIMENSIONS.bar.height}
      width={CHART_DIMENSIONS.bar.width}
    />
    <div>
      <BarChartReport pid={pid} type={reportType} />
    </div>
  </div>
);

const Barchart: React.FC<BarChartProps> = ({ pid }) => {
  const { loading, error,
    // original unsorted
    // categories, perceivedSeries, physioSeries,
    // sorted for charts:
    categoriesPerceivedSorted, perceivedSeriesSorted,
    categoriesPhysioSorted, physioSeriesSorted
  } = useEffectData(DATA_ENDPOINTS.DIFF_RATE, pid);

  const hasData = perceivedSeriesSorted.length > 0 && physioSeriesSorted.length > 0;
  const normalizedPid = String(pid ?? '');
  const perceivedCategories = React.useMemo(
    () => categoriesPerceivedSorted.map((x) => INTERVENTION_LABELS[x] ?? x),
    [categoriesPerceivedSorted]
  );
  const physioCategories = React.useMemo(
    () => categoriesPhysioSorted.map((x) => INTERVENTION_LABELS[x] ?? x),
    [categoriesPhysioSorted]
  );
  const perceivedSeries = React.useMemo<ApexAxisChartSeries>(
    () => [{ name: "", data: perceivedSeriesSorted }],
    [perceivedSeriesSorted]
  );
  const physioSeries = React.useMemo<ApexAxisChartSeries>(
    () => [{ name: "", data: physioSeriesSorted }],
    [physioSeriesSorted]
  );

  if (loading) return <div>{getLoadingComponent()}</div>;
  if (error) return <div>{getErrorComponent(error)}</div>;
  if (!hasData) return null;

  return (
    <div className="w-full my-4 flex gap-20 justify-between">
      <ChartSection
        title={CONTENT.BODY_1.TITLE}
        color={CHART_COLORS.internal}
        categories={perceivedCategories}
        series={perceivedSeries}
        reportType="psychological"
        pid={normalizedPid}
      />
      <ChartSection
        title={CONTENT.BODY_2.TITLE}
        color={CHART_COLORS.physical}
        categories={physioCategories}
        series={physioSeries}
        reportType="physiological"
        pid={normalizedPid}
      />
    </div>
  );
};

export default Barchart;
