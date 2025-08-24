// filepath: /home/jeonghyun/Desktop/stress-data-dashboard/src/layouts/DashboardLayout.tsx

import React from 'react';

const DashboardLayout: React.FC = () => {
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
                {/* Section 1: Stress Type Guide */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">Stress Type Guide</h2>
                    <p className="text-base text-neutral-900">
                        This section provides an overview of different types of stress and their effects.
                    </p>
                </section>

                {/* Section 2: Daily Stress Change Calendar */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">Daily Stress Change Calendar</h2>
                    <p className="text-base text-neutral-900">
                        A calendar visualizing the average stress reduction rate for each day. Click or drag to explore data.
                    </p>
                    <div className="w-full h-72 bg-gray-200 mt-4 rounded-md">
                        {/* Calendar Visualization Placeholder */}
                    </div>
                </section>

                {/* Section 3: Stress Reduction Activities */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">Stress Reduction Activities</h2>
                    <p className="text-base text-neutral-900">
                        Overview of activities that have helped reduce stress levels.
                    </p>
                    <div className="flex flex-col mt-4">
                        <div className="bg-green-400 h-16 mb-2 rounded-md">Breathing (76.3%)</div>
                        <div className="bg-emerald-200 h-16 mb-2 rounded-md">Anger Eating Fairy (58.6%)</div>
                        <div className="bg-neutral-400 h-16 mb-2 rounded-md">Stretching (43.0%)</div>
                        <div className="bg-red-200 h-16 mb-2 rounded-md">Now, Is It Because of Me? (-1.8%)</div>
                    </div>
                </section>

                {/* Section 4: Stress Levels */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">Stress Levels</h2>
                    <p className="text-base text-neutral-900">
                        This section displays the physiological stress levels recorded.
                    </p>
                    <div className="flex flex-col mt-4">
                        <div className="bg-blue-400 h-16 mb-2 rounded-md">Physical Stress Level</div>
                        <div className="bg-red-400 h-16 mb-2 rounded-md">Cognitive Stress Level</div>
                    </div>
                </section>

                {/* Section 5: Stress Triggers */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">Stress Triggers</h2>
                    <p className="text-base text-neutral-900">
                        Insights into what has caused stress over the past month.
                    </p>
                    <div className="bg-gray-200 h-32 mt-4 rounded-md">
                        {/* Stress Triggers Visualization Placeholder */}
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