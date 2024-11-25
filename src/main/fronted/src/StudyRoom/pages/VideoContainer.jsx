import React, { useEffect, useState } from 'react';
import '../../styles/VideoContainer.css';
import {
    CallSlash,
    Camera,
    CameraSlash,
    ImportSquare,
    Microphone2,
    MicrophoneSlash,
    Screenmirroring,
} from 'iconsax-react';

const VideoContainer = ({
    publisher,
    subscribers,
    videoRef,
    leaveSession,
    OV,
    sessionRef,
    setPublisher,
    setCurrentPage, // StudyRoom에서 전달받은 상태 업데이트 함수
}) => {
    const [isCammera, setIsCammera] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    useEffect(() => {
        if (publisher && videoRef.current) {
            publisher.addVideoElement(videoRef.current);
        }
    }, [publisher, videoRef]);

    const handleSreenShare = async () => {
        const session = sessionRef.current;
        if (!session) return;

        if (isScreenSharing) {
            const screenPublisher = session.streamManagers.find((sm) => sm.stream.typeOfVideo === 'SCREEN');
            if (screenPublisher) {
                try {
                    await session.unpublish(screenPublisher);
                    screenPublisher.stream.getMediaStream().getTracks().forEach((track) => track.stop());
                    setIsScreenSharing(false);

                    const cameraPublisher = OV.initPublisher(videoRef.current, {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: !isMuted,
                        publishVideo: true,
                        resolution: '640x480',
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: false,
                    });

                    await session.publish(cameraPublisher);
                    setPublisher(cameraPublisher);
                } catch (error) {
                    console.error('화면 공유 중지 오류:', error);
                }
            }
        } else {
            if (publisher) {
                try {
                    await session.unpublish(publisher);
                } catch (error) {
                    console.error('카메라 게시 중지 오류:', error);
                }
            }
            try {
                const screenPublisher = OV.initPublisher(undefined, {
                    videoSource: 'screen',
                    publishAudio: !isMuted,
                    publishVideo: true,
                    mirror: false,
                });

                screenPublisher.once('accessAllowed', async () => {
                    try {
                        await session.publish(screenPublisher);
                        setIsScreenSharing(true);
                        setPublisher(screenPublisher);
                    } catch (error) {
                        console.error('화면 공유 게시 오류:', error);
                    }
                });

                screenPublisher.once('accessDenied', (error) => {
                    console.error('화면 공유 시작 오류:', error);
                });
            } catch (error) {
                console.error('화면 공유 시작 오류:', error);
            }
        }
    };

    const handleCammera = () => {
        if (publisher) {
            try {
                publisher.publishVideo(!isCammera);
                setIsCammera(!isCammera);
            } catch (error) {
                console.error('카메라 전환 오류:', error);
            }
        }
    };

    const handleMute = () => {
        if (publisher) {
            try {
                publisher.publishAudio(!isMuted);
                setIsMuted(!isMuted);
            } catch (error) {
                console.error('오디오 전환 오류:', error);
            }
        }
    };

    const handleEndCall = async () => {
        if (!sessionRef?.current) {
            console.warn('세션이 이미 종료되었거나 초기화되지 않았습니다.');
            setCurrentPage('자유'); // 페이지를 자유로 변경
            return;
        }

        const session = sessionRef.current;

        try {
            if (
                session.connection &&
                session.connection.rpc &&
                (session.connection.rpc.rpcReadyState === 2 || session.connection.rpc.rpcReadyState === 3)
            ) {
                console.warn('WebSocket이 닫혀 있는 상태입니다. 세션 종료를 건너뜁니다.');
                setCurrentPage('자유'); // 페이지를 자유로 변경
                return;
            }

            console.log('통화 종료를 시작합니다...');
            await leaveSession(); // `useOpenVidu`의 leaveSession 호출
            console.log('통화 종료 완료.');
        } catch (error) {
            console.error('통화 종료 중 오류 발생:', error);
        } finally {
            setCurrentPage('자유'); // 통화 종료 후 페이지 변경
        }
    };

    return (
        <div className="video-container">
            <div className="video-grid">
                {publisher && (
                    <div className="publisher-container">
                        <video ref={videoRef} autoPlay playsInline className="publisher-video" />
                    </div>
                )}
                {subscribers.map((subscriber, index) => (
                    <div key={index} className="subscriber-container">
                        <video
                            ref={(video) => {
                                if (video && subscriber.stream) {
                                    try {
                                        subscriber.addVideoElement(video);
                                    } catch (error) {
                                        console.error('비디오 엘리먼트 추가 오류:', error);
                                    }
                                }
                            }}
                            autoPlay
                            playsInline
                            className="subscriber-video"
                        />
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button onClick={handleSreenShare} title={isScreenSharing ? '화면 공유 중지' : '화면 공유'}>
                    {isScreenSharing ? (
                        <ImportSquare size="32" color="#2ccce4" variant="Bulk" />
                    ) : (
                        <Screenmirroring size="32" color="#2ccce4" variant="Bulk" />
                    )}
                </button>
                <button onClick={handleCammera} title={isCammera ? '카메라 끄기' : '카메라 켜기'}>
                    {isCammera ? (
                        <CameraSlash size="32" color="#2ccce4" variant="Bulk" />
                    ) : (
                        <Camera size="32" color="#2ccce4" variant="Bulk" />
                    )}
                </button>
                <button onClick={handleMute} title={isMuted ? '마이크 음소거' : '마이크 켜기'}>
                    {isMuted ? (
                        <MicrophoneSlash size="32" color="#2ccce4" variant="Bulk" />
                    ) : (
                        <Microphone2 size="32" color="#2ccce4" variant="Bulk" />
                    )}
                </button>
                <button onClick={handleEndCall} title="통화 종료">
                    <CallSlash size="32" color="#2ccce4" variant="Bulk" />
                </button>
            </div>
        </div>
    );
};

export default VideoContainer;
