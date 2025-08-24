import React from 'react';

const DashboardLayout = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-3xl font-semibold">Stress Data Dashboard</h1>
                <nav>
                    <button className="p-2 bg-blue-500 text-white rounded">Change Mode</button>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex flex-col p-6">
                {/* Section 1: Stress Type Guidance */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 유형 안내</h2>
                    <div className="mt-4">
                        <p className="text-base">이 섹션에서는 다양한 스트레스 유형에 대한 정보를 제공합니다.</p>
                    </div>
                </section>

                {/* Section 2: Daily Stress Change Calendar */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">일간 스트레스 변화 캘린더</h2>
                    <div className="mt-4">
                        <p className="text-base">각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다.</p>
                        {/* Calendar Component Placeholder */}
                        <div className="w-full h-72 bg-gray-200 mt-4 rounded-md"></div>
                    </div>
                </section>

                {/* Section 3: Stress Reduction Activities */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">나의 인지 스트레스 저감 활동</h2>
                    <div className="mt-4">
                        <p className="text-base">지난 한 달 동안, 당신은 왜 스트레스를 받았나요?</p>
                        <div className="mt-4">
                            {/* Activities List Placeholder */}
                            <ul className="list-disc pl-5">
                                <li>호흡하기 (76.3%)</li>
                                <li>화 먹는 요정 (58.6%)</li>
                                <li>스트레칭 (43.0%)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Section 4: Stress Data Overview */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">지난 한 달 동안의 스트레스 데이터</h2>
                    <div className="mt-4">
                        <p className="text-base">내가 ‘스트레스를 받고 있다’고 스스로 인식하는 정도를 의미합니다.</p>
                        {/* Data Overview Placeholder */}
                        <div className="w-full h-72 bg-gray-300 mt-4 rounded-md"></div>
                    </div>
                </section>

                {/* Section 5: Stress Type Comparison */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 유형 비교</h2>
                    <div className="mt-4">
                        <p className="text-base">신체 스트레스와 인지 스트레스의 비교를 통해 더 나은 이해를 돕습니다.</p>
                        {/* Comparison Chart Placeholder */}
                        <div className="w-full h-72 bg-gray-400 mt-4 rounded-md"></div>
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="p-4 bg-gray-100 text-center">
                <p className="text-sm">© 2025 Stress Data Dashboard. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default DashboardLayout;