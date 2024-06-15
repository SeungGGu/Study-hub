import { Button, Form, Modal, Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import {IoEyeSharp} from "react-icons/io5";

function Community() {
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();
    const userNickname = sessionStorage.getItem('nickname');  // 세션에서 닉네임 가져오기
    const [showEditModal, setShowEditModal] = useState(false);  // 수정 모달 표시 상태
    const [editBoard, setEditBoard] = useState({ boardTitle: '', boardDetail: '', boardCategory: '' });  // 수정할 게시물 데이터
    const [currentBoardId, setCurrentBoardId] = useState(null);  // 현재 수정 중인 게시물 ID

    const fetchBoards = () => {
        fetch('http://localhost:8080/api/boards')
            .then(response => response.json())
            .then(data => {
                // 데이터가 올바르게 받아지면 상태 업데이트
                setBoards(data);
            })
            .catch(error => console.error('게시물 목록을 가져오는 중 오류 발생:', error));
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    // 좋아요 토글 처리
    const handleLike = async (event, board) => {
        event.stopPropagation();
        try {
            const url = board.liked ? `http://localhost:8080/api/boards/${board.boardId}/unlike` : `http://localhost:8080/api/boards/${board.boardId}/like`;
            await axios.post(url);

            // 좋아요 상태 업데이트
            setBoards(prevData =>
                prevData.map(b =>
                    b.boardId === board.boardId
                        ? { ...b, liked: !board.liked, boardGreat: board.liked ? b.boardGreat - 1 : b.boardGreat + 1 }
                        : b
                )
            );
        } catch (error) {
            console.error("좋아요/좋아요 취소 중 오류 발생:", error);
        }
    };
    // 삭제 요청 처리
    const handleDelete = async (event, boardId) => {
        event.stopPropagation();
        try {
            await axios.delete(`http://localhost:8080/api/boards/${boardId}`);
            setBoards(prevData => prevData.filter(board => board.boardId !== boardId)); // 삭제된 게시물 제거
            console.log(`Board with ID ${boardId} deleted successfully.`);
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
        }
    };

    const handleEditClick = (event, board) => {
        event.stopPropagation();
        setCurrentBoardId(board.boardId);
        setEditBoard({ boardTitle: board.boardTitle, boardDetail: board.boardDetail, boardCategory: board.boardCategory });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditBoard(prevBoard => ({ ...prevBoard, [name]: value }));
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/api/boards/${currentBoardId}`, editBoard);
            fetchBoards();
            setShowEditModal(false);
        } catch (error) {
            console.error("게시물 업데이트 중 오류 발생:", error);
        }
    };

// 게시물 클릭 시 조회 수 증가
    const handleBoardClick = async (boardId) => {
        try {
            await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`); // 조회 수 증가 API 호출
            navigate(`/boards/${boardId}`);
        } catch (error) {
            console.error("게시물 조회 중 오류 발생:", error);
        }
    };
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <div>
            <div className="row mt-4">
                <div className="col">
                    <Nav variant="underline" defaultActiveKey="최신순">
                        <Nav.Item className="me-3">
                            <Nav.Link eventKey="최신순">• 최신순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3">
                            <Nav.Link eventKey="좋아요순">• 좋아요 순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3">
                            <Nav.Link eventKey="댓글 순">• 댓글 순</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="col-auto">
                    <Button variant="secondary" onClick={() => {
                        navigate('/MainBoards');
                    }}>
                        글쓰기
                    </Button>
                </div>
            </div>
            <hr />
            <div className="mt-3">
                {boards.map((board, index) => (
                    <div className="card mb-3" key={index} onClick={() => handleBoardClick(board.boardId)}>
                        <div className="card-body">
                            <h4 className="card-title">{board.boardTitle}</h4>
                            <p className="card-text">{stripHtml(board.boardDetail)}</p>
                            <Button
                                variant="outline-primary"
                                onClick={(event) => handleLike(event, board)}
                                className="like-button"
                            >
                                {board.liked ? <BiSolidLike /> : <BiLike />} {board.boardGreat}
                            </Button>
                            <Button
                                variant="outline-danger"
                                onClick={(event) => handleDelete(event, board.boardId)}
                                className="delete-button"
                                style={{ marginLeft: "5px" }}
                            >
                                <FaTrash />
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={(event) => handleEditClick(event, board)}
                                className="edit-button"
                                style={{ marginLeft: "10px" }}
                            >
                                <BiEdit />
                            </Button>

                            <hr />
                            <small className="text-muted">작성자: {board.boardNickname}</small>
                            <br />
                            <IoEyeSharp /> {board.boardView}
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>게시물 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                rows={3}
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>닫기</Button>
                    <Button variant="primary" onClick={handleEditSubmit}>변경 내용 저장</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Community;
