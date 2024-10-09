// RecentActivitySection.jsx
import React from 'react';


const RecentActivitySection = () => {
    const recentActivities = ['카드1을 학습', '카드2을 학습', '카드3을 학습'];  // 최근 활동 내역

    return (
        <div className="mypage-activity mypage-section">
            <h3>최근 학습</h3>
            <ul>
                {recentActivities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivitySection;
