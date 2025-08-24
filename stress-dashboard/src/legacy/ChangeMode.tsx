import React from 'react';

const DashboardLayout = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Section 1: Mode Selection */}
            <section className="flex justify-start items-center gap-3 p-4">
                <div className="w-28 h-14 p-4 bg-gray-100 rounded-md flex justify-center items-center">
                    <span className="text-neutral-400 text-xl font-normal">상태 모드</span>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div className="w-28 h-14 p-4 bg-sky-200 rounded-md flex justify-center items-center">
                    <span className="text-neutral-900 text-xl font-semibold">변화 모드</span>
                </div>
            </section>

            {/* Section 2: Daily Stress Change Calendar */}
            <section className="p-4">
                <h2 className="text-neutral-900 text-3xl font-semibold">일간 스트레스 변화 캘린더</h2>
                <div className="mt-4">
                    <p className="text-neutral-900 text-base font-normal">
                        각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                        <br />
                        색상은 스트레스의 저감 정도를 나타내며, 부정적인 변화 (스트레스 증가)는 주황색 계열로, 긍정적인 변화 (스트레스 저감)는 초록색 계열로 표시됩니다.
                    </p>
                </div>
                {/* Placeholder for Calendar Component */}
                <div className="w-full h-72 bg-gray-200 mt-4">Calendar Component Placeholder</div>
            </section>

            {/* Section 3: Stress Type Guidance */}
            <section className="p-4">
                <h2 className="text-neutral-900 text-3xl font-semibold">스트레스 유형 안내</h2>
                <div className="mt-4">
                    <p className="text-neutral-900 text-base font-normal">
                        지난 한 달 동안, 당신은 왜 스트레스를 받았나요?
                    </p>
                </div>
                {/* Placeholder for Stress Type Content */}
                <div className="w-full h-96 bg-gray-200 mt-4">Stress Type Content Placeholder</div>
            </section>

            {/* Section 4: Stress Reduction Activities */}
            <section className="p-4">
                <h2 className="text-neutral-900 text-3xl font-semibold">나의 인지 스트레스 저감 활동</h2>
                <div className="mt-4">
                    <p className="text-neutral-900 text-base font-normal">
                        당신의 인지 스트레스를 가장 많이 저감시킨 스트레스 완화 활동은 호흡하기(76.3%)입니다. 그 외에도 화 먹는 요정(58.6%)과 스트레칭(43.0%)이 스트레스를 줄이는 데 효과적인 방법으로 나타났습니다.
                    </p>
                </div>
                {/* Placeholder for Activities Content */}
                <div className="w-full h-96 bg-gray-200 mt-4">Activities Content Placeholder</div>
            </section>

            {/* Section 5: Physical Stress Reduction Activities */}
            <section className="p-4">
                <h2 className="text-neutral-900 text-3xl font-semibold">나의 신체 스트레스 저감 활동</h2>
                <div className="mt-4">
                    <p className="text-neutral-900 text-base font-normal">
                        나의 신체 스트레스를 가장 많이 저감시킨 활동은 화 먹는 요정(67.3%)입니다. 그 외에도 호흡하기(61.0%)와 나를 지켜줘(54.1%)가 신체 스트레스 저감에 효과적인 방법으로 나타났습니다.
                    </p>
                </div>
                {/* Placeholder for Physical Activities Content */}
                <div className="w-full h-96 bg-gray-200 mt-4">Physical Activities Content Placeholder</div>
            </section>

            {/* Section 6: Stress Records */}
            <section className="p-4">
                <h2 className="text-neutral-900 text-3xl font-semibold">콜 응대 기록</h2>
                <div className="mt-4">
                    <p className="text-neutral-900 text-base font-normal">
                        지난 한 달 동안, 당신은 언제 스트레스를 받았나요?
                    </p>
                </div>
                {/* Placeholder for Call Records Content */}
                <div className="w-full h-96 bg-gray-200 mt-4">Call Records Content Placeholder</div>
            </section>
        </div>
    );
};

export default DashboardLayout;