import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../context/UserContext'; // 사용자 정보를 가져오기 위한 컨텍스트

function StorySection() {
    const { user } = useContext(UserContext); // 사용자 정보를 가져옴
    const [activities, setActivities] = useState([]);
    const [streak, setStreak] = useState(0); // 연속 접속 일 수 저장

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                // 사용자 활동 기록을 가져옴
                const response = await axios.get(`/api/user/activity/${user.id}`);
                setActivities(response.data); // 활동 기록을 상태로 저장

                // 연속 접속 일 계산
                const streakCount = calculateStreak(response.data);
                setStreak(streakCount);
            } catch (error) {
                console.error('Error fetching activity data:', error);
            }
        };

        if (user && user.id) { // user 객체가 있을 때만 호출
            fetchActivityData();
        }
    }, [user]);

    // 연속 접속 일 계산
    const calculateStreak = (activities) => {
        const today = new Date();
        let currentStreak = 0;

        for (let i = 0; i < activities.length; i++) {
            const activityDate = new Date(activities[i].date);
            const differenceInDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));

            // 만약 현재 날짜로부터 연속된 날이라면 연속 일 수 증가
            if (differenceInDays === currentStreak) {
                currentStreak++;
            } else {
                break;
            }
        }
        return currentStreak;
    };

    // 활동 시간에 따라 잔디 색상 결정
    const getGrassColor = (totalDuration) => {
        if (totalDuration === undefined || totalDuration === 0) {
            return '#ebedf0'; // 기본 회색 (활동이 없을 경우)
        }
        if (totalDuration > 120) {
            return '#216e39'; // 가장 진한 초록색 (120분 이상)
        } else if (totalDuration > 60) {
            return '#30a14e'; // 중간 초록색 (60분 이상)
        } else if (totalDuration > 30) {
            return '#40c463'; // 연한 초록색 (30분 이상)
        } else {
            return '#9be9a8'; // 아주 연한 초록색 (30분 이하)
        }
    };

    // 해당 월의 마지막 일자 계산 (예: 30일, 31일 등)
    const getLastDayOfMonth = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 현재 월
        return new Date(year, month, 0).getDate(); // 해당 월의 마지막 날 계산
    };

    const lastDayOfMonth = getLastDayOfMonth();

    return (
        <div className="story-section">
            <p>{streak > 0 ? `${streak}일 연속 접속중!` : '현재 연속 접속이 없습니다.'}</p> {/* 연속 접속 일 수 표시 */}
            <div
                className="grass-field"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',  // 7일씩 한 줄로 배치
                    gap: '3px',  // 각 칸 간의 간격
                    margin: '10px 0'  // 위아래 여백
                }}
            >
                {/* 각 월의 마지막 날에 맞춰 잔디칸을 렌더링 */}
                {[...Array(lastDayOfMonth)].map((_, index) => {
                    const day = index + 1;
                    const activity = activities.find(act => new Date(act.date).getDate() === day);
                    const grassColor = activity ? getGrassColor(activity.totalDuration) : '#ebedf0';

                    return (
                        <div
                            key={index}
                            style={{
                                width: '30px',  // 각 칸의 너비
                                height: '30px',  // 각 칸의 높이
                                backgroundColor: grassColor, // 배경색
                                borderRadius: '2px',  // 모서리 둥글게
                            }}
                            title={`날짜: ${day}, 총 시간: ${activity ? activity.totalDuration : 0}분`} // 마우스 오버 시 정보 표시
                        >
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StorySection;
