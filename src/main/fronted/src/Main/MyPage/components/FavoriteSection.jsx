// FavoriteSection.jsx
import React from 'react';

const FavoriteSection = () => {
    const favoriteItems = ['단어1', '단어2', '단어3'];  // 즐겨찾기한 단어 목록

    return (
        <div className="mypage-favorites mypage-section">
            <h3>즐겨찾기</h3>
            <ul>
                {favoriteItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default FavoriteSection;
