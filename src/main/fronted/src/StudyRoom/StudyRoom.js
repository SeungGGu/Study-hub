// StudyRoom.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './studyRoomCss/StudyRoom.css';
import {StudyHeader} from "./StudyHeader";
import {NavigationSidebar} from "./NavigationSidebar"; // Import CSS file for custom styling

const StudyRoom = () => {
    return (
        <div className="study-room">
            <StudyHeader/>
            <Container fluid className="content-wrapper">
                <Row>
                    <Col sm={2} className="sidebar-col">
                        <NavigationSidebar/>
                    </Col>
                    <Col sm={10} className="main-content">
                        {/* Main content goes here */}
                        <h2>Main Content</h2>
                        <p>This is the main content area.</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StudyRoom;
