import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoEyeSharp } from 'react-icons/io5';
import { VscKebabVertical } from 'react-icons/vsc';
import { FaTrash } from 'react-icons/fa';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { Dropdown } from 'react-bootstrap';
import './../styles/Community.css'; // CSS 파일 임포트

function Community({ boards }) {
    const navigate = useNavigate();
    const userNickname = sessionStorage.getItem('nickname');
    const [likedBoards, setLikedBoards] = useState({});

    const fetchLikedBoards = async () => {
        try {
            const response = await axios.get(`/api/likes/user/${userNickname}`);
            const likedBoardIds = response.data;
            const likedBoardsMap = likedBoardIds.reduce((acc, boardId) => {
                acc[boardId] = true;
                return acc;
            }, {});
            setLikedBoards(likedBoardsMap);
        } catch (error) {
            console.error('Error fetching liked boards:', error);
        }
    };

    const handleDelete = async (event, boardId) => {
        event.stopPropagation();
        try {
            await axios.delete(`http://localhost:8080/api/boards/${boardId}`);
            window.location.reload();
        } catch (error) {
            console.error('게시물 삭제 중 오류 발생:', error);
        }
    };

    const handleBoardClick = async (boardId) => {
        try {
            await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
            navigate(`/boards/${boardId}`);
        } catch (error) {
            console.error('게시물 조회 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchLikedBoards();
    }, []);

    const handleLike = async (event, boardId) => {
        event.stopPropagation();
        try {
            const response = await axios.post(`/api/likes/toggle`, null, {
                params: { nickname: userNickname, boardId }
            });
            const isLiked = response.data.isLiked;
            setLikedBoards(prevLikedBoards => ({
                ...prevLikedBoards,
                [boardId]: isLiked,
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <div className="community-container">
            <hr />
            <div className="mt-3" style={{ height: '80vh', overflowY: 'auto', paddingRight: '15px' }}>
                {boards.map((board, index) => (
                    <div className="card" key={index}>
                        <div className="card-body" onClick={() => handleBoardClick(board.boardId)}>
                            <h4 className="card-title">
                                {board.boardTitle}
                                {board.boardNickname === userNickname && (
                                    <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                                        <Dropdown.Toggle variant="link" className="dropdown-toggle">
                                            <VscKebabVertical />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={(event) => handleDelete(event, board.boardId)}>
                                                <FaTrash /> 삭제
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </h4>
                            <p className="card-text" style={{textAlign:"left"}}>{board.boardDetail}</p>
                        </div>
                        <div className="card-footer">
                            <small>작성자: {board.boardNickname}</small>
                            <div>
                                <span
                                    className="like-button"
                                    onClick={(event) => handleLike(event, board.boardId)}>
                                    {likedBoards[board.boardId] ? <BiSolidLike/> : <BiLike/>}
                                </span>
                                <IoEyeSharp/> {board.boardView}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;