import { useRef, useState, useCallback, useEffect } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (url, onMessage) => {
    const stompClientRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const connectingRef = useRef(false);

    // 새로고침을 위한 세션 저장
    const sessionKey = 'websocket-session'; // localStorage 키

    // 연결 복구 또는 새로 연결
    const connect = useCallback(() => {
        if (connectingRef.current) return;
        connectingRef.current = true;

        const socket = new SockJS(url);
        const client = Stomp.over(socket);

        client.connect(
            {},
            () => {
                console.log('웹소켓 연결 성공');
                stompClientRef.current = client;
                setConnected(true);
                setRetryCount(0);
                connectingRef.current = false;

                // 웹소켓 세션 정보 저장 (새로고침 후 복구 가능)
                localStorage.setItem(sessionKey, JSON.stringify({ connected: true }));

                // 메시지 구독
                client.subscribe('/topic/messages', (message) => {
                    onMessage(JSON.parse(message.body));
                });
            },
            (error) => {
                console.error('웹소켓 연결 오류:', error);
                connectingRef.current = false;
                setConnected(false);
                if (retryCount < 5) {
                    setTimeout(() => {
                        setRetryCount((prevCount) => prevCount + 1);
                        connect();
                    }, 5000);
                } else {
                    console.error('최대 재시도 횟수에 도달했습니다. 연결 실패.');
                }
            }
        );

        socket.onclose = () => {
            console.log('웹소켓 연결이 닫혔습니다.');
            setConnected(false);
            connectingRef.current = false;

            // 세션 상태 초기화
            localStorage.removeItem(sessionKey);

            // 일정 시간 후 재연결 시도
            setTimeout(() => {
                console.log('웹소켓 재연결 시도');
                connect();
            }, 5000);
        };
    }, [url, onMessage, retryCount]);

    // 연결 종료
    const disconnect = useCallback(() => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect(
                () => {
                    console.log('웹소켓 연결 종료됨');
                    setConnected(false);
                    localStorage.removeItem(sessionKey); // 세션 상태 초기화
                },
                (error) => {
                    console.error('웹소켓 연결 종료 오류', error);
                }
            );
            stompClientRef.current = null;
        }
    }, []);

    // 메시지 전송
    const sendMessage = useCallback((destination, message) => {
        if (stompClientRef.current && connected) {
            stompClientRef.current.send(destination, {}, JSON.stringify(message));
        } else {
            console.warn('웹소켓이 연결되어 있지 않습니다. 메시지를 전송할 수 없습니다.');
        }
    }, [connected]);

    // 컴포넌트 초기화 시 기존 연결 복구
    useEffect(() => {
        const storedSession = localStorage.getItem(sessionKey);

        if (storedSession) {
            const sessionData = JSON.parse(storedSession);
            if (sessionData.connected) {
                console.log('이전 웹소켓 세션 복구 시도');
                connect();
            }
        } else {
            connect();
        }

        // 컴포넌트 언마운트 시 연결 종료
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return { connect, disconnect, sendMessage, connected };
};

export default useWebSocket;
