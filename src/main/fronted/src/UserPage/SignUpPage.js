import React, {useState} from "react";
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        birthYear: '',
        birthMonth: '',
        birthDay: ''
    });

    const handleGoLogin = () => {
		navigate('/login');
	}

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDuplicateCheck = (fieldName) => {
        // Logic to perform duplicate check for the specified field
        console.log(`Performing duplicate check for ${fieldName}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send form data to backend
        axios.post("/api/register", formData)
            .then((response) => {
                console.log("Registration successful:", response.data);
                if (response.data === "success"){
                    handleGoLogin();
                }else {
                    alert(response.data);
                }
                // Reset form after successful registration if needed
                setFormData({
                    id: "",
                    password: "",
                    confirmPassword: "",
                    name: "",
                    nickname: "",
                    email: "",
                    phone: "",
                    gender: "",
                    birthYear: "",
                    birthMonth: "",
                    birthDay: ""
                })
            })
            .catch((error) => {
                console.error("Registration failed:", error);
            });
    };

    // Function to generate an array of years
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= currentYear - 100; year--) {
            years.push(year);
        }
        return years;
    };

    // Function to generate an array of months
    const generateMonths = () => {
        const months = [];
        for (let month = 1; month <= 12; month++) {
            months.push(month);
        }
        return months;
    };

    // Function to generate an array of days for the selected month and year
    const generateDays = (year, month) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2>회원가입</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formId">
                            <Form.Label>아이디</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control type="text" placeholder="아이디" name="id" value={formData.id}
                                                  onChange={handleChange}/>
                                </Col>
                                <Col>
                                    <Button variant="primary" onClick={() => handleDuplicateCheck('id')}>중복확인</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" placeholder="비밀번호" name="password" value={formData.password}
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
                                <Col>
                                    <Button variant="primary"
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
                            <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
                                <option>남성</option>
                                <option>여성</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBirthDate">
                            <Form.Label>생년월일</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control as="select" name="birthYear" value={formData.birthYear}
                                                  onChange={handleChange}>
                                        <option value="">년</option>
                                        {generateYears().map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" name="birthMonth" value={formData.birthMonth}
                                                  onChange={handleChange}>
                                        <option value="">월</option>
                                        {generateMonths().map((month, index) => (
                                            <option key={index} value={month}>{month}</option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control as="select" name="birthDay" value={formData.birthDay}
                                                  onChange={handleChange}>
                                        <option value="">일</option>
                                        {generateDays(formData.birthYear, formData.birthMonth).map((day, index) => (
                                            <option key={index} value={day}>{day}</option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            가입하기
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default SignUpPage;
