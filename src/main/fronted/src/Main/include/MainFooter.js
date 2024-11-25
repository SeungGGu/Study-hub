import React from "react";
import "../../styles/MainFooter.css";
import {Box1} from "iconsax-react";  // 스타일 적용

export const MainFooter = () => {
    return (
        <div className="footerScreen container-fluid py-5 bg-dark text-light"> {/* container-fluid 사용 */}
            <div className="row">
                <div className="col-12 col-md mb-4 text-center">
                    <Box1 size="32" color="#FF8A65"/>
                    <small className="d-block mb-3">2024 © RUNNER - Study Hub</small>
                </div>
                <div className="col-6 col-md">
                    <h5>스터디</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="/mainStudy">스터디 목록</a></li>
                    </ul>
                </div>
                <div className="col-6 col-md">
                    <h5>규칙</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="/mainRule">규칙 보기</a></li>
                    </ul>
                </div>
                <div className="col-6 col-md">
                    <h5>커뮤니티</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="/mainCommunity">커뮤니티 목록</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
