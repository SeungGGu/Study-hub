import React from "react";
import {Route, Routes} from "react-router-dom";
import FirstMainPage from "./FirstMainPage";
import SignInPage from "../UserPage/SignInPage";
import StudyRoom from "../StudyRoom/StudyRoom";
import MainStudy from "./MainStudy";
import MainRule from "./MainRule";
import MainCommunity from "./MainCommunity";
import Register from "../UserPage/SignUpPage";
import MainBoards from "./tab/MainBoards";

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
            <Route path="/MainBoards" element={<MainBoards/>}/>
            <Route path='/*' element={ //*이란? 지정된 페이지 이외의 모든것들
                <>
                    <div className='error-page'>oops!! 404 error!</div>
                    <img src={'https://sitechecker.pro/wp-content/uploads/2023/06/404-status-code.png'} width={"100%"}></img>
                </>}/>
        </Routes>
    );
};

export default Router;
