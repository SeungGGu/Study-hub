import React, {useState} from "react";
import {MainHeader} from "./include/MainHeader";
import {MainFooter} from "./include/MainFooter";
import {Form, Button, Col, Row} from "react-bootstrap";
import "../styles/MainStudyCreate.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function MainStudyCreate() {
    const navigate = useNavigate();
    const [studyTitle, setStudyTitle] = useState("");
    const [studyCreateDate, setStartDate] = useState("");
    const [studyLastDate, setEndDate] = useState("");
    const [pwStatus, setPasswordProtected] = useState(true);
    const [studyPw, setPassword] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // 추가: 선택한 이미지 파일 상태
    const [studyComment, setStudyContent] = useState(""); // 추가: 스터디 내용 입력 값
    const nickname = sessionStorage.getItem('nickname');
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imagePath = "Study_Room_.png"; // 기본 이미지 경로 설정

            // 선택한 이미지가 있으면 업로드 진행
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);

                const uploadResponse = await axios.post('/api/study/upload', formData);
                imagePath = uploadResponse.data.imagePath; // 업로드된 이미지 경로
            }

            // 이미지 경로 포함한 스터디 데이터 생성
            const studyData = {
                studyTitle,
                studyCreateDate,
                studyLastDate,
                pwStatus,
                studyPw,
                studyComment,
                studyTitlePicture: imagePath, // 이미지 경로 설정
                studyCreator: nickname,      // 사용자 닉네임 추가
            };

            // 스터디 데이터 전송
            const response = await axios.post('/api/study/edit', studyData);
            if (response.data === "스터디 생성 실패") {
                alert("스터디 생성에 실패했습니다. 다시 시도해주세요.");
            } else {
                console.log("스터디 생성 성공");
                navigate("/mainStudy"); // 메인 스터디 페이지로 이동
            }
        } catch (error) {
            console.error("스터디 생성 중 에러:", error);
            alert("스터디 생성 중 오류가 발생했습니다.");
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // 파일이 선택되지 않은 경우 또는 이미지 파일이 아닌 경우
        if (!file || !file.type.match("image.*")) {
            alert("이미지 파일이 아닙니다. 다시 선택해주세요");
            setSelectedImage(null); // 이미지가 선택되지 않은 경우
            return;
        }
        // 이미지를 리사이징하여 300x170 크기로 만듭니다.
        resizeImage(file, 300, 170, (resizedImage) => {
            setSelectedImage(resizedImage);
        });
    };

    const resizeImage = (file, maxWidth, maxHeight, callback) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, {
                        type: "image/jpeg",
                        lastModified: Date.now()
                    });
                    callback(resizedFile);
                }, "image/jpeg");
            };
        };
        reader.readAsDataURL(file);
    };
    return (
        <div className="MainStudyCreate">
            <MainHeader/>
            <div className="main-study-container mt-5">
                <h5 className="main-study-title">Make Study Room</h5>
                <hr className="main-study-divider"/>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={6} md={3}> {/* 왼쪽 부분 */}
                            <Form.Group controlId="fileUpload">
                                <div className="image-preview-container">
                                    {selectedImage ? (
                                        <img
                                            src={URL.createObjectURL(selectedImage)}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    ) : (
                                        <img
                                            src="/images/Study_Room_.png"
                                            alt="Default"
                                            className="image-preview"
                                        />
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={9}> {/* 오른쪽 부분 */}
                            <Form.Group controlId="fileUpload">
                                <Form.Label className="main-study-label"></Form.Label>
                                <div className="d-flex">
                                    <Form.Control className="main-study-input" type="file" onChange={handleFileChange}/>
                                </div>
                            </Form.Group>
                            <Form.Group controlId="studyTitle">
                                <Form.Label className="main-study-label">스터디 제목</Form.Label>
                                <Form.Control
                                    className="main-study-input"
                                    type="text"
                                    value={studyTitle}
                                    onChange={(e) => setStudyTitle(e.target.value)}
                                    placeholder="스터디 제목을 입력하세요."
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Row>
                            <Form.Group controlId="studyContent">
                                <Form.Label className="main-study-label">스터디 내용</Form.Label>
                                <Form.Control
                                    className="main-study-input"
                                    as="textarea"
                                    rows={3}
                                    value={studyComment}
                                    onChange={(e) => setStudyContent(e.target.value)}
                                    placeholder="스터디 내용을 입력하세요."
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="startDate">
                                <Form.Label className="main-study-label">시작 날짜</Form.Label>
                                <Form.Control
                                    className="main-study-input"
                                    type="date"
                                    value={studyCreateDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="endDate">
                                <Form.Label className="main-study-label">종료 날짜</Form.Label>
                                <Form.Control
                                    className="main-study-input"
                                    type="date"
                                    value={studyLastDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="passwordProtected" className="password-switch-container mt-4">
                            <Row className="align-items-center">
                                <Col xs="auto">
                                    <Form.Label className="main-study-label mb-0">비밀번호 사용</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Check
                                        className="main-study-switch form-switch"
                                        type="switch"
                                        checked={pwStatus}
                                        onChange={(e) => setPasswordProtected(e.target.checked)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        {pwStatus && (
                            <Form.Group controlId="password">
                                <Form.Label className="main-study-label">비밀번호</Form.Label>
                                <Form.Control
                                    className="main-study-input"
                                    type="password"
                                    value={studyPw}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        )}
                    </Row>
                    <Button className="main-study-submit-btn" type="submit">
                        만들기
                    </Button>
                </Form>
            </div>
            <hr className="main-study-divider"/>
        </div>
    );
}

export default MainStudyCreate;
