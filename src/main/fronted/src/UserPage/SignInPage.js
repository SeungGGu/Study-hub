// SignInPage.js

import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // UserContext 가져오기
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Back} from 'iconsax-react'; // 뒤로가기 아이콘 import
import '../styles/SignInPage.css';

function SignInPage() {
    const { updateUser } = useContext(UserContext); // UserContext에서 updateUser 가져오기
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({id: '', password: ''});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/user/loginProc', credentials)
            .then(response => {
                if (response.data === "로그인 실패") {
                    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
                } else {
                    // 응답 데이터를 "|"를 기준으로 나누어 각 사용자 정보를 저장
                    const [name, nickname, email] = response.data.split('|');

                    // 사용자 정보를 세션에 저장
                    sessionStorage.setItem('userId', credentials.id);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('nickname', nickname);
                    sessionStorage.setItem('email', email);

                    updateUser({
                        id: credentials.id,
                        name,
                        nickname,
                        email
                    });

                    navigate("/");  // 메인 페이지로 이동
                }
            })
            .catch(error => {
                console.error('로그인 실패:', error);
            });
    };


    return (
        <div className="signin-background">
            <div className="back-button" onClick={() => navigate('/')}>
                <Back size="32" color="#A1ACBD"/>
            </div>
            <div className="signin-container">
                <div className="signin-card">
                    <h2 className="signin-header">로그인</h2>
                    <form onSubmit={handleSubmit} className="signin-form">
                        <label htmlFor="id">아이디</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={credentials.id}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="signin-button">로그인</button>
                        <button type="button" className="signup-button" onClick={() => navigate('/register')}>
                            회원가입
                        </button>
                        <a href="/find-account" className="forgot-link">아이디/비밀번호 찾기</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
