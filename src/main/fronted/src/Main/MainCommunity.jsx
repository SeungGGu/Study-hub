import { MainHeader } from "./include/MainHeader";
import { Button, Form, InputGroup, Badge, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Community from "./Community";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function MainCommunity() {
    const [boards, setBoards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [tagSearchQuery, setTagSearchQuery] = useState("");
    const [popularTags, setPopularTags] = useState([]);
    const [popularBoards, setPopularBoards] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const navigate = useNavigate();

    // 서버에서 초기 데이터 가져오기 (모든 게시물, 인기 태그, 인기 게시물)
    useEffect(() => {
        // 모든 게시물 가져오기 (초기 로드 시 한 번만 실행)
        axios.get('http://localhost:8080/api/boards')
            .then(response => setBoards(response.data))
            .catch(error => console.error('Error fetching all boards:', error));

        // 인기 태그 가져오기
        axios.get('http://localhost:8080/api/boards/popular-tags')
            .then(response => setPopularTags(response.data))
            .catch(error => console.error('Error fetching popular tags:', error));

        // 인기 게시물 가져오기
        axios.get('http://localhost:8080/api/boards/popular-boards')
            .then(response => setPopularBoards(response.data))
            .catch(error => console.error('Error fetching popular boards:', error));
    }, []); // 빈 배열을 전달하여 컴포넌트 로드 시 한 번만 실행

    // 제목 검색
    const handleSearchByTitle = () => {
        if (searchQuery.trim() === "") {
            alert("검색어를 입력하세요.");
            return;
        }
        setIsSearching(true); // 검색 중 상태로 설정
        axios.get(`http://localhost:8080/api/boards/search`, {
            params: {
                query: searchQuery,
                type: "title"
            }
        })
            .then(response => {
                setSearchResult(response.data); // 검색 결과 상태 업데이트
                if (response.data.length === 0) {
                    alert("검색 결과가 없습니다.");
                }
            })
            .catch(error => console.error(`Error searching by title:`, error));
    };

    // 태그 검색
    const handleSearchByTag = () => {
        if (tagSearchQuery.trim() === "") {
            alert("태그를 입력하세요.");
            return;
        }
        setIsSearching(true); // 검색 중 상태로 설정
        axios.get(`http://localhost:8080/api/boards/search`, {
            params: {
                query: tagSearchQuery,
                type: "tag"
            }
        })
            .then(response => {
                setSearchResult(response.data); // 검색 결과 상태 업데이트
                if (response.data.length === 0) {
                    alert("검색 결과가 없습니다.");
                }
            })
            .catch(error => console.error(`Error searching by tag:`, error));
    };

    // 특정 태그 클릭 시 해당 태그로 검색된 게시물 필터링
    const handleTagClick = (tag) => {
        setTagSearchQuery(tag); // 태그 입력란에 선택한 태그 자동 입력
        handleSearchByTag(); // 해당 태그로 검색
    };

    // 특정 게시물 클릭 시 해당 게시물로 이동
    const handleBoardClick = (boardId) => {
        navigate(`/boards/${boardId}`);
    };

    return (
        <div className="MainCommunity" style={{ paddingTop: "56px", marginLeft: "20" }}>
            <MainHeader />
            <div className="row g-5">
                <div className="col-md-8">
                    <div className="mt-3">
                        {/* 제목 검색 입력 및 버튼 */}
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="게시물 제목으로 검색해 보세요!"
                                aria-label="searchByTitle"
                                aria-describedby="searchByTitle"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={handleSearchByTitle}>
                                제목 검색
                            </Button>
                        </InputGroup>
                        {/* 태그 검색 입력 및 버튼 */}
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="# 태그로 검색해보세요!"
                                aria-label="searchByTag"
                                aria-describedby="searchByTag"
                                value={tagSearchQuery}
                                onChange={(e) => setTagSearchQuery(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={handleSearchByTag}>
                                태그 검색
                            </Button>
                        </InputGroup>
                    </div>
                    <div>
                        {isSearching ? (
                            searchResult.length > 0 ? (
                                // 검색 결과가 있을 때, 해당 게시물만 표시
                                <Community boards={searchResult} />
                            ) : (
                                // 검색 결과가 없을 때, 메시지 표시
                                <div>검색 결과가 없습니다.</div>
                            )
                        ) : (
                            // 검색 중이 아닐 때, 전체 게시물 표시
                            <Community boards={boards}/>
                        )}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 mb-3 bg-body-tertiary rounded">
                        <h6 style={{ color: 'black', textAlign: "left" }}>
                            # 인기 태그
                        </h6>
                        {popularTags.map((tag, index) => (
                            <Badge
                                key={index}
                                pill
                                bg="secondary"
                                onClick={() => handleTagClick(tag)}
                                style={{ cursor: 'pointer', marginRight: '5px' }}
                            >
                                <Badge pill bg="black">#</Badge>{tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="p-4 mt-3 bg-body-tertiary rounded">
                        <h6 style={{ color: 'black', textAlign: "left" }}>
                            인기 게시물
                        </h6>
                        <ListGroup variant="flush">
                            {popularBoards.map((board, index) => (
                                <ListGroup.Item
                                    key={index}
                                    style={{ cursor: 'pointer', padding: '10px 15px', border: '1px solid #ddd'
                                }}
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
    );
}

export default MainCommunity;