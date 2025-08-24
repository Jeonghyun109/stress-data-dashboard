import React from 'react';

const DashboardLayout = () => {
    return (
        <div className="w-full h-full bg-white overflow-hidden">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-3xl font-semibold">Stress Data Dashboard</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li className="text-xl">Home</li>
                        <li className="text-xl">Settings</li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-8">
                {/* Mode Selection Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">모드 선택</h2>
                    <div className="flex space-x-4 mt-4">
                        <div className="p-4 bg-gray-100 rounded-md">
                            <span className="text-neutral-400 text-xl">상태 모드</span>
                        </div>
                        <div className="p-4 bg-sky-200 rounded-md">
                            <span className="text-neutral-900 text-xl font-semibold">변화 모드</span>
                        </div>
                    </div>
                </section>

                {/* Stress Change Calendar Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">일간 스트레스 변화 캘린더</h2>
                    <div className="mt-4">
                        <p className="text-base text-neutral-900">
                            각 날짜의 평균 스트레스 저감률을 색상으로 시각화한 캘린더입니다. 날짜를 클릭하거나 드래그하여 특정 기간 동안의 스트레스 저감률 데이터를 탐색할 수 있으며, 월간 스트레스 저감 경향을 한눈에 확인할 수 있습니다.
                        </p>
                        <p className="text-base text-neutral-900">
                            색상은 스트레스의 저감 정도를 나타내며, 부정적인 변화 (스트레스 증가)는 주황색 계열로, 긍정적인 변화 (스트레스 저감)는 초록색 계열로 표시됩니다.
                        </p>
                    </div>
                </section>

                {/* Stress Type Guidance Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 유형 안내</h2>
                    <div className="mt-4">
                        <p className="text-base text-neutral-900">
                            지난 한 달 동안, 당신은 왜 스트레스를 받았나요?
                        </p>
                    </div>
                </section>

                {/* Stress Reduction Activities Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">나의 인지 스트레스 저감 활동</h2>
                    <div className="mt-4">
                        <p className="text-base text-neutral-900">
                            당신의 인지 스트레스를 가장 많이 저감시킨 스트레스 완화 활동은 <strong>호흡하기(76.3%)</strong>입니다. 그 외에도 <strong>화 먹는 요정(58.6%)</strong>과 <strong>스트레칭(43.0%)</strong>이 효과적인 방법으로 나타났습니다.
                        </p>
                    </div>
                </section>

                {/* Stress Data Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">스트레스 데이터</h2>
                    <div className="mt-4">
                        <p className="text-base text-neutral-900">
                            해당 시점에 수집된 데이터: CO2: ~~~, 온도: ~~~, 습도: ~~~, 콜 유형: ~~~, 수면의 질: ~~~, 각성/흥분 정도: ~~~, 정서적 긍부정 정도: ~~~, 피로도: ~~~, 감정을 숨기려는 노력: ~~~
                        </p>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="mt-8 p-4 bg-gray-100 text-center">
                    <p className="text-sm text-neutral-600">© 2025 Stress Data Dashboard. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default DashboardLayout;