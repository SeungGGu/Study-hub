import React, {useEffect, useState} from 'react';
import '../styles/CustomStyles.css';
import {useParams} from 'react-router-dom';
import {StudyHeader} from "./StudyHeader";
import {Col, Container, Row} from "react-bootstrap";
import {StudySideBar} from "./StudySideBar";
import Mission from './pages/Mission';
import TodayRunner from "./pages/TodayRunner";
import Calendar from "./pages/Calendar";
import Canvas from "./pages/Canvas";

function StudyRoom() {
    const {id, title} = useParams();
    const [currentPage, setCurrentPage] = useState("Home");
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // WebSocket 연결 설정
        const ws = new WebSocket('ws://localhost:8080'); // WebSocket 서버 주소에 맞게 변경

        ws.onopen = () => {
            console.log('WebSocket 연결 성공');
        };

        ws.onmessage = (event) => {
            // 새로운 메시지를 받았을 때 상태 업데이트
            const newMessage = JSON.parse(event.data);
            setMessages([...messages, newMessage]);
        };

        ws.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        return () => {
            // 컴포넌트 언마운트 시 WebSocket 연결 종료
            ws.close();
        };
    }, [messages]); // messages 상태가 변경될 때마다 useEffect 실행

    const sendMessage = () => {
        // 메시지 전송
        // 예: WebSocket을 통해 서버로 메시지 전송
    };

    // 내용을 렌더링하는 함수
    const renderContent = () => {
        switch (currentPage) {
            case '미션':
                return <Mission/>;
            case 'Today Runner':
                return <TodayRunner/>;
            case '캘린더':
                return <Calendar/>;
            case '캔버스':
                return <Canvas/>;
            default:
                // 기본 메시지 목록
                return (
                    <div className="content-area">
                        <ul className="message-list">
                            {/* 임시 메시지 예시 */}
                            <li className="message">
                                <img src="profile-placeholder.png" alt="profile" className="profile-pic"/>
                                <div className="message-info">
                                    <div className="message-top">
                                        <span className="nickname">사용자123</span>
                                        <span className="timestamp">12:35 PM</span>
                                    </div>
                                    <div className="message-text">안녕하세요! 오늘의 학습 목표는 무엇인가요?</div>
                                </div>
                            </li>
                            <li className="message">
                                <img src="profile-placeholder.png" alt="profile" className="profile-pic"/>
                                <div className="message-info">
                                    <div className="message-top">
                                        <span className="nickname">사용자123</span>
                                        <span className="timestamp">12:34 PM</span>
                                    </div>
                                    <div className="message-text">안녕하세요! 오늘의 학습 목표는 무엇인가요?</div>
                                </div>
                            </li>
                        </ul>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                className="chat-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="메시지 입력..."
                            />
                            <button onClick={() => setInputValue('')}>전송</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="studyRoom">
            <Container fluid className="custom-container">
                <Row className="no-gutters">
                    <Col className="sidebar" md={2}>
                        <StudySideBar title={title} onChannelSelect={setCurrentPage}/>
                    </Col>
                    <Col className="mainContent" md={10}>
                        <StudyHeader title={title} currentPage={currentPage}/>
                        {renderContent()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StudyRoom;
