// filepath: /home/jeonghyun/Desktop/stress-data-dashboard/src/layouts/DashboardLayout.tsx
import React from 'react';

const DashboardLayout = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-3xl font-semibold">Stress Data Dashboard</h1>
                <nav>
                    {/* Navigation items can go here */}
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-col p-6">
                {/* Section 1: Mode Selection */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold">모드 선택</h2>
                    <div className="flex gap-4 mt-2">
                        <div className="p-4 bg-gray-100 rounded-md flex items-center">
                            <span className="text-neutral-400 text-xl">상태 모드</span>
                        </div>
                        <div className="w-px h-8 bg-gray-300" />
                        <div className="p-4 bg-sky-200 rounded-md flex items-center">
                            <span className="text-neutral-900 text-xl font-semibold">변화 모드</span>
                        </div>
                    </div>
                </section>

                {/* Section 2: Stress Change Calendar */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold">일간 스트레스 변화 캘린더</h2>
                    <div className="mt-4">
                        {/* Calendar visualization component can go here */}
                        <p className="text-base text-neutral-900">
                            각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                        </p>
                    </div>
                </section>

                {/* Section 3: Stress Type Information */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold">스트레스 유형 안내</h2>
                    <div className="mt-4">
                        <p className="text-base text-neutral-900">
                            내가 ‘스트레스를 받고 있다’고 스스로 인식하는 정도를 의미합니다. 같은 상황이라도 어떤 사람은 크게 스트레스로 느끼고, 다른 사람은 덜 느낄 수 있습니다.
                        </p>
                    </div>
                </section>

                {/* Section 4: Stress Reduction Activities */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold">나의 스트레스 저감 활동</h2>
                    <div className="mt-4">
                        <p className="text-base text-neutral-900">
                            당신의 인지 스트레스를 가장 많이 저감시킨 스트레스 완화 활동은 호흡하기(76.3%)입니다. 그 외에도 화 먹는 요정(58.6%)과 스트레칭(43.0%)이 효과적인 방법으로 나타났습니다.
                        </p>
                    </div>
                </section>

                {/* Section 5: Stress Data Summary */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold">지난 한 달 동안, 당신은 왜 스트레스를 받았나요?</h2>
                    <div className="mt-4">
                        {/* Summary content can go here */}
                        <p className="text-base text-neutral-900">
                            스트레스의 원인과 관련된 데이터 요약을 여기에 추가합니다.
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="p-4 bg-gray-100 text-center">
                <p className="text-sm text-neutral-600">© 2025 Stress Data Dashboard. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;