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
import MainStudyCreate from "./MainStudyCreate";
import BoardDetail from "./tab/BoardDetail";
import MyPage from "./MyPage/MyPage";
import EditProfile from "../UserPage/EditProfile";

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
            <Route path="/boards/:boardId" element={<BoardDetail />} />
            <Route path="/MainBoards" element={<MainBoards/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/studyCreate" element={<MainStudyCreate/>}/>
            <Route path="/myPage" element={<MyPage/>}/>
            <Route path="/editProfile" element={<EditProfile/>}/>

            <Route path='/*' element={ //*이란? 지정된 페이지 이외의 모든것들을 에러처리
                <>
                    <div className='error-page'>oops!! 404 error!</div>
                    <img src={'https://sitechecker.pro/wp-content/uploads/2023/06/404-status-code.png'}
                         alt="404 error page"
                         width={"100%"}
                         height={"100%"}></img>
                </>}/>
            </Routes>
    );
};

export default Router;
