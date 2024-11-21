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
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { IoEyeSharp } from 'react-icons/io5';
// import { VscKebabVertical } from 'react-icons/vsc';
// import { FaTrash } from 'react-icons/fa';
// import { BiLike, BiSolidLike } from 'react-icons/bi';
// import {Dropdown} from "react-bootstrap";
//
// function Community({ boards }) {
//     const navigate = useNavigate();
//     const userNickname = sessionStorage.getItem('nickname'); // 세션에서 닉네임 가져오기
//     const [likedBoards, setLikedBoards] = useState({}); // 좋아요 상태 저장
//
//     // 사용자가 좋아요한 게시물 목록 가져오기
//     const fetchLikedBoards = async () => {
//         try {
//             const response = await axios.get(`/api/likes/user/${userNickname}`);
//             const likedBoardIds = response.data;
//             const likedBoardsMap = likedBoardIds.reduce((acc, boardId) => {
//                 acc[boardId] = true;
//                 return acc;
//             }, {});
//             setLikedBoards(likedBoardsMap);
//         } catch (error) {
//             console.error('Error fetching liked boards:', error);
//         }
//     };
//     // Handle board deletion
//     const handleDelete = async (event, boardId) => {
//         event.stopPropagation();
//         try {
//             await axios.delete(`http://localhost:8080/api/boards/${boardId}`);
//             window.location.reload(); // Refresh the page to update the board list
//         } catch (error) {
//             console.error("게시물 삭제 중 오류 발생:", error);
//         }
//     };
//     // Handle board click (increments view and navigates to board detail)
//     const handleBoardClick = async (boardId) => {
//         try {
//             await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
//             navigate(`/boards/${boardId}`);
//         } catch (error) {
//             console.error("게시물 조회 중 오류 발생:", error);
//         }
//     };
//     useEffect(() => {
//         fetchLikedBoards(); // 컴포넌트가 마운트될 때 호출
//     }, []);
//
//     // 좋아요 토글 핸들러
//     const handleLike = async (event, boardId) => {
//         event.stopPropagation();
//         try {
//             const response = await axios.post(`/api/likes/toggle`, null, {
//                 params: { nickname: userNickname, boardId }
//             });
//             const isLiked = response.data.isLiked;
//
//             // 좋아요 상태 업데이트
//             setLikedBoards(prevLikedBoards => ({
//                 ...prevLikedBoards,
//                 [boardId]: isLiked,
//             }));
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };
//
//     return (
//         <div style={{ marginRight: '40px' }}>
//             <hr />
//             <div className="mt-3" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden", paddingRight: "15px" }}>
//                 {boards.map((board, index) => (
//                     <div className="card mb-3" key={index}>
//                         <div className="card-body" onClick={() => navigate(`/boards/${board.boardId}`)}>
//                             <h4 className="card-title" style={{
//                                 fontWeight: "bold",
//                                 display: "flex",
//                                 justifyContent: 'center'
//                             }}>
//                                 {board.boardTitle}
//                                 {board.boardNickname === userNickname && (
//                                     <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
//                                         <Dropdown.Toggle variant="link" id="dropdown-basic" style={{
//                                             color: 'black',
//                                             display: 'flex',
//                                             justifyContent: 'flex-end'
//                                         }}>
//                                             <VscKebabVertical/>
//                                         </Dropdown.Toggle>
//                                         <Dropdown.Menu>
//                                             <Dropdown.Item onClick={(event) => handleDelete(event, board.boardId)}>
//                                                 <FaTrash/> 삭제
//                                             </Dropdown.Item>
//                                         </Dropdown.Menu>
//                                     </Dropdown>
//                                 )}
//                             </h4>
//                             <p className="card-text">{board.boardDetail}</p>
//                             <button onClick={(event) => handleLike(event, board.boardId)}>
//                                 {likedBoards[board.boardId] ? <BiSolidLike/> : <BiLike/>}
//                             </button>
//                             <hr/>
//                             <small className="text-muted">작성자: {board.boardNickname}</small>
//                             <br/>
//                             <IoEyeSharp/> {board.boardView}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
//
// export default Community;