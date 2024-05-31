import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Tabs, Tab, Col, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./MainBoardCSS.css";
import BoardTag from "./BoardTag";

const ListBoardComponent = ({ addBoard }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);  // 태그 상태 초기화
    const nickname = sessionStorage.getItem('nickname');  // 세션에서 닉네임 가져오기

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

    // 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault();

        if (title.trim() === '' || content.trim() === '') {
            alert("Title and content cannot be empty.");
            return;
        }

        const boardData = {
            boardTitle: title,
            boardDetail: content,
            boardCategory: tags.join(','),  // 태그를 문자열로 변환하여 저장
            boardNickname: nickname,
            createdDate: new Date(),
        };

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
        <div className="container" style={{ backgroundColor: "lightgray" , borderRadius:"20px", padding:"20px"}}>
            <form onSubmit={handleSubmit}>


                <Row>
                    <Col xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="제목을 입력하세요."
                            style={{ fontSize: "23px", fontWeight: "bold", marginTop:"35px"}}
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


// import React, { useEffect, useState } from 'react';
// import { Button, FloatingLabel, Form, Tabs, Tab, Col, Row } from 'react-bootstrap';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import "./MainBoardCSS.css";
// import BoardTag from "./BoardTag";
//
// const ListBoardComponent = ({ addBoard }) => {
//     // const [show, setShow] = useState(false);
//     const [content, setContent] = useState('');
//     const [title, setTitle] = useState('');
//     const [tags, setTags] = useState([]);
//     const nickname = sessionStorage.getItem('nickname');
//     // const [boards, setBoards] = useState([]);
//     // const [username, setUsername] = useState('defaultUser'); // Default username
//
//
//     const handleContentChange = (newContent) => {
//         setContent(newContent);
//     };
//
//     const handleTitleChange = (event) => {
//         setTitle(event.target.value);
//     };
//
//     const handleTagsChange = (newTags) => {
//         setTags(newTags);
//     };
//
//     const handleSubmit = (event) => {
//         event.preventDefault();
//
//         if (title.trim() === '' || content.trim() === '') {
//             alert("Title and content cannot be empty.");
//             return;
//         }
//
//         const boardData = {
//             boardTitle: title, // Board title
//             boardDetail: content, // Board content
//             boardCategory: tags.join(','), // Board tags
//             boardNickname: nickname, // Username (assumed to be obtained from authentication context or similar)
//             createdDate: new Date(), // Current date and time
//         };
//         console.log("Sending board data to server:", boardData);
//
//         fetch('http://localhost:8080/api/boards/create', { // URL을 확인하세요.
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(boardData),
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Error saving board');
//                 }
//                 return response.json(); // Get the saved board as JSON
//             })
//             .then((savedBoard) => {
//                 console.log("Response from server:", savedBoard); // Add console log to check the response from server
//                 addBoard(savedBoard); // Add new board to the parent component state
//                 setTitle(''); // Clear the title input
//                 setContent(''); // Clear the content input
//                 setTags([]); // Clear the tags input
//                 console.log("board정보", boardData);
//             })
//
//             .catch((error) => {
//                 console.error('Error:', error);
//                 alert('An error occurred while submitting the form. Please try again later.');
//             });
//     };
//
//     return (
//         <div className="container" style={{ backgroundColor: "lightgray" }}>
//             <form onSubmit={handleSubmit}>
//                 <Tabs
//                     defaultActiveKey="profile"
//                     id="justify-tab-example"
//                     className="mb-3"
//                     justify
//                 >
//                     <Tab eventKey="home" title="전체"></Tab>
//                     <Tab eventKey="profile" title="공지사항"></Tab>
//                     <Tab eventKey="question" title="질문"></Tab>
//                     <Tab eventKey="study" title="스터디"></Tab>
//                     <Tab eventKey="free" title="자유"></Tab>
//                 </Tabs>
//
//                 <Row>
//                     <Col xs={12}>
//                         <Form.Control
//                             type="text"
//                             placeholder="제목을 입력하세요."
//                             style={{ fontSize: "23px", fontWeight: "bold" }}
//                             value={title}
//                             onChange={handleTitleChange}
//                         />
//                     </Col>
//                 </Row>
//
//                 <FloatingLabel
//                     controlId="floatingQuill"
//                     className="mb-3"
//                 >
//                     {/* BoardTag 컴포넌트에 tags와 onChange props를 전달 */}
//                     <BoardTag tags={tags} onChange={handleTagsChange} />
//                     <ReactQuill
//                         theme="snow"
//                         value={content}
//                         onChange={handleContentChange}
//                         placeholder="- 학습 관련 질문을 남겨주세요."
//                         style={{ color: 'black', backgroundColor: 'white', padding: "0" }}
//                     />
//                 </FloatingLabel>
//             </form>
//             <div className="button_box" >
//                 <Button type="submit" onClick={handleSubmit} style={{backgroundColor:"gray"}}>Submit</Button>
//             </div>
//         </div>
//
//     )
// };
// export default ListBoardComponent;
