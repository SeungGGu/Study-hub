import React, {useContext, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import TabHeader from "../include/TabHeader";
import {Lock, Add, ArrowLeft3, ArrowRight3} from 'iconsax-react';
import "../../styles/MainStudyAll.css";
import {UserContext} from "../../context/UserContext";

function MainStudyAll({type}) {
    const {user} = useContext(UserContext);
    const nickname = user?.nickname || '';
    const userId = user?.id || '';

    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showApplicationSuccess, setShowApplicationSuccess] = useState(false);
    const [currentStudyId, setCurrentStudyId] = useState(null);
    const [currentStudyTitle, setCurrentStudyTitle] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(10);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchStudyData = async () => {
            try {
                const response = await fetch(`/api/study/cardView?nickname=${nickname}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch study data");
                }

                const data = await response.json();
                setCards(data);
                setFilteredCards(data.slice(0, cardsPerPage));
            } catch (error) {
                console.error("Error fetching study data:", error);
            }
        };
        if (nickname) { // nickname이 있을 때만 데이터 fetch
            fetchStudyData();
        }
    }, [nickname, cardsPerPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIdx = (pageNumber - 1) * cardsPerPage;
        const endIdx = startIdx + cardsPerPage;
        setFilteredCards(cards.slice(startIdx, endIdx));
    };

    const totalPages = Math.ceil(cards.length / cardsPerPage);

    // handleLike 함수 정의
    const handleLike = async (studyId) => {
        if (!nickname) {
            alert('로그인이 필요합니다. 로그인해주세요.');
            navigate('/login');
            return;
        }
        try {
            const response = await fetch(`/api/study/${studyId}/like?nickname=${nickname}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const updatedCards = cards.map(card =>
                    card.studyId === studyId ? {...card, likes: data.likes} : card
                );
                setCards(updatedCards);
                handlePageChange(currentPage); // 현재 페이지의 카드를 업데이트
            } else {
                console.error("Failed to update like");
            }
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    // getTopLikedStudies 함수 정의
    const getTopLikedStudies = () => {
        return [...cards].sort((a, b) => b.likes - a.likes).slice(0, 4);
    };

    // handleSearch 함수 정의
    const handleSearch = (searchTerm) => {
        const filtered = cards.filter(card => card.studyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredCards(filtered.slice(0, cardsPerPage));
        setCurrentPage(1); // 검색 후 첫 페이지로 이동
    };

    const handleCheckMembership = async (studyId, studyTitle) => {
        try {
            // 스터디 생성자인지 확인
            const isCreatorResponse = await fetch(`/api/study/${studyId}/isCreator?userNickname=${nickname}`);
            const isCreator = await isCreatorResponse.json();

            if (isCreator) {
                // 스터디 생성자인 경우 바로 입장
                navigate(`/studyRoom/${studyId}/${studyTitle}`);
            } else {
                // 스터디 생성자가 아닌 경우 가입 상태 확인
                const response = await fetch(`/api/study/checkMembership?studyId=${studyId}&userId=${userId}`);
                const { status } = await response.json();

                switch (status) {
                    case null: // 가입하지 않은 경우
                        setCurrentStudyId(studyId);
                        setCurrentStudyTitle(studyTitle);
                        setShowApplyModal(true); // 가입 신청 모달 표시
                        break;

                    case "대기중": // 승인 대기 중
                        setShowPendingModal(true); // 승인 대기 중 모달 표시
                        break;

                    case "승인완료": // 승인된 경우
                        setCurrentStudyId(studyId);
                        setCurrentStudyTitle(studyTitle);
                        setShowPasswordModal(true); // 비밀번호 입력 모달 표시
                        break;

                    default:
                        console.error("알 수 없는 상태:", status);
                }
            }
        } catch (error) {
            console.error("가입 상태 확인 중 오류 발생:", error);
        }
    };




    const handleApplyMembership = async () => {
        try {
            const response = await fetch(`/api/study/saveApplication`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studyId: currentStudyId, userId: userId }),
            });

            if (response.ok) {
                setShowApplicationSuccess(true);
                setShowApplyModal(false);
            } else {
                alert("가입 신청에 실패했습니다.");
            }
        } catch (error) {
            console.error("가입 신청 오류:", error);
        }
    };



    const handlePasswordSubmit = () => {
        const study = cards.find(card => card.studyId === currentStudyId);
        if (enteredPassword === study.studyPw) {
            setShowPasswordModal(false);
            setWrongPassword(false);
            handleStudyClick(currentStudyId, currentStudyTitle);
        } else {
            setWrongPassword(true);
        }
    };

    const handleCreate = () => {
        if (!nickname) {
            alert('로그인이 필요합니다. 로그인해주세요.');
            navigate('/login');
        } else {
            navigate('/studyCreate');
        }
    };

    const handleStudyClick = (studyId, studyTitle) => {
        if (!nickname) {
            alert('로그인이 필요합니다. 로그인해주세요.');
            navigate('/login');
        } else {
            navigate(`/studyRoom/${studyId}/${studyTitle}`);
        }
    };

    return (
        <div className="main-study-all">
            <TabHeader
                onSearch={handleSearch}
                topLikedStudies={getTopLikedStudies()}
                onStudyClick={handleStudyClick}
                onPasswordCheck={handleCheckMembership}
            />
            <div className="action-bar">
                <button className="create-button" onClick={handleCreate}>
                    새로운 스터디 만들기 <Add size="24" color="white"/>
                </button>
            </div>
            <div className="study-cards-container">
                {filteredCards.slice(0, 5).map(card => (
                    <div key={card.studyId} className="study-card"
                         onClick={() => handleCheckMembership(card.studyId, card.studyTitle)}>
                        <img src={`/images/${card.studyTitlePicture}`} alt={card.studyTitle}/>
                        <div className="study-card-content">
                            <h5>{card.studyTitle}</h5>
                            <p>{card.studyComment}</p>
                            <small>{card.studyCreator}</small>
                            <div className="likes-container" onClick={(e) => {
                                e.stopPropagation();
                                handleLike(card.studyId);
                            }}>
                                {card.pwStatus && <Lock size={16}/>}
                                <span>👍 {card.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="study-cards-container">
                {filteredCards.slice(5, 10).map(card => (
                    <div
                        key={card.studyId}
                        className="study-card"
                        onClick={() => handleCheckMembership(card.studyId, card.studyTitle)}
                    >
                        <img src={`/images/${card.studyTitlePicture}`} alt={card.studyTitle}/>
                        <div className="study-card-content">
                            <h5>{card.studyTitle}</h5>
                            <p>{card.studyComment}</p>
                            <small>{card.studyCreator}</small>
                            <div
                                className="likes-container"
                                onClick={(e) => {
                                    e.stopPropagation(); // 좋아요 클릭 시 부모 이벤트 중단
                                    handleLike(card.studyId);
                                }}
                            >
                                {card.pwStatus && <Lock size={16}/>}
                                <span>👍 {card.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <div
                    className={`page-arrow ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                >
                    <ArrowLeft3 size="32" color={currentPage === 1 ? "#4C3D29" : "#A1ACBD"} variant="Outline"/>
                </div>

                {Array.from({length: totalPages}, (_, index) => (
                    <button
                        key={index + 1}
                        className={`Study-page-button ${index + 1 === currentPage ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}


                <div
                    className={`page-arrow ${currentPage === totalPages ? "disabled" : ""}`}
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                >
                    <ArrowRight3 size="32" color={currentPage === totalPages ? "#4C3D29" : "#A1ACBD"}
                                 variant="Outline"/>
                </div>
            </div>

            {/* 가입 신청 모달 */}
            <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>스터디 가입 신청</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{currentStudyTitle} 스터디에 가입 신청을 하시겠습니까?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShowApplyModal(false)}>취소</button>
                    <button onClick={handleApplyMembership}>가입 신청</button>
                </Modal.Footer>
            </Modal>

            {/* 승인 대기 상태 모달 */}
            <Modal show={showPendingModal} onHide={() => setShowPendingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>승인 대기 중</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>스터디 가입 신청이 승인 대기 중입니다. 스터디장의 승인을 기다려 주세요.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShowPendingModal(false)}>확인</button>
                </Modal.Footer>
            </Modal>


            {/* 가입 신청 성공 팝업 */}
            <Modal show={showApplicationSuccess} onHide={() => setShowApplicationSuccess(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>알림</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>가입 신청이 완료되었습니다. 스터디장의 승인을 기다려주세요.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShowApplicationSuccess(false)}>확인</button>
                </Modal.Footer>
            </Modal>

            {/* 비밀번호 입력 모달 */}
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
}

export default MainStudyAll;