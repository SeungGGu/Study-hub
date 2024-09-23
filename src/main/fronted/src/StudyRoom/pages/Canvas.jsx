import React, {useEffect, useState, useRef} from 'react';
import {Button, Card, Form, InputGroup, Pagination} from "react-bootstrap";
import {fabric} from 'fabric';
import axios from 'axios';
import '../../styles/Canvas.css';
import DrawCanvas from './DrawCanvas'; // DrawCanvas 컴포넌트를 임포트

const Canvas = ({id, setCurrentPage}) => {
    const [canvasPage, setCanvasPage] = useState(1);
    const itemsPerPage = 6;
    const [currentGroup, setCurrentGroup] = useState(0);
    const pagesPerGroup = 10;
    const [canvasData, setCanvasData] = useState([]);
    const studyId = sessionStorage.getItem('studyId');
    const hiddenCanvasRef = useRef(null);
    const [canvasId, setCanvasId] = useState(null);
    const [editingCanvas, setEditingCanvas] = useState(null); // 현재 수정 중인 캔버스 데이터
    const [hoveredIndex, setHoveredIndex] = useState(null); // hover 상태를 개별 카드에 적용하기 위한 상태
    const currentUserNickname = sessionStorage.getItem('nickname'); // 현재 사용자 닉네임 가져오기

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

    const indexOfLastItem = canvasPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = canvasData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCanvasPage(pageNumber);

    const pageCount = Math.ceil(canvasData.length / itemsPerPage);
    const totalGroups = Math.ceil(pageCount / pagesPerGroup);
    let active = canvasPage;
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

    const nextGroup = () => {
        const newGroup = currentGroup + 1;
        if (newGroup < totalGroups) {
            setCurrentGroup(newGroup);
            setCanvasPage(groupStart + pagesPerGroup + 1);
        }
    };

    const prevGroup = () => {
        const newGroup = currentGroup - 1;
        if (newGroup >= 0) {
            setCurrentGroup(newGroup);
            setCanvasPage(groupStart - pagesPerGroup + 1);
        }
    };

    const deleteCanvas = async (canvasId) => {
        try {
            await axios.delete(`/api/canvas/delete/${canvasId}`);
            setCanvasData(canvasData.filter(canvas => canvas.id !== canvasId));
        } catch (error) {
            console.error("Failed to delete canvas", error);
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
            const objects = fabricCanvas.getObjects();
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            objects.forEach(obj => {
                const boundingRect = obj.getBoundingRect();
                minX = Math.min(minX, boundingRect.left);
                minY = Math.min(minY, boundingRect.top);
                maxX = Math.max(maxX, boundingRect.left + boundingRect.width);
                maxY = Math.max(maxY, boundingRect.top + boundingRect.height);
            });

            const objectsWidth = maxX - minX;
            const objectsHeight = maxY - minY;
            const canvasCenter = {x: fabricCanvas.getWidth() / 2, y: fabricCanvas.getHeight() / 2};

            const scaleFactor = Math.min(fabricCanvas.getWidth() / objectsWidth, fabricCanvas.getHeight() / objectsHeight);

            objects.forEach(obj => {
                obj.set({
                    left: (obj.left - minX) * scaleFactor + (canvasCenter.x - (objectsWidth * scaleFactor) / 2),
                    top: (obj.top - minY) * scaleFactor + (canvasCenter.y - (objectsHeight * scaleFactor) / 2),
                    scaleX: obj.scaleX * scaleFactor,
                    scaleY: obj.scaleY * scaleFactor,
                });
                obj.setCoords();
            });

            fabricCanvas.renderAll();
        });

        const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1.0,
        });

        fabricCanvas.dispose();
        return dataURL;
    };

    const handleCardClick = (canvas) => {
        setCanvasId(canvas.id);
        setEditingCanvas(canvas.canvasData);
    };

    if (editingCanvas) {
        return <DrawCanvas id={studyId} canvasId={canvasId} canvasData={editingCanvas}
                           setCurrentPage={setCurrentPage}/>;
    }

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
                    const canDelete = card.nickname === currentUserNickname; // 삭제 권한 확인
                    return (
                        <Card key={index} style={{width: '18rem'}}
                              onMouseEnter={() => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(null)}
                              className="card-hover"
                              onClick={() => handleCardClick(card)} // 클릭 시 수정 모드로 전환
                        >
                            <div className="card-image-container">
                                <Card.Img variant="top" src={imageSrc}/>
                                {hoveredIndex === index && canDelete && ( // 같은 사용자만 삭제 버튼을 볼 수 있음
                                    <Button variant="danger" className="delete-button" onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCanvas(card.id);
                                    }}>삭제</Button>
                                )}
                            </div>
                            <Card.Body>
                                <Card.Title>{card.drawTitle}</Card.Title>
                                <Card.Text>{card.nickname}</Card.Text>
                                <Card.Text>{new Date(card.timestamp).toLocaleString()}</Card.Text>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
            <div className="pagination-container">
                <Pagination>
                    {currentGroup > 0 && <Pagination.Prev onClick={prevGroup}/>}
                    {items}
                    {currentGroup < totalGroups - 1 && <Pagination.Next onClick={nextGroup}/>}
                </Pagination>
            </div>
            <canvas ref={hiddenCanvasRef} style={{display: 'none'}}/>
        </div>
    );
};

export default Canvas;
