import React from "react";
import {Route, Routes} from "react-router-dom";
import FirstMainPage from "./FirstMainPage";
import SignInPage from "../UserPage/SignInPage";
import StudyRoom from "../StudyRoom/StudyRoom";
import MainStudy from "./MainStudy";
import MainRule from "./MainRule";
import MainCommunity from "./MainCommunity";

const Router = () => {
    return (
        <Routes>
            <Route exact path="/" element={<FirstMainPage/>}/>
            <Route path="/login" element={<SignInPage/>}/>
            <Route path="/main" element={<FirstMainPage/>}/>
            <Route path="/studyRoom" element={<StudyRoom/>}/>
            <Route path="/mainStudy" element={<MainStudy/>}/>
            <Route path="/mainRule" element={<MainRule/>}/>
            <Route path="/mainCommunity" element={<MainCommunity/>}/>
        </Routes>
    );
};

export default Router;
