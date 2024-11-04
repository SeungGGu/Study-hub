import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TabHeader from "../include/TabHeader";
import { Lock, Add } from 'iconsax-react';
import "../../styles/MainStudyAll.css";

function MainStudyAll({ type }) {
    const nickname = sessionStorage.getItem("nickname");
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentStudyId, setCurrentStudyId] = useState(null);
    const [currentStudyTitle, setCurrentStudyTitle] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);
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
                setFilteredCards(data);
            } catch (error) {
                console.error("Error fetching study data:", error);
            }
        };

        fetchStudyData();
    }, [nickname]);

    const getTopLikedStudies = () => {
        return [...cards].sort((a, b) => b.likes - a.likes).slice(0, 4);
    };

    const handleSearch = (searchTerm) => {
        const filtered = cards.filter(card => card.studyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredCards(filtered);
    };

    const handlePasswordCheck = (studyId, studyTitle) => {
        const study = cards.find(card => card.studyId === studyId);
        if (study.pwStatus) {
            setCurrentStudyId(studyId);
            setCurrentStudyTitle(studyTitle);
            setShowPasswordModal(true);
        } else {
            handleStudyClick(studyId, studyTitle);
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
                onPasswordCheck={handlePasswordCheck}
            />
            <div className="action-bar">
                <button className="create-button" onClick={handleCreate}>
                    새로운 스터디 만들기 <Add size="24" color="white" />
                </button>
            </div>
            <div className="study-cards-container">
                {filteredCards.map(card => (
                    <div key={card.studyId} className="study-card" onClick={() => handlePasswordCheck(card.studyId, card.studyTitle)}>
                        <img src={`/images/${card.studyTitlePicture}`} alt={card.studyTitle} />
                        <div className="study-card-content">
                            <h5>{card.studyTitle}</h5>
                            <p>{card.studyComment}</p>
                            <small>{card.studyCreator}</small>
                            <div className="likes-container">
                                {card.pwStatus && <Lock size={16} />}
                                <span>👍 {card.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
