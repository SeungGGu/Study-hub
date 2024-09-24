import { Button, Dropdown, Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { IoEyeSharp } from "react-icons/io5";
import { VscKebabVertical } from "react-icons/vsc";
import { FaTrash } from "react-icons/fa";
import {BiLike, BiSolidLike} from "react-icons/bi";

function Community({ boards }) {
    const navigate = useNavigate();
    const userNickname = sessionStorage.getItem('nickname');
    const [likedBoards, setLikedBoards] = useState({});

    // Fetch the user's liked posts on component mount
    useEffect(() => {
        const fetchLikedBoards = async () => {
            try {
                const response = await axios.get(`/api/users/${userNickname}/liked-boards`);
                const likedBoardsData = response.data;
                const likedBoardsMap = {};
                likedBoardsData.forEach(boardId => {
                    likedBoardsMap[boardId] = true;
                });
                setLikedBoards(likedBoardsMap);
            } catch (error) {
                console.error('Error fetching liked boards:', error);
            }
        };
        fetchLikedBoards();
    }, [userNickname]);

    // Handle like button click
    const handleLike = async (event, boardId) => {
        event.stopPropagation();
        try {
            const response = await axios.post(`/api/boards/${boardId}/like?userNickname=${userNickname}`);
            const updatedIsLiked = response.data.isLiked;
            setLikedBoards(prevLikedBoards => ({
                ...prevLikedBoards,
                [boardId]: updatedIsLiked
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
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
    const handleBoardClick = async (event, boardId) => {
        event.stopPropagation(); // Prevent the click event from bubbling up
        try {
            await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
            navigate(`/boards/${boardId}`);
        } catch (error) {
            console.error("게시물 조회 중 오류 발생:", error);
        }
    };

    return (
        <div style={{ marginRight: '40px' }}>
            <hr />
            <div className="mt-3" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden", paddingRight: "15px" }}>
                {boards.map((board, index) => (
                    <div className="card mb-3" key={index} onClick={(event) => handleBoardClick(event, board.boardId)}>
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
                            <p className="card-text">{board.boardDetail}</p>
                            <button onClick={(event) => handleLike(event, board.boardId)}>
                                {likedBoards[board.boardId] ? (
                                    <BiSolidLike/>
                                ) : (
                                    <BiLike/> // Unliked icon
                                )}
                            </button>
                            <hr />
                            <small className="text-muted">작성자: {board.boardNickname}</small>
                            <br />
                            <IoEyeSharp /> {board.boardView}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;

// import {Button, Dropdown, Nav} from "react-bootstrap";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// // import { BiLike, BiSolidLike } from "react-icons/bi";
// import { IoEyeSharp } from "react-icons/io5";
// import { VscKebabVertical } from "react-icons/vsc";
// import { FaTrash } from "react-icons/fa";
// import {BiLike, BiSolidLike} from "react-icons/bi";
//
// function Community({ boards }) {
//     const navigate = useNavigate();
//     const userNickname = sessionStorage.getItem('nickname');
//     const [likedBoards, setLikedBoards] = useState({}); // 좋아요 상태를 저장
//
//     useEffect(() => {
//         const fetchLikedBoards = async () => {
//             try {
//                 const response = await axios.get(`/api/users/${userNickname}/liked-boards`);
//                 const likedBoardsData = response.data;
//                 const likedBoardsMap = {};
//                 likedBoardsData.forEach(boardId => {
//                     likedBoardsMap[boardId] = true;
//                 });
//                 setLikedBoards(likedBoardsMap);
//             } catch (error) {
//                 console.error('Error fetching liked boards:', error);
//             }
//         };
//         fetchLikedBoards();
//     }, [userNickname]);
//
//     const handleLike = async (event, boardId) => {
//         event.stopPropagation();
//         try {
//             const response = await axios.post(`/api/boards/${boardId}/like?userNickname=${userNickname}`);
//             const updatedIsLiked = response.data.isLiked;
//             setLikedBoards(prevLikedBoards => ({
//                 ...prevLikedBoards,
//                 [boardId]: updatedIsLiked // 해당 게시물의 좋아요 상태를 업데이트
//             }));
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };
//
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
//
//     // Handle board click (increments view and navigates to board detail)
//     const handleBoardClick = async (boardId) => {
//         try {
//             await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
//             navigate(`/boards/${boardId}`);
//         } catch (error) {
//             console.error("게시물 조회 중 오류 발생:", error);
//         }
//     };
//
//     return (
//         <div style={{marginRight:'40px'}}>
//             <hr/>
//             <div className="mt-3" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden", paddingRight: "15px" }}>
//                 {boards.map((board, index) => (
//                     <div className="card mb-3" key={index} onClick={() => handleBoardClick(board.boardId)} >
//                         <div className="card-body">
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
//                                 {likedBoards[board.boardId] ? (
//                                     <BiSolidLike/>
//                                 ) : (
//                                     <BiLike/> // Unliked icon
//                                 )}
//                             </button>
//                             <hr/>
//                             <small className="text-muted"> 작성자: {board.boardNickname}</small>
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