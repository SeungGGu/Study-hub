import React, { useEffect } from 'react';
import './Main.css';
import { MainHeader } from './include/MainHeader';
import { useTheme } from '../ThemeContext.jsx';

const Main = () => {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
        };

        const handleIntersect = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        const sections = document.querySelectorAll('.fade-in');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="main-container">
            <MainHeader />
            <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Hero Section */}
            <section className="hero-section fade-in">
                <div className="hero-content">
                    <h1>함께 성장하는 스터디</h1>
                    <p>언제 어디서나 함께하는 스마트한 학습</p>
                    <a href="#focus-room-section" className="hero-cta">시작하기</a>
                </div>
            </section>

            {/* Focus Room Section */}
            <section id="focus-room-section" className="focus-room-section fade-in">
                <h2>스터디룸 입장하기</h2>
                <p className="focus-room-subtitle">다른 사람들과 함께 공부해요!</p>
                <div className="moniter-screen">
                    <img src="https://via.placeholder.com/800x400" alt="Study Room Main Screen" />
                </div>
                <div className="focus-feature-boxes">
                    <div className="focus-feature-box">
                        <h3>💬 채팅 기능</h3>
                        <p>스터디원들과 실시간으로 채팅하며 소통할 수 있습니다.</p>
                    </div>
                    <div className="focus-feature-box">
                        <h3>👥 커뮤니티 기능</h3>
                        <p>스터디 멤버들과 학습 자료와 정보를 공유할 수 있는 공간입니다.</p>
                    </div>
                    <div className="focus-feature-box">
                        <h3>📌 과제 관리</h3>
                        <p>할 일 목록과 과제를 관리하고 함께 진행 상황을 확인할 수 있습니다.</p>
                    </div>
                </div>
            </section>

            {/* Features Sections */}
            <section className="feature-section feature-calendar fade-in">
                <div className="feature-content">
                    <div className="feature-text">
                        <h2>📅 캘린더 일정 관리</h2>
                        <p>스터디원들과 공유 캘린더를 통해 일정과 계획을 손쉽게 관리하세요</p>
                    </div>
                    <div className="feature-image">
                        <img src="https://via.placeholder.com/400x250" alt="Calendar Feature"/>
                    </div>
                </div>
            </section>

            <section className="feature-section feature-canvas fade-in">
                <div className="feature-content reverse-layout">
                    <div className="feature-image">
                        <img src="https://via.placeholder.com/400x250" alt="Canvas Feature" />
                    </div>
                    <div className="feature-text">
                        <h2>🖌️ 캔버스 활용</h2>
                        <p>캔버스 노트를 활용해 시각적으로 내용을 공유할 수 있어요!</p>
                    </div>
                </div>
            </section>

            <section className="feature-section feature-video-call fade-in">
                <div className="feature-content">
                    <div className="feature-text">
                        <h2>💻 화상 스터디</h2>
                        <p>화상통화로 어디서든 실시간으로 스터디원들과 함께 공부할 수 있습니다.</p>
                    </div>
                    <div className="feature-image">
                        <img src="https://via.placeholder.com/400x250" alt="Video Call Feature" />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section fade-in">
                <h2>사용자 후기</h2>
                <div className="testimonial-cards">
                    <div className="testimonial-card">
                        <div className="testimonial-image">👨‍💻</div>
                        <h3>박승빈</h3>
                        <span>대학생</span>
                        <p>"공부 시간을 효율적으로 관리할 수 있어 너무 좋아요!"</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-image">👩‍🎓</div>
                        <h3>양제훈</h3>
                        <span>대학생</span>
                        <p>"이 사이트 덕분에 혼자 공부할 때보다 집중력이 훨씬 좋아졌어요!"</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-image">👩‍🏫</div>
                        <h3>이정은</h3>
                        <span>대학생</span>
                        <p>"캘린더와 타이머 기능 덕분에 공부 효율이 훨씬 높아졌어요!"</p>
                    </div>
                </div>
            </section>

            <footer className="main-footer">
                <div className="footer-content">
                    <p>&copy; 2024 Study Hub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Main;

