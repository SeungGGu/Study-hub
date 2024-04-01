import './App.css';
import './DarkMode.css';
// import {useEffect, useState} from "react";
// import axios from "axios";
import React from "react";
import {Route, Routes} from 'react-router-dom'
import StudyRoom from "./StudyRoom/StudyRoom.js";
import FirstMainPage from "./Main/FirstMainPage";
import MainStudy from "./Main/MainStudy";
import MainRule from "./Main/MainRule";
import MainCommunity from "./Main/MainCommunity";

function App() {
    // const [hello, setHello] = useState('');
    //
    // useEffect(() => {
    //     axios.get('/api/test')
    //         .then((res) => {
    //             setHello(res.data);
    //         });
    // }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<FirstMainPage/>}/>
                <Route path="/studyRoom" element={<StudyRoom/>}/>
                <Route path="/mainStudy" element={<MainStudy/>}/>
                <Route path="/mainRule" element={<MainRule/>}/>
                <Route path="/mainCommunity" element={<MainCommunity/>}/>
                {/*백엔드 데이터 : {hello}*/}
            </Routes>
        </div>
    );
}

export default App;
