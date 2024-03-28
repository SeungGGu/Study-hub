import React from "react";
import Button from 'react-bootstrap/Button';

export const MainHeader = () => {
    return (
        <div className="headerScreen">
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Study-Hub</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">스터디</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">규칙</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">커뮤니티</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">고객센터</a>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <Button variant="secondary" className="me-2">회원가입</Button>{' '}
                            <Button variant="secondary">로그인</Button>{' '}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

{/*<form className="d-flex" role="search">*/}
{/*    <input className="form-control me-2" type="search" placeholder="Search"*/}
{/*           aria-label="Search"/>*/}
{/*    <button className="btn btn-outline-success" type="submit">Search</button>*/}
{/*</form>*/}

{/*<div className="group">*/}
{/*    <div className="overlap-group">*/}
{/*        <div className="text-wrapper">회원가입</div>*/}
{/*    </div>*/}
{/*</div>*/}
{/*<div className="overlap-wrapper">*/}
{/*    <div className="overlap-group">*/}
{/*        <div className="div">로그인</div>*/}
{/*    </div>*/}
{/*</div>*/}
{/*<div className="text-wrapper-2">고객센터</div>*/}
{/*<div className="community">커뮤니티</div>*/}
{/*<div className="rule-section">규칙</div>*/}
{/*<div className="study-section">스터디</div>*/}
{/*<p className="study-hub">*/}
{/*    <span className="span">study</span>*/}
{/*    <span className="text-wrapper-3"> -hub</span>*/}
{/*</p>*/}