import React, { useEffect, useState } from 'react';
import '../../styles/VideoContainer.css';

const VideoContainer = ({ publisher, subscribers, videoRef, leaveSession, OV, sessionRef, setPublisher }) => {
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
            const screenPublisher = session.streamManagers.find(sm => sm.stream.typeOfVideo === 'SCREEN');
            if (screenPublisher) {
                try {
                    await session.unpublish(screenPublisher);
                    screenPublisher.stream.getMediaStream().getTracks().forEach(track => track.stop());
                    setIsScreenSharing(false);

                    const cameraPublisher = OV.initPublisher(videoRef.current, {
                        audioSource: undefined,
                        videoSource: undefined,
                        publishAudio: !isMuted,
                        publishVideo: true,
                        resolution: '640x480',
                        frameRate: 30,
                        insertMode: 'APPEND',
                        mirror: false
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
                    mirror: false
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

    const handleEndCall = () => {
        leaveSession();
    };

    return (
        <div className="video-container">
            <div className="video-grid">
                {publisher && (
                    <div className="publisher-container">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="publisher-video"
                        />
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
                <button onClick={handleSreenShare}>{isScreenSharing ? '화면 공유 중지' : '화면 공유'}</button>
                <button onClick={handleCammera}>{isCammera ? '카메라 끄기' : '카메라 켜기'}</button>
                <button onClick={handleMute}>{isMuted ? '마이크 음소거' : '마이크 켜기'}</button>
                <button onClick={handleEndCall}>통화 종료</button>
            </div>
        </div>
    );
};

export default VideoContainer;
