import React, { useState } from "react";
import { MainHeader } from "./include/MainHeader";
import MainStudyAll from "./tab/MainStudyAll";
import { MainFooter } from "./include/MainFooter";
import "../styles/MainStudy.css"; // 추가된 CSS 파일 임포트

function MainStudy() {
    const [tab, setTab] = useState('all');

    return (
        <div className="MainStudy">
            <MainHeader />

            {/* 상단 탭 레이아웃 */}
            <div className="custom-tabs">
                <div className={`tab-item ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
                    전체
                </div>
                <div className={`tab-item ${tab === 'recruiting' ? 'active' : ''}`} onClick={() => setTab('recruiting')}>
                    모집 중
                </div>
                <div className={`tab-item ${tab === 'recruitingComplete' ? 'active' : ''}`} onClick={() => setTab('recruitingComplete')}>
                    모집 완료
                </div>
            </div>

            {/* 선택된 탭에 따라 다른 컴포넌트 로드 */}
            <div className="tab-content">
                {tab === 'all' && <MainStudyAll type="all" />}
                {tab === 'project' && <MainStudyAll type="recruiting" />}
                {tab === 'study' && <MainStudyAll type="recruitingComplete" />}
            </div>

            <MainFooter />
        </div>
    );
}

export default MainStudy;
