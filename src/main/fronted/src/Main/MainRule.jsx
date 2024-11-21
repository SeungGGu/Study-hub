import { MainHeader } from "./include/MainHeader";
import { MainFooter } from "./include/MainFooter";
import { Accordion } from "react-bootstrap";
import React from "react";

function MainRule() {
    return (
        <div
            className="MainRule"
            style={{
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: "#f5f7fa",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <MainHeader />
            {/* Hero Section */}
            <section
                style={{
                    backgroundColor: "#3b5998",
                    color: "#fff",
                    padding: "60px 20px",
                    textAlign: "center",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    marginTop: "75px",
                }}
            >
                <h1 style={{ fontSize: "2.8rem", fontWeight: "700", marginBottom: "20px" }}>
                    Study-Hub 규칙
                </h1>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.8", maxWidth: "800px", margin: "auto" }}>
                    여러분과 함께 만드는 열정적이고 긍정적인 커뮤니티! 🌟<br />
                    서로 격려하고 영감을 주며 목표를 달성하세요.
                </p>
            </section>

            {/* Rules Section */}
            <section
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "40px 20px",
                }}
            >
                <div
                    className="container"
                    style={{
                        maxWidth: "900px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                        padding: "30px",
                    }}
                >
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <span role="img" aria-label="Community" style={{ marginRight: "10px" }}>
                                    🙌🏼
                                </span>
                                <strong style={{ color: "#3b5998" }}>커뮤니티 가이드라인</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#555" }}>
                                    <li>🤝 서로 도우며 협력하세요</li>
                                    <li>☀️ 존중과 긍정적인 분위기를 유지하세요</li>
                                    <li>🦜 폭언은 신고해주세요</li>
                                    <li>🦸‍♂️ 필요시 사용자를 차단하세요</li>
                                    <li>🔒 개인정보를 안전하게 보호하세요</li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <span role="img" aria-label="Rules" style={{ marginRight: "10px" }}>
                                    📝
                                </span>
                                <strong style={{ color: "#3b5998" }}>일반 규칙</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#555" }}>
                                    <li>👍 적절한 에티켓 유지</li>
                                    <li>⛔ 명시적 동의 없이 정보 공유 금지</li>
                                    <li>❌ 괴롭힘 금지</li>
                                    <li>😖 차별 금지</li>
                                    <li>📵 모욕적 콘텐츠 금지</li>
                                    <li>🔇 허가 없는 광고 금지</li>
                                    <li>🎭 신고 시스템 오용 금지</li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>
                                <span role="img" aria-label="Chat" style={{ marginRight: "10px" }}>
                                    💬
                                </span>
                                <strong style={{ color: "#3b5998" }}>채팅 규칙</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <p style={{ color: "#555", lineHeight: "1.8" }}>
                                    🙊 부적절한 메시지, 스팸 또는 불쾌한 메시지는 금지됩니다.
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>
                                <span role="img" aria-label="Study Room" style={{ marginRight: "10px" }}>
                                    ⏲
                                </span>
                                <strong style={{ color: "#3b5998" }}>스터디룸 규칙</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <p style={{ color: "#555", lineHeight: "1.8" }}>
                                    📹 주의를 산만하게 하거나 부적절한 행동을 피하세요.
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </section>
        </div>
    );
}

export default MainRule;
