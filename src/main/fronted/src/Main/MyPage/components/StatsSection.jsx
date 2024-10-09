// StatsSection.jsx
import React from 'react';


const StatsSection = () => {
    const stats = [
        { label: '총 학습 시간', value: '15시간' },
        { label: '총 학습 횟수', value: '50회' },
        { label: '연속 학습 일수', value: '5일' },
    ];

    return (
        <div className="mypage-stats mypage-section">
            <h3>학습 통계</h3>
            <ul>
                {stats.map((stat, index) => (
                    <li className="stat-item" key={index}>
                        {stat.label}: {stat.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatsSection;
