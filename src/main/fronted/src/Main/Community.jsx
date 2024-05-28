import {Badge, Button, Nav} from "react-bootstrap";
import React from "react";
import { useNavigate } from 'react-router-dom';


function Community({boards}){
    const navigate = useNavigate();
    return(
        <div>
            <div className="row mt-4">
                <div className="col">
                    <Nav variant="underline" defaultActiveKey="최신순">
                        <Nav.Item className="me-3">
                            <Nav.Link eventKey="최신순">• 최신순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3">
                            <Nav.Link eventKey="좋아요순">• 좋아요 순</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-3">
                            <Nav.Link eventKey="댓글 순">• 댓글 순</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="col-auto">
                    <Button variant="secondary" onClick={() => {
                        navigate('/MainBoards');
                    }
                    }>글쓰기</Button>
                </div>
                <hr/>
                <div className="게시물">
                    <h4>게시물 제목</h4>
                    <p>qhsans</p>
                </div>
                {/*{boards.map((board, index) => (*/}
                {/*    <div className="게시물" key={index}>*/}
                {/*        <h4>{board.title}</h4>*/}
                {/*        <p>{board.content}</p>*/}
                {/*        <Badge pill bg="primary">{index + 1}</Badge>*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
        </div>
    )
}

export default Community;
