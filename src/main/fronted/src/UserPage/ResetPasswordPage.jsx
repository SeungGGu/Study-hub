// ResetPasswordPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Back } from 'iconsax-react';
import '../styles/ResetPasswordPage.css';

function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // URL에서 token 파라미터 추출
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const handlePasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleBack = () => {
        navigate('/'); // 뒤로가기 버튼 클릭 시 메인 페이지로 이동
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        axios.post(`/api/user/reset-password?token=${token}`, { newPassword })
            .then(response => {
                alert(response.data);
                navigate('/login'); // 비밀번호 변경 후 로그인 페이지로 이동
            })
            .catch(error => {
                console.error("비밀번호 재설정 실패:", error);
                setError('비밀번호 재설정에 실패했습니다. 링크가 만료되었거나 유효하지 않습니다.');
            });
    };

    return (
        <div className="reset-password-background">
            <div className="reset-password-card">
                <h3 className="reset-password-header">비밀번호 재설정</h3>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <button type="submit" className="submit-button">
                        비밀번호 재설정
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
