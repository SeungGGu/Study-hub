import { MainHeader } from "./include/MainHeader";
import { Button, Form, InputGroup, Badge, ListGroup } from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import Community from "./Community";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";

function MainCommunity() {
    const [boards, setBoards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [popularTags, setPopularTags] = useState([]);
    const [popularBoards, setPopularBoards] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/boards')
            .then(response => setBoards(response.data))
            .catch(error => console.error('Error fetching all boards:', error));

        axios.get('http://localhost:8080/api/boards/popular-tags')
            .then(response => setPopularTags(response.data))
            .catch(error => console.error('Error fetching popular tags:', error));

        axios.get('http://localhost:8080/api/boards/popular-boards')
            .then(response => setPopularBoards(response.data))
            .catch(error => console.error('Error fetching popular boards:', error));
    }, []);

    // 제목 검색
    const handleSearchByTitle = () => {
        if (searchQuery.trim() === "") {
            alert("검색어를 입력하세요.");
            return;
        }
        setIsSearching(true);

        axios.get('http://localhost:8080/api/boards')
            .then(response => {
                const allBoards = response.data;
                const filteredBoards = allBoards.filter(board =>
                    board.boardTitle.includes(searchQuery)
                );
                setSearchResult(filteredBoards);
                setIsSearching(false);

                if (filteredBoards.length === 0) {
                    alert("검색 결과가 없습니다.");
                }
            })
            .catch(error => {
                console.error("Error searching by title:", error);
                setIsSearching(false);
            });
    };

    // Handle click on a tag to filter by that tag
    const handleTagClick = (tag) => {
        axios.get(`http://localhost:8080/api/boards?tag=${tag}`)
            .then(response => setSearchResult(response.data))
            .catch(error => console.error("Error filtering by tag:", error));
    };

    // 인기 게시물 조회수 증가
    const handleBoardClick = async (boardId) => {
        try {
            // Increment view count
            await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
            // Navigate to the board's detail page
            navigate(`/boards/${boardId}`);
        } catch (error) {
            console.error("Error incrementing view count or navigating to board:", error);
        }
    };

    return (
        <div className="MainCommunity" style={{ paddingTop: "56px", marginLeft: "150px", marginRight:'150px' }}>
            <MainHeader />
            <div className="row g-5">
                <div className="col-md-8">
                    <div className="mt-3" style={{ marginRight: '50px' }}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="게시물 제목으로 검색해 보세요!"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{borderRadius: "10px"}}
                            />

                            <div>
                                <Button variant="outline-secondary"
                                        style={{marginLeft: "30px", borderRadius: "10px", height: "40px"}}
                                        onClick={handleSearchByTitle}>
                                    제목 검색
                                </Button>
                            </div>
                            <div className="col-auto" style={{marginLeft: "20px"}}>
                                <Button variant="secondary" onClick={() => {
                                    navigate('/MainBoards');
                                }}>
                                    글쓰기
                                </Button>
                            </div>
                        </InputGroup>
                    </div>
                    {/* 검색*/}
                    <div>
                        {isSearching ? (
                            <div>검색 중...</div>
                        ) : (
                            searchResult.length > 0 ? (
                                <Community boards={searchResult} />
                            ) : (
                                <Community boards={boards} />
                            )
                        )}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 mb-3 rounded"
                         style={{ border: '1px solid #ddd', margin: '5px', borderRadius: '5px', marginTop: '20px' }}>
                        <h6 style={{ color: 'black', textAlign: "left", fontWeight: 'bold' }}># 인기 태그</h6>
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
                    <div className="p-4 mt-3 rounded" style={{ border: '1px solid #ddd', margin:'5px', borderRadius:'5px' }}>
                        <h6 style={{ color: 'black', textAlign: "left", fontWeight:'bold' }}>인기 게시물</h6>
                        <ListGroup variant="flush">
                            {popularBoards.map((board, index) => (
                                <ListGroup.Item
                                    key={index}
                                    style={{ cursor: 'pointer', padding: '10px 15px', border: '1px solid #ddd', margin:'5px', borderRadius:'5px' }}
                                    onClick={() => handleBoardClick(board.boardId)}
                                    className="popular-board-item"
                                >
                                    <div style={{ fontWeight: 'bold' }}>{board.boardTitle}</div>
                                    <div><IoEyeSharp style={{ color:"lightgray" }}/>{board.boardView}</div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainCommunity;
