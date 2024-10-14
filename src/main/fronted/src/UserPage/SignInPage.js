import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button, Container, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext"; // UserContext 가져오기

function SignInPage() {
    const { updateUser } = useContext(UserContext); // setUser 대신 updateUser 가져오기
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        id: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/user/loginProc', credentials)
            .then(response => {
                if (response.data === "로그인 실패") {
                    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
                } else {
                    const [name, nickname, email] = response.data.split('|');
                    const userData = {
                        id: credentials.id,
                        name,
                        nickname,
                        email,  // 로그인 시 이메일 추가
                    };

                    sessionStorage.setItem('userId', credentials.id);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('nickname', nickname);
                    sessionStorage.setItem('email', email);  // 이메일 세션 저장

                    // UserContext를 통해 로그인된 유저 정보 업데이트
                    updateUser(userData);

                    console.log('로그인 성공 - 사용자 아이디:', credentials.id);
                    console.log('로그인 성공 - 사용자 이름:', name);
                    console.log('로그인 성공 - 사용자 닉네임:', nickname);
                    console.log('로그인 성공 - 사용자 이메일:', email);

                    navigate("/");
                }
            })
            .catch(error => {
                console.error('로그인 실패:', error);
            });
    };

    // 경로 이동을 처리하는 함수 정의
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Container fluid="md">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={8} md={6} lg={5} xl={4}>
                    <Card className="p-4 shadow">
                        <Card.Body>
                            <h2 className="text-center mb-4">로그인</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>아이디</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="아이디 입력"
                                        name="id"
                                        value={credentials.id}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호 입력"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" size="lg">
                                        로그인
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleNavigate('/register')} size="lg">
                                        회원가입
                                    </Button>
                                    <Button variant="link" onClick={() => handleNavigate('/find-account')}>
                                        아이디/비밀번호 찾기
                                    </Button>
                                    <Button variant="warning" onClick={() => console.log('카카오 로그인')} size="lg">
                                        카카오 로그인
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SignInPage;
