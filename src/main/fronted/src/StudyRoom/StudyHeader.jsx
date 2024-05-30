import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { OpenVidu } from 'openvidu-browser';
import '../styles/StudyHeader.css';

export const StudyHeader = ({ title, currentPage, onDisconnect, id }) => {
    const sessionRef = useRef(null); // 세션 정보를 저장할 ref
    const [publisher, setPublisher] = useState(null); // 퍼블리셔 상태
    const [subscribers, setSubscribers] = useState([]); // 구독자 상태
    const videoRef = useRef(null); // 비디오 요소를 참조하기 위한 ref

    const startCall = async () => {
        console.log('통화 시작');

        const sessionTitle = `${title}-${id}`; // 세션 제목 설정
        const requestData = {
            title: sessionTitle
        };

        const OV = new OpenVidu(); // OpenVidu 객체 생성
        const session = OV.initSession(); // 세션 초기화

        sessionRef.current = session; // 세션 정보를 ref에 저장

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

            if (!response.ok) {
                throw new Error(`세션 생성 실패: ${response.statusText}`);
            }

            const sessionId = await response.text(); // 생성된 세션 ID 받기
            console.log('세션 ID:', sessionId);

            console.log('토큰 요청 중...');
            const tokenResponse = await fetch(`http://localhost:8080/api/sessions/${sessionId}/connections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!tokenResponse.ok) {
                throw new Error(`토큰 생성 실패: ${tokenResponse.statusText}`);
            }

            const token = await tokenResponse.text(); // 세션 접속 토큰 받기
            console.log('토큰:', token);

            console.log('세션에 연결 중...');
            await session.connect(token, { clientData: 'User' }); // 세션에 연결
            console.log('세션 연결 성공');

            // 로컬 스트림 퍼블리시
            console.log('퍼블리셔 초기화 중...');
            const newPublisher = OV.initPublisher(videoRef.current, {
                audioSource: undefined, // 오디오 소스 자동 선택
                videoSource: undefined, // 비디오 소스 자동 선택
                publishAudio: true, // 오디오 퍼블리시
                publishVideo: true, // 비디오 퍼블리시
                resolution: '640x480', // 비디오 해상도 설정
                frameRate: 30, // 프레임 레이트 설정
                insertMode: 'APPEND', // 비디오 삽입 모드 설정
                mirror: false, // 비디오 미러링 설정
            });

            // 카메라와 마이크 접근 허용 이벤트 핸들러
            newPublisher.on('accessAllowed', () => {
                console.log('카메라와 마이크 접근 허용됨');
            });

            // 카메라와 마이크 접근 거부 이벤트 핸들러
            newPublisher.on('accessDenied', (error) => {
                console.error('카메라와 마이크 접근 거부됨:', error);
            });

            console.log('세션에 퍼블리셔 등록 중...');
            session.publish(newPublisher); // 퍼블리셔 등록
            setPublisher(newPublisher); // 퍼블리셔 상태 업데이트
            console.log('퍼블리셔 등록 완료');

            // 스트림 생성 이벤트 핸들러
            session.on('streamCreated', (event) => {
                console.log('새로운 스트림 생성됨:', event.stream.streamId);
                const newSubscriber = session.subscribe(event.stream, undefined); // 새로운 스트림 구독
                setSubscribers((prevSubscribers) => [...prevSubscribers, newSubscriber]); // 구독자 상태 업데이트
            });

            // 기존 스트림 구독
            console.log('기존 스트림 구독 시작');
            session.streamManagers.forEach((streamManager) => {
                if (streamManager.stream && !streamManager.stream.connection.local) {
                    console.log('기존 스트림 구독:', streamManager.stream.streamId);
                    const newSubscriber = session.subscribe(streamManager.stream, undefined); // 기존 스트림 구독
                    setSubscribers((prevSubscribers) => [...prevSubscribers, newSubscriber]); // 구독자 상태 업데이트
                }
            });
            console.log('기존 스트림 구독 완료');

        } catch (error) {
            console.error('통화 시작 오류:', error);
        }
    };

    useEffect(() => {
        // 윈도우 닫기 또는 새로고침 시 세션 종료
        const handleBeforeUnload = (event) => {
            leaveSession();
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        // 컴포넌트 언마운트 시 세션 종료
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            leaveSession();
        };
    }, []);

    const leaveSession = () => {
        console.log('세션 종료');
        const session = sessionRef.current;
        if (session) {
            session.disconnect(); // 세션 연결 해제
            console.log('세션 연결 해제');
        }
        if (publisher) {
            publisher.stream.dispose(); // 퍼블리셔 스트림 해제
            console.log('퍼블리셔 스트림 해제');
        }
        setPublisher(null);
        setSubscribers([]);
        if (onDisconnect) onDisconnect(); // 연결 종료 콜백 호출
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
