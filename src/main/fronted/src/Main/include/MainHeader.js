import React from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/MainHeader.css';

export const MainHeader = () => {
    const nickname = sessionStorage.getItem('nickname');
    const isAuthenticated = sessionStorage.getItem('userId') !== null;
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('nickname');
        sessionStorage.removeItem('name');
        navigate('/');
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
}
