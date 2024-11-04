// SignInPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Back } from 'iconsax-react'; // 뒤로가기 아이콘 import
import '../styles/SignInPage.css';

function SignInPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ id: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/user/loginProc', credentials)
            .then(response => {
                if (response.data === "로그인 실패") {
                    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
                } else {
                    navigate("/");
                }
            })
            .catch(error => {
                console.error('로그인 실패:', error);
            });
    };

    return (
        <div className="signin-background">
            <div className="back-button" onClick={() => navigate('/')}>
                <Back size="32" color="#A1ACBD" />
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
