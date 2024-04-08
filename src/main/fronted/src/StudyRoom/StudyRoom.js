import React from 'react';
import {StudyHeader} from "./StudyHeader";
import {Col, Container, Row} from "react-bootstrap";
import {StudySideBar} from "./StudySideBar";

function StudyRoom() {
    return (
        <div className="studyRoom">
            <Container fluid>
                <Row>
                    <Col className="sidebar" md={2}>
                        <StudySideBar/>
                        side
                    </Col>
                    <Col className="sidebar" md={10}>
                        <StudyHeader/>
                        main
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StudyRoom;
