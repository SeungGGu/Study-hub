import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup, Toast, Dropdown } from 'react-bootstrap';
import { CgProfile } from "react-icons/cg";
import { VscKebabVertical } from 'react-icons/vsc';
import {BiEdit} from "react-icons/bi";
import {FaTrash} from "react-icons/fa";

const CommentComponent = ({ boardId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const userNickname = sessionStorage.getItem('nickname');
    const [editingCommentId, setEditingCommentId] = useState(null);  // 현재 수정 중인 댓글 ID

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

    // 댓글 삭제 처리
    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
        }
    };

    // 댓글 수정 모드로 전환
    const handleEditClick = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setCommentText(commentText); // 기존 댓글 내용을 수정 텍스트에 설정
    };

    // 댓글 수정 취소
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setCommentText('');
    };
    const handleKeyPress = (event, commentId) => {
        if (event.key === 'Enter') {
            handleEditSubmit(commentId);
        }
    };

    // 댓글 수정 처리
    const handleEditSubmit = async (commentId) => {
        try {
            const updatedComment = { commentText: commentText };
            await axios.put(`http://localhost:8080/api/comments/${commentId}`, updatedComment);
            setComments(prevComments => prevComments.map(comment =>
                comment.commentId === commentId ? { ...comment, commentText: commentText } : comment
            ));
            setEditingCommentId(null);
            setCommentText('');
        } catch (error) {
            console.error('댓글 수정 중 오류 발생:', error);
        }
    };

    return (
        <div>
            <Form onSubmit={handleCommentSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="댓글을 입력하세요."
                        value={commentText}
                        onChange={handleCommentChange}
                        style={{ width: '600px', borderRadius: "5px", borderColor: "lightgray" }}
                    />
                    <Button variant="outline-secondary" type="submit" style={{ marginLeft: "20px", borderRadius: "10px", height: "40px" }}>
                        등록
                    </Button>
                </InputGroup>

                <div style={{ maxHeight: '800px', maxWidth: '800px', overflowY: 'auto', marginTop: '10px' }}>
                    <div className="p-3" style={{ margin: "0", padding: "0" }} position="middlestart">
                        {comments.map(comment => (
                            <Toast
                                key={comment.commentId}
                                className="mb-2"
                                bg="light"
                                style={{ border: 'none', width: '800px'}}
                            >
                                <Toast.Header closeButton={false} style={{ borderBottom: 'none' }}>
                                    <CgProfile style={{ marginRight: '8px' }} /> {/* 프로필 아이콘 */}
                                    <strong className="me-auto">{comment.userNickname}</strong>
                                    <small className="text-muted">{new Date(comment.createdDate).toLocaleString()}</small>

                                    {/* 본인 댓글만 표시 */}
                                    {comment.userNickname === userNickname && (
                                        <Dropdown align="end">
                                            <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ padding: '0' , color:'black'}}>
                                                <VscKebabVertical style={{ color:'black' }}/>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleEditClick(comment.commentId, comment.commentText)}><BiEdit />수정</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDelete(comment.commentId)}><FaTrash />삭제</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </Toast.Header>

                                <Toast.Body style={{display:'flex', background:'white'}}>
                                    {editingCommentId === comment.commentId ? (
                                        <div>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={commentText}
                                                onChange={handleCommentChange}
                                                onKeyPress={(e) => handleKeyPress(e, comment.commentId)}
                                                style={{ marginBottom: '10px' }}
                                            />
                                            <div>
                                                <Button variant="outline-success" size="sm" onClick={() => handleEditSubmit(comment.commentId)}>저장</Button>
                                                <Button variant="outline-secondary" size="sm" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>취소</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        comment.commentText
                                    )}
                                </Toast.Body>
                            </Toast>
                        ))}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default CommentComponent;