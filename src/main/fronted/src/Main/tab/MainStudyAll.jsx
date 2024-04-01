import TabHeader from "../include/TabHeader";
import {Nav, Button, Card, Col, Row, CardFooter} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import "../include/TabHeader.css"


function MainStudyAll({type}) {
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(16);

    // Simulated data fetching
    useEffect(() => {
        // Fetch data from database or API
        // For demonstration, generating dummy data
        const data = Array.from({length: 30}).map((_, idx) => ({
            id: idx + 1,
            title: `Card ${idx + 1}`,
            description: `Description for Card ${idx + 1}`,
            leader: '정은',
            views: '0',
            comments: '0',
            // You can include additional properties such as image URL, leader, etc.
        }));
        setCards(data);
    }, []);

    // Pagination
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to handle sorting option click
    const handleSortOptionClick = (sortOption) => {
        console.log(`Sorting by ${sortOption}`,`type : ${type}`);
        // Call API endpoint to send sortOption to backend
        // Example: fetch('/api/sort', { method: 'POST', body: JSON.stringify({ sortOption }) });
    };

    return (
        <div>
            <TabHeader/>
            <div className="row mt-4" style={{margin: '30px'}}>
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
                    <Button variant="secondary">만들기</Button>
                </div>
            </div>
            <hr/>
            <div className="BestStudyCard">
                <Row xs={1} md={2} lg={4} className="g-4">
                    {currentCards.map(card => (
                        <Col key={card.id}>
                            <Card>
                                <Card.Img variant="top" src="holder.js/100px160"/>
                                <Card.Body>
                                    <Card.Title>{card.title}</Card.Title>
                                    <Card.Text>{card.description}</Card.Text>
                                </Card.Body>
                                <CardFooter>
                                    <small className="text">{card.leader} <br/> </small>
                                    <small className="text">조회수 {card.views} | 댓글 {card.comments}</small>
                                </CardFooter>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
            {/* Pagination */}
            <hr/>
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({length: Math.ceil(cards.length / cardsPerPage)}).map((_, idx) => (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                            <Button className="page-link" onClick={() => paginate(idx + 1)}>{idx + 1}</Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <hr/>
        </div>
    )
}

export default MainStudyAll;
