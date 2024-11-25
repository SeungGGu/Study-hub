import React, { createContext, useState, useEffect } from 'react';

// UserContext 생성
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 세션에서 유저 정보를 불러옴
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            console.log("User loaded from session:", storedUser);  // 추가된 로그
        }
    }, []);

    const updateUser = (newUserData) => {
        if (newUserData) {
            setUser(newUserData);
            sessionStorage.setItem('user', JSON.stringify(newUserData));  // sessionStorage에 저장
            console.log("Updated user data saved in sessionStorage:", newUserData);  // 로그 추가
        } else {
            setUser(null);
            sessionStorage.removeItem('user');  // 로그아웃 시 세션에서도 제거
            console.log("User logged out.");
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
