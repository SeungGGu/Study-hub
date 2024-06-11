import {MainHeader} from "./include/MainHeader";
import {Button, Form, InputGroup, Badge, Tab, Tabs, ListGroup} from "react-bootstrap";
import {useEffect, useState} from "react";
import Community from "./Community";
import React from "react";
import ListBoardComponent from "./tab/ListBoardComponent";
import axios from "axios";

function MainCommunity() {
    const [key, setKey] = useState('all');
    const [boards, setBoards] = useState([]);
    const [popularTags, setPopularTags] = useState([]); // 인기 태그 상태 추가
    const [popularBoards, setPopularBoards] = useState([]); // 인기 게시물 상태 추가

    const addBoard = (newBoard) => {
        setBoards([...boards, newBoard]);
    };

    useEffect(() => {
        // 인기 태그 가져오기
        axios.get('http://localhost:8080/api/boards/popular-tags')
            .then(response => {
                setPopularTags(response.data);
            })
            .catch(error => {
                console.error('Error fetching popular tags:', error);
            });
        // 인기 게시물 가져오기
        axios.get('http://localhost:8080/api/boards/popular-boards')
            .then(response => {
                setPopularBoards(response.data);
            })
            .catch(error => {
                console.error('Error fetching popular boards:', error);
            });
    }, []);
    const handleTagClick = (tag) => {
        // 특정 태그로 게시물 필터링
        axios.get(`http://localhost:8080/api/boards/tag?tag=${tag}`)
            .then(response => {
                setBoards(response.data);
            })
            .catch(error => {
                console.error(`Error fetching boards for tag ${tag}:`, error);
            });
    };
    const handleBoardClick = (boardId) => {
        // 게시물 클릭 시 해당 게시물로 이동
        window.location.href = `/boards/${boardId}`;
    };


    return (
        <div className="MainCommunity" style={{paddingTop: "56px", marginLeft: "20"}}>
            <MainHeader/>
            <div className="row g-5">
                <div className="col-md-8">
                    <div className="mt-3">
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="관심 스터디를 검색해 보세요!"
                                aria-label="search"
                                aria-describedby="search"
                            />
                            <Button variant="outline-secondary" id="searchButton">
                                검색
                            </Button>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="# 태그로 검색해보세요!"
                                aria-label="tagSearch"
                                aria-describedby="tagSearch"
                            />
                            <Button variant="outline-secondary" id="reset">
                                초기화
                            </Button>
                            <Button variant="outline-secondary" id="TagSearchButton">
                                검색
                            </Button>
                        </InputGroup>
                    </div>
                    <div>
                        <Community boards={boards}/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 mb-3 bg-body-tertiary rounded">
                        <h6 style={{color: 'black', textAlign: "left"}}>
                            # 인기 태그
                        </h6>
                        {popularTags.map((tag, index) => (
                            <Badge
                                key={index}
                                pill
                                bg="secondary"
                                onClick={() => handleTagClick(tag)} // 태그 클릭 핸들러
                                style={{cursor: 'pointer', marginRight: '5px'}}
                            >
                                <Badge pill bg="black">#</Badge>{tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="p-4 mt-3 bg-body-tertiary rounded">
                        <h6 style={{color: 'black', textAlign: "left"}}>
                            # 인기 게시물
                        </h6>
                        <ListGroup variant="flush">
                            {popularBoards.map((board, index) => (
                                <ListGroup.Item
                                    key={index}
                                    style={{ cursor: 'pointer', padding: '10px 15px', border: '1px solid #ddd' }}
                                    onClick={() => handleBoardClick(board.boardId)}
                                    className="popular-board-item"
                                >
                                    <div style={{ fontWeight: 'bold', color: '#007bff' }}>
                                        {board.boardTitle}
                                    </div>
                                    <small className="text-muted">조회수: {board.boardView}</small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            </div>
            <style>
                {`
                    .nav-item .nav-link {
                        color: white; /* Set text color of unselected tabs to white */
                    }
            
                    .nav-item .nav-link.active {
                        color: black; /* Set text color of selected tab to black */
                    }
                `}
            </style>
        </div>
    )
}

export default MainCommunity;
