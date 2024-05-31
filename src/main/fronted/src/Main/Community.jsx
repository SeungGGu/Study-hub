import { Badge, Button, Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function Community() {
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/boards')
            .then(response => response.json())
            .then(data => setBoards(data))
            .catch(error => console.error('Error fetching boards:', error));
    }, []);

    const handleBoardClick = (boardId) => {
        navigate(`/boards/${boardId}`);
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
                            <p className="card-text">{board.boardDetail}</p>
                            <Badge pill bg="primary">{index + 1}</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;

// import { Badge, Button, Nav, Tabs, Tab } from "react-bootstrap";
// import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
//
// function Community({ boards }) {
//     const navigate = useNavigate();
//     const [boardData, setBoardData] = useState(boards);
//     const [activeCategory, setActiveCategory] = useState('All');
//
//     const handleLike = async (boardId) => {
//         try {
//             await axios.post(`http://localhost:8080/api/boards/${boardId}/like`);
//             setBoardData(prevData =>
//                 prevData.map(board =>
//                     board.boardId === boardId ? { ...board, boardGreat: board.boardGreat + 1 } : board
//                 )
//             );
//         } catch (error) {
//             console.error("Failed to like the board:", error);
//         }
//     };
//
//     const handleClick = (boardId) => {
//         navigate(`/boards/${boardId}`);
//     };
//
//     const filteredBoards = activeCategory === 'All'
//         ? boardData
//         : boardData.filter(board => board.boardCategory === activeCategory);
//
//     return (
//         <div className="container mt-4">
//             <div className="row">
//                 <div className="col">
//                     <Nav variant="underline" defaultActiveKey="latest">
//                         <Nav.Item className="me-3">
//                             <Nav.Link eventKey="latest">• 최신순</Nav.Link>
//                         </Nav.Item>
//                         <Nav.Item className="me-3">
//                             <Nav.Link eventKey="like">• 좋아요 순</Nav.Link>
//                         </Nav.Item>
//                         <Nav.Item className="me-3">
//                             <Nav.Link eventKey="comment">• 댓글 순</Nav.Link>
//                         </Nav.Item>
//                     </Nav>
//                 </div>
//                 <div className="col-auto">
//                     <Button variant="secondary" onClick={() => navigate('/MainBoards')}>글쓰기</Button>
//                 </div>
//             </div>
//             <hr />
//             <Tabs
//                 defaultActiveKey="All"
//                 id="justify-tab-example"
//                 className="mb-3"
//                 justify
//                 onSelect={(k) => setActiveCategory(k)}
//             >
//                 <Tab eventKey="All" title="전체"></Tab>
//                 <Tab eventKey="Notice" title="공지사항"></Tab>
//                 <Tab eventKey="Question" title="질문"></Tab>
//                 <Tab eventKey="Study" title="스터디"></Tab>
//                 <Tab eventKey="Free" title="자유"></Tab>
//             </Tabs>
//             <div className="row">
//                 {filteredBoards.map((board, index) => (
//                     <div className="col-12 mb-3" key={board.boardId}>
//                         <div className="card">
//                             <div className="card-body">
//                                 <h5 className="card-title" onClick={() => handleClick(board.boardId)}>{board.boardTitle}</h5> {/* 게시물 제목 클릭 시 상세 페이지 이동 */}
//                                 <p className="card-text">{board.boardDetail}</p>
//                                 <div className="d-flex justify-content-between">
//                                     <Badge pill bg="primary">{board.boardCategory}</Badge>
//                                     <Button variant="outline-primary" onClick={() => handleLike(board.boardId)}>
//                                         👍 {board.boardGreat}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
//
// export default Community;
