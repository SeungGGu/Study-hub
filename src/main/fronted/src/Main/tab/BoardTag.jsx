import React, { useState } from 'react';
import { Form, Row, Col, Badge } from 'react-bootstrap';

const BoardTag = () => {
    const [tagName, setTags] = useState([]);  // Array to store tags
    const [tagInput, setTagInput] = useState('');  // Input field for new tag

    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);  // Update the tag input field
    };
    const handleTagAdd = () => {
        if (tagInput.trim() !== '') {
            setTags([...tagName, tagInput.trim()]);  // Add the new tag
            setTagInput('');  // Clear the input field
        }
    };
    const handleTagRemove = (index) => {
        const updatedTags = tagName.filter((_, i) => i !== index);  // Remove the tag by index
        setTags(updatedTags);
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
                                handleTagAdd();  // Add tag on Enter key
                                console.log(e.target.value);
                            }
                        }}
                    />
                </Col>
            </Row>
            <div className="tags-container">
                {tagName.map((tag, index) => (
                    <Badge
                        key={index}
                        className="badge bg-secondary me-1"
                        onClick={() => handleTagRemove(index)}  // Click to remove tag
                    >
                        {tag} <span className="badge bg-danger">x</span>
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default BoardTag;
