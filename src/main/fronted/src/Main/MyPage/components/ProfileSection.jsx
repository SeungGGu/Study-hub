// ProfileSection.jsx
import React from 'react';

const ProfileSection = () => {
    return (
        <div className="mypage-profile-section mypage-section">
            <img
                src="https://via.placeholder.com/150"  // 유저의 프로필 이미지
                alt="Profile"
                className="mypage-profile-picture"
            />
            <div className="mypage-profile-info">
                <h2>홍길동</h2>  {/* 닉네임 */}
                <p>gildong@example.com</p>  {/* 이메일 */}
                <p>등급: Silver</p>  {/* 등급 */}
            </div>
        </div>
    );
};

export default ProfileSection;
