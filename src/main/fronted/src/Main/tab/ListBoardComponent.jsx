import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Tabs, Tab, Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./MainBoardCSS.css";
import BoardTag from "./BoardTag";

const ListBoardComponent = ({ addBoard }) => {
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [boards, setBoards] = useState([]);
    const [username, setUsername] = useState('defaultUser'); // Default username


    const handleContentChange = (newContent) => {
        setContent(newContent);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleTagsChange = (newTags) => {
        setTags(newTags);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() === '' || content.trim() === '') {
            alert("Title and content cannot be empty.");
            return;
        }

        const boardData = {
            boardTitle: title, // Board title
            boardDetail: content, // Board content
            boardCategory: tags.join(','), // Board tags
            boardNickname: username, // Username (assumed to be obtained from authentication context or similar)
            createdDate: new Date(), // Current date and time
        };

        fetch('http://localhost:8080/boards/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData), // Send data as JSON
        })

            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error saving board');
                }
                return response.json(); // Get the saved board as JSON
            })
            .then((savedBoard) => {
                addBoard(savedBoard); // Add new board to the parent component state
                setTitle(''); // Clear the title input
                setContent(''); // Clear the content input
                setTags([]); // Clear the tags input
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while submitting the form. Please try again later.');
            });
    };

    return (
        <div className="container" style={{ backgroundColor: "lightgray" }}>
            <form onSubmit={handleSubmit}>
                <Tabs
                    defaultActiveKey="profile"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                >
                    <Tab eventKey="home" title="전체"></Tab>
                    <Tab eventKey="profile" title="공지사항"></Tab>
                    <Tab eventKey="question" title="질문"></Tab>
                    <Tab eventKey="study" title="스터디"></Tab>
                    <Tab eventKey="free" title="자유"></Tab>
                </Tabs>

                <Row>
                    <Col xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="제목을 입력하세요."
                            style={{ fontSize: "23px", fontWeight: "bold" }}
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </Col>
                </Row>

                <FloatingLabel
                    controlId="floatingQuill"
                    className="mb-3"
                >
                    <BoardTag onChange={handleTagsChange} />
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="- 학습 관련 질문을 남겨주세요."
                        style={{ color: 'black', backgroundColor: 'white', padding: "0" }}
                    />
                </FloatingLabel>
            </form>

            <div className="button_box" >
                <Button type="submit" onClick={handleSubmit} style={{backgroundColor:"gray"}}>Submit</Button>
            </div>

        </div>

    )
};
export default ListBoardComponent;
