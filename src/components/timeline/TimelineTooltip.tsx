import React from 'react';
import { formatTime } from '@/utils/timelineUtils';
import type { TimelineBucket } from '@/utils/timelineBuckets';

type TimelineTooltipProps = {
  bucket: TimelineBucket;
};

const TimelineTooltip: React.FC<TimelineTooltipProps> = ({ bucket }) => {
  const summary = bucket?.summary ?? {};

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="text-lg text-center font-bold mt-12 mb-6">
        Data collected {formatTime(bucket.startMs)} ~ {formatTime(bucket.endMs)}
      </div>
      <div className="text-gray-700 flex flex-row gap-12">
        <div className="w-1/2">
          <div className="font-bold">Stress data</div>
          {bucket.avgInternal !== undefined && <div>Perceived stress score: {bucket.avgInternal} / 4</div>}
          {bucket.avgPhysical !== undefined && <div>Physiological stress score: {bucket.avgPhysical} / 4</div>}
          <div className="h-3" />

          {summary.stressor?.length > 0 && <div className="font-bold">Stressor</div>}
          {summary.stressor?.length > 0 && <div className="h-auto">{summary.stressor.join(', ')}</div>}
          {summary.stressor?.length > 0 && <div className="h-3" />}

          <div className="font-bold">Pre-shift data</div>
          {summary.daily_arousal !== undefined && <div>Emotional arousal: {summary.daily_arousal.toFixed(2)} / 5</div>}
          {summary.daily_valence !== undefined && <div>Emotional valence: {summary.daily_valence.toFixed(2)} / 5</div>}
          {summary.daily_tiredness !== undefined && <div>Fatigue: {summary.daily_tiredness.toFixed(2)} / 5</div>}
          {summary.daily_general_health !== undefined && <div>General health: {summary.daily_general_health.toFixed(2)} / 5</div>}
          {summary.daily_general_sleep !== undefined && <div>Sleep quality: {summary.daily_general_sleep.toFixed(2)} / 5</div>}
        </div>
        <div className="w-1/2">
          <div className="font-bold">Environment data</div>
          {summary.humidity_mean !== undefined && <div>Humidity: {summary.humidity_mean.toFixed(2)}%</div>}
          {summary.co2_mean !== undefined && <div>CO2 concentration: {summary.co2_mean.toFixed(1)} ppm</div>}
          {summary.tvoc_mean !== undefined && <div>Air quality: {summary.tvoc_mean.toFixed(1)}ppm</div>}
          {summary.temperature_mean !== undefined && <div>Indoor temperature: {summary.temperature_mean.toFixed(2)}°C</div>}
          <div className="h-3" />

          <div className="font-bold">Work context data</div>
          {summary.workload !== undefined && <div>Workload: {summary.workload.toFixed(2)} / 5</div>}
          {summary.arousal !== undefined && <div>Emotional arousal: {summary.arousal.toFixed(2)} / 5</div>}
          {summary.valence !== undefined && <div>Emotional valence: {summary.valence.toFixed(2)} / 5</div>}
          {summary.tiredness !== undefined && <div>Fatigue: {summary.tiredness.toFixed(2)} / 5</div>}
          {summary.surface_acting !== undefined && <div>Surface acting: {summary.surface_acting.toFixed(2)} / 5</div>}
          <div>Previous call type: {summary.call_type_angry ? 'Complaint' : 'General'}</div>
          {/* <div>Stressor count (sum flags): {summary.stressor_sum ?? 0}</div> */}
          {summary.steps !== undefined && <div>Average steps: {Math.round(summary.steps)}</div>}
          {summary.skintemp !== undefined && <div>Average skin temperature: {summary.skintemp.toFixed(2)}°C</div>}
          {summary.hr_minmax !== undefined && <div>Average heart rate: {summary.hr_mean.toFixed(2)} bpm</div>}
          {summary.acc_mean !== undefined && <div>Average accelerometer: {summary.acc_mean.toFixed(3)} m/s²</div>}
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
};

export default TimelineTooltip;
