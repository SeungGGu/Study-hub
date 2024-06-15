import React, { useRef, useState } from 'react';
import { Button, FloatingLabel, Form, Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./MainBoardCSS.css";
import BoardTag from "./BoardTag";

const ListBoardComponent = ({ addBoard }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);  // 태그 상태 초기화
    const nickname = sessionStorage.getItem('nickname');  // 세션에서 닉네임 가져오기
    const quillRef = useRef();

    // 내용 변경 핸들러
    const handleContentChange = (newContent) => {
        setContent(newContent);
    };

    // 제목 변경 핸들러
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    // 태그 변경 핸들러
    const handleTagsChange = (newTags) => {
        setTags(newTags);  // 태그 상태 업데이트
    };

    // HTML 내용을 순수 텍스트로 변환하는 함수 추가
    const stripHtml = (html) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    // 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() === '' || content.trim() === '') {
            alert("Title and content cannot be empty.");
            return;
        }

        // HTML 태그 제거하여 순수 텍스트만 남기기
        const plainTextContent = stripHtml(content);

        const boardData = {
            boardTitle: title,
            boardDetail: plainTextContent, // HTML 태그 제거된 내용 사용
            boardCategory: tags.join(','),  // 태그를 문자열로 변환하여 저장
            boardNickname: nickname,
            createdDate: new Date(),
        };

        console.log("board 데이터", boardData);

        fetch('http://localhost:8080/api/boards/create', {  // API 엔드포인트 수정됨
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error saving board');
                }
                return response.json();
            })
            .then((savedBoard) => {
                addBoard(savedBoard);
                setTitle('');
                setContent('');
                setTags([]);
                console.log("board정보", boardData);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while submitting the form. Please try again later.');
            });
    };

    return (
        <div className="container" style={{ backgroundColor: "lightgray", borderRadius: "20px", padding: "20px" }}>
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="제목을 입력하세요."
                            style={{ fontSize: "23px", fontWeight: "bold", marginTop: "35px" }}
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </Col>
                </Row>

                <FloatingLabel controlId="floatingQuill" className="mb-3">
                    {/* BoardTag 컴포넌트에 tags와 onChange props를 전달 */}
                    <BoardTag tags={tags} onChange={handleTagsChange} />
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="- 학습 관련 질문을 남겨주세요."
                        style={{ color: 'black', backgroundColor: 'white', padding: "0" }}
                    />
                </FloatingLabel>
            </form>
            <div className="button_box">
                <Button type="submit" onClick={handleSubmit} style={{ backgroundColor: "gray" }}>Submit</Button>
            </div>
        </div>
    );
};

export default ListBoardComponent;
