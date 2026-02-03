export type ContentType = {
    TITLE: string;
    BODY_1: {
        TITLE: string;
        DESCRIPTION: Array<{ TXT: string; BOLD: boolean }>;
    };
    BODY_2: {
        TITLE: string;
        DESCRIPTION: Array<{ TXT: string; BOLD: boolean }>;
    };
};

export const CONTENT: ContentType = {
    TITLE: "Guide to stress types",
    BODY_1: {
        TITLE: "perceived stress",
        DESCRIPTION: [
            { TXT: 'It refers to ', BOLD: false },
            { TXT: 'how much you perceive yourself as "being under stress"', BOLD: true },
            { TXT: '. Even in the same situation, one person may experience it as highly stressful while another may feel less so. It mainly reflects ', BOLD: false },
            { TXT: 'thoughts, emotions, and interpretation of the situation', BOLD: true },
            { TXT: ', and it is recorded through the survey responses you submit.', BOLD: false }
        ]
    },
    BODY_2: {
        TITLE: "physiological stress",
        DESCRIPTION: [
            { TXT: 'The level of physiological arousal your body actually shows—i.e., ', BOLD: false },
            { TXT: 'the burden on your body', BOLD: true },
            { TXT: '. It is computed from changes in heart rate, electrodermal activity, and breathing patterns. Even if you do not consciously notice it, your body may still be under stress. In this dashboard, physiological stress is shown using heart-rate changes collected by your Galaxy Watch.', BOLD: false }
        ]
    }
};