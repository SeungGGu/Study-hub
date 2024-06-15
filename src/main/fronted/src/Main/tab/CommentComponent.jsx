import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup } from 'react-bootstrap';

const CommentComponent = ({ boardId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const userNickname = sessionStorage.getItem('nickname');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = () => {
        axios.get(`http://localhost:8080/api/comments/${boardId}`)
            .then(response => setComments(response.data))
            .catch(error => console.error('댓글을 가져오는 중 오류 발생:', error));
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const commentData = {
            boardId: boardId,
            userNickname: userNickname,
            commentText: commentText,
            createdDate: new Date()
        };

        axios.post('http://localhost:8080/api/comments', commentData)
            .then(response => {
                setComments([...comments, response.data]);
                setCommentText('');
            })
            .catch(error => console.error('댓글 등록 중 오류 발생:', error));
    };

    return (
        <div>
            <ListGroup>
                {comments.map(comment => (
                    <ListGroup.Item key={comment.commentId}>
                        <strong>{comment.userNickname}</strong>: {comment.commentText}
                        <br />
                        <small className="text-muted">{new Date(comment.createdDate).toLocaleString()}</small>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Form onSubmit={handleCommentSubmit}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="댓글을 입력하세요."
                        value={commentText}
                        onChange={handleCommentChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    등록
                </Button>
            </Form>
        </div>
    );
};

export default CommentComponent;
