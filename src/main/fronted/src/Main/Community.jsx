import {Button, Dropdown, Nav} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import { VscKebabVertical } from "react-icons/vsc";
import { FaTrash } from "react-icons/fa";

function Community({ boards }) {
    const navigate = useNavigate();
    const userNickname = sessionStorage.getItem('nickname');

    // Handle like toggle
    const handleLike = async (event, board) => {
        event.stopPropagation();
        try {
            const url = `http://localhost:8080/api/boards/${board.boardId}/like?userNickname=${userNickname}`;
            await axios.post(url);
            // Update the like state
            board.liked = !board.liked;
            board.boardGreat = board.liked ? board.boardGreat + 1 : board.boardGreat - 1;
        } catch (error) {
            console.error("좋아요/좋아요 취소 중 오류 발생:", error);
        }
    };

    // Handle board deletion
    const handleDelete = async (event, boardId) => {
        event.stopPropagation();
        try {
            await axios.delete(`http://localhost:8080/api/boards/${boardId}`);
            window.location.reload(); // Refresh the page to update the board list
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
        }
    };

    // Handle board click (increments view and navigates to board detail)
    const handleBoardClick = async (boardId) => {
        try {
            await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
            navigate(`/boards/${boardId}`);
        } catch (error) {
            console.error("게시물 조회 중 오류 발생:", error);
        }
    };

    return (
        <div style={{marginRight:'40px'}}>
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
            <hr/>

            <div className="mt-3" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden", paddingRight: "15px" }}>
                {boards.map((board, index) => (
                    <div className="card mb-3" key={index} onClick={() => handleBoardClick(board.boardId)} >
                        <div className="card-body">
                            <h4 className="card-title" style={{
                                fontWeight: "bold",
                                display: "flex",
                                justifyContent: 'center'
                            }}>
                                {board.boardTitle}
                                {board.boardNickname === userNickname && (
                                    <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                                        <Dropdown.Toggle variant="link" id="dropdown-basic" style={{
                                            color: 'black',
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <VscKebabVertical/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={(event) => handleDelete(event, board.boardId)}>
                                                <FaTrash/> 삭제
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </h4>
                            <p className="card-text">{board.boardDetail}</p>
                            <Button
                                variant="outline-primary"
                                onClick={(event) => handleLike(event, board)}
                                className="like-button"
                            >
                                {board.liked ? <BiSolidLike/> : <BiLike/>} {board.boardGreat}
                            </Button>
                            <hr/>
                            <small className="text-muted">작성자: {board.boardNickname}</small>
                            <br/>
                            <IoEyeSharp/> {board.boardView}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;