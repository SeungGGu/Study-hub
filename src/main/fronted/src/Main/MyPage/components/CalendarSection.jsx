// CalendarSection.jsx
import React from 'react';

const CalendarSection = () => {
    const calendarItems = ['10월 10일: 학습 완료', '10월 12일: 복습 예정'];  // 일정 정보

    return (
        <div className="mypage-calendar mypage-section">
            <h3>학습 계획</h3>
            <ul>
                {calendarItems.map((item, index) => (
                    <li className="calendar-item" key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default CalendarSection;
