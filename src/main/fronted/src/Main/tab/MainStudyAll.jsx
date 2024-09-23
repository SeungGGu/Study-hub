import React, { useEffect, useState } from "react";
import { Nav, Button, Card, Col, Row, CardFooter, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TabHeader from "../include/TabHeader";
import "../../styles/TabHeader.css";
import { Lock } from 'react-bootstrap-icons';

function MainStudyAll({ type }) {
    const nickname = sessionStorage.getItem("nickname");
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(16);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentStudyId, setCurrentStudyId] = useState(null);
    const [currentStudyTitle, setCurrentStudyTitle] = useState(""); // Study Title을 저장
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

    // Function to get top 4 liked studies
    const getTopLikedStudies = () => {
        return [...cards] // Create a copy to avoid mutating original data
            .sort((a, b) => b.likes - a.likes) // Sort by likes descending
            .slice(0, 4); // Get top 4
    };

    const handleLikeClick = async (studyId, isLiked) => {
        try {
            const response = await fetch(`/api/study/${studyId}/like?nickname=${nickname}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update likes");
            }

            const result = await response.json();
            const updatedLikes = result.likes;

            // 좋아요 수와 상태 업데이트
            setCards(prevCards =>
                prevCards.map(card =>
                    card.studyId === studyId
                        ? { ...card, likes: updatedLikes, isLiked: !isLiked }
                        : card
                )
            );
            setFilteredCards(prevFilteredCards =>
                prevFilteredCards.map(card =>
                    card.studyId === studyId
                        ? { ...card, likes: updatedLikes, isLiked: !isLiked }
                        : card
                )
            );
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    };

    const handleSearch = (searchTerm) => {
        const filtered = cards.filter(card =>
            card.studyTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCards(filtered);
        setCurrentPage(1);
    };

    const handlePasswordCheck = (studyId, studyTitle) => {
        const study = cards.find(card => card.studyId === studyId);
        if (study.pwStatus) {
            setCurrentStudyId(studyId);
            setCurrentStudyTitle(studyTitle); // Set the study title for password-protected studies
            setShowPasswordModal(true);
        } else {
            handleStudyClick(studyId, studyTitle);  // 비밀번호가 없을 경우 바로 이동
        }
    };

    const handlePasswordSubmit = () => {
        const study = cards.find(card => card.studyId === currentStudyId);
        if (enteredPassword === study.studyPw) {
            setShowPasswordModal(false);
            setWrongPassword(false);
            handleStudyClick(currentStudyId, currentStudyTitle); // 비밀번호가 맞으면 이동
        } else {
            setWrongPassword(true);
        }
    };

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSortOptionClick = (sortOption) => {
        console.log(`Sorting by ${sortOption}`, `type: ${type}`);
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
            navigate(`/studyRoom/${studyId}/${studyTitle}`);  // studyId와 studyTitle 함께 사용
        }
    };

    return (
        <div>
            <TabHeader
                onSearch={handleSearch}  // 검색 버튼을 없애고 입력할 때마다 검색 실행
                topLikedStudies={getTopLikedStudies()}
                onStudyClick={handleStudyClick}
                onPasswordCheck={handlePasswordCheck}
            />
            <div className="row mt-4" style={{ margin: '30px' }}>
                <div className="col">
                    <Nav variant="underline" defaultActiveKey="최신순">
                        <Nav.Item className="me-3" onClick={() => handleSortOptionClick('최신순')}>
                            <Nav.Link eventKey="최신순">최신순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3" onClick={() => handleSortOptionClick('추천순')}>
                            <Nav.Link eventKey="추천순">추천순</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="col-auto">
                    <Button variant="secondary" onClick={handleCreate}>만들기</Button>
                </div>
            </div>
            <hr />
            <div className="BestStudyCard">
                <Row xs={1} md={2} lg={4} className="g-4">
                    {currentCards.map(card => (
                        <Col key={card.studyId}>
                            <Card onClick={() => handlePasswordCheck(card.studyId, card.studyTitle)}
                                style={{ cursor: 'pointer' }}>
                                <div className="card-img-container">
                                    <Card.Img
                                        variant="top"
                                        src={`/images/${card.studyTitlePicture}`}
                                        className="responsive-img"
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title>{card.studyTitle}</Card.Title>
                                    <Card.Text>{card.studyComment}</Card.Text>
                                </Card.Body>
                                <CardFooter
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <small className="text-muted">{card.studyCreator}</small>
                                    <div>
                                        {card.pwStatus && <Lock size={16} className="me-2" />}
                                        <Button
                                            variant={card.isLiked ? "primary" : "outline-primary"}
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLikeClick(card.studyId, card.isLiked);
                                            }}
                                        >
                                            👍 {card.likes || 0}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            <hr />
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(filteredCards.length / cardsPerPage) }).map((_, idx) => (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                            <Button className="page-link" onClick={() => paginate(idx + 1)}>
                                {idx + 1}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <hr />

            {/* Modal for password entry */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 입력</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="passwordInput">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={enteredPassword}
                                onChange={(e) => setEnteredPassword(e.target.value)}
                            />
                            {wrongPassword && <small className="text-danger">비밀번호가 틀렸습니다.</small>}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handlePasswordSubmit}>
                        확인
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MainStudyAll;
