import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useParams } from "react-router-dom";
import '../styles/StudyHeader.css';  // CSS 파일 임포트

export const StudyHeader = ({ currentPage }) => {
    const { title } = useParams();

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar-custom">
            <Container fluid>
                <Navbar.Brand href="#home" className="navbar-brand-custom"> # {title} - {currentPage}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto nav-ms-auto">
                        <Nav.Link href="#features">통화</Nav.Link>
                        <Nav.Link href="#pricing">그리기</Nav.Link>
                        <Nav.Link href="#deets">고정</Nav.Link>
                        <Nav.Link href="#memes">사용자</Nav.Link>
                        <Nav.Link href="/mainStudy">나가기</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
