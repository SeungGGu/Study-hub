// TabHeader.js

import React, { useState } from "react";
import { Lock } from 'react-bootstrap-icons'; // 잠금 및 새로고침 아이콘
import "../../styles/TabHeader.css";
import {Refresh} from "iconsax-react";

function TabHeader({ onSearch, topLikedStudies, onStudyClick, onPasswordCheck }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleReset = () => {
        setSearchTerm(""); // 검색어 상태를 초기화
        onSearch(""); // 빈 검색어를 부모 컴포넌트로 전달하여 초기 상태로 복원
    };

    return (
        <div className="tab-header">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="관심 스터디를 검색해 보세요!"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onSearch(e.target.value);
                    }}
                    className="search-input"
                />
                <button className="reset-button" onClick={handleReset}>
                    <Refresh size={20} color="white" />
                </button>
            </div>
            {searchTerm === "" && (
                <>
                    <hr />
                    <div className="best-study-card">
                        <h4>⭐ 주간 인기 스터디</h4>
                        <div className="study-cards-container">
                            {topLikedStudies.map((card) => (
                                <div
                                    key={card.studyId}
                                    className="study-card"
                                    onClick={() => {
                                        if (card.pwStatus) {
                                            onPasswordCheck(card.studyId, card.studyTitle);
                                        } else {
                                            onStudyClick(card.studyId, card.studyTitle);
                                        }
                                    }}
                                >
                                    <div className="card-image">
                                        <img src={`/images/${card.studyTitlePicture}`} alt={card.studyTitle} />
                                    </div>
                                    <div className="card-content">
                                        <h5>{card.studyTitle}</h5>
                                        <p>{card.studyComment}</p>
                                        <small>{card.studyCreator}</small>
                                        <div className="likes-container">
                                            {card.pwStatus && <Lock size={16} />}
                                            <span>👍 {card.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr />
                </>
            )}
        </div>
    );
}

export default TabHeader;
