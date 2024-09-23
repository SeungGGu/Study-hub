// StudyHeader.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../styles/StudyHeader.css';

export const StudyHeader = ({title, currentPage, setCurrentPage, disconnect, leaveSession}) => {
    const handleStartCall = () => {
        setCurrentPage('통화');
    };

    const handleStartDraw = () => {
        setCurrentPage('메모');
    };

    const handleLeaveSession = () => {
        // WebSocket과 OpenVidu 세션을 안전하게 종료
        if (disconnect) disconnect();
        if (leaveSession) leaveSession();
        setCurrentPage('자유');
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar-custom">
                <Container fluid>
                    <Navbar.Brand href="#home" className="navbar-brand-custom">
                        # {title} - {currentPage}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto nav-ms-auto">
                            <Nav.Link onClick={handleStartCall}>통화</Nav.Link>
                            <Nav.Link onClick={handleStartDraw}>그리기</Nav.Link>
                            <Nav.Link href="/mainStudy" onClick={handleLeaveSession}>나가기</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};
