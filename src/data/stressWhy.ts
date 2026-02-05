import { TreemapCategory } from "@/hooks/useCorrelationData";

export type ContentType = {
  TITLE: string;
  BODY_1: {
    TITLE: { txt: string, color: string }[];
    CATEGORY: Array<{ NAME: string; COLOR: string }>;
  };
  BODY_2: {
    TITLE: { txt: string, color: string }[];
    CATEGORY: Array<{ NAME: string; COLOR: string }>;
  };
};

export const COLORS: string[] = ['#A93F55', '#52B12C', '#33A1FD', '#1c1e7a'];
export const NAMES: TreemapCategory[] = ['stressor', 'env', 'context', 'daily_context'];

export const CONTENT: ContentType = {
  TITLE: "Over the past month, when did you experience stress?",
  BODY_1: {
    TITLE: [
      { txt: "Data related to my ", color: '' },
      { txt: "perceived stress", color: 'text-violet-500' },
      { txt: "", color: '' },
    ],
    CATEGORY: [
      { NAME: "Stressor", COLOR: COLORS[0] },
      { NAME: "Environment", COLOR: COLORS[1] },
      { NAME: "Work context", COLOR: COLORS[2] },
      { NAME: "Pre-shift", COLOR: COLORS[3] }
    ]
  },
  BODY_2: {
    TITLE: [
      { txt: "Data related to my ", color: '' },
      { txt: "physiological stress", color: 'text-orange-500' },
      { txt: "", color: '' },
    ],
    CATEGORY: [
      { NAME: "Stressor", COLOR: COLORS[0] },
      { NAME: "Environment", COLOR: COLORS[1] },
      { NAME: "Work context", COLOR: COLORS[2] },
      { NAME: "Pre-shift", COLOR: COLORS[3] }
    ]
  }
};

export const stressor_list = [
  'stressor_lack_ability',
  'stressor_difficult_work',
  'stressor_eval_pressure',
  'stressor_work_bad',
  'stressor_hard_communication',
  'stressor_rude_customer',
  'stressor_time_pressure',
  'stressor_noise',
  'stressor_peer_conflict',
  'stressor_other',
];
export const STRESSORS = {
  stressor_lack_ability: "Felt that my abilities were insufficient",
  stressor_difficult_work: "Difficulty in understanding the tasks",
  stressor_eval_pressure: "Pressure from performance evaluation",
  stressor_work_bad: "Dissatisfaction with work procedures",
  stressor_hard_communication: "Communication issues with customers",
  stressor_rude_customer: "Rude customers",
  stressor_time_pressure: "Time pressure",
  stressor_noise: "Noise from surrounding people",
  stressor_peer_conflict: "Conflicts or issues with colleagues",
  stressor_other: "Other"
};

export const env_list = ['humidity_mean', 'co2_mean', 'tvoc_mean', 'temperature_mean'];
export const ENV = {
  humidity_mean: "습도",
  co2_mean: "이산화탄소 농도",
  tvoc_mean: "공기질",
  temperature_mean: "온도"
};

export const context_list = [
  'steps',
  'skintemp',
  'workload',
  'arousal',
  'valence',
  'tiredness',
  'surface_acting',
  'call_type_angry',
];

export const CONTEXT = {
  steps: "지난 한 시간 동안 걸은 걸음수",
  skintemp: "피부 온도",
  workload: "업무량",
  arousal: "감정의 강도",
  valence: "감정의 긍정도",
  tiredness: "피로도",
  surface_acting: "감정을 숨기기 위해 노력한 정도",
  call_type_angry: "불만 콜 여부",
};

export const daily_context_list = [
  'daily_stress',
  'daily_valence',
  'daily_arousal',
  'daily_tiredness',
  'daily_general_health',
  'daily_general_sleep_quality'
]

export const DAILY_CONTEXT = {
  daily_stress: "Start-of-shift stress",
  daily_valence: "Start-of-shift emotional valence",
  daily_arousal: "Start-of-shift emotional arousal",
  daily_tiredness: "Start-of-shift fatigue",
  daily_general_health: "Start-of-shift general health",
  daily_general_sleep_quality: "Sleep quality before the shift",
}

export const labelMap = (featureName: string) => {
  switch (featureName) {
    case 'stressor_lack_ability':
      return 'Felt that my abilities were insufficient'
    case 'stressor_difficult_work':
      return 'Difficulty in understanding the tasks'
    case 'stressor_eval_pressure':
      return 'Pressure from performance evaluation'
    case 'stressor_work_bad':
      return 'Dissatisfaction with work procedures'
    case 'stressor_hard_communication':
      return 'Communication issues with customers'
    case 'stressor_rude_customer':
      return 'Rude customers'
    case 'stressor_time_pressure':
      return 'Time pressure'
    case 'stressor_noise':
      return 'Noise from surrounding people'
    case 'stressor_peer_conflict':
      return 'Conflicts or issues with colleagues'
    case 'stressor_other':
      return 'Other'
    case 'humidity_mean':
      return 'Humidity'
    case 'co2_mean':
      return 'CO2 concentration'
    case 'tvoc_mean':
      return 'Air quality'
    case 'temperature_mean':
      return 'Temperature'
    case 'steps':
      return 'Steps in the past hour'
    case 'skintemp':
      return 'Skin temperature'
    case 'workload':
      return 'Workload'
    case 'arousal':
      return 'Emotional arousal'
    case 'valence':
      return 'Emotional valence'
    case 'tiredness':
      return 'Fatigue'
    case 'surface_acting':
      return 'Surface acting'
    case 'call_type_angry':
      return 'Complaint call'
    case 'daily_stress':
      return 'Start-of-shift stress'
    case 'daily_valence':
      return 'Start-of-shift emotional valence'
    case 'daily_arousal':
      return 'Start-of-shift emotional arousal'
    case 'daily_tiredness':
      return 'Start-of-shift fatigue'
    case 'daily_general_health':
      return 'Start-of-shift general health'
    case 'daily_general_sleep_quality':
      return 'Sleep quality before the shift'
    default:
      return featureName
  }
}