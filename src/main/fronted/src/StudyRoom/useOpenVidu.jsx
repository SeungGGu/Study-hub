import {useState, useEffect, useRef, useCallback} from "react";
import {OpenVidu} from "openvidu-browser";

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

    const removeSubscriber = useCallback((subscriberToRemove) => {
        setSubscribers((prevSubscribers) =>
            prevSubscribers.filter((subscriber) => subscriber !== subscriberToRemove)
        );
    }, []);

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

                if (
                    session.connection &&
                    session.connection.rpc &&
                    (session.connection.rpc.rpcReadyState === 2 || session.connection.rpc.rpcReadyState === 3)
                ) {
                    console.warn("WebSocket이 이미 닫혀 있습니다.");
                } else {
                    if (publisherRef.current) {
                        await session.unpublish(publisherRef.current);
                        console.log("퍼블리셔 언퍼블리시 성공");
                    }

                    subscribersRef.current.forEach((subscriber) => {
                        session.unsubscribe(subscriber);
                    });

                    await session.disconnect();
                    console.log("클라이언트 세션 종료 성공");
                }

                // 서버에 참가자 수 확인 및 세션 삭제 요청
                if (sessionRef.current) {
                    const sessionId = sessionRef.current.sessionId;

                    try {
                        await fetch(`http://localhost:8080/api/sessions/${sessionId}/check-participants`, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                        });
                        console.log("참가자 수 확인 및 감소 요청 완료");
                    } catch (error) {
                        console.error("세션 종료 요청 중 오류 발생:", error);
                    }
                }
            } catch (error) {
                console.error("세션 종료 중 오류 발생:", error);
            } finally {
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
            // 서버에서 세션 생성 요청
            const sessionResponse = await fetch(`http://localhost:8080/api/sessions`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({studyId: id}),
            });

            if (!sessionResponse.ok) {
                throw new Error(`세션 생성 실패: ${sessionResponse.statusText}`);
            }

            const sessionId = await sessionResponse.text();
            console.log("세션 생성 성공 또는 기존 세션 재활용:", sessionId);

            // 서버에서 해당 세션의 토큰 요청
            const tokenResponse = await fetch(
                `http://localhost:8080/api/sessions/${sessionId}/connections`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({role: "PUBLISHER", data: `User connected to studyId: ${id}`}),
                }
            );

            if (!tokenResponse.ok) {
                const errorDetail = await tokenResponse.text();
                console.error(`토큰 생성 실패: ${tokenResponse.status} - ${errorDetail}`);
                throw new Error(`토큰 생성 실패: ${tokenResponse.statusText}`);
            }

            const token = await tokenResponse.text();
            console.log("토큰 생성 성공:", token);

            // 세션 초기화 및 연결
            const session = OV.initSession();
            sessionRef.current = session;

            session.on("streamCreated", (event) => {
                const subscriber = session.subscribe(event.stream, undefined);
                setSubscribers((prev) => [...prev, subscriber]);
            });

            // streamDestroyed 이벤트 처리
            session.on("streamDestroyed", (event) => {
                const subscriberToRemove = event.stream.streamManager;
                removeSubscriber(subscriberToRemove); // 구독자 제거
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

            console.log("세션 연결 및 퍼블리셔 생성 성공");
        } catch (error) {
            console.error("세션 시작 중 오류 발생:", error);
        }
    }, [id, OV, removeSubscriber]);

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
