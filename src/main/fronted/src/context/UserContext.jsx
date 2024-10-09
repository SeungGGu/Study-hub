import React, { createContext, useState, useEffect } from 'react';

// UserContext 생성
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        nickname: '',
        phone: '',
        birthDate: '',
        gender: '',
    });

    // 여기서는 임시로 로그인 후 세션에서 유저 정보를 불러온다고 가정함.
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            console.log("User loaded from session:", storedUser);  // 추가된 로그
            console.log("Email from stored user:", storedUser.email);  // 이메일 값 확인
        }
    }, []);

    const updateUser = (newUserData) => {
        setUser(newUserData);
        sessionStorage.setItem('user', JSON.stringify(newUserData));  // sessionStorage에 저장
        console.log("Updated user data saved in sessionStorage:", newUserData);  // 로그 추가
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
