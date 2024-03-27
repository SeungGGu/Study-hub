import React from "react";
import "./MainHeader.css"
export const MainHeader = () => {
    return (
        <div className="headerScreen">
            <div className="group">
                <div className="overlap-group">
                    <div className="text-wrapper">회원가입</div>
                </div>
            </div>
            <div className="overlap-wrapper">
                <div className="overlap-group">
                    <div className="div">로그인</div>
                </div>
            </div>
            <div className="text-wrapper-2">고객센터</div>
            <div className="community">커뮤니티</div>
            <div className="rule-section">규칙</div>
            <div className="study-section">스터디</div>
            <p className="study-hub">
                <span className="span">study</span>
                <span className="text-wrapper-3"> -hub</span>
            </p>
        </div>
    )
}