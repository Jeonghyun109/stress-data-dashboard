export type ContentType = {
    TITLE: string;
    BODY_1: {
        TITLE: string;
        // DESCRIPTION: Array<{ TXT: string; BOLD: boolean }>;
    };
    BODY_2: {
        TITLE: string;
        // DESCRIPTION: Array<{ TXT: string; BOLD: boolean }>;
    };
};

export const CONTENT: ContentType = {
    TITLE: "지난 한 달 동안, 당신은 언제 스트레스를 받았나요?",
    BODY_1: {
        TITLE: "일간 스트레스 변화 캘린더",
        // DESCRIPTION: [
        //     { TXT: '내가 "스트레스를 받고 있다"고 ', BOLD: false },
        //     { TXT: '스스로 인식하는 정도', BOLD: true },
        //     { TXT: '를 의미합니다. 같은 상황이라도 어떤 사람은 크게 스트레스로 느끼고, 다른 사람은 덜 느낄 수 있습니다. 주로 ', BOLD: false },
        //     { TXT: '생각, 감정, 상황 해석', BOLD: true },
        //     { TXT: '이 반영되며, 상담사님께서 제출해주신 설문 응답을 통해 기록됩니다.', BOLD: false }
        // ]
    },
    BODY_2: {
        TITLE: "에 받은 스트레스",
        // DESCRIPTION: [
        //     { TXT: '내 몸이 실제로 반응한 생리적인 긴장 수준, 즉 ', BOLD: false },
        //     { TXT: '내 몸이 받은 부담', BOLD: true },
        //     { TXT: '을 나타냅니다. 심박수 변화, 피부 전도 반응, 호흡 패턴 등에서 계산되며, 내가 자각하지 못하더라도 몸은 스트레스를 받고 있을 수 있습니다. 이 대시보드에서는 상담사님께서 착용하신 갤럭시 워치에서 수집된 PPG(광용적맥파) 데이터로 심박수 변화를 계산하여 신체 스트레스를 보여줍니다.', BOLD: false }
        // ]
    }
};