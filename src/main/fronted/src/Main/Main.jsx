import React from 'react';
import './Main.css';
import {MainHeader} from "./include/MainHeader";

const Main = () => {
    return (
        <div className="main-container">
            <MainHeader/>

            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-text">
                        <h1>Learn and Improve Yourself in Less Time</h1>
                        <p>Our self improvement courses are very effective</p>
                        <a href="#" className="cta-btn">Ready to get started?</a>
                    </div>
                </div>
            </section>


            <section className="focus-room-section">
                <h2>스터디룸 입장하기</h2>
                <p className="focus-room-subtitle">다른사람과 같이 공부를 해봐요!!!</p>

                <div className="monitor-frame">
                    <div className="monitor-screen">
                        <img src="https://via.placeholder.com/800x400" alt="Study Room Main Screen"/>
                    </div>
                    <div className="monitor-stand"></div>
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


            <section className="feature-calendar">
                <div className="feature-content">
                    <div className="feature-text">
                        <h2>📅 캘린더로 일정관리!</h2>
                        <p>스터디원들과 함께 캘린더를 통해 일정과 계획을 손쉽게 관리하세요.</p>
                    </div>
                    <div className="feature-image monitor-frame">
                        <div className="monitor-screen">
                            <img src="https://via.placeholder.com/400x250" alt="Calendar Feature"/>
                        </div>
                        <div className="monitor-stand"></div>
                    </div>
                </div>
            </section>

            <section className="feature-canvas">
                <div className="feature-content reverse-layout">
                    <div className="feature-image monitor-frame">
                        <div className="monitor-screen">
                            <img src="https://via.placeholder.com/400x250" alt="Canvas Feature"/>
                        </div>
                        <div className="monitor-stand"></div>
                    </div>
                    <div className="feature-text">
                        <h2>🖌️ 캔버스를 활용하여 시각적인 도구 사용가능!</h2>
                        <p>캔버스를 사용해 그림이나 도형을 그려가며 시각적으로 내용을 공유할 수 있습니다.</p>
                    </div>
                </div>
            </section>

            <section className="feature-video-call">
                <div className="feature-content">
                    <div className="feature-text">
                        <h2>💻 화상통화를 활용한 비대면 화상 스터디 기능</h2>
                        <p>화상통화로 어디서든 실시간으로 스터디원들과 함께 공부할 수 있습니다.</p>
                    </div>
                    <div className="feature-image monitor-frame">
                        <div className="monitor-screen">
                            <img src="https://via.placeholder.com/400x250" alt="Video Call Feature"/>
                        </div>
                        <div className="monitor-stand"></div>
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <h2 className="testimonials-title">사용자 후기</h2>
                <div className="testimonial-cards">
                    <div className="testimonial-card">
                        <div className="testimonial-image">👨‍💻</div>
                        <h3 className="testimonial-name">박승빈</h3>
                        <span className="testimonial-role">프로그래머</span>
                        <p className="testimonial-text">“공부 시간을 효율적으로 관리할 수 있어서 너무 좋아요. 필요한 기능들이 잘 갖춰져 있어 정말 유용합니다.”</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-image">👩‍🎓</div>
                        <h3 className="testimonial-name">양제훈</h3>
                        <span className="testimonial-role">대학생</span>
                        <p className="testimonial-text">“이 사이트 덕분에 혼자 공부할 때보다 집중력이 훨씬 좋아졌어요! 스터디룸 기능이 특히 도움이 많이
                            되네요.”</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-image">👩‍🏫</div>
                        <h3 className="testimonial-name">이정은</h3>
                        <span className="testimonial-role">대학생</span>
                        <p className="testimonial-text">“캘린더와 타이머 기능 덕분에 스스로 시간 관리를 할 수 있어서 공부 효율이 훨씬 높아졌어요!”</p>
                    </div>
                </div>
            </section>


            <footer className="main-footer">
                <div className="footer-content">
                    <p>&copy; 2024 Study Course. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Main;
