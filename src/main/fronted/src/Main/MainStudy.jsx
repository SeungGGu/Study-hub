import { MainHeader } from "./include/MainHeader";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import MainStudyAll from "./tab/MainStudyAll";
import {MainFooter} from "./include/MainFooter";

function MainStudy() {
    const [key, setKey] = useState('all');

    return (
        <div className="MainStudy" style={{paddingTop: "56px"}}>
            <MainHeader/>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3 nav-justified"
            >
                <Tab eventKey="all" title="전체" className="tab-content">
                    <MainStudyAll type="all"/>
                </Tab>
                <Tab eventKey="recruiting" title="모집 중" className="tab-content">
                    <MainStudyAll type="recruiting"/>
                </Tab>
                <Tab eventKey="recruitingComplete" title="모집 완료" className="tab-content">
                    <MainStudyAll type="recruitingComplete"/>
                </Tab>
            </Tabs>
            <MainFooter/>
            <style jsx>{`
                .nav-item .nav-link {
                    color: white; /* Set text color of unselected tabs to white */
                }
                .nav-item .nav-link.active {
                    color: black; /* Set text color of selected tab to black */
                }
            `}</style>
        </div>
    );
}

export default MainStudy;
