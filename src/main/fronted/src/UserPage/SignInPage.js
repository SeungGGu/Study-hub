import React, {useState} from 'react';
import axios from 'axios';
import {Button, Container, Form, Row, Col, Card} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

function SignInPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState(
        {
            id: '',
            password: ''
        });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('입력된 아이디:', credentials.id);
        console.log('입력된 비밀번호:', credentials.password);
        axios.post('/api/loginProc', credentials)
            .then(response => {
                if (response.data === "로그인 실패"){
                    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
                }else {
                    const [name, nickname] = response.data.split('|');
                    sessionStorage.setItem('userId', credentials.id);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('nickname', nickname);
                    console.log('로그인 성공 - 사용자 아이디:', credentials.id)
                    console.log('로그인 성공 - 사용자 이름:', name);
                    console.log('로그인 성공 - 사용자 닉네임:', nickname);
                    navigate("/");
                    // 세션 사용법
                    // const userId = sessionStorage.getItem('userId');
                    // const nickname = sessionStorage.getItem('nickname');
                    // <p>Welcome, {nickname}!</p>
                    // 세션 삭제방법
                    // sessionStorage.removeItem('userId');
                    // sessionStorage.removeItem('nickname');
                    // 조건부 렌더링
                    //  - 로그인 되어있는지 확인
                    //      const isAuthenticated = sessionStorage.getItem('userId') !== null;
                    //{isAuthenticated ? (
                    //     <AuthenticatedApp />
                    // ) : (
                    //     <UnauthenticatedApp />
                    // )}
                    // 페이지를 다르게 렌더링 가능

                }
            })
            .catch(error => {
                console.error('로그인 실패:', error);
                // handle login failure
            });
    };


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
