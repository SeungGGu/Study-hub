import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css'; // Import custom CSS for styling
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function EditProfile() {
    const { user, updateUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        id: user.id || '',  // 아이디 필드 추가
        name: user.name || '',
        nickname: user.nickname || '',
        password: '',
        confirmPassword: '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthYear: user.birthDate?.split('-')[0] || '',
        birthMonth: user.birthDate?.split('-')[1] || '',
        birthDay: user.birthDate?.split('-')[2] || ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('userId');
        if (!storedUserId) {
            // Redirect to login if no userId is found in sessionStorage
            navigate('/login');
        } else {
            // Fetch the user data from the server
            axios.get(`/api/user/${storedUserId}`)
                .then((response) => {
                    const userData = response.data;
                    setFormData({
                        id: userData.id,  // 서버에서 받아온 id 값 추가
                        name: userData.name,
                        nickname: userData.nickname,
                        email: userData.email,
                        phone: userData.phone,
                        gender: userData.gender,
                        birthYear: userData.birthDate?.split('-')[0],
                        birthMonth: userData.birthDate?.split('-')[1],
                        birthDay: userData.birthDate?.split('-')[2]
                    });
                })
                .catch((error) => {
                    console.error("Error fetching user data", error);
                });
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const userId = sessionStorage.getItem('userId');
        const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;

        const updatedData = {
            name: formData.name,
            nickname: formData.nickname,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            birthDate: birthDate,
            password: formData.password // 비밀번호는 변경할 때만 전송
        };

        axios.put(`/api/user/${userId}`, updatedData)
            .then((response) => {
                alert("회원 정보가 성공적으로 수정되었습니다.");
                // 수정된 정보를 UserContext에 반영
                updateUser(response.data);
                navigate('/myPage');
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    alert("사용자를 찾을 수 없습니다.");
                } else {
                    alert("회원 정보 수정 중 오류가 발생했습니다.");
                }
                console.error("Error updating profile", error);
            });
    };

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 101 }, (v, i) => currentYear - i);
    };

    const generateMonths = () => {
        return Array.from({ length: 12 }, (v, i) => i + 1).map((month) => month.toString().padStart(2, '0'));
    };

    const generateDays = (year, month) => {
        if (!year || !month) return []; // year, month 값이 없을 때 빈 배열 반환
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from({ length: daysInMonth }, (v, i) => (i + 1).toString().padStart(2, '0'));
    };

    return (
        <Container className="edit-profile-container">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col md={6} sm={12}>
                    <Card className="p-4 shadow edit-profile-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">회원정보 수정</h2>
                            <Form onSubmit={handleSubmit} className="edit-profile-form">
                                <Form.Group>
                                    <Form.Label>아이디</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="아이디"
                                        name="id"
                                        value={formData.id} // 아이디 필드에 값 설정
                                        disabled // 아이디 필드를 수정할 수 없도록 설정
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="새 비밀번호"
                                        name="password"
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>비밀번호 확인</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호 확인"
                                        name="confirmPassword"
                                        value={formData.confirmPassword || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formName">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이름"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>닉네임</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="닉네임"
                                        name="nickname"
                                        value={formData.nickname || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="이메일"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>휴대폰 번호</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="휴대폰 번호"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>성별</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">선택...</option>
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>생년월일</Form.Label>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                id="formBirthYear"
                                                as="select"
                                                name="birthYear"
                                                value={formData.birthYear || ''}
                                                onChange={handleChange}>
                                                <option value="">년</option>
                                                {generateYears().map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                id="formBirthMonth"
                                                as="select"
                                                name="birthMonth"
                                                value={formData.birthMonth || ''}
                                                onChange={handleChange}>
                                                <option value="">월</option>
                                                {generateMonths().map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                id="formBirthDay"
                                                as="select"
                                                name="birthDay"
                                                value={formData.birthDay || ''}
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
                                    <Button variant="primary" type="submit">
                                        저장
                                    </Button>
                                    <Button variant="secondary" onClick={() => navigate('/mypage')} className="ml-2">
                                        취소
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

export default EditProfile;
