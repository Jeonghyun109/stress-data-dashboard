import React from 'react';

const DashboardLayout = () => {
    return (
        <div className="w-full h-full relative bg-white overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4">
                <h1 className="text-3xl font-semibold">Stress Data Dashboard</h1>
                <nav>
                    {/* Navigation items can go here */}
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-col items-center">
                {/* Mode Selection Section */}
                <section className="flex justify-start items-center gap-3 mt-8">
                    <div className="w-28 h-14 p-4 bg-gray-100 rounded-md flex justify-center items-center">
                        <span className="text-neutral-400 text-xl font-normal">상태 모드</span>
                    </div>
                    <div className="w-px h-8 bg-gray-300" />
                    <div className="w-28 h-14 p-4 bg-sky-200 rounded-md flex justify-center items-center">
                        <span className="text-neutral-900 text-xl font-semibold">변화 모드</span>
                    </div>
                </section>

                {/* Calendar Section */}
                <section className="w-[668px] h-[534px] mt-8 flex flex-col items-center">
                    <h2 className="text-3xl font-semibold text-neutral-900">일간 스트레스 변화 캘린더</h2>
                    <div className="w-[668px] h-72 flex flex-col justify-start items-end gap-1 mt-4">
                        {/* Calendar Visualization */}
                        <div className="w-[668px] h-6 relative overflow-hidden"></div>
                        <div className="w-[668px] flex flex-col justify-start items-start"></div>
                    </div>
                    <p className="text-base font-normal text-neutral-900 mt-4">
                        각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                        <br />
                        색상은 스트레스의 저감 정도를 나타내며, 부정적인 변화 (스트레스 증가)는 주황색 계열로, 긍정적인 변화 (스트레스 저감)는 초록색 계열로 표시됩니다.
                    </p>
                </section>

                {/* Stress Type Section */}
                <section className="mt-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">스트레스 유형 안내</h2>
                    <div className="flex justify-between mt-4">
                        <div className="text-center">
                            <span className="text-blue-600 text-xl font-semibold">신체 스트레스</span>
                        </div>
                        <div className="text-center">
                            <span className="text-red-600 text-xl font-semibold">인지 스트레스</span>
                        </div>
                    </div>
                </section>

                {/* Stress Reduction Activities Section */}
                <section className="mt-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">나의 스트레스 저감 활동</h2>
                    <div className="w-[667px] mt-4">
                        <p className="text-base font-normal text-neutral-900">
                            당신의 인지 스트레스를 가장 많이 저감시킨 스트레스 완화 활동은 <strong>호흡하기(76.3%)</strong>입니다. 그 외에도 <strong>화 먹는 요정(58.6%)</strong>과 <strong>스트레칭(43.0%)</strong>이 스트레스를 줄이는 데 효과적인 방법으로 나타났습니다.
                        </p>
                    </div>
                </section>

                {/* Stress Timeline Section */}
                <section className="mt-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">지난 한 달 동안, 당신은 언제 스트레스를 받았나요?</h2>
                    {/* Timeline visualization can be added here */}
                </section>
            </main>

            {/* Footer Section */}
            <footer className="p-4 text-center">
                <p className="text-sm text-neutral-600">© 2025 Stress Data Dashboard. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;