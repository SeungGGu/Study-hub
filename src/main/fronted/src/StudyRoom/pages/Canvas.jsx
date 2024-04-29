import React, { useState } from 'react';
import { Button, Card, Form, InputGroup, Pagination } from "react-bootstrap";
import '../../styles/Canvas.css'; // 스타일 시트 파일 임포트

const Canvas = () => {
    const [hover, setHover] = useState(false); // 마우스 오버 상태를 위한 state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 한 페이지에 보여질 아이템 수
    const [currentGroup, setCurrentGroup] = useState(0); // 현재 페이지 그룹
    const pagesPerGroup = 10; // 한 그룹에 보여질 최대 페이지 수

    // 임시로 카드 데이터를 생성
    const cardsData = new Array(100).fill(null).map((_, index) => ({
        id: index + 1,
        title: `카드 ${index + 1}`,
        text: `내용 ${index + 1}`
    }));

    // 현재 페이지에서 보여질 아이템 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cardsData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 번호를 클릭할 때 실행될 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 전체 페이지 수 계산
    const pageCount = Math.ceil(cardsData.length / itemsPerPage);
    const totalGroups = Math.ceil(pageCount / pagesPerGroup);
    let active = currentPage;
    let items = [];
    const groupStart = currentGroup * pagesPerGroup;
    const groupEnd = Math.min(groupStart + pagesPerGroup, pageCount);

    for (let number = groupStart + 1; number <= groupEnd; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
                {number}
            </Pagination.Item>
        );
    }

    // 페이지 그룹 변경 함수
    const nextGroup = () => {
        const newGroup = currentGroup + 1;
        if(newGroup < totalGroups) {
            setCurrentGroup(newGroup);
            setCurrentPage(groupStart + pagesPerGroup + 1);
        }
    };

    const prevGroup = () => {
        const newGroup = currentGroup - 1;
        if(newGroup >= 0) {
            setCurrentGroup(newGroup);
            setCurrentPage(groupStart - pagesPerGroup + 1);
        }
    };

    return (
        <div className="Canvas">
            <InputGroup className="mb-3 mt-3">
                <Form.Control
                    placeholder="캔버스를 검색해보세요"
                    aria-label="search"
                    aria-describedby="search"
                />
                <Button variant="outline-secondary" id="searchButton">
                    검색
                </Button>
            </InputGroup>
            <div className="card-grid">
                {currentItems.map(card => (
                    <Card key={card.id} style={{ width: '18rem' }}
                          onMouseEnter={() => setHover(true)}
                          onMouseLeave={() => setHover(false)}
                          className="card-hover">
                        <div className="card-image-container">
                            <Card.Img variant="top" src="/studyHub.png"/>
                            {hover && (
                                <Button variant="danger" className="delete-button">삭제</Button>
                            )}
                        </div>
                        <Card.Body>
                            <Card.Title>{card.title}</Card.Title>
                            <Card.Text>{card.text}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className="pagination-container">
                <Pagination>
                    {currentGroup > 0 && <Pagination.Prev onClick={prevGroup} />}
                    {items}
                    {currentGroup < totalGroups - 1 && <Pagination.Next onClick={nextGroup} />}
                </Pagination>
            </div>
            <h1>캔버스</h1>
        </div>
    );
};

export default Canvas;
