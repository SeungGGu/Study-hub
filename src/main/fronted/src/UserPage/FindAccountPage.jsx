// FindAccountPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Back } from 'iconsax-react'; // 뒤로가기 아이콘 import
import '../styles/FindAccountPage.css';

function FindAccountPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [activeTab, setActiveTab] = useState('findId');
    const [foundAccountId, setFoundAccountId] = useState(''); // 찾은 아이디 저장
    const [showIdResult, setShowIdResult] = useState(false); // 아이디 찾기 결과 표시

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handleUserIdChange = (e) => setUserId(e.target.value);

    const handleBack = () => {
        navigate('/login'); // 뒤로가기 버튼 클릭 시 메인 페이지로 이동
    };

    const handleFindIdSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/user/find-id', { email, name })
            .then(response => {
                if (response.data.status === "success") {
                    setFoundAccountId(response.data.accountId); // 찾은 아이디 저장
                    setShowIdResult(true); // 결과 표시
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error("아이디 찾기 실패:", error);
                alert("아이디 찾기에 실패했습니다. 다시 시도해주세요.");
            });
    };

    const handleFindPasswordSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/user/find-password', { email, userId })
            .then(response => {
                if (response.data.status === "success") {
                    alert("비밀번호 찾기에 성공했습니다. 이메일을 확인해주세요.");
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error("비밀번호 찾기 실패:", error);
                alert("비밀번호 찾기에 실패했습니다. 다시 시도해주세요.");
            });
    };

    return (
        <div className="find-account-background">
            <div className="back-button" onClick={handleBack}>
                <Back size="32" color="#A1ACBD" />
            </div>
            <div className="find-account-card">
                <h2 className="find-account-header">아이디/비밀번호 찾기</h2>
                <div className="tab-buttons">
                    <button onClick={() => setActiveTab('findId')} className={activeTab === 'findId' ? 'active' : ''}>아이디 찾기</button>
                    <button onClick={() => setActiveTab('findPassword')} className={activeTab === 'findPassword' ? 'active' : ''}>비밀번호 찾기</button>
                </div>

                {activeTab === 'findId' ? (
                    <form onSubmit={handleFindIdSubmit} className="find-account-form">
                        <label>이름</label>
                        <input type="text" placeholder="이름 입력" value={name} onChange={handleNameChange} required />

                        <label>이메일</label>
                        <input type="email" placeholder="가입 시 사용한 이메일 입력" value={email} onChange={handleEmailChange} required />

                        <button type="submit" className="submit-button">아이디 찾기</button>
                    </form>
                ) : (
                    <form onSubmit={handleFindPasswordSubmit} className="find-account-form">
                        <label>아이디</label>
                        <input type="text" placeholder="아이디 입력" value={userId} onChange={handleUserIdChange} required />

                        <label>이메일</label>
                        <input type="email" placeholder="가입 시 사용한 이메일 입력" value={email} onChange={handleEmailChange} required />

                        <button type="submit" className="submit-button">비밀번호 찾기</button>
                    </form>
                )}

                {/* 아이디 찾기 결과 */}
                {showIdResult && (
                    <div className="result-modal">
                        <div className="modal-content">
                            <h3>아이디 찾기 결과</h3>
                            <p>찾은 아이디: <strong>{foundAccountId}</strong></p>
                            <button onClick={() => setShowIdResult(false)}>닫기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindAccountPage;
