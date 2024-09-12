// import {Button, Nav, Dropdown} from "react-bootstrap";
// import React, {useEffect, useState} from "react";
// import {useNavigate} from 'react-router-dom';
// import axios from "axios";
// import {BiLike, BiSolidLike} from "react-icons/bi";
// import {IoEyeSharp} from "react-icons/io5";
// import {VscKebabVertical} from "react-icons/vsc";
// import {FaTrash} from "react-icons/fa";
//
// function Community() {
//     const [boards, setBoards] = useState([]);
//     const navigate = useNavigate();
//     const userNickname = sessionStorage.getItem('nickname');  // 세션에서 닉네임 가져오기
//
//     // 서버에서 게시물 목록을 가져옴
//     const fetchBoards = async () => {
//         try {
//             const response = await axios.get('http://localhost:8080/api/boards');
//             const boardsWithLikes = await Promise.all(
//                 response.data.map(async (board) => {
//                     const likeCheckResponse = await axios.get(`http://localhost:8080/api/likes/check`, {
//                         params: {boardId: board.boardId, userNickname: userNickname},
//                     });
//                     return {
//                         ...board,
//                         liked: likeCheckResponse.data, // 서버에서 현재 사용자가 좋아요를 눌렀는지 여부를 받아옴
//                     };
//                 })
//             );
//
//             setBoards(boardsWithLikes);
//         } catch (error) {
//             console.error('게시물 목록을 가져오는 중 오류 발생:', error);
//         }
//     };
//
//     useEffect(() => {
//         fetchBoards();
//     }, []);
//
//     // 좋아요 토글 처리
//     const handleLike = async (event, board) => {
//         event.stopPropagation();
//         try {
//             const url = `http://localhost:8080/api/boards/${board.boardId}/like?userNickname=${userNickname}`;
//             await axios.post(url);
//
//             // 좋아요 상태가 서버에서 성공적으로 변경되었을 때만 상태 업데이트
//             setBoards(prevData =>
//                 prevData.map(b =>
//                     b.boardId === board.boardId
//                         ? {
//                             ...b,
//                             liked: !board.liked,
//                             boardGreat: board.liked ? b.boardGreat - 1 : b.boardGreat + 1
//                         }
//                         : b
//                 )
//             );
//         } catch (error) {
//             console.error("좋아요/좋아요 취소 중 오류 발생:", error);
//         }
//     };
//     // 게시물 삭제
//     const handleDelete = async (event, boardId) => {
//         event.stopPropagation();
//         try {
//             await axios.delete(`http://localhost:8080/api/boards/${boardId}`);
//             setBoards(prevData => prevData.filter(board => board.boardId !== boardId)); // 삭제된 게시물 제거
//             console.log(`게시물 ${boardId} 삭제됨`);
//         } catch (error) {
//             console.error("게시물 삭제 중 오류 발생:", error);
//         }
//     };
//     // 게시물 클릭 시 조회 수 증가
//     const handleBoardClick = async (boardId) => {
//         try {
//             await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`); // 조회 수 증가 API 호출
//             navigate(`/boards/${boardId}`);
//         } catch (error) {
//             console.error("게시물 조회 중 오류 발생:", error);
//         }
//     };
//
//     const stripHtml = (html) => {
//         const doc = new DOMParser().parseFromString(html, 'text/html');
//         return doc.body.textContent || "";
//     };
//
//     return (
//         <div style={{marginRight:'40px'}}>
//             <div className="row mt-4">
//                 <div className="col">
//                     <Nav variant="underline" defaultActiveKey="최신순">
//                         <Nav.Item className="me-3">
//                             <Nav.Link eventKey="최신순">• 최신순</Nav.Link>
//                         </Nav.Item>
//                         <Nav.Item className="me-3">
//                             <Nav.Link eventKey="좋아요순">• 좋아요 순</Nav.Link>
//                         </Nav.Item>
//                         <Nav.Item className="me-3">
//                             <Nav.Link eventKey="댓글 순">• 댓글 순</Nav.Link>
//                         </Nav.Item>
//                     </Nav>
//                 </div>
//                 <div className="col-auto">
//                     <Button variant="secondary" onClick={() => {
//                         navigate('/MainBoards');
//                     }}>
//                         글쓰기
//                     </Button>
//                 </div>
//             </div>
//             <hr/>
//             <div className="mt-3"
//                  style={{height: "80vh", overflowY: "auto", overflowX: "hidden", paddingRight: "15px"}}>
//                 {boards.map((board, index) => (
//                     <div className="card mb-3" key={index} onClick={() => handleBoardClick(board.boardId)} >
//                         <div className="card-body">
//                             <h4 className="card-title" style={{
//                                 fontWeight: "bold",
//                                 display: "flex",
//                                 justifyContent: 'center'
//                             }}> {board.boardTitle}
//                                 {board.boardNickname === userNickname && ( // 사용자 식별
//                                     <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
//                                         <Dropdown.Toggle variant="link" id="dropdown-basic" style={{
//                                             color: 'black',
//                                             display: 'flex',
//                                             justifyContent: 'flex-end'
//                                         }}>
//                                             <VscKebabVertical/>
//                                         </Dropdown.Toggle>
//                                         <Dropdown.Menu>
//                                             <Dropdown.Item
//                                                 onClick={(event) => handleDelete(event, board.boardId)}><FaTrash/>삭제</Dropdown.Item>
//                                         </Dropdown.Menu>
//                                     </Dropdown>
//                                 )}
//                             </h4>
//                             <p className="card-text">{stripHtml(board.boardDetail)}</p>
//                             <Button
//                                 variant="outline-primary"
//                                 onClick={(event) => handleLike(event, board)}
//                                 className="like-button"
//                             >
//                                 {board.liked ? <BiSolidLike/> : <BiLike/>} {board.boardGreat}
//                             </Button>
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
import { Button, Dropdown } from "react-bootstrap";
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
        <div style={{ marginRight:'40px' }}>
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