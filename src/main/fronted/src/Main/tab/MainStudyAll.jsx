import React, { useEffect, useState } from "react";
import { Nav, Button, Card, Col, Row, CardFooter } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import TabHeader from "../include/TabHeader";
import "../../styles/TabHeader.css";

function MainStudyAll({ type }) {
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(16);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudyData = async () => {
            try {
                const response = await fetch('/api/study/cardView', {
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
            } catch (error) {
                console.error("Error fetching study data:", error);
            }
        };

        fetchStudyData();
    }, []);

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSortOptionClick = (sortOption) => {
        console.log(`Sorting by ${sortOption}`, `type: ${type}`);
        // Implement sorting logic or API call here
    };

    const handleCreate = () => {
        navigate('/studyCreate');
    };

    return (
        <div>
            <TabHeader />
            <div className="row mt-4" style={{ margin: '30px' }}>
                <div className="col">
                    <Nav variant="underline" defaultActiveKey="추천순">
                        <Nav.Item className="me-3" onClick={() => handleSortOptionClick('추천순')}>
                            <Nav.Link eventKey="추천순">추천순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3" onClick={() => handleSortOptionClick('인기순')}>
                            <Nav.Link eventKey="인기순">인기순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3" onClick={() => handleSortOptionClick('최신순')}>
                            <Nav.Link eventKey="최신순">최신순</Nav.Link>
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
                            <Link to={`/studyRoom/${card.studyId}/${card.studyTitle}`} style={{ textDecoration: 'none' }}>
                                <Card>
                                    <Card.Img
                                        variant="top"
                                        src={`/images/${card.studyTitlePicture}`}
                                        style={{ width: '300px', height: '170px', objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{card.studyTitle}</Card.Title>
                                        <Card.Text>{card.studyComment}</Card.Text>
                                    </Card.Body>
                                    <CardFooter>
                                        <small className="text">{card.studyCreator.nickname} <br /> </small>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
            <hr />
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(cards.length / cardsPerPage) }).map((_, idx) => (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                            <Button className="page-link" onClick={() => paginate(idx + 1)}>
                                {idx + 1}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <hr />
        </div>
    );
}

export default MainStudyAll;
