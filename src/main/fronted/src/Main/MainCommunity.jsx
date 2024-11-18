import { MainHeader } from "./include/MainHeader";
import { Button, Form, InputGroup, Badge, ListGroup } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import Community from "./Community";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { AddSquare } from 'iconsax-react';

function MainCommunity() {
    const [boards, setBoards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [popularTags, setPopularTags] = useState([]);
    const [popularBoards, setPopularBoards] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]); // 검색 결과를 저장할 상태 추가

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/boards')
            .then(response => {
                setBoards(response.data);
                setFilteredBoards(response.data); // 기본적으로 모든 게시물을 필터된 상태로 설정
            })
            .catch(error => console.error('Error fetching all boards:', error));

        axios.get('http://localhost:8080/api/boards/popular-tags')
            .then(response => setPopularTags(response.data))
            .catch(error => console.error('Error fetching popular tags:', error));

        axios.get('http://localhost:8080/api/boards/popular-boards')
            .then(response => setPopularBoards(response.data))
            .catch(error => console.error('Error fetching popular boards:', error));
    }, []);

    // 제목 검색 (DB 대신 불러온 데이터를 필터링)
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredBoards(boards); // 검색어가 없으면 모든 게시물 표시
        } else {
            const filtered = boards.filter(board =>
                board.boardTitle.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredBoards(filtered);
        }
    };

    // Handle click on a tag to filter by that tag
    const handleTagClick = (tag) => {
        const filteredByTag = boards.filter(board => board.tags && board.tags.includes(tag));
        setFilteredBoards(filteredByTag);
    };

    // 인기 게시물 조회수 증가
    const handleBoardClick = async (boardId) => {
        try {
            await axios.post(`http://localhost:8080/api/boards/${boardId}/increment-view`);
            navigate(`/boards/${boardId}`);
        } catch (error) {
            console.error("Error incrementing view count or navigating to board:", error);
        }
    };

    return (
        <div className="MainCommunity" style={{ paddingTop: "30px", marginLeft: "150px", marginRight: '150px' }}>
            <MainHeader />
            <div className="row g-5">
                <div className="col-md-8">
                    <div className="mt-3" style={{ marginRight: '50px' }}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="게시물 제목으로 검색해 보세요!"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)} // 입력할 때마다 실시간 검색
                                style={{ borderRadius: "10px" }}
                            />
                            <div className="col-auto" style={{ marginLeft: "20px" }}>
                                    <HiPencilSquare onClick={() => navigate('/MainBoards')} size={30} />
                            </div>
                        </InputGroup>
                    </div>
                    {/* 검색 결과 */}
                    <div>
                        <Community boards={filteredBoards} /> {/* 검색된 결과 또는 전체 게시물 표시 */}
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
                    <div className="p-4 mt-3 rounded" style={{ border: '1px solid #ddd', margin: '5px', borderRadius: '5px' }}>
                        <h6 style={{ color: 'black', textAlign: "left", fontWeight: 'bold' }}>인기 게시물</h6>
                        <ListGroup variant="flush">
                            {popularBoards.map((board, index) => (
                                <ListGroup.Item
                                    key={index}
                                    style={{ cursor: 'pointer', padding: '10px 15px', border: '1px solid #ddd', margin: '5px', borderRadius: '5px' }}
                                    onClick={() => handleBoardClick(board.boardId)}
                                    className="popular-board-item"
                                >
                                    <div style={{ fontWeight: 'bold' }}>{board.boardTitle}</div>
                                    <div><IoEyeSharp style={{ color: "lightgray" }} />{board.boardView}</div>
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
