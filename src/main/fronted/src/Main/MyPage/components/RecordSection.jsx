import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Axios로 API 호출
import '../myPage.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext'; // 사용자 정보를 위한 컨텍스트 추가

function RecordSection() {
    // 탭 상태를 관리하기 위한 state 추가
    const [activeTab, setActiveTab] = useState('board');
    const [boardData, setBoardData] = useState([]);
    const [commentData, setCommentData] = useState([]); // 댓글 데이터
    const { user } = useContext(UserContext); // 로그인한 사용자 정보 가져오기
    const navigate = useNavigate();  // useNavigate 훅 사용

    // 페이지 네비게이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;


    // 날짜 포맷을 사람이 보기 쉽게 변환하는 함수
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('ko-KR', options); // 한국식 날짜 및 시간 포맷
    };

    // 게시글 데이터 가져오는 함수
    const fetchUserBoards = async () => {
        try {
            const response = await axios.get(`/api/boards?userNickname=${user.nickname}`);
            setBoardData(response.data);
        } catch (error) {
            console.error('Error fetching user boards:', error);
        }
    };

    // 댓글 데이터 가져오는 함수
    const fetchUserComments = async () => {
        try {
            const response = await axios.get(`/api/comments/user/${user.nickname}`);
            setCommentData(response.data);
        } catch (error) {
            console.error('Error fetching user comments:', error);
        }
    };

    useEffect(() => {
        // 사용자가 로그인한 상태일 때 게시글과 댓글 데이터를 불러옴
        if (user && user.nickname) {
            fetchUserBoards();
            fetchUserComments();
        }
    }, [user]);

    // 페이지에 맞는 게시글 데이터 가져오기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBoardData = boardData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지에 맞는 댓글 데이터 가져오기
    const currentCommentData = commentData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 페이지 번호 생성
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(activeTab === 'board' ? boardData.length / itemsPerPage : commentData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // 삭제 버튼 클릭 시 실행되는 함수
    const handleDeleteComment = async (commentId) => {
        const userConfirmed = window.confirm("정말 삭제 하겠습니까?");

        if (userConfirmed) { // 사용자가 확인을 눌렀을 때만 삭제 진행
            try {
                await axios.delete(`/api/comments/${commentId}`); // 댓글 삭제 API 호출
                setCommentData(commentData.filter(comment => comment.commentId !== commentId)); // 삭제 후 화면에서 제거
                console.log('댓글이 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('댓글 삭제 중 오류 발생:', error);
            }
        }
    };

    // 확인 버튼 클릭 시 게시글로 이동하는 함수
    const handleViewPost = (boardId) => {
        navigate(`/boards/${boardId}`); // 해당 게시물로 이동
    };


    // 게시글 삭제 버튼 클릭 시 실행되는 함수
    const handleDeleteBoard = async (boardId) => {
        const userConfirmed = window.confirm("정말 삭제 하겠습니까?");

        if (userConfirmed) { // 사용자가 확인을 눌렀을 때만 삭제 진행
            try {
                await axios.delete(`/api/boards/${boardId}`); // 게시글 삭제 API 호출
                setBoardData(boardData.filter(board => board.boardId !== boardId)); // 삭제 후 화면에서 제거
                console.log('게시글이 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('게시글 삭제 중 오류 발생:', error);
            }
        }
    };

    // 게시글 조회 버튼 클릭 시 게시글 상세 페이지로 이동하는 함수
    const handleViewBoard = (boardId) => {
        navigate(`/boards/${boardId}`); // 해당 게시물로 이동
    };

    return (
        <div className="record-section">
            <div className="record-tabs">
                <button
                    className={`record-tab ${activeTab === 'board' ? 'active' : ''}`}
                    onClick={() => setActiveTab('board')}
                >
                    게시글
                </button>
                <button
                    className={`record-tab ${activeTab === 'comment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comment')}
                >
                    댓글
                </button>
            </div>

            {/* 게시글 탭 선택 시 */}
            {activeTab === 'board' && (
                <>
                    <h3>내 게시글</h3>
                    <table className="board-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>제목</th>
                            <th>카테고리</th>
                            <th>설명</th>
                            <th>조회수</th>
                            <th>조회하기</th>
                            <th>삭제하기</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentBoardData.map((board, index) => (
                            <tr key={board.boardId}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td>{board.boardTitle}</td>
                                <td><span className="mypage-tag">{board.boardCategory}</span></td>
                                <td>{board.boardDetail}</td>
                                <td>{board.boardView}</td>
                                <td>
                                    <button
                                        className="view-board-btn"
                                        onClick={() => handleViewBoard(board.boardId)} // 게시물로 이동
                                    >
                                        🔍 조회
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteBoard(board.boardId)} // 게시물 삭제
                                    >
                                        ❌ 삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 페이지 네비게이션 */}
                    <div className="pagination">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={number === currentPage ? 'active' : ''}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* 댓글 탭 선택 시 */}
            {activeTab === 'comment' && (
                <>
                    <h3>내 댓글</h3>
                    <table className="comment-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>게시글 제목</th>
                            <th>댓글 내용</th>
                            <th>작성일</th>
                            <th>확인</th>
                            <th>삭제</th>
                        </tr>
                        </thead>
                        <tbody>
                        {commentData.map((comment, index) => (
                            <tr key={comment.commentId}>
                                <td>{index + 1}</td>
                                <td>{comment.boardTitle}</td>
                                <td>{comment.commentText}</td>
                                <td>{formatDate(comment.createdDate)}</td>
                                {/* 날짜를 포맷팅해서 표시 */}
                                <td>
                                    <button
                                        className="view-post-btn"
                                        onClick={() => handleViewPost(comment.boardId)} // 게시물로 이동
                                    >
                                        🔍 조회
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteComment(comment.commentId)}
                                    >
                                        ❌ 삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 페이지 네비게이션 */}
                    <div className="pagination">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={number === currentPage ? 'active' : ''}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default RecordSection;
