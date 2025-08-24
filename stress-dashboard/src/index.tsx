// filepath: /home/jeonghyun/Desktop/stress-data-dashboard/src/layouts/DashboardLayout.tsx
import React from 'react';

const DashboardLayout: React.FC = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Header Section */}
            <header className="p-4 bg-gray-100">
                <h1 className="text-3xl font-bold text-center">Stress Data Dashboard</h1>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-col items-center p-4">
                {/* Mode Selection Section */}
                <section className="flex justify-center items-center gap-4 mb-8">
                    <div className="p-4 bg-gray-100 rounded-md">
                        <h2 className="text-xl font-normal text-neutral-400">상태 모드</h2>
                    </div>
                    <div className="w-px h-8 bg-gray-300" />
                    <div className="p-4 bg-sky-200 rounded-md">
                        <h2 className="text-xl font-semibold text-neutral-900">변화 모드</h2>
                    </div>
                </section>

                {/* Calendar Section */}
                <section className="w-[668px] h-[534px] flex flex-col items-center mb-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">일간 스트레스 변화 캘린더</h2>
                    <div className="w-full h-72 bg-gray-200 mt-4">
                        {/* Calendar Visualization Placeholder */}
                    </div>
                    <p className="text-base text-neutral-900 mt-4">
                        각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                    </p>
                </section>

                {/* Stress Type Section */}
                <section className="flex flex-col items-center mb-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">스트레스 유형 안내</h2>
                    <div className="flex flex-col items-center mt-4">
                        <div className="flex items-center gap-2">
                            <img className="w-9 h-9" src="https://placehold.co/36x36" alt="Physical Stress Icon" />
                            <h3 className="text-3xl font-semibold text-blue-600">신체 스트레스란?</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <img className="w-9 h-9" src="https://placehold.co/36x36" alt="Cognitive Stress Icon" />
                            <h3 className="text-3xl font-semibold text-red-600">인지 스트레스란?</h3>
                        </div>
                    </div>
                </section>

                {/* Stress Reduction Activities Section */}
                <section className="w-full mb-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">나의 인지 스트레스 저감 활동</h2>
                    <div className="flex flex-col items-center mt-4">
                        <p className="text-base text-neutral-900">
                            당신의 인지 스트레스를 가장 많이 저감시킨 스트레스 완화 활동은 <strong>호흡하기(76.3%)</strong>입니다.
                        </p>
                        {/* Additional activities can be listed here */}
                    </div>
                </section>

                {/* Stress Timeline Section */}
                <section className="w-full mb-8">
                    <h2 className="text-3xl font-semibold text-neutral-900">지난 한 달 동안, 당신은 언제 스트레스를 받았나요?</h2>
                    <div className="flex flex-col items-center mt-4">
                        {/* Timeline Visualization Placeholder */}
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