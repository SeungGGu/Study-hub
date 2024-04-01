import React from "react";
import {MainHeader} from "./include/MainHeader";
import {MainSlider} from "./include/MainSlider";
import {MainFooter} from "./include/MainFooter";

export const FirstMainPage = () =>{
    return(
        <div className="firstMainPage">
            <MainHeader/>
            <MainSlider/>
            <div className="mt-5"/>
            <div className="container marketing">
                <div className="row">
                    <div className="col-lg-4">
                        <svg className="bd-placeholder-img rounded-circle" width="140" height="140"
                             xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder"
                             preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                            <rect width="100%" height="100%" fill="var(--bs-secondary-color)"/>
                        </svg>
                        <h2 className="fw-normal">온라인 스터디</h2>
                        <p>여러가지 서비스 샬라샬라 ㅇㅇ</p>
                        <p><a className="btn btn-secondary" href="#">보러가기 »</a></p>
                    </div>
                    <div className="col-lg-4">
                        <svg className="bd-placeholder-img rounded-circle" width="140" height="140"
                             xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder"
                             preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                            <rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect>
                        </svg>
                        <h2 className="fw-normal">스터디추천</h2>
                        <p>이런곳에 추천 스터디 넣어도 괜찮을려나</p>
                        <p><a className="btn btn-secondary" href="#">스터디 바로가기 »</a></p>
                    </div>
                    <div className="col-lg-4">
                        <svg className="bd-placeholder-img rounded-circle" width="140" height="140"
                             xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder"
                             preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                            <rect width="100%" height="100%" fill="var(--bs-secondary-color)"></rect>
                        </svg>
                        <h2 className="fw-normal">스터디추천</h2>
                        <p>이런곳에 추천 스터디 넣어도 괜찮을려나</p>
                        <p><a className="btn btn-secondary" href="#">View details »</a></p>
                    </div>
                </div>
                <hr className="featurette-divider"/>

                <div className="row featurette d-flex align-items-center justify-content-center">
                    <div className="col-md-7">
                        <h2 className="featurette-heading fw-normal lh-1">스터디를 만들 수도 있어요<span
                            className="text-body-secondary">🎆여기 옅은 글씨</span></h2>
                        <p className="lead">내가 만들어보자</p>
                    </div>
                    <div className="col-md-5">
                        <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                             width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img"
                             aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect>
                            <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text>
                        </svg>
                    </div>
                </div>

                <hr className="featurette-divider"/>

                <div className="row featurette d-flex align-items-center">
                    <div className="col-md-5 order-md-2">
                        <h2 className="featurette-heading fw-normal lh-1">궁금한게 있어요!!<span
                            className="text-body-secondary">📢여기도 흐린글씨</span></h2>
                        <p className="lead">커뮤니티를 사용해 보아요!</p>
                    </div>
                    <div className="col-md-5 order-md-1">
                        <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                             width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img"
                             aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect>
                            <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text>
                        </svg>
                    </div>
                </div>

                <hr className="featurette-divider"/>

                <div className="row featurette d-flex align-items-center justify-content-center">
                    <div className="col-md-7">
                        <h2 className="featurette-heading fw-normal lh-1">하나 더 만들어 놨는디 뭐하지<span
                            className="text-body-secondary">Check</span></h2>
                        <p className="lead">흠흠흠</p>
                    </div>
                    <div className="col-md-5">
                        <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                             width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img"
                             aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false">
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="var(--bs-secondary-bg)"></rect>
                            <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">500x500</text>
                        </svg>
                    </div>
                </div>

                <hr className="featurette-divider"/>

            </div>
            <MainFooter/>
        </div>
    )
}

export default FirstMainPage;
