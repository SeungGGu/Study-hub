import React, { useState } from 'react';
import '../myPage.css';

function RecordSection() {
    // 탭 상태를 관리하기 위한 state 추가
    const [activeTab, setActiveTab] = useState('board');

    // 게시글 데이터 (임시)
    const [boardData, setBoardData] = useState([
        // 여기에 더 많은 데이터를 추가하면 페이지당 20개씩 보여줄 수 있음.
        { boardId: 1, boardCategory: 'test1', boardTitle: '제목칸', boardDetail: '설명란입니다', boardView: 1 },
        { boardId: 2, boardCategory: 'test2', boardTitle: 'Test Title입니다', boardDetail: 'test 설명란입니다.', boardView: 0 },
        { boardId: 3, boardCategory: 'test3', boardTitle: 'boardTest입니다', boardDetail: 'test로 적어봤습니다.', boardView: 0 },
        { boardId: 4, boardCategory: 'test4', boardTitle: 'boardTest입니다', boardDetail: 'test로 적어봤습니다.', boardView: 0 },
        // 총 데이터가 40개를 넘도록 임시 데이터 추가
        // 필요한 만큼 데이터를 추가하세요.
    ]);

    // 댓글 데이터 (임시)
    const [commentData, setCommentData] = useState([
        { commentId: 1, boardTitle: 'Test Title입니다', commentText: 'ㅇㅇㅇ', createdDate: '2024-10-07 19:45:58'},
        { commentId: 2, boardTitle: 'Test Title입니다', commentText: 'test로 댓글을 달아봤습니다', createdDate: '2024-10-10 13:35:18' }
    ]);

    // 현재 페이지 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // 페이지에 맞는 게시글 데이터 가져오기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBoardData = boardData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지에 맞는 댓글 데이터 가져오기
    const currentCommentData = commentData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 페이지 번호 생성 (예: 1, 2, 3 ...)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(boardData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                            <th>카테고리</th>
                            <th>제목</th>
                            <th>설명</th>
                            <th>조회수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentBoardData.map((board, index) => (
                            <tr key={board.boardId}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td><span className="mypage-tag">{board.boardCategory}</span></td>
                                <td>{board.boardTitle}</td>
                                <td>{board.boardDetail}</td>
                                <td>{board.boardView}</td>
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
                        {currentCommentData.map((comment, index) => (
                            <tr key={comment.commentId}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td>{comment.boardTitle}</td>
                                <td>{comment.commentText}</td>
                                <td>{comment.createdDate}</td>
                                <td>🔴</td>
                                <td>❌</td>
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
