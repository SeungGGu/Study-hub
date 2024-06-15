import React, { useState } from 'react';
import { Form, Row, Col, Badge } from 'react-bootstrap';

// 부모 컴포넌트로부터 tags와 onChange props를 받음
const BoardTag = ({ tags, onChange }) => {
    const [tagInput, setTagInput] = useState('');  // 새 태그 입력 필드

    // 태그 입력 필드 변경 핸들러
    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);  // 태그 입력 필드 업데이트
    };

    // 태그 추가 핸들러
    const handleTagAdd = () => {
        if (tagInput.trim() !== '' && tags.length < 5) {  // 태그는 최대 5개까지 허용
            onChange([...tags, tagInput.trim()]);  // 새 태그 추가
            setTagInput('');  // 입력 필드 초기화
        }
    };

    // 태그 제거 핸들러
    const handleTagRemove = (index) => {
        const updatedTags = tags.filter((_, i) => i !== index);  // 인덱스를 통해 태그 제거
        onChange(updatedTags);
    };

    return (
        <div>
            <Row>
                <Col xs={12}>
                    <Form.Control
                        type="text"
                        placeholder="태그를 설정하시오. (최대 5개)"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleTagAdd();  // Enter 키로 태그 추가
                            }
                        }}
                    />
                </Col>
            </Row>
            <div className="tags-container mt-2">
                {tags.map((tag, index) => (
                    <Badge
                        key={index}
                        className="badge bg-secondary me-1"
                        onClick={() => handleTagRemove(index)}  // 클릭으로 태그 제거
                    >
                        {tag} <span className="badge bg-danger">x</span>
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default BoardTag;