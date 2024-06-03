// StudyHeader.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useOpenVidu from "./useOpenVidu";
import VideoContainer from "./pages/VideoContainer";
import '../styles/StudyHeader.css';

export const StudyHeader = ({ title, currentPage, setCurrentPage, onDisconnect, id }) => {
    // const {
    //     startCall,
    //     leaveSession,
    //     publisher,
    //     subscribers,
    //     videoRef
    // } = useOpenVidu({ title, id, onDisconnect });

    const handleStartCall = () => {
        setCurrentPage('통화');
        // startCall();
    };

    const handleLeaveSession = () => {
        setCurrentPage('');
        // leaveSession();
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
                            <Nav.Link href="#pricing">그리기</Nav.Link>
                            <Nav.Link href="/mainStudy" onClick={handleLeaveSession}>나가기</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/*<VideoContainer publisher={publisher} subscribers={subscribers} videoRef={videoRef} />*/}
        </div>
    );
};
