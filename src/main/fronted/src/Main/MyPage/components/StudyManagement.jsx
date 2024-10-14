import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";  // 로그인한 사용자 정보를 가져오는 context
import "../myPage.css";

function StudyManagement() {
    const { user } = useContext(UserContext);  // UserContext에서 사용자 정보 가져오기
    const [studyData, setStudyData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;  // 한 페이지에 표시할 스터디 개수
    const navigate = useNavigate();

    // 스터디 데이터 가져오는 함수
    const fetchUserStudies = async () => {
        try {
            // 동적으로 로그인된 사용자의 닉네임을 사용
            const response = await axios.get(`/api/study/cardView?nickname=${user.nickname}`);
            setStudyData(response.data);
        } catch (error) {
            console.error("Error fetching user studies:", error);
        }
    };

    useEffect(() => {
        if (user && user.nickname) {
            fetchUserStudies();
        }
    }, [user]);

    // 페이지에 맞는 스터디 데이터 가져오기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudyData = studyData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 함수
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 삭제 버튼 클릭 시 실행되는 함수
    const handleDeleteStudy = async (studyId) => {
        const userConfirmed = window.confirm("정말 삭제 하겠습니까?");
        if (userConfirmed) {
            try {
                await axios.delete(`/api/study/${studyId}`);
                setStudyData(studyData.filter(study => study.studyId !== studyId));
                console.log("스터디가 성공적으로 삭제되었습니다.");
            } catch (error) {
                console.error("스터디 삭제 중 오류 발생:", error);
            }
        }
    };

    // 조회 버튼 클릭 시 실행되는 함수
    const handleViewStudy = (studyId, studyTitle) => {
        navigate(`/studyRoom/${studyId}/${studyTitle}`);
    };

    return (
        <div className="record-section">
            <h3>내 스터디 관리</h3>
            <table className="study-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>스터디 제목</th>
                    <th>스터디 설명</th>
                    <th>생성일</th>
                    <th>마지막 수정일</th>
                    <th>조회하기</th>
                    <th>삭제하기</th>
                </tr>
                </thead>
                <tbody>
                {currentStudyData.map((study, index) => (
                    <tr key={study.studyId}>
                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                        <td>{study.studyTitle}</td>
                        <td>{study.studyComment}</td>
                        <td>{study.studyCreateDate}</td>
                        <td>{study.studyLastDate}</td>
                        <td>
                            <button
                                className="view-btn"
                                onClick={() => handleViewStudy(study.studyId, study.studyTitle)}
                            >
                                🔍 조회
                            </button>
                        </td>
                        <td>
                            <button
                                className="delete-btn"
                                onClick={() => handleDeleteStudy(study.studyId)}
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
                {Array.from({ length: Math.ceil(studyData.length / itemsPerPage) }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => paginate(idx + 1)}
                        className={idx + 1 === currentPage ? 'active' : ''}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default StudyManagement;
