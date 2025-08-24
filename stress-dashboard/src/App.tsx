// filepath: /home/jeonghyun/Desktop/stress-data-dashboard/src/components/DashboardLayout.tsx
import React from 'react';

const DashboardLayout: React.FC = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-3xl font-semibold">Stress Data Dashboard</h1>
                <nav>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Change Mode</button>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {/* Section 1: Stress Type Guide */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 유형 안내</h2>
                    <p className="text-base text-neutral-900">
                        다양한 스트레스 유형에 대한 안내입니다.
                    </p>
                </section>

                {/* Section 2: Daily Stress Change Calendar */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">일간 스트레스 변화 캘린더</h2>
                    <p className="text-base text-neutral-900">
                        각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다.
                    </p>
                    <div className="w-full h-72 bg-gray-200 rounded-md mt-4">
                        {/* Calendar Visualization Placeholder */}
                    </div>
                </section>

                {/* Section 3: Stress Reduction Activities */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">나의 인지 스트레스 저감 활동</h2>
                    <p className="text-base text-neutral-900">
                        지난 한 달 동안, 당신은 왜 스트레스를 받았나요?
                    </p>
                    <div className="w-full h-72 bg-gray-200 rounded-md mt-4">
                        {/* Activities Visualization Placeholder */}
                    </div>
                </section>

                {/* Section 4: Stress Records */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">콜 응대 기록</h2>
                    <p className="text-base text-neutral-900">
                        스트레스 관련 콜 응대 기록을 확인하세요.
                    </p>
                    <div className="w-full h-72 bg-gray-200 rounded-md mt-4">
                        {/* Call Records Visualization Placeholder */}
                    </div>
                </section>

                {/* Section 5: Summary */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 요약</h2>
                    <p className="text-base text-neutral-900">
                        당신의 스트레스 수준과 저감 활동에 대한 요약입니다.
                    </p>
                    <div className="w-full h-72 bg-gray-200 rounded-md mt-4">
                        {/* Summary Visualization Placeholder */}
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="p-4 bg-gray-100 text-center">
                <p className="text-sm text-neutral-600">© 2025 Stress Data Dashboard</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;