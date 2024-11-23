import React, { useState, useEffect, useContext } from 'react';
import './myPage.css';
import { MainHeader } from "../include/MainHeader";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import StorySection from "./components/StroySection";
import RecordSection from "./components/RecordSection";
import StudyManagement from "./components/StudyManagement";
import axios from 'axios';
import { Modal } from "react-bootstrap";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const [joinedStudies, setJoinedStudies] = useState([]); // 가입한 스터디 목록
    const [showPasswordModal, setShowPasswordModal] = useState(false); // 비밀번호 모달
    const [enteredPassword, setEnteredPassword] = useState(""); // 입력된 비밀번호
    const [wrongPassword, setWrongPassword] = useState(false); // 비밀번호 오류 상태
    const [currentStudyId, setCurrentStudyId] = useState(null); // 현재 선택된 스터디 ID
    const [currentStudyTitle, setCurrentStudyTitle] = useState(""); // 현재 선택된 스터디 제목
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // 로그인된 사용자 정보

    // 가입한 스터디 목록 가져오기
    useEffect(() => {
        if (user && user.id) {
            axios.get(`/api/studyMember/byUser/${user.id}`)
                .then((response) => setJoinedStudies(response.data))
                .catch((error) => {
                    console.error('스터디 조회 오류:', error);
                    setJoinedStudies([]);
                });
        }
    }, [user]);

    // 스터디 입장 처리
    const handleStudyEnter = async (studyId, studyTitle) => {
        try {
            // 스터디 생성자인지 확인
            const response = await axios.get(`http://localhost:8080/api/study/${studyId}/isCreator`, {
                params: { userNickname: user.nickname }, // 닉네임 전달
            });

            if (response.data) {
                // 생성자인 경우 바로 입장
                navigate(`/studyRoom/${studyId}/${studyTitle}`);
            } else {
                // 생성자가 아닌 경우 비밀번호 입력 모달 표시
                setCurrentStudyId(studyId);
                setCurrentStudyTitle(studyTitle);
                setShowPasswordModal(true);
            }
        } catch (error) {
            console.error("스터디 입장 오류:", error);
            alert("스터디 입장 중 문제가 발생했습니다.");
        }
    };



    // 비밀번호 확인 처리
    const handlePasswordSubmit = async () => {
        try {
            const response = await axios.post(`/api/study/checkPassword`, {
                studyId: currentStudyId,
                password: enteredPassword,
            });

            if (response.data.success) {
                // 비밀번호가 올바른 경우 스터디룸으로 이동
                navigate(`/studyRoom/${currentStudyId}/${currentStudyTitle}`);
                setShowPasswordModal(false); // 모달 닫기
                setWrongPassword(false); // 오류 상태 초기화
            } else {
                setWrongPassword(true); // 비밀번호 오류 표시
            }
        } catch (error) {
            console.error("비밀번호 확인 오류:", error);
        }
    };

    const handleEditProfile = () => {
        navigate('/editProfile');
    };


    const handleLeaveStudy = async (studyId) => {
        const confirmLeave = window.confirm("정말 스터디에서 나가시겠습니까?");
        if (!confirmLeave) return;

        try {
            const response = await axios.delete(`http://localhost:8080/api/study/${studyId}/leave`, {
                params: { userId: user.id },
            });

            if (response.status === 200) {
                // 나가기 성공 후 UI 업데이트
                setJoinedStudies((prevStudies) =>
                    prevStudies.filter((study) => study.studyId !== studyId)
                );
                alert("스터디에서 나갔습니다.");
            }
        } catch (error) {
            console.error("스터디 나가기 중 오류 발생:", error);
            alert("스터디 나가기 중 문제가 발생했습니다.");
        }
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
                                        <th>입장하기</th>
                                        <th>나가기</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {joinedStudies.map((study) => (
                                        <tr key={study.studyId}>
                                            <td>{study.studyTitle}</td>
                                            <td>{study.studyComment}</td>
                                            <td>
                                                <button
                                                    className="mypage-enter-btn"
                                                    onClick={() => handleStudyEnter(study.studyId, study.studyTitle)}
                                                >
                                                    입장하기
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="mypage-leave-btn"
                                                    onClick={() => handleLeaveStudy(study.studyId)}
                                                >
                                                    나가기
                                                </button>
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
            <MainHeader />
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
                                <hr />
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

            {/* 비밀번호 모달 */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 입력</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                        />
                        {wrongPassword && <small className="error-text">비밀번호가 틀렸습니다.</small>}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShowPasswordModal(false)}>닫기</button>
                    <button onClick={handlePasswordSubmit}>확인</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyPage;
