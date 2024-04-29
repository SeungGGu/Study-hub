import React, {useState} from 'react';
import {Link, useParams} from "react-router-dom";
import '../styles/StudySideBar.css';  // CSS 파일 임포트

export const StudySideBar = ({onChannelSelect}) => {
    const {title} = useParams();
    const [showChannels, setShowChannels] = useState(true);

    const [showCgChannels, setShowCgChannels] = useState(false);

    const [channels, setChannels] = useState([
        {name: "Home"},
        {name: "About"},
        {name: "Contact"}
    ]); // 초기 채널 목록


    const [CgChannels, setCgChannels] = useState([
        {name: "미션"},
        {name: "Today Runner"},
        {name: "캘린더"}
    ]); // 초기 채널 목록

    const addChannel = () => {
        const newChannelName = prompt("Enter the name of the new channel:");
        if (newChannelName) {
            setChannels([...channels, {name: newChannelName}]);
        }
    };

    return (
        <div className="sidebar-container">
            <div className="title-display">
                {title}
            </div>
            <hr/>
            {/* 여기에 구분선 추가 */}
            <ul className="nav flex-column">
                <li className="nav-title">
                    <div className="channel-header">
                        <Link to="#" className="nav-link" onClick={() => setShowChannels(!showChannels)}>ⅴ 채널</Link>
                        <button onClick={addChannel} className="add-channel-btn">+</button>
                        {/* 추가 버튼 */}
                    </div>
                </li>
                {showChannels && channels.map(channel => (
                    <li className="nav-item" key={channel.name}>
                        <Link to="#" className="nav-link" onClick={() => onChannelSelect(channel.name)}>
                            # {channel.name}
                        </Link>
                    </li>
                ))}
                <li className="nav-title">
                    <div className="channel-header">
                        <Link to="#" className="nav-link" onClick={() => setShowCgChannels(!showCgChannels)}>ⅴ 챌린지</Link>
                    </div>
                </li>
                {showCgChannels && CgChannels.map(channel => (
                    <li className="nav-item" key={channel.name}>
                        <Link to="#" className="nav-link" onClick={() => onChannelSelect(channel.name)}>
                            # {channel.name}
                        </Link>
                    </li>
                ))}
                <li>
                    <div className="channel-header">
                        <Link to="#" className="nav-link" onClick={() => onChannelSelect("캔버스")}>캔버스</Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}
