import React, { useState } from "react";
import { InputGroup, Button, Form, Card, Col } from "react-bootstrap";
import { Lock } from 'react-bootstrap-icons'; // 잠금 아이콘 추가
import "../../styles/TabHeader.css";

function TabHeader({ onSearch, topLikedStudies, onStudyClick, onPasswordCheck }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        onSearch(searchTerm); // 검색어를 부모 컴포넌트로 전달
    };

    const handleReset = () => {
        setSearchTerm(""); // 검색어 상태를 초기화
        onSearch(""); // 빈 검색어를 부모 컴포넌트로 전달하여 초기 상태로 복원
    };

    return (
        <div>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="관심 스터디를 검색해 보세요!"
                    aria-label="search"
                    aria-describedby="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" id="reset" onClick={handleReset}>
                    초기화
                </Button>
                <Button variant="outline-secondary" id="searchButton" onClick={handleSearch}>
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
                    {topLikedStudies.map((card) => (
                        <div key={card.studyId} className="col-md-6 col-lg-3 mb-4">
                            <Card
                                onClick={() => {
                                    if (card.pwStatus) {
                                        // 잠금 상태면 비밀번호 확인으로 이동
                                        onPasswordCheck(card.studyId, card.studyTitle);
                                    } else {
                                        // 잠금이 아닌 경우 바로 스터디로 이동
                                        onStudyClick(card.studyId, card.studyTitle);
                                    }
                                }}
                                style={{cursor: 'pointer'}}
                            >
                                <div className="card-img-container">
                                    <Card.Img
                                        variant="top"
                                        src={`/images/${card.studyTitlePicture}`}
                                        alt={card.studyTitle}
                                        className="responsive-img"
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title>{card.studyTitle}</Card.Title>
                                    <Card.Text>{card.studyComment}</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">{card.studyCreator}</small>
                                    <div>
                                        {card.pwStatus && <Lock size={16} className="me-2"/>}
                                        <small>👍 {card.likes}</small>
                                    </div>
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
