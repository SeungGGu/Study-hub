import React from "react";
import {Route, Routes} from "react-router-dom";
import FirstMainPage from "./FirstMainPage";
import SignInPage from "../UserPage/SignInPage";
import StudyRoom from "../StudyRoom/StudyRoom";
import MainStudy from "./MainStudy";
import MainRule from "./MainRule";
import MainCommunity from "./MainCommunity";
import Register from "../UserPage/SignUpPage";
import MainStudyCreate from "./MainStudyCreate";

const Router = () => {
    return (
        <Routes>
            <Route exact path="/" element={<FirstMainPage/>}/>
            <Route path="/login" element={<SignInPage/>}/>
            <Route path="/main" element={<FirstMainPage/>}/>
            <Route path="/studyRoom/:id/:title" element={<StudyRoom/>}/>
            <Route path="/mainStudy" element={<MainStudy/>}/>
            <Route path="/mainRule" element={<MainRule/>}/>
            <Route path="/mainCommunity" element={<MainCommunity/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/studyCreate" element={<MainStudyCreate/>}/>
        </Routes>
    );
};

export default Router;
