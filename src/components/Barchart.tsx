'use client';

import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import React from 'react';
import useEffectData from '@/hooks/useEffectData';
import { CONTENT } from '@/data/stressEffect';
import BarChartReport from './report/BarChartReport';


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
      style: { fontSize: '12px', colors: [({ seriesIndex, series, dataPointIndex }) => series[seriesIndex][dataPointIndex] < 0 ? '#f87171' : color] },
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
    colors: [({ value }: { value: number }) => value < 0 ? '#f87171' : color],
  });

  const perceivedApex: ApexAxisChartSeries = [{ name: "", data: perceivedSeriesSorted }];
  const physioApex: ApexAxisChartSeries = [{ name: "", data: physioSeriesSorted }];

  return (
    perceivedSeriesSorted.length > 0 && physioSeriesSorted.length > 0 && <div className="w-full my-4 flex gap-20 justify-between">
      <div className="w-1/2">
        <div className="font-semibold text-2xl">{CONTENT.BODY_1.TITLE.map((part, index) => (
          <span key={index} className={part.color}>{part.txt}</span>
        ))}</div>
        <ReactApexChart
          options={baseOptions('#14b8a6', categoriesPerceivedSorted)}
          series={perceivedApex}
          type="bar"
          height={320}
          width={600}
        />
        <div>
          <BarChartReport pid={pid ?? ''} type="psychological" />
        </div>
      </div>
      <div className="w-1/2">
        <div className="font-semibold text-2xl">{CONTENT.BODY_2.TITLE.map((part, index) => (
          <span key={index} className={part.color}>{part.txt}</span>
        ))}</div>
        <ReactApexChart
          options={baseOptions('#a3e635', categoriesPhysioSorted)}
          series={physioApex}
          type="bar"
          height={320}
          width={600}
        />
        <div>
          <BarChartReport pid={pid ?? ''} type="physiological" />
        </div>
      </div>
    </div>
  );
};

export default Barchart;