// SignUpPage.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Back } from 'iconsax-react'; // 뒤로가기 아이콘 import
import '../styles/SignUpPage.css';

function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        nickname: '',
        email: ''
    });

    const handleGoLogin = () => {
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/'); // 뒤로가기 버튼 클릭 시 메인 페이지로 이동
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDuplicateCheck = (fieldName) => {
        console.log(`Performing duplicate check for ${fieldName}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        axios.post("/api/user/register", formData)
            .then((response) => {
                if (response.data === "success") {
                    handleGoLogin();
                } else {
                    alert(response.data);
                }
                setFormData({
                    id: "",
                    password: "",
                    confirmPassword: "",
                    name: "",
                    nickname: "",
                    email: ""
                });
            })
            .catch((error) => {
                console.error("Registration failed:", error);
            });
    };

    return (
        <div className="signup-background">
            <div className="back-button" onClick={handleBack}>
                <Back size="32" color="#A1ACBD" />
            </div>
            <div className="signup-card">
                <h2 className="signup-header">회원가입</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <label>아이디</label>
                    <div className="field-with-button">
                        <input type="text" placeholder="아이디" name="id" value={formData.id} onChange={handleChange} required />
                        <button type="button" onClick={() => handleDuplicateCheck('id')}>중복확인</button>
                    </div>

                    <label>비밀번호</label>
                    <input type="password" placeholder="비밀번호" name="password" value={formData.password} onChange={handleChange} required />

                    <label>비밀번호 확인</label>
                    <input type="password" placeholder="비밀번호 확인" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

                    <label>이름</label>
                    <input type="text" placeholder="이름" name="name" value={formData.name} onChange={handleChange} required />

                    <label>닉네임</label>
                    <div className="field-with-button">
                        <input type="text" placeholder="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} required />
                        <button type="button" onClick={() => handleDuplicateCheck('nickname')}>중복확인</button>
                    </div>

                    <label>이메일</label>
                    <input type="email" placeholder="이메일" name="email" value={formData.email} onChange={handleChange} required />

                    <div className="button-group">
                        <button type="submit" className="submit-button">회원가입</button>
                        <button type="button" className="cancel-button" onClick={handleGoLogin}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
