import React from "react";
import { MainHeader } from "./include/MainHeader";
import { MainSlider } from "./include/MainSlider";
import { MainFooter } from "./include/MainFooter";
import "../styles/FirstMainPage.css";

export const FirstMainPage = () => {
    return (
        <div className="firstMainPage">
            <MainHeader />
            <MainSlider />

            {/* 카드 섹션 */}
            <div className="container-fluid card-container my-5 px-5">
                <div className="row justify-content-center">
                    {["온라인 스터디", "스터디 추천", "커뮤니티"].map((title, index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                            <div className="study-card">
                                <img className="card-img" src="https://via.placeholder.com/140" alt={title} />
                                <h2 className="card-title">{title}</h2>
                                <p className="card-description">
                                    {title}에 관련된 다양한 정보를 확인하세요.
                                </p>
                                <button className="card-button">자세히 보기 »</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="section-divider" />

            {/* 콘텐츠 섹션 */}
            <div className="container-fluid feature-section mb-5 px-5">
                <div className="row align-items-center mb-5">
                    <div className="col-md-7">
                        <h2 className="feature-title">스터디를 만들 수도 있어요 <span className="highlight-text">여기 옅은 글씨</span></h2>
                        <p className="feature-description">직접 스터디를 개설하고 함께 공부할 사람들을 모집해보세요.</p>
                    </div>
                    <div className="col-md-5">
                        <img className="feature-image" src="https://via.placeholder.com/500" alt="스터디 만들기" />
                    </div>
                </div>

                <hr className="section-divider" />

                <div className="row align-items-center mb-5 reverse">
                    <div className="col-md-5">
                        <img className="feature-image" src="https://via.placeholder.com/500" alt="커뮤니티" />
                    </div>
                    <div className="col-md-7">
                        <h2 className="feature-title">궁금한게 있어요!! <span className="highlight-text">여기도 흐린글씨</span></h2>
                        <p className="feature-description">커뮤니티를 활용해 궁금한 점을 해결하고, 다른 사람들과 소통하세요.</p>
                    </div>
                </div>
            </div>

            <MainFooter />
        </div>
    );
};

export default FirstMainPage;
