import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, ListGroup, Badge, Form, Button, Dropdown } from 'react-bootstrap';
import { MainHeader } from "../include/MainHeader";
import CommentComponent from "./CommentComponent";
import { IoEyeSharp } from "react-icons/io5";
import { VscKebabVertical } from "react-icons/vsc";
import { BiEdit } from "react-icons/bi";
import axios from 'axios';
import './BoardDatail.css'

const BoardDetail = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [similarBoards, setSimilarBoards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const userNickname = sessionStorage.getItem('nickname');
    const [editBoard, setEditBoard] = useState({ boardTitle: '', boardDetail: '', boardCategory: '' });

    useEffect(() => {
        fetchBoardDetails();
    }, [boardId]);

    const fetchBoardDetails = () => {
        axios.get(`http://localhost:8080/api/boards/${boardId}`)
            .then(response => {
                setBoard(response.data);
                setEditBoard({
                    boardTitle: response.data.boardTitle,
                    boardDetail: response.data.boardDetail,
                    boardCategory: response.data.boardCategory
                });
                fetchSimilarBoards(response.data.boardDetail);
            })
            .catch(error => console.error('Error fetching board detail:', error));
    };

    const fetchSimilarBoards = (boardDetail) => {
        axios.get('http://localhost:8080/api/boards')
            .then(response => {
                const allBoards = response.data;
                const boardWords = new Set(boardDetail.split(/\s+/));
                const similar = allBoards.filter(b => {
                    const otherBoardWords = new Set(b.boardDetail.split(/\s+/));
                    const commonWords = [...boardWords].filter(word => otherBoardWords.has(word));
                    return commonWords.length > 0 && b.boardId !== parseInt(boardId);
                });
                setSimilarBoards(similar);
            })
            .catch(error => console.error('Error fetching similar boards:', error));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditBoard(prevBoard => ({ ...prevBoard, [name]: value }));
    };

    const handleEditSubmit = () => {
        axios.put(`http://localhost:8080/api/boards/${boardId}`, editBoard)
            .then(() => {
                fetchBoardDetails();
                setIsEditing(false);
            })
            .catch(error => console.error("Error updating board:", error));
    };

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div className="BoardDetail">
            <MainHeader />
            <Container>
                <Row>
                    <Col md={8}>
                        <div className="board-content">
                            {!isEditing ? (
                                <>
                                    <h3 className="board-title">
                                        {board.boardTitle}
                                        {board.boardNickname === userNickname && (
                                            <Dropdown align="end" onClick={(e) => e.stopPropagation()} className="dropdown-icon">
                                                <Dropdown.Toggle variant="link" id="dropdown-basic">
                                                    <VscKebabVertical />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={handleEditClick}><BiEdit />수정</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )}
                                    </h3>
                                    <div className="boardDetail">
                                        <div style={{
                                            marginLeft: "0px",
                                            color: "gray",
                                            textAlign: "left",
                                            marginBottom:"10px"

                                        }}>작성자: {board.boardNickname}</div>
                                        <Card.Text>{board.boardDetail}</Card.Text>
                                    </div>

                                    <div className="board-category">

                                        <Badge pill className="category-badge">
                                            <Badge pill className="hash-badge">#</Badge>{board.boardCategory}
                                        </Badge>

                                    </div>
                                </>
                            ) : (
                                <div className="edit-form">
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>제목</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="boardTitle"
                                                value={editBoard.boardTitle}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>내용</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                name="boardDetail"
                                                value={editBoard.boardDetail}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>카테고리</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="boardCategory"
                                                value={editBoard.boardCategory}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <div className="edit-buttons">
                                            <Button variant="outline-secondary" onClick={() => setIsEditing(false)}>취소</Button>
                                            <Button variant="outline-success" onClick={handleEditSubmit}>저장</Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </div>
                        <CommentComponent boardId={board.boardId} />
                    </Col>
                    <Col md={4}>
                        <div className="similar-posts">
                            <h6>이 글과 비슷한 POST</h6>
                            <ListGroup variant="flush">
                                {similarBoards.length > 0 ? (
                                    similarBoards.map((similarBoard, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            className="similar-board-item"
                                            onClick={() => window.location.href = `/boards/${similarBoard.boardId}`}
                                        >
                                            <div className="similar-board-title">{similarBoard.boardTitle}</div>
                                            <div className="similar-board-meta">
                                                <Badge pill>{similarBoard.boardCategory}</Badge>
                                                <strong><IoEyeSharp />{similarBoard.boardView}</strong>
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <div>비슷한 글이 없습니다.</div>
                                )}
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BoardDetail;