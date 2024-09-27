import React, {useState} from 'react';
import {Link, useParams} from "react-router-dom";
import '../styles/StudySideBar.css';  // CSS 파일 임포트

export const StudySideBar = ({onChannelSelect}) => {
    const {title} = useParams();
    const [showChannels, setShowChannels] = useState(true);

    const [channels, setChannels] = useState([
        {name: "자유"},
        {name: "질문"},
        {name: "공지"}
    ]); // 초기 채널 목록

    return (
        <div className="study-sidebar-container">
            <div className="study-title-display">
                {title}
            </div>
            <hr className="study-hr"></hr>
            {/* 여기에 구분선 추가 */}
            <ul className="nav flex-column">
                <li className="nav-title">
                    <div className="channel-header">
                        <Link to="#" className="study-nav-link" onClick={() => setShowChannels(!showChannels)}>ⅴ 채널</Link>
                        {/*<button onClick={addChannel} className="add-channel-btn">+</button>*/}
                        {/* 추가 버튼 */}
                    </div>
                </li>
                {showChannels && channels.map(channel => (
                    <li className="study-nav-item" key={channel.name}>
                        <Link to="#" className="study-nav-link" onClick={() => onChannelSelect(channel.name)}>
                            # {channel.name}
                        </Link>
                    </li>
                ))}
                <li>
                    <div className="study-channel-header">
                        <Link to="#" className="study-nav-link" onClick={() => onChannelSelect("캘린더")}>캘린더</Link>
                    </div>
                </li>
                <li>
                    <div className="study-channel-header">
                        <Link to="#" className="study-nav-link" onClick={() => onChannelSelect("캔버스")}>캔버스</Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}
