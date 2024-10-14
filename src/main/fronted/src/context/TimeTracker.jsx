import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const TimeTracker = ({ children }) => {
    const { user } = useContext(UserContext);  // 로그인한 사용자 정보
    let intervalId;

    useEffect(() => {
        const updateDuration = async () => {
            try {
                if (user && user.id) {
                    await axios.put(`/api/user/activity/update-duration/${user.id}`, {
                        duration: 1
                    });
                    console.log("1분 누적되었습니다.");
                }
            } catch (error) {
                console.error('Error updating user activity duration:', error);
            }
        };

        // 로그인 상태일 때만 타이머 작동
        if (user && user.id) {
            intervalId = setInterval(updateDuration, 60000);  // 1분마다 실행
        }

        // 로그아웃 시 타이머 중지
        return () => clearInterval(intervalId);
    }, [user]);

    return <>{children}</>;
};

export default TimeTracker;
