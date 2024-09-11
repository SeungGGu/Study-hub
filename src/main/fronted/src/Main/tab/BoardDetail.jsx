import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, ListGroup, Badge, Form, Button, Dropdown } from 'react-bootstrap';
import { MainHeader } from "../include/MainHeader";
import CommentComponent from "./CommentComponent";
import { IoEyeSharp } from "react-icons/io5";
import { VscKebabVertical } from "react-icons/vsc";  // 케밥 아이콘 추가
import { BiEdit } from "react-icons/bi";
import axios from 'axios';

const BoardDetail = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [similarBoards, setSimilarBoards] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editBoard, setEditBoard] = useState({ boardTitle: '', boardDetail: '', boardCategory: '' });
    useEffect(() => {
        fetchBoardDetails();
    }, [boardId]);

    // 현재 로그인된 사용자 정보 가져오기 (예시: localStorage에서 닉네임 가져옴)
    const loggedInUserNickname = localStorage.getItem('nickname');

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
                fetchBoardDetails();  // Refresh the board details
                setIsEditing(false);  // Exit editing mode
            })
            .catch(error => console.error("Error updating board:", error));
    };

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div className="BoardDetail" style={{ paddingTop: "56px", marginLeft: "20px" }}>
            <MainHeader />
            <Container>
                <Row>
                    <Col md={8}>
                        <div style={{ maxHeight: "570px", overflowY: "auto", marginBottom: "20px" }}>
                            {!isEditing ? (
                                <>
                                    <h3 style={{ fontWeight: "bold", display: "flex" }}>
                                        {board.boardTitle}
                                        <Dropdown align="end" onClick={(e) => e.stopPropagation()} style={{ marginLeft: "auto"}}>
                                            <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ padding: '0', display: 'flex', justifyContent: 'flex-end', color:'black'}}>
                                                <VscKebabVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={handleEditClick}><BiEdit />수정</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </h3>
                                    <small className="text-muted" style={{ display: "flex" }}>작성자: {board.boardNickname}</small>
                                    <Card.Text style={{ display: "flex" }}>{board.boardDetail}</Card.Text>
                                    <div style={{ display: "flex" }}>
                                        <Badge
                                            pill
                                            bg="secondary"
                                            style={{ cursor: 'pointer', backgroundColor: "lightgray" }}
                                        >
                                            <Badge pill bg="black">#</Badge>{board.boardCategory}
                                        </Badge>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>제목</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="boardTitle"
                                                value={editBoard.boardTitle}
                                                onChange={handleEditChange}
                                                style={{ marginBottom: "10px" }}
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
                                                style={{ marginBottom: "10px" }}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>카테고리</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="boardCategory"
                                                value={editBoard.boardCategory}
                                                onChange={handleEditChange}
                                                style={{ marginBottom: "10px" }}
                                            />
                                        </Form.Group>
                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Button variant="secondary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>취소</Button>
                                            <Button variant="primary" onClick={handleEditSubmit}>저장</Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </div>
                        <CommentComponent boardId={board.boardId} />
                    </Col>
                    <Col md={4}>
                        <div style={{ maxHeight: "570px" }}>
                            <h6 style={{ color: 'black', fontWeight: 'bold' }}>이 글과 비슷한 POST</h6>
                            <ListGroup variant="flush">
                                {similarBoards.length > 0 ? (
                                    similarBoards.map((similarBoard, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '10px 15px',
                                                border: '1px solid #ddd',
                                                marginBottom: '5px',
                                                borderRadius: '5px',
                                                marginLeft: '50px',
                                                width: '350px'
                                            }}
                                            onClick={() => window.location.href = `/boards/${similarBoard.boardId}`}
                                        >
                                            <div style={{ fontWeight: 'bold', color: 'black', display: 'flex' }}>
                                                {similarBoard.boardTitle}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <Badge
                                                    key={index}
                                                    pill
                                                    bg="secondary"
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    #{similarBoard.boardCategory}
                                                </Badge>
                                                <strong>
                                                    <IoEyeSharp />{similarBoard.boardView}
                                                </strong>
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