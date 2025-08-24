// filepath: /home/jeonghyun/Desktop/stress-data-dashboard/src/components/DashboardLayout.tsx
import React from 'react';

const DashboardLayout: React.FC = () => {
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
            <main className="p-6">
                {/* Section: Mode Selection */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">모드 선택</h2>
                    <div className="flex gap-4 mt-4">
                        <div className="w-28 h-14 p-4 bg-gray-100 rounded-md flex justify-center items-center">
                            <span className="text-neutral-400 text-xl">상태 모드</span>
                        </div>
                        <div className="w-px h-8 bg-gray-300" />
                        <div className="w-28 h-14 p-4 bg-sky-200 rounded-md flex justify-center items-center">
                            <span className="text-neutral-900 text-xl font-semibold">변화 모드</span>
                        </div>
                    </div>
                </section>

                {/* Section: Daily Stress Change Calendar */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">일간 스트레스 변화 캘린더</h2>
                    <div className="mt-4">
                        <p className="text-neutral-900 text-base">
                            각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                        </p>
                        <p className="text-neutral-900 text-base">
                            색상은 스트레스의 저감 정도를 나타내며, 부정적인 변화 (스트레스 증가)는 주황색 계열로, 긍정적인 변화 (스트레스 저감)는 초록색 계열로 표시됩니다.
                        </p>
                    </div>
                </section>

                {/* Section: Stress Types */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 유형 안내</h2>
                    <div className="mt-4">
                        <p className="text-neutral-900 text-base">
                            나의 인지 스트레스를 가장 많이 저감시킨 활동은 <strong>호흡하기(76.3%)</strong>입니다. 그 외에도 <strong>화 먹는 요정(58.6%)</strong>과 <strong>스트레칭(43.0%)</strong>이 스트레스를 줄이는 데 효과적인 방법으로 나타났습니다.
                        </p>
                    </div>
                </section>

                {/* Section: Stress Records */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">콜 응대 기록</h2>
                    <div className="mt-4">
                        <p className="text-neutral-900 text-base">
                            지난 한 달 동안, 당신은 왜 스트레스를 받았나요?
                        </p>
                        {/* Content for call records can be added here */}
                    </div>
                </section>

                {/* Section: Stress Reduction Activities */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">나의 스트레스 완화 활동</h2>
                    <div className="mt-4">
                        <p className="text-neutral-900 text-base">
                            내가 ‘스트레스를 받고 있다’고 스스로 인식하는 정도를 의미합니다. 같은 상황이라도 어떤 사람은 크게 스트레스로 느끼고, 다른 사람은 덜 느낄 수 있습니다.
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