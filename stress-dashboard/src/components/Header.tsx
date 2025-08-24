// filepath: /home/jeonghyun/Desktop/stress-data-dashboard/src/components/DashboardLayout.tsx
import React from 'react';

const DashboardLayout: React.FC = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-3xl font-semibold">Stress Data Dashboard</h1>
                <div className="flex gap-4">
                    <button className="p-2 bg-gray-200 rounded">상태 모드</button>
                    <button className="p-2 bg-sky-200 rounded">변화 모드</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8">
                {/* Stress Change Calendar Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">일간 스트레스 변화 캘린더</h2>
                    <p className="text-base text-neutral-900 mb-4">
                        각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                    </p>
                    <div className="h-72 bg-gray-200 rounded-md"> {/* Placeholder for Calendar */}</div>
                </section>

                {/* Stress Type Guidance Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">스트레스 유형 안내</h2>
                    <div className="flex justify-between">
                        <div className="w-1/2 p-4 bg-gray-100 rounded-md">
                            <h3 className="text-xl font-semibold">신체 스트레스</h3>
                            <p className="text-base text-neutral-900">
                                내 몸이 실제로 반응한 생리적인 긴장 수준을 나타냅니다.
                            </p>
                        </div>
                        <div className="w-1/2 p-4 bg-gray-100 rounded-md">
                            <h3 className="text-xl font-semibold">인지 스트레스</h3>
                            <p className="text-base text-neutral-900">
                                내가 ‘스트레스를 받고 있다’고 스스로 인식하는 정도를 의미합니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stress Reduction Activities Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">나의 스트레스 저감 활동</h2>
                    <p className="text-base text-neutral-900 mb-4">
                        지난 한 달 동안, 당신은 왜 스트레스를 받았나요?
                    </p>
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-green-200 rounded-md">
                            <h3 className="text-xl font-semibold">호흡하기</h3>
                            <p className="text-base text-neutral-900">76.3% 효과</p>
                        </div>
                        <div className="p-4 bg-green-200 rounded-md">
                            <h3 className="text-xl font-semibold">화 먹는 요정</h3>
                            <p className="text-base text-neutral-900">58.6% 효과</p>
                        </div>
                        <div className="p-4 bg-green-200 rounded-md">
                            <h3 className="text-xl font-semibold">스트레칭</h3>
                            <p className="text-base text-neutral-900">43.0% 효과</p>
                        </div>
                    </div>
                </section>

                {/* Stress Timeline Section */}
                <section>
                    <h2 className="text-3xl font-semibold mb-4">지난 한 달 동안, 당신은 언제 스트레스를 받았나요?</h2>
                    <div className="h-72 bg-gray-200 rounded-md"> {/* Placeholder for Timeline */}</div>
                </section>
            </main>
        </div>
    );
};

export default DashboardLayout;