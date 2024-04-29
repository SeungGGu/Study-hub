import React from "react";
import {useState, useEffect} from "react";
import {InputGroup, Button, Form, Card, Col} from "react-bootstrap";
import "../../styles/TabHeader.css";

function TabHeader() {
    const [cardsData, setCardsData] = useState([]);

    // Simulated data fetching
    useEffect(() => {
        // Simulated fetch from database
        const fetchData = () => {
            // Example data
            const data = [
                {id: 1, title: "Java 모각코 모집 9기", text: "#Java #Spring #코딩", leader: "스터디장 이름", views: 0, comments: 0},
                {
                    id: 2,
                    title: "Java 모각코 모집 9기",
                    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
                    leader: "스터디장 이름",
                    views: 0,
                    comments: 0
                },
                {
                    id: 3,
                    title: "Java 모각코 모집 9기",
                    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
                    leader: "스터디장 이름",
                    views: 0,
                    comments: 0
                },
                {
                    id: 4,
                    title: "Java 모각코 모집 9기",
                    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
                    leader: "스터디장 이름",
                    views: 0,
                    comments: 0
                },
                // Add more data as needed
            ];

            // Simulate delay for fetching data
            setTimeout(() => {
                setCardsData(data.slice(0, 4));
            }, 500); // Adjust delay as needed
        };

        fetchData();
    }, []);

    return (
        <div>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="관심 스터디를 검색해 보세요!"
                    aria-label="search"
                    aria-describedby="search"
                />
                <Button variant="outline-secondary" id="searchButton">
                    검색
                </Button>
            </InputGroup>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="# 태그로 검색해보세요!"
                    aria-label="tagSearch"
                    aria-describedby="tagSearch"
                />
                <Button variant="outline-secondary" id="reset">
                    초기화
                </Button>
                <Button variant="outline-secondary" id="TagSearchButton">
                    검색
                </Button>
            </InputGroup>
            <hr/>
            <div className="BestStudyCard">
                <Col xs={12}>
                    <h4>
                        ⭐주간 인기 스터디
                    </h4>
                </Col>
                <div className="row">
                    {cardsData.map((card) => (
                        <div key={card.id} className="col-md-6 col-lg-3 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{card.title}</Card.Title>
                                    <Card.Text>{card.text}</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text">{card.leader} <br/> </small>
                                    <small className="text">조회수 {card.views} | 댓글 {card.comments}</small>
                                </Card.Footer>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <hr/>
        </div>
    );
}

export default TabHeader;
