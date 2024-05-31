// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
//
// function BoardDetail() {
//     const { boardId } = useParams();
//     const [board, setBoard] = useState(null);
//
//     useEffect(() => {
//         const fetchBoard = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/api/boards/${boardId}`);
//                 setBoard(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch board details:", error);
//             }
//         };
//
//         fetchBoard();
//     }, [boardId]);
//
//     if (!board) {
//         return <div>Loading...</div>;
//     }
//
//     return (
//         <div className="container mt-4">
//             <h2>{board.boardTitle}</h2>
//             <p>{board.boardDetail}</p>
//             <div>
//                 <span>Category: {board.boardCategory}</span>
//                 <span> | Likes: {board.boardGreat}</span>
//             </div>
//         </div>
//     );
// }
//
// export default BoardDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const BoardDetail = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/boards/${boardId}`)
            .then(response => response.json())
            .then(data => setBoard(data))
            .catch(error => console.error('Error fetching board detail:', error));
    }, [boardId]);

    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h4>{board.boardTitle}</h4>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{board.boardDetail}</Card.Text>
                    <Card.Footer>
                        <small className="text-muted">작성자: {board.boardNickname}</small>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BoardDetail;
