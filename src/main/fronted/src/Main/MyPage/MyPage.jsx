import React, { useState, useEffect, useContext } from 'react';
import './myPage.css';
import { MainHeader } from "../include/MainHeader";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import StorySection from "./components/StroySection";
import RecordSection from "./components/RecordSection";
import StudyManagement from "./components/StudyManagement";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        // DOM이 렌더링된 후에만 프로필과 스토리의 높이를 맞춤
        const profileHeight = document.querySelector('.mypage-profile-content')?.offsetHeight;
        const storyContent = document.querySelector('.mypage-story-content');
        if (storyContent && profileHeight) {
            storyContent.style.height = `${profileHeight}px`;
        }
    }, [user]); // user 값이 변경될 때마다 실행되도록 수정

    const handleEditProfile = () => {
        navigate('/editProfile'); // editProfile 페이지로 이동
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'study':
                return (
                    <div className="mypage-content">
                        <h3>가입한 스터디 목록</h3>
                        <div className="mypage-study-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>스터디 이름</th>
                                    <th>태그</th>
                                    <th>나가기</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>스터디 A</td>
                                    <td>
                                        <span className="mypage-tag">#JavaScript</span>
                                        <span className="mypage-tag">#React</span>
                                    </td>
                                    <td><button className="mypage-leave-btn">나가기</button></td>
                                </tr>
                                <tr>
                                    <td>스터디 B</td>
                                    <td><span className="mypage-tag">#Python</span></td>
                                    <td><button className="mypage-leave-btn">나가기</button></td>
                                </tr>
                                <tr>
                                    <td>스터디 C</td>
                                    <td>
                                        <span className="mypage-tag">#React</span>
                                        <span className="mypage-tag">#NodeJS</span>
                                        <span className="mypage-tag">#Express</span>
                                    </td>
                                    <td><button className="mypage-leave-btn">나가기</button></td>
                                </tr>
                                <tr>
                                    <td>스터디 D</td>
                                    <td>
                                        <span className="mypage-tag">#NodeJS</span>
                                        <span className="mypage-tag">#MongoDB</span>
                                    </td>
                                    <td><button className="mypage-leave-btn">나가기</button></td>
                                </tr>
                                <tr>
                                    <td>스터디 E</td>
                                    <td>
                                        <span className="mypage-tag">#CSS</span>
                                        <span className="mypage-tag">#HTML</span>
                                    </td>
                                    <td><button className="mypage-leave-btn">나가기</button></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'activity':
                return (
                    <div className="mypage-content">
                        <StudyManagement />
                    </div>
                );
            case 'record':
                return (
                    <div className="mypage-content">
                        <RecordSection />
                    </div>
                );
            default:
                return null;
        }
    };

    // user가 null일 때 로딩 상태 처리
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mypage">
            <MainHeader/>
            <div className="mypage-header">
                <div className="mypage-profile">
                    <h3>내 프로필</h3>
                    <div className="mypage-profile-content">
                        <div className="mypage-profile-details">
                            <div className="mypage-profile-img">
                                <span role="img" aria-label="profile" className="mypage-emoji">👤</span>
                            </div>
                            <div className="mypage-profile-info">
                                {/* 로그인한 사용자 정보 표시 */}
                                <p className="mypage-nickname">{user.nickname || '닉네임 정보 없음'}</p>
                                <p className="mypage-email">{user.email || '이메일 정보 없음'}</p>
                                <hr/>
                                <div className="mypage-profile-extra">
                                    <p>닉네임 | {user.nickname || '닉네임 정보 없음'}</p>
                                    <p>상태메시지 | 아자아자 화이팅~</p>
                                    <p>목표 | 디자인 얼른 끝내기 ㅎㅎ</p>
                                    <p>소셜 로그인 | KAKAO</p>
                                </div>
                            </div>
                            <button className="mypage-edit-btn" onClick={handleEditProfile}>수정</button>
                        </div>
                    </div>
                </div>

                <div className="mypage-story">
                    <h3>내 스토리</h3>
                    <div className="mypage-story-content">
                        <StorySection />
                    </div>
                </div>
            </div>

            <div className="mypage-tabs">
                <button onClick={() => setActiveTab('study')}
                        className={activeTab === 'study' ? 'mypage-active' : ''}>
                    가입한 스터디 관리
                </button>
                <button onClick={() => setActiveTab('activity')}
                        className={activeTab === 'activity' ? 'mypage-active' : ''}>
                    내 스터디 관리
                </button>
                <button onClick={() => setActiveTab('record')}
                        className={activeTab === 'record' ? 'mypage-active' : ''}>
                    게시판
                </button>
            </div>

            {renderContent()}
        </div>
    );
};

export default MyPage;
