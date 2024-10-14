import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/MainHeader.css';
import { UserContext } from '../../context/UserContext';  // 사용자 정보를 가져오기 위한 컨텍스트

export const MainHeader = () => {
    const { user, updateUser } = useContext(UserContext);  // 유저 정보를 가져옴
    const nickname = user?.nickname;  // user가 null일 경우를 방지
    const isAuthenticated = user && user.email;  // 유저 이메일로 로그인 여부 확인
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('user');  // 모든 사용자 정보를 세션에서 제거
        updateUser(null);  // Context 내의 유저 정보도 비움
        navigate('/');  // 메인 화면으로 이동
    };

    return (
        <div className="headerScreen">
            <nav className="navbar navbar-expand-lg fixed-top header-nav">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold text-gold" href="/">Study-Hub</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link text-gold" href="/mainStudy">스터디</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-gold" href="/mainRule">규칙</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-gold" href="/mainCommunity">커뮤니티</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-gold" href="/">고객센터</a>
                            </li>
                        </ul>
                        <div className="d-flex">
                            {isAuthenticated ? (
                                <>
                                    <div className="me-2 text-gold">{nickname}</div>
                                    <button className="btn btn-outline-gold me-2" onClick={() => navigate('/myPage')}>
                                        마이페이지
                                    </button>
                                    <button className="btn btn-outline-gold" onClick={handleLogout}>
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-outline-gold me-2" onClick={() => navigate('/register')}>
                                        회원가입
                                    </button>
                                    <button className="btn btn-outline-gold" onClick={() => navigate('/login')}>
                                        로그인
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};
