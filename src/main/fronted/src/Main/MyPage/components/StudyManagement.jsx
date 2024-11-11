import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";  // 로그인한 사용자 정보를 가져오는 context
import "../myPage.css";

function StudyManagement() {
    const { user } = useContext(UserContext);
    const [studyData, setStudyData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [applications, setApplications] = useState([]);
    const [showApplications, setShowApplications] = useState(false);
    const [currentStudyId, setCurrentStudyId] = useState(null);
    const navigate = useNavigate();

    const fetchUserStudies = async () => {
        try {
            const response = await axios.get(`/api/study/creator?nickname=${user.nickname}`);
            setStudyData(response.data);
        } catch (error) {
            console.error("Error fetching user studies:", error);
        }
    };

    const fetchApplications = async (studyId) => {
        try {
            const response = await axios.get(`/api/study/${studyId}/applications`);
            setApplications(response.data);
            setCurrentStudyId(studyId);
            setShowApplications(true);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await axios.post(`/api/study/${currentStudyId}/applications/${userId}/approve`);
            setApplications(applications.filter(app => app.userId !== userId));
        } catch (error) {
            console.error("Error approving application:", error);
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.post(`/api/study/${currentStudyId}/applications/${userId}/reject`);
            setApplications(applications.filter(app => app.userId !== userId));
        } catch (error) {
            console.error("Error rejecting application:", error);
        }
    };

    useEffect(() => {
        if (user && user.nickname) {
            fetchUserStudies();
        }
    }, [user]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudyData = studyData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                        <th>가입신청 관리</th>
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
                            <td>
                                <button
                                    className="manage-applications-btn"
                                    onClick={() => fetchApplications(study.studyId)}
                                >
                                    가입신청 관리
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

            {showApplications && (
                <div className="applications-modal">
                    <h4>가입 신청 관리</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>사용자 ID</th>
                                <th>상태</th>
                                <th>승인</th>
                                <th>거절</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.userId}>
                                    <td>{app.userId}</td>
                                    <td>{app.status}</td>
                                    <td>
                                        <button onClick={() => handleApprove(app.userId)}>✔️ 승인</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleReject(app.userId)}>❌ 거절</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowApplications(false)}>닫기</button>
                </div>
            )}
        </div>
    );
}

export default StudyManagement;
