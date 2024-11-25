import {useState, useEffect, useRef, useCallback} from 'react';
import {OpenVidu} from 'openvidu-browser';

const REQUEST_TIMEOUT = 10000; // 10초

const useOpenVidu = ({id}) => {
    const sessionRef = useRef(null);
    const publisherRef = useRef(null);
    const subscribersRef = useRef([]);
    const isLeavingSession = useRef(false);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const videoRef = useRef(null);
    const OV = useRef(new OpenVidu()).current;

    // 서버 요청 함수에 타임아웃 추가
    const fetchWithTimeout = async (url, options) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeout);
            return response;
        } catch (error) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                console.error(`요청 타임아웃 발생: ${url}`);
                throw new Error(`Request timed out: ${url}`);
            }
            throw error;
        }
    };

    // 세션 종료
    const leaveSession = useCallback(async () => {
        if (isLeavingSession.current) {
            console.warn("이미 세션 종료 중입니다.");
            return;
        }

        isLeavingSession.current = true;

        if (sessionRef.current) {
            try {
                const session = sessionRef.current;

                // WebSocket 상태 확인
                if (
                    session.connection &&
                    session.connection.rpc &&
                    (session.connection.rpc.rpcReadyState === 2 || session.connection.rpc.rpcReadyState === 3)
                ) {
                    console.warn("WebSocket이 이미 닫혀 있습니다.");
                    return;
                }

                // 퍼블리셔 언퍼블리시
                if (publisherRef.current) {
                    await session.unpublish(publisherRef.current);
                    console.log("퍼블리셔 언퍼블리시 성공");
                }

                // 구독자 스트림 해제
                subscribersRef.current.forEach((subscriber) => {
                    session.unsubscribe(subscriber);
                });

                // 세션 종료
                await session.disconnect();
                console.log("세션 종료 성공");

                // 서버에 세션 종료 요청
                const response = await fetchWithTimeout(
                    `http://localhost:8080/api/sessions/${session.sessionId}`,
                    {method: "DELETE"}
                );

                if (response.ok) {
                    console.log("서버에서 세션 강제 종료 요청 완료");
                } else {
                    console.error(`서버 세션 종료 요청 실패: ${response.statusText}`);
                }

            } catch (error) {
                console.error("세션 종료 중 오류 발생:", error);
            } finally {
                // 리소스 정리
                sessionRef.current = null;
                publisherRef.current = null;
                setPublisher(null);
                setSubscribers([]);
                subscribersRef.current = [];
                isLeavingSession.current = false;
            }
        } else {
            console.warn("세션이 없습니다.");
            isLeavingSession.current = false;
        }
    }, []);

    const startCall = useCallback(async () => {
        try {
            // 세션 생성 요청
            const sessionResponse = await fetchWithTimeout(`http://localhost:8080/api/sessions`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({studyId: id}),
            });

            if (!sessionResponse.ok) throw new Error(`세션 생성 실패: ${sessionResponse.statusText}`);
            const sessionId = await sessionResponse.text();

            // 토큰 생성 요청
            const tokenResponse = await fetchWithTimeout(
                `http://localhost:8080/api/sessions/${sessionId}/connections`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({role: "PUBLISHER", data: `User connected to studyId: ${id}`}),
                }
            );

            if (!tokenResponse.ok) throw new Error(`토큰 생성 실패: ${tokenResponse.statusText}`);
            const token = await tokenResponse.text();

            // 세션 초기화 및 연결
            const session = OV.initSession();
            sessionRef.current = session;

            session.on("streamCreated", (event) => {
                const subscriber = session.subscribe(event.stream, undefined);
                setSubscribers((prev) => [...prev, subscriber]);
            });

            await session.connect(token, {clientData: "User"});

            const newPublisher = OV.initPublisher(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: "640x480",
                frameRate: 30,
                insertMode: "APPEND",
            });

            await session.publish(newPublisher);
            setPublisher(newPublisher);
            publisherRef.current = newPublisher;
        } catch (error) {
            console.error("세션 시작 오류:", error);
        }
    }, [id, OV]);

    useEffect(() => {
        window.addEventListener("beforeunload", leaveSession);
        return () => {
            window.removeEventListener("beforeunload", leaveSession);
            leaveSession();
        };
    }, [leaveSession]);

    return {
        startCall,
        leaveSession,
        publisher,
        subscribers,
        videoRef,
    };
};

export default useOpenVidu;
