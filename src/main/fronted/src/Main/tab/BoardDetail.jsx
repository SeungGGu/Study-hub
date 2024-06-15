import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import {MainHeader} from "../include/MainHeader";
import CommentComponent from "./CommentComponent";

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
            <MainHeader/>
            <Card
            style={{marginTop:"60px"}}>
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
            <CommentComponent boardId={board.boardId} />
        </Container>
    );
};

export default BoardDetail;
