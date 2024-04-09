import React from 'react';
import { useParams } from 'react-router-dom';
import { StudyHeader } from "./StudyHeader";
import { Col, Container, Row } from "react-bootstrap";
import { StudySideBar } from "./StudySideBar";

function StudyRoom() {
    // Get the card ID from URL parameters
    const { id } = useParams();
    const { title } = useParams();

    return (
        <div className="studyRoom">
            <Container fluid>
                <Row>
                    <Col className="sidebar" md={2}>
                        <div> id={id} </div>
                        <StudySideBar/>
                    </Col>
                    <Col className="mainContent" md={10}>
                        <StudyHeader title={title}/>
                        main
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StudyRoom;
