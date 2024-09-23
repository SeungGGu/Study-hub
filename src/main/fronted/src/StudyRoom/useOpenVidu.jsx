import { useState, useEffect, useRef, useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';

const useOpenVidu = ({ title, id }) => {
    const sessionRef = useRef(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const videoRef = useRef(null);
    const OV = useRef(new OpenVidu()).current;

    // leaveSession을 useCallback으로 감싸기
    const leaveSession = useCallback(() => {
        console.log('Leaving session');
        const session = sessionRef.current;
        if (session) {
            if (publisher) {
                session.unpublish(publisher);
                if (publisher.streamManager) {
                    const videoElements = publisher.streamManager.videos || [];
                    videoElements.forEach(video => {
                        if (video && video.video && video.video.parentNode && document.contains(video.video)) {
                            try {
                                video.video.parentNode.removeChild(video.video);
                            } catch (error) {
                                console.error('Error removing publisher video element:', error);
                            }
                        }
                    });
                    publisher.streamManager = null; // 추가 참조 방지
                }
            }
            subscribers.forEach(subscriber => {
                session.unsubscribe(subscriber);
                if (subscriber.streamManager) {
                    const videoElements = subscriber.streamManager.videos || [];
                    videoElements.forEach(video => {
                        if (video && video.video && video.video.parentNode && document.contains(video.video)) {
                            try {
                                video.video.parentNode.removeChild(video.video);
                            } catch (error) {
                                console.error('Error removing subscriber video element:', error);
                            }
                        }
                    });
                    subscriber.streamManager = null; // 추가 참조 방지
                }
            });
            session.disconnect();
            sessionRef.current = null;
        }
        setPublisher(null);
        setSubscribers([]);
        console.log('Session cleaned up');
    }, [publisher, subscribers]);  // 의존성 배열에 publisher와 subscribers 추가

    // useEffect에서 leaveSession을 의존성 배열에 추가
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            leaveSession();
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            leaveSession();
        };
    }, [leaveSession]);

    const startCall = async () => {
        console.log('Starting call...');
        const sessionTitle = `${title}-${id}`;
        const requestData = { title: sessionTitle };

        try {
            const response = await fetch('http://localhost:8080/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });

            if (!response.ok) throw new Error(`Failed to create session: ${response.statusText}`);

            const sessionId = await response.text();
            console.log('Session ID:', sessionId);

            const tokenResponse = await fetch(`http://localhost:8080/api/sessions/${sessionId}/connections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!tokenResponse.ok) throw new Error(`Failed to create token: ${tokenResponse.statusText}`);

            const token = await tokenResponse.text();
            console.log('Token:', token);

            const session = OV.initSession();
            sessionRef.current = session;

            session.on('streamCreated', (event) => {
                console.log('New stream created:', event.stream.streamId);
                const newSubscriber = session.subscribe(event.stream, undefined);
                setSubscribers((prevSubscribers) => [...prevSubscribers, newSubscriber]);
            });

            session.on('streamDestroyed', (event) => {
                console.log('Stream destroyed:', event.stream.streamId);
                setSubscribers((prevSubscribers) => prevSubscribers.filter(subscriber => subscriber.stream !== event.stream));
            });

            await session.connect(token, { clientData: 'User' });

            const newPublisher = OV.initPublisher(videoRef.current, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false
            });

            newPublisher.on('accessAllowed', () => console.log('Access allowed to camera and microphone'));
            newPublisher.on('accessDenied', (error) => console.error('Access denied to camera and microphone:', error));

            await session.publish(newPublisher);
            setPublisher(newPublisher);
        } catch (error) {
            console.error('Error starting call:', error);
        }
    };

    return {
        startCall,
        leaveSession,
        publisher,
        subscribers,
        videoRef,
        OV,
        sessionRef,
        setPublisher
    };
};

export default useOpenVidu;
