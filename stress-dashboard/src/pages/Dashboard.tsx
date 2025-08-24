import React from 'react';

const DashboardLayout: React.FC = () => {
    return (
        <div className="w-[1920px] h-[2200px] relative bg-white overflow-hidden">
            {/* Section: Change Mode */}
            <section className="absolute left-[198px] top-[423px] inline-flex justify-start items-center gap-3.5">
                <div className="w-28 h-14 p-4 bg-gray-100 rounded-md flex justify-center items-center gap-2.5">
                    <div className="text-neutral-400 text-xl font-normal font-['Inter']">상태 모드</div>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div className="w-28 h-14 p-4 bg-sky-200 rounded-md flex justify-center items-center gap-2.5">
                    <div className="text-neutral-900 text-xl font-semibold font-['Inter']">변화 모드</div>
                </div>
            </section>

            {/* Section: Daily Stress Change Calendar */}
            <section className="absolute left-[199px] top-[602px] text-center">
                <h2 className="text-neutral-900 text-3xl font-semibold font-['Inter']">일간 스트레스 변화 캘린더</h2>
                <p className="w-[668px] h-72 flex flex-col justify-start items-end gap-1">
                    {/* Content Area for Calendar Visualization */}
                    <div className="w-[668px] h-6 relative overflow-hidden"></div>
                    <div className="w-[668px] flex flex-col justify-start items-start"></div>
                </p>
                <p className="w-[668px] text-neutral-900 text-base font-normal font-['Inter']">
                    각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                    <br />
                    색상은 스트레스의 저감 정도를 나타내며, 부정적인 변화 (스트레스 증가)는 주황색 계열로, 긍정적인 변화 (스트레스 저감)는 초록색 계열로 표시됩니다.
                </p>
            </section>

            {/* Section: Stress Type Guidance */}
            <section className="absolute left-[198px] top-[1483px] text-center">
                <h2 className="text-neutral-900 text-3xl font-semibold font-['Inter']">지난 한 달 동안, 당신은 왜 스트레스를 받았나요?</h2>
                <h3 className="text-neutral-900 text-3xl font-semibold font-['Inter']">
                    나의 <span className="text-red-600">인지 스트레스</span>를 저감시킨 스트레스 완화 활동
                </h3>
                <p className="w-[667px] text-neutral-900 text-base font-normal font-['Inter']">
                    당신의 인지 스트레스를 가장 많이 저감시킨 스트레스 완화 활동은 <strong>호흡하기(76.3%)</strong>입니다. 그 외에도 <strong>화 먹는 요정(58.6%)</strong>과 <strong>스트레칭(43.0%)</strong>이 스트레스를 줄이는 데 효과적인 방법으로 나타났습니다.
                    반면 <strong>지금, 나 때문일까?(-1.8%)</strong>와 <strong>당 충전하기(-7.7%)</strong>는 오히려 스트레스를 유발하는 결과를 나타냈습니다.
                </p>
            </section>

            {/* Section: Physical Stress Reduction Activities */}
            <section className="absolute left-[961px] top-[1556px] text-center">
                <h3 className="text-neutral-900 text-3xl font-semibold font-['Inter']">
                    나의 <span className="text-blue-600">신체 스트레스</span>를 저감시킨 스트레스 완화 활동
                </h3>
                <p className="w-[667px] text-neutral-900 text-base font-normal font-['Inter']">
                    나의 신체 스트레스를 가장 많이 저감시킨 활동은 <strong>화 먹는 요정(67.3%)</strong>입니다. 그 외에도 <strong>호흡하기(61.0%)</strong>와 <strong>나를 지켜줘(54.1%)</strong>가 신체 스트레스 저감에 효과적인 방법으로 나타났습니다.
                    반면 <strong>당 충전하기(-5.8%)</strong>는 오히려 신체 스트레스를 유발하는 결과를 나타냈습니다.
                </p>
            </section>

            {/* Additional Sections can be added here */}
        </div>
    );
};

export default DashboardLayout;