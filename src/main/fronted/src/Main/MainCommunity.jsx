import {MainHeader} from "./include/MainHeader";
import {Button, Form, InputGroup, Badge, Tab, Tabs} from "react-bootstrap";
import {useState} from "react";
import Community from "./Community";
import React from "react";

function MainCommunity() {
    const [key, setKey] = useState('all');

    // const [popularTags, setPopularTags] = useState([]);
    //
    // useEffect(() => {
    //     // Fetch popular tags from the backend API
    //     fetch("/api/popular-tags")
    //         .then(response => response.json())
    //         .then(data => setPopularTags(data.tags))
    //         .catch(error => console.error("Error fetching popular tags:", error));
    // }, []);

    return (
        <div className="MainCommunity" style={{paddingTop: "56px", marginLeft: "20"}}>
            <MainHeader/>
            <div className="row g-5">
                <div className="col-md-8">
                    <div className="mt-3">
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="관심 스터디를 검색해 보세요!"
                                aria-label="search"
                                aria-describedby="search"
                            />
                            <Button variant="outline-secondary" id="searchButton">
                                검색
                            </Button>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="# 태그로 검색해보세요!"
                                aria-label="tagSearch"
                                aria-describedby="tagSearch"
                            />
                            <Button variant="outline-secondary" id="reset">
                                초기화
                            </Button>
                            <Button variant="outline-secondary" id="TagSearchButton">
                                검색
                            </Button>
                        </InputGroup>
                    </div>
                    <div>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3 nav-justified"
                        >
                            <Tab eventKey="all" title="전체">
                                <Community/>
                            </Tab>
                            <Tab eventKey="공지사항" title="공지사항">
                                Tab content for Profile
                            </Tab>
                            <Tab eventKey="질문" title="질문">
                                Tab content for Contact
                            </Tab>
                            <Tab eventKey="스터디" title="스터디">
                                Tab content for Contact
                            </Tab>
                            <Tab eventKey="자유" title="자유">
                                Tab content for Contact
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 mb-3 bg-body-tertiary rounded">
                        <h6 style={{color: 'black', textAlign: "left"}}>
                            # 인기 태그
                        </h6>
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}
                        <Badge pill bg="secondary"><Badge pill bg="black">#</Badge>인기태그1</Badge>{' '}

                        {/*{popularTags.map((tag, index) => (*/}
                        {/*    <Badge key={index} pill bg="secondary"><Badge pill bg="black">#</Badge>{tag}</Badge>*/}
                        {/*))}*/}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .nav-item .nav-link {
                    color: white; /* Set text color of unselected tabs to white */
                }

                .nav-item .nav-link.active {
                    color: black; /* Set text color of selected tab to black */
                }
            `}</style>
        </div>
    )
}

export default MainCommunity;