// import React, { useEffect } from 'react';
// import './Main.css';
// import { MainHeader } from './include/MainHeader';
//
// const Main = () => {
//     useEffect(() => {
//         const observerOptions = {
//             threshold: 0.1,
//         };
//
//         const handleIntersect = (entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('visible');
//                 }
//             });
//         };
//
//         const observer = new IntersectionObserver(handleIntersect, observerOptions);
//
//         const sections = document.querySelectorAll('.fade-in');
//         sections.forEach(section => observer.observe(section));
//
//         return () => observer.disconnect();
//     }, []);
//
//     return (
//         <div className="main-container">
//             <MainHeader />
//
//             {/* Hero Section */}
//             <section className="hero-section fade-in">
//                 <div className="hero-content">
//                     <h1>함께 성장하는 스터디 플랫폼</h1>
//                     <p>언제 어디서나 함께하는 스마트한 학습</p>
//                     <a href="#focus-room-section" className="hero-cta">시작하기</a>
//                 </div>
//             </section>
//
//             {/* Focus Room Section */}
//             <section id="focus-room-section" className="focus-room-section fade-in">
//                 <h2>스터디룸 입장하기</h2>
//                 <p className="focus-room-subtitle">다른 사람들과 함께 공부해요!</p>
//                 <div className="moniter-screen">
//                     <img src="https://via.placeholder.com/800x400" alt="Study Room Main Screen" />
//                 </div>
//                 <div className="focus-feature-boxes">
//                     <div className="focus-feature-box">
//                         <h3>💬 채팅 기능</h3>
//                         <p>스터디원들과 실시간으로 채팅하며 소통할 수 있습니다.</p>
//                     </div>
//                     <div className="focus-feature-box">
//                         <h3>👥 커뮤니티 기능</h3>
//                         <p>스터디 멤버들과 학습 자료와 정보를 공유할 수 있는 공간입니다.</p>
//                     </div>
//                     <div className="focus-feature-box">
//                         <h3>📌 과제 관리</h3>
//                         <p>할 일 목록과 과제를 관리하고 함께 진행 상황을 확인할 수 있습니다.</p>
//                     </div>
//                 </div>
//             </section>
//
//             {/* Features Sections */}
//             <section className="feature-section feature-calendar fade-in">
//                 <div className="feature-content">
//                     <div className="feature-text">
//                         <h2>📅 캘린더 일정 관리</h2>
//                         <p>스터디원들과 공유 캘린더를 통해 일정과 계획을 손쉽게 관리하세요</p>
//                     </div>
//                     <div className="feature-image">
//                         <img src="https://via.placeholder.com/400x250" alt="Calendar Feature"/>
//                     </div>
//                 </div>
//             </section>
//
//             <section className="feature-section feature-canvas fade-in">
//                 <div className="feature-content reverse-layout">
//                     <div className="feature-image">
//                         <img src="https://via.placeholder.com/400x250" alt="Canvas Feature" />
//                     </div>
//                     <div className="feature-text">
//                         <h2>🖌️ 캔버스 활용</h2>
//                         <p>캔버스 노트를 활용해 시각적으로 내용을 공유할 수 있어요!</p>
//                     </div>
//                 </div>
//             </section>
//
//             <section className="feature-section feature-video-call fade-in">
//                 <div className="feature-content">
//                     <div className="feature-text">
//                         <h2>💻 화상 스터디</h2>
//                         <p>화상통화로 어디서든 실시간으로 스터디원들과 함께 공부할 수 있습니다.</p>
//                     </div>
//                     <div className="feature-image">
//                         <img src="https://via.placeholder.com/400x250" alt="Video Call Feature" />
//                     </div>
//                 </div>
//             </section>
//
//             {/* Testimonials Section */}
//             <section className="testimonials-section fade-in">
//                 <h2>사용자 후기</h2>
//                 <div className="testimonial-cards">
//                     <div className="testimonial-card">
//                         <div className="testimonial-image">👨‍💻</div>
//                         <h3>박승빈</h3>
//                         <span>대학생</span>
//                         <p>"공부 시간을 효율적으로 관리할 수 있어 너무 좋아요!"</p>
//                     </div>
//                     <div className="testimonial-card">
//                         <div className="testimonial-image">👩‍🎓</div>
//                         <h3>양제훈</h3>
//                         <span>대학생</span>
//                         <p>"이 사이트 덕분에 혼자 공부할 때보다 집중력이 훨씬 좋아졌어요!"</p>
//                     </div>
//                     <div className="testimonial-card">
//                         <div className="testimonial-image">👩‍🏫</div>
//                         <h3>이정은</h3>
//                         <span>대학생</span>
//                         <p>"캘린더와 타이머 기능 덕분에 공부 효율이 훨씬 높아졌어요!"</p>
//                     </div>
//                 </div>
//             </section>
//
//             <footer className="main-footer">
//                 <div className="footer-content">
//                     <p>&copy; 2024 Study Hub. All rights reserved.</p>
//                 </div>
//             </footer>
//         </div>
//     );
// };
//
// export default Main;