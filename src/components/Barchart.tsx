'use client';

import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import React from 'react';
import useEffectData from '@/hooks/useEffectData';
import { CONTENT } from '@/data/stressEffect';

// SSR(window) 회피
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Barchart: React.FC<{ pid?: string | number }> = ({ pid }) => {
  const { loading, error,
    // original unsorted
    // categories, perceivedSeries, physioSeries,
    // sorted for charts:
    categoriesPerceivedSorted, perceivedSeriesSorted,
    categoriesPhysioSorted, physioSeriesSorted
  } = useEffectData('/data/diff_rate.csv', pid);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  const baseOptions = (color: string, categoriesForChart: string[]): ApexOptions => ({
    chart: { type: 'bar', toolbar: { show: false }, parentHeightOffset: 0 },
    plotOptions: { bar: { dataLabels: { position: 'top' }, columnWidth: '35%' } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Number(val).toFixed(1)}%`,
      offsetY: -20,
      style: { fontSize: '12px', colors: [color] },
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
    colors: [color],
  });

  const perceivedApex: ApexAxisChartSeries = [{ name: "", data: perceivedSeriesSorted }];
  const physioApex: ApexAxisChartSeries = [{ name: "", data: physioSeriesSorted }];

  return (
    <div className="w-full my-4 flex gap-20 justify-between">
      <div className="w-1/2">
        <div className="font-semibold text-2xl">{CONTENT.BODY_1.TITLE}</div>
        <ReactApexChart
          options={baseOptions('#6B21A8', categoriesPerceivedSorted)}
          series={perceivedApex}
          type="bar"
          height={320}
          width={600}
        />
      </div>
      <div className="w-1/2">
        <div className="font-semibold text-2xl">{CONTENT.BODY_2.TITLE}</div>
        <ReactApexChart
          options={baseOptions('#D97706', categoriesPhysioSorted)}
          series={physioApex}
          type="bar"
          height={320}
          width={600}
        />
      </div>
    </div>
  );
};

export default Barchart;