import React from "react";
import Button from 'react-bootstrap/Button';
import './MainHeader.css';

export const MainHeader = () => {
    const nickname = sessionStorage.getItem('nickname');
    const isAuthenticated = sessionStorage.getItem('userId') !== null;

    return (
        <div className="headerScreen mb-7">
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Study-Hub</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-items">
                                <a className="nav-link" href="/mainStudy">스터디</a>
                            </li>
                            <li className="nav-items">
                                <a className="nav-link" href="/mainRule">규칙</a>
                            </li>
                            <li className="nav-items">
                                <a className="nav-link" href="/mainCommunity">커뮤니티</a>
                            </li>
                            <li className="nav-items">
                                <a className="nav-link" href="/">고객센터</a>
                            </li>
                        </ul>
                        <div className="d-flex">
                            {isAuthenticated ? (
                                <span className="me-2">{nickname}</span>
                            ) : (
                                <>
                                    <Button variant="secondary" className="me-2" href={"/register"}>
                                        회원가입
                                    </Button>
                                    <Button variant="secondary" href={"/login"}>
                                        로그인
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
