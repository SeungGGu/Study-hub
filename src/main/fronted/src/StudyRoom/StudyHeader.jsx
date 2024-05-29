import React, {useState, useEffect, useRef} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {OpenVidu} from 'openvidu-browser';
import '../styles/StudyHeader.css';

export const StudyHeader = ({title, currentPage, onDisconnect}) => {
    const sessionRef = useRef(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const videoRef = useRef(null);

    const startCall = async () => {
        console.log('통화 시작');

        const sessionTitle = title + '-' + currentPage;
        const requestData = {
            title: sessionTitle
        };

        const OV = new OpenVidu();
        const session = OV.initSession();

        sessionRef.current = session;

        session.on('streamCreated', (event) => {
            console.log('새로운 스트림 생성됨:', event.stream.streamId);
            const newSubscriber = session.subscribe(event.stream, undefined);
            setSubscribers((prevSubscribers) => [...prevSubscribers, newSubscriber]);
        });

        try {
            console.log('세션 생성 요청 중...');
            const response = await fetch('http://localhost:8080/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });
            const sessionId = await response.text();
            console.log('세션 ID:', sessionId);

            console.log('토큰 요청 중...');
            const tokenResponse = await fetch(`http://localhost:8080/api/sessions/${sessionId}/connections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const token = await tokenResponse.text();
            console.log('토큰:', token);

            console.log('세션에 연결 중...');
            await session.connect(token, {clientData: 'User'});
            console.log('세션 연결 성공');

            // Publish local stream after subscribing to existing streams
            console.log('퍼블리셔 초기화 중...');
            const newPublisher = OV.initPublisher(videoRef.current, {
                audioSource: true,
                videoSource: true,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            newPublisher.on('accessAllowed', () => {
                console.log('카메라와 마이크 접근 허용됨');
            });

            newPublisher.on('accessDenied', (error) => {
                console.error('카메라와 마이크 접근 거부됨:', error);
            });

            console.log('세션에 퍼블리셔 등록 중...');
            session.publish(newPublisher);
            setPublisher(newPublisher);
            console.log('퍼블리셔 등록 완료');

            // 구독 가능한 모든 스트림 구독
            console.log('기존 스트림 : ', session.streamManagers);
            console.log('기존 스트림 구독 시작');
            session.streamManagers.forEach((streamManager) => {
                if (streamManager.stream) {
                    console.log('기존 스트림 구독:', streamManager.stream.streamId);
                    const newSubscriber = session.subscribe(streamManager.stream, undefined);
                    setSubscribers((prevSubscribers) => [...prevSubscribers, newSubscriber]);
                }
            });

            console.log('기존 스트림 구독 완료');

        } catch (error) {
            console.error('통화 시작 오류:', error);
        }
    };

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            leaveSession();
        };
    }, []);

    const leaveSession = () => {
        console.log('세션 종료');
        const session = sessionRef.current;
        if (session) {
            session.disconnect();
            console.log('세션 연결 해제');
        }
        if (publisher) {
            publisher.stream.dispose();
            console.log('퍼블리셔 스트림 해제');
        }
        setPublisher(null);
        setSubscribers([]);
        if (onDisconnect) onDisconnect();
        console.log('세션 초기화 완료');
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
                            <Nav.Link onClick={startCall}>통화</Nav.Link>
                            <Nav.Link href="#pricing">그리기</Nav.Link>
                            <Nav.Link href="/mainStudy" onClick={leaveSession}>나가기</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="video-container" ref={videoRef}>
                {publisher && publisher.stream ? (
                    <video
                        ref={(video) => {
                            if (video) {
                                video.srcObject = publisher.stream.mediaStream;
                            }
                        }}
                        autoPlay
                        playsInline
                        className="publisher-video"
                    />
                ) : (
                    <p>Waiting for camera access...</p>
                )}
                {subscribers.map((subscriber, index) => (
                    <video
                        key={index}
                        ref={(video) => {
                            if (video) {
                                video.srcObject = subscriber.stream.mediaStream;
                            }
                        }}
                        autoPlay
                        playsInline
                        className="subscriber-video"
                    />
                ))}
            </div>
        </div>
    );
};
