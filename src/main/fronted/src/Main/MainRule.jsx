import {MainHeader} from "./include/MainHeader";
import {MainFooter} from "./include/MainFooter";
import {Accordion} from "react-bootstrap";

function MainRule() {
    return (
        <div className="MainRule" style={{paddingTop: "56px"}}>
            <MainHeader/>
            <div className="d-flex justify-content-center">
                <div style={{paddingTop: '30px', paddingBottom: '30px'}}>
                    <h4>
                        Study-hub 규칙은 커뮤니티 때문에 존재합니다. 바로 여러분입니다!😍<br/>
                        지구상에서 가장 열망적이고 지지적인 커뮤니티를 구축하는 데 동참하세요.<br/>
                        함께라면 우리는 목표 달성을 위해 서로 격려하고 영감을 주는 힘이 있습니다 🌎
                    </h4>
                </div>
            </div>
            <div className="ml-8" style={{textAlign: "left"}}>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>🙌🏼 커뮤니티 가이드라인</Accordion.Header>
                        <Accordion.Body>
                            🤝 서로서로 도와요<br/>
                            ☀️ 존중 및 좋은 분위기<br/>
                            🦜 폭언, 욕설은 고객센터에 신고하세요.<br/>
                            🦸🏻 필요한 경우 사용자를 차단하거나 비디오 스트림을 숨기세요.<br/>
                            🔒 안전: 개인 정보 보호나 보안을 침해할 수 있는 개인 정보를 공개하지 마세요.<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>📝 일반규칙</Accordion.Header>
                        <Accordion.Body>
                            1. 👍🏻 적절한 에티켓: 부적절하거나 불쾌한 사용자 이름, 프로필 사진 또는 약력 설명을 사용하지 마세요.<br/>
                            2. ⛔ 동의: 명시적인 동의 없이 다른 사용자에 관한 정보를 공유하지 마세요.<br/>
                            3. ❌ 괴롭힘 금지: 다른 사람을 향한 모욕, 위협, 따돌림, 트롤링 또는 인신 공격을 포함하여 어떤 형태의 학대도 금지됩니다.<br/>
                            4. 😖 차별 금지: 보호되는 특성(예: 인종, 성별, 나이, 성적 취향, 종교, 국적, 장애 등)을 근거로 타인을 선동하거나 편견을 갖거나 증오하지
                            않습니다.<br/>
                            5. 📵 모욕 콘텐츠 없음: 모욕적이거나 불쾌하거나 성적으로 노골적인 콘텐츠가 없습니다. 폭력, 무기, 기분전환용 약물과 관련된 콘텐츠가 없습니다.<br/>
                            6. 🔇 홍보 금지: 허가 없이 직간접적으로 홍보하거나 광고하지 마세요.<br/>
                            7. 🎭 신고 시스템 오용 금지: 허위 신고를 제출하거나 타인에 대해 허위 주장을 하지 마세요.<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>💬 채팅 규칙</Accordion.Header>
                        <Accordion.Body>
                            1. 🙊 부적절한 메시지 금지: 환영받지 못하는 메시지, 스팸 메시지 또는 '살짝 들어오는' 메시지는 금지됩니다. 욕설이 없습니다.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>⏲ 스터디룸 규칙</Accordion.Header>
                        <Accordion.Body>
                            1. 📹 영상 행위: 의도적으로 주의를 산만하게 하고, 부적절하고, 파괴적이고 공격적인 행동과 표현을 피하세요. 여기에는 의류, 배경, 필터, 타일 메시지 및
                            오디오(사용 가능한 경우)가 포함됩니다.<br/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            <hr/>
            <MainFooter/>
        </div>
    )
}

export default MainRule;
