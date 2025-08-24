export type ContentType = {
    TITLE: string;
    BODY_1: {
        TITLE: string;
        CATEGORY: Array<{ NAME: string; COLOR: string }>;
        // DESCRIPTION: Array<{ TXT: string; BOLD: boolean }>;
    };
    BODY_2: {
        TITLE: string;
        CATEGORY: Array<{ NAME: string; COLOR: string }>;
        // DESCRIPTION: Array<{ TXT: string; BOLD: boolean }>;
    };
};

export const COLORS: string[] = ['#A93F55', '#52B12C', '#33A1FD'];
export const NAMES: string[] = ['stressor', 'env', 'context'];

export const CONTENT: ContentType = {
    TITLE: "지난 한 달 동안, 당신은 왜 스트레스를 받았나요?",
    BODY_1: {
        TITLE: "나의 인지 스트레스와 관련된 데이터", // TODO - 스트레스 이름 색 다르게 + 아이콘
        // TITLE: "나의 인지 스트레스를 저감시킨 스트레스 완화 활동",
        CATEGORY: [
            { NAME: "스트레스 요인", COLOR: COLORS[0] },
            { NAME: "환경 데이터", COLOR: COLORS[1] },
            { NAME: "상황 데이터", COLOR: COLORS[2] }
        ]
        // DESCRIPTION: [
        //     { TXT: '내가 "스트레스를 받고 있다"고 ', BOLD: false },
        //     { TXT: '스스로 인식하는 정도', BOLD: true },
        //     { TXT: '를 의미합니다. 같은 상황이라도 어떤 사람은 크게 스트레스로 느끼고, 다른 사람은 덜 느낄 수 있습니다. 주로 ', BOLD: false },
        //     { TXT: '생각, 감정, 상황 해석', BOLD: true },
        //     { TXT: '이 반영되며, 상담사님께서 제출해주신 설문 응답을 통해 기록됩니다.', BOLD: false }
        // ]
    },
    BODY_2: {
        TITLE: "나의 신체 스트레스와 관련된 데이터", // TODO - 스트레스 이름 색 다르게 + 아이콘
        // TITLE: "나의 신체 스트레스를 저감시킨 스트레스 완화 활동",
        CATEGORY: [
            { NAME: "스트레스 요인", COLOR: COLORS[0] },
            { NAME: "환경 데이터", COLOR: COLORS[1] },
            { NAME: "상황 데이터", COLOR: COLORS[2] }
        ]
        // DESCRIPTION: [
        //     { TXT: '내 몸이 실제로 반응한 생리적인 긴장 수준, 즉 ', BOLD: false },
        //     { TXT: '내 몸이 받은 부담', BOLD: true },
        //     { TXT: '을 나타냅니다. 심박수 변화, 피부 전도 반응, 호흡 패턴 등에서 계산되며, 내가 자각하지 못하더라도 몸은 스트레스를 받고 있을 수 있습니다. 이 대시보드에서는 상담사님께서 착용하신 갤럭시 워치에서 수집된 PPG(광용적맥파) 데이터로 심박수 변화를 계산하여 신체 스트레스를 보여줍니다.', BOLD: false }
        // ]
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
    'stressor_peer_conflict'
];
export const STRESSORS = {
    stressor_lack_ability: "내 능력이 부족하다고 생각됨",
    stressor_difficult_work: "업무를 숙지하기 어려움",
    stressor_eval_pressure: "성과 평가가 부담됨",
    stressor_work_bad: "업무방식이 불만스러움",
    stressor_hard_communication: "고객과 소통이 안 됨",
    stressor_rude_customer: "예의 없는 고객",
    stressor_time_pressure: "시간적인 압박을 느낌",
    stressor_noise: "주위 사람들의 소리가 신경 쓰임",
    stressor_peer_conflict: "동료와 관련된 갈등이나 문제"
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
    'daily_general_health',
    'daily_general_sleep_quality'
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
    daily_general_health: "전반적인 건강 상태",
    daily_general_sleep_quality: "수면의 질"
};