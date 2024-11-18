import React, {useState, useEffect, useContext} from 'react';
import './myPage.css';
import {MainHeader} from "../include/MainHeader";
import {useNavigate} from "react-router-dom";
import {UserContext} from '../../context/UserContext';
import StorySection from "./components/StroySection";
import RecordSection from "./components/RecordSection";
import StudyManagement from "./components/StudyManagement";
import axios from 'axios';

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const [joinedStudies, setJoinedStudies] = useState([]);
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    useEffect(() => {
        // DOM이 렌더링된 후에만 프로필과 스토리의 높이를 맞춤
        const profileHeight = document.querySelector('.mypage-profile-content')?.offsetHeight;
        const storyContent = document.querySelector('.mypage-story-content');
        if (storyContent && profileHeight) {
            storyContent.style.height = `${profileHeight}px`;
        }
    }, [user]); // user 값이 변경될 때마다 실행되도록 수정

    useEffect(() => {
        if (user && user.id) {
            axios.get(`/api/studyMember/byUser/${user.id}`)
                .then(response => {
                    setJoinedStudies(response.data);
                })
                .catch(error => {
                    console.error('스터디 조회 오류:', error);
                    setJoinedStudies([]);
                });
        }
    }, [user]);

    const handleEditProfile = () => {
        navigate('/editProfile');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'study':
                return (
                    <div className="mypage-content">
                        <h3>가입한 스터디 목록</h3>
                        {joinedStudies && joinedStudies.length > 0 ? (
                            <div className="mypage-study-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>스터디 이름</th>
                                        <th>설명</th>
                                        <th>나가기</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {joinedStudies.map(study => (
                                        <tr key={study.studyId}>
                                            <td>{study.studyTitle}</td>
                                            <td>{study.studyComment}</td>
                                            <td>
                                                <button className="mypage-leave-btn">나가기</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>아직 가입한 스터디가 없습니다.</p>
                        )}
                    </div>
                );
            case 'activity':
                return (
                    <div className="mypage-content">
                        <StudyManagement/>
                    </div>
                );
            case 'record':
                return (
                    <div className="mypage-content">
                        <RecordSection/>
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
                                {/* 로그인한 사용자 정보 표시, user가 있을 때만 접근 */}
                                <p className="mypage-nickname">{user ? user.nickname : '닉네임 정보 없음'}</p>
                                <p className="mypage-email">{user ? user.email : '이메일 정보 없음'}</p>
                                <hr/>
                                <div className="mypage-profile-extra">
                                    <p>닉네임 | {user ? user.nickname : '닉네임 정보 없음'}</p>
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
                        <StorySection/>
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
