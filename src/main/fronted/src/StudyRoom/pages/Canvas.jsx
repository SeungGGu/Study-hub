import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Form, InputGroup, Pagination } from "react-bootstrap";
import { fabric } from 'fabric';
import axios from 'axios';
import '../../styles/Canvas.css'; // 스타일 시트 파일 임포트

const Canvas = ({ id }) => {
    const [hover, setHover] = useState(false); // 마우스 오버 상태를 위한 state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 한 페이지에 보여질 아이템 수
    const [currentGroup, setCurrentGroup] = useState(0); // 현재 페이지 그룹
    const pagesPerGroup = 10; // 한 그룹에 보여질 최대 페이지 수
    const [canvasData, setCanvasData] = useState([]);
    const [studyId, setStudyId] = useState(id);
    const hiddenCanvasRef = useRef(null); // Ref for the hidden canvas

    useEffect(() => {
        const fetchCanvasData = async () => {
            try {
                const response = await axios.get(`/api/canvas/view?studyId=${studyId}`);
                setCanvasData(response.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        if (studyId) {
            fetchCanvasData();
        }
    }, [studyId]);

    // 현재 페이지에서 보여질 아이템 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = canvasData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 번호를 클릭할 때 실행될 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 전체 페이지 수 계산
    const pageCount = Math.ceil(canvasData.length / itemsPerPage);
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
        if (newGroup < totalGroups) {
            setCurrentGroup(newGroup);
            setCurrentPage(groupStart + pagesPerGroup + 1);
        }
    };

    const prevGroup = () => {
        const newGroup = currentGroup - 1;
        if (newGroup >= 0) {
            setCurrentGroup(newGroup);
            setCurrentPage(groupStart - pagesPerGroup + 1);
        }
    };

    const generateImage = (canvasJson) => {
        const hiddenCanvas = hiddenCanvasRef.current;
        if (!hiddenCanvas) return '';

        const fabricCanvas = new fabric.Canvas(hiddenCanvas, {
            width: 300,
            height: 300,
        });

        fabricCanvas.loadFromJSON(canvasJson, () => {
            fabricCanvas.renderAll();
        });

        const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1.0,
        });

        fabricCanvas.dispose();
        return dataURL;
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
                {currentItems.map((card, index) => {
                    const imageSrc = generateImage(card.canvasData);
                    return (
                        <Card key={index} style={{ width: '18rem' }}
                              onMouseEnter={() => setHover(true)}
                              onMouseLeave={() => setHover(false)}
                              className="card-hover">
                            <div className="card-image-container">
                                <Card.Img variant="top" src={imageSrc}/>
                                {hover && (
                                    <Button variant="danger" className="delete-button">삭제</Button>
                                )}
                            </div>
                            <Card.Body>
                                <Card.Title>{card.drawTitle}</Card.Title>
                                <Card.Text>{card.nickname}</Card.Text>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
            <div className="pagination-container">
                <Pagination>
                    {currentGroup > 0 && <Pagination.Prev onClick={prevGroup} />}
                    {items}
                    {currentGroup < totalGroups - 1 && <Pagination.Next onClick={nextGroup} />}
                </Pagination>
            </div>
            <h1>캔버스</h1>
            <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default Canvas;
