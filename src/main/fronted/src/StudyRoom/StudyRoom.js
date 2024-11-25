import React, {useState, useCallback, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useWebSocket from './useWebSocket';
import '../styles/CustomStyles.css';
import {StudyHeader} from './StudyHeader';
import {Col, Container, Row} from 'react-bootstrap';
import {StudySideBar} from './StudySideBar';
import Calendar from './pages/Calendar';
import Canvas from './pages/Canvas';
import DrawCanvas from "./pages/DrawCanvas";
import VideoContainer from "./pages/VideoContainer";
import useOpenVidu from "./useOpenVidu";
import {UserOctagon} from "iconsax-react";

function StudyRoom() {
    const nickname = sessionStorage.getItem('nickname');
    const {id, title} = useParams();
    const [currentPage, setCurrentPage] = useState('자유');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [callStarted, setCallStarted] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth > 992);

    const handleNewMessage = useCallback((message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    }, []);

    const {disconnect, sendMessage, connected} = useWebSocket('/ws', handleNewMessage);

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (inputValue) {
            const chatMessage = {
                studyId: id,
                roomId: currentPage,
                userId: nickname,
                message: inputValue,
                timestamp: new Date().toISOString()
            };
            sendMessage('/app/chat.sendMessage', chatMessage);
            setInputValue('');
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log("fetch시작");
                const response = await fetch(`/api/messages?studyId=${id}&roomId=${currentPage}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError('Response is not JSON');
                }
                const data = await response.json();
                setMessages(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [id, currentPage]);

    const filteredMessages = messages.filter(msg => msg.studyId === id && msg.roomId === currentPage);

    const {
        OV,
        startCall,
        leaveSession,
        publisher,
        subscribers,
        videoRef,
        sessionRef,
        setPublisher,
    } = useOpenVidu({title, id, onDisconnect: disconnect});

    useEffect(() => {
        if (currentPage === '통화' && !callStarted) {
            startCall();
            setCallStarted(true);
        } else if (currentPage !== '통화' && callStarted) {
            leaveSession();
            setCallStarted(false);
        }
    }, [currentPage, startCall, leaveSession, callStarted]);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const renderContent = () => {
        switch (currentPage) {
            case '캘린더':
                sessionStorage.setItem('studyId', title);
                return <Calendar/>;
            case '캔버스':
                sessionStorage.setItem('studyId', title);
                return <Canvas
                    id={id}
                    setCurrentPage={setCurrentPage}
                />;
            case '메모' :
                return <DrawCanvas
                    id={id}
                    setCurrentPage={setCurrentPage}
                />;
            case '통화':
                return <VideoContainer
                    publisher={publisher}
                    subscribers={subscribers}
                    videoRef={videoRef}
                    leaveSession={leaveSession}
                    sessionRef={sessionRef}
                    OV={OV}
                    setPublisher={setPublisher}
                />;
            default:
                return (
                    <div className="content-area">
                        <ul className="message-list">
                            {filteredMessages.slice().reverse().map((msg, index) => (
                                <li className={`message ${msg.userId === nickname ? 'my-message' : 'other-message'}`} key={index}>
                                    <div className="toast-message">
                                        <div className="toast-header">
                                            <UserOctagon size="60" className="profile-pic" color="#2ccce4" variant="Bold"/>
                                            <strong className="nickname">{msg.userId}</strong>
                                            <small className="timestamp">{new Date(msg.timestamp).toLocaleString()}</small>
                                        </div>
                                        <div className="toast-body">
                                            {msg.message}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="chat-input-container">
                            <form onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    className="chat-input"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="메시지 입력..."
                                />
                                <button type="submit">전송</button>
                            </form>
                        </div>
                        {!connected && <div className="connection-status">연결 중...</div>}
                    </div>
                );
        }
    };

    return (
        <div className="studyRoom">
            <Container fluid className="custom-container">
                <Row className="no-gutters">
                    <Col className={`sidebar ${sidebarVisible ? 'show' : ''}`} md={2}>
                        <StudySideBar title={title} onChannelSelect={setCurrentPage}/>
                    </Col>
                    <Col className="mainContent" md={10}>
                        <StudyHeader
                            title={title}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            disconnect={disconnect}
                            leaveSession={leaveSession}
                            onToggleSidebar={toggleSidebar}
                        />
                        {renderContent()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StudyRoom;
