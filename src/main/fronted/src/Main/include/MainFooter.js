import React from "react";
export const MainFooter = () => {
    return (
        <div className="footerScreen container py-5">
            <div className="row">
                <div className="col-12 col-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                         stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="d-block mb-2"
                         role="img" viewBox="0 0 24 24"><title>Product</title>
                        <circle cx="12" cy="12" r="10"></circle>
                        <path
                            d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"></path>
                    </svg>
                    <small className="d-block mb-3">2024 © RUNNER - </small>
                </div>
                <div className="col-6 col-md">
                    <h5>스터디</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="#">스터디 목록</a></li>
                        <li><a className="link-secondary text-decoration-none" href="#">스터디 머시기</a></li>
                    </ul>
                </div>
                <div className="col-6 col-md">
                    <h5>규칙</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="#">규칙 보기</a></li>
                    </ul>
                </div>
                <div className="col-6 col-md">
                    <h5>커뮤니티</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="#">공지사항</a></li>
                        <li><a className="link-secondary text-decoration-none" href="#">커뮤니티 목록</a></li>
                    </ul>
                </div>
                <div className="col-6 col-md">
                    <h5>고객센터</h5>
                    <ul className="list-unstyled text-small">
                        <li><a className="link-secondary text-decoration-none" href="#">자주묻는 질문</a></li>
                        <li><a className="link-secondary text-decoration-none" href="#">FAQ</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
