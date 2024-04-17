import React, {useState} from "react";
import {Container, Row, Col, Form, Button, Card} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './SignUpPage.css'; // Importing custom CSS

function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        nickname: '',
        email: '',
        phone: '',
        gender: '',
        birthDate: ''
    });

    const handleGoLogin = () => {
        navigate('/login');
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDuplicateCheck = (fieldName) => {
        console.log(`Performing duplicate check for ${fieldName}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 여기에서 birthDate를 병합합니다.
        const {birthYear, birthMonth, birthDay} = formData;
        const birthDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

        // birthDate를 제외한 나머지 데이터와 함께 병합된 birthDate를 전송 데이터에 포함
        const submitData = {
            ...formData,
            birthDate
        };

        axios.post("/api/register", submitData)
            .then((response) => {
                console.log("Registration successful:", response.data);
                if (response.data === "success") {
                    handleGoLogin();
                } else {
                    alert(response.data);
                }
                setFormData({
                    id: "",
                    password: "",
                    confirmPassword: "",
                    name: "",
                    nickname: "",
                    email: "",
                    phone: "",
                    gender: "",
                    birthDate: ""
                });
            })
            .catch((error) => {
                console.error("Registration failed:", error);
            });
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({length: 101}, (v, i) => currentYear - i);
    };

    const generateMonths = () => {
        return Array.from({length: 12}, (v, i) => i + 1);
    };

    const generateDays = (year, month) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from({length: daysInMonth}, (v, i) => i + 1);
    };

    return (
        <Container className="signup-container">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col md={6} sm={12}>
                    <Card className="p-4 shadow">
                        <Card.Body>
                            <h2 className="text-center mb-4">회원가입</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formId">
                                    <Form.Label>아이디</Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="text" placeholder="아이디" name="id" value={formData.id}
                                                          onChange={handleChange}/>
                                        </Col>
                                        <Col xs={4}>
                                            <Button variant="outline-primary"
                                                    onClick={() => handleDuplicateCheck('id')}>중복확인</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control type="password" placeholder="비밀번호" name="password"
                                                  value={formData.password}
                                                  onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Label>비밀번호 확인</Form.Label>
                                    <Form.Control type="password" placeholder="비밀번호 확인" name="confirmPassword"
                                                  value={formData.confirmPassword} onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group controlId="formName">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control type="text" placeholder="이름" name="name" value={formData.name}
                                                  onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group controlId="formNickname">
                                    <Form.Label>닉네임</Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control type="text" placeholder="닉네임" name="nickname"
                                                          value={formData.nickname} onChange={handleChange}/>
                                        </Col>
                                        <Col xs={4}>
                                            <Button variant="outline-primary"
                                                    onClick={() => handleDuplicateCheck('nickname')}>중복확인</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control type="email" placeholder="이메일" name="email" value={formData.email}
                                                  onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>휴대폰번호</Form.Label>
                                    <Form.Control type="tel" placeholder="휴대폰번호" name="phone" value={formData.phone}
                                                  onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group controlId="formGender">
                                    <Form.Label>성별</Form.Label>
                                    <Form.Control as="select" name="gender" value={formData.gender}
                                                  onChange={handleChange}>
                                        <option value="">선택...</option>
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formBirthDate">
                                    <Form.Label>생년월일</Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control as="select" name="birthYear" value={formData.birthYear}
                                                          onChange={handleChange}>
                                                <option value="">년</option>
                                                {generateYears().map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control as="select" name="birthMonth" value={formData.birthMonth}
                                                          onChange={handleChange}>
                                                <option value="">월</option>
                                                {generateMonths().map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control as="select" name="birthDay" value={formData.birthDay}
                                                          onChange={handleChange}>
                                                <option value="">일</option>
                                                {generateDays(formData.birthYear, formData.birthMonth).map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="primary" type="submit">회원가입</Button>
                                    <Button variant="secondary" onClick={handleGoLogin} className="ml-2">취소</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default SignUpPage;
