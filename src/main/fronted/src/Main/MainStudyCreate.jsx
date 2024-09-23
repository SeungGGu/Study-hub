import React, {useState} from "react";
import {MainHeader} from "./include/MainHeader";
import {MainFooter} from "./include/MainFooter";
import {Form, Button, Col, Row, Badge} from "react-bootstrap";
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', selectedImage);

        const studyData = {
            studyTitle,
            studyCreateDate,
            studyLastDate,
            pwStatus,
            studyPw,
            studyComment
        };
        console.log("스터디 데이터:", studyData);

        axios.post('/api/study/upload', formData)
            .then(response => {
                // 서버에서 반환한 파일 경로를 받아와서 저장
                const imagePath = response.data.imagePath;
                console.log("업로드 성공 : " + imagePath);

                // imagePath를 studyData에 추가
                studyData.studyTitlePicture = imagePath;
                studyData.studyCreator = nickname;

                // studyData를 서버로 전송
                axios.post('/api/study/edit', studyData)
                    .then(response => {
                        if (response.data === "스터디 생성 실패") {
                            alert("생성되지 않았습니다 다시 생성해주세요");
                        } else {
                            navigate("/mainStudy");
                            console.log("성공했네요");
                        }
                    }).catch(error => {
                    console.error('스터디 생성 에러메세지', error);
                    // handle login failure
                });
            })
            .catch(error => {
                console.error('사진 에러메세지', error);
            });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // 파일이 선택되지 않은 경우 또는 이미지 파일이 아닌 경우
        if (!file || !file.type.match("image.*")) {
            alert("이미지 파일이 아닙니다. 다시 선택해주세요");
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
            <div className="container mt-5">
                <h5>스터디 작성 페이지</h5>
                <hr className="featurette-divider"/>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={6} md={3}> {/* 왼쪽 부분 */}
                            <Form.Group controlId="fileUpload">
                                <div>
                                    {selectedImage ? (
                                        <img
                                            src={URL.createObjectURL(selectedImage)}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    ) : (
                                        <img
                                            src="/images/studyHub.png" // 파일이 선택되지 않은 경우 기본 이미지 표시
                                            alt="Default"
                                            className="image-preview"
                                        />
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={9}> {/* 오른쪽 부분 */}
                            <Form.Group controlId="fileUpload">
                                <Form.Label>사진 등록 : 700 X 400 크기로 등록하세요</Form.Label>
                                <div className="d-flex">
                                    <Form.Control type="file" onChange={handleFileChange}/>
                                </div>
                            </Form.Group>
                            <Form.Group controlId="studyTitle">
                                <Form.Label>스터디 제목</Form.Label>
                                <Form.Control
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
                                <Form.Label>스터디 내용</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={studyComment}
                                    onChange={(e) => setStudyContent(e.target.value)}
                                    placeholder="스터디 내용을 입력하세요."
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="startDate">
                                <Form.Label>시작 날짜</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={studyCreateDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="endDate">
                                <Form.Label>종료 날짜</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={studyLastDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="passwordProtected">
                            <Row>
                                <Col>
                                    <Form.Label>비밀방</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Check
                                        type="switch"
                                        checked={pwStatus}
                                        onChange={(e) => setPasswordProtected(e.target.checked)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        {pwStatus && (
                            <Form.Group controlId="password">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={studyPw}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        )}
                    </Row>
                    <Button variant="primary" type="submit">
                        만들기
                    </Button>
                </Form>
            </div>
            <hr className="featurette-divider"/>
            <MainFooter/>
        </div>
    );
}

export default MainStudyCreate;
