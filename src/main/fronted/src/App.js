import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from "react";
import axios from "axios";
import {MainHeader} from "./MainHeader/MainHeader";
import {MainSlider} from "./MainSlider/MainSlider";

function App() {
    const [hello, setHello] = useState('');

    useEffect(() => {
        axios.get('/api/test')
            .then((res) => {
                setHello(res.data);
            });
    }, []);

    return (
        <div className="App">
            {/*백엔드 데이터 : {hello}*/}
        <MainHeader/>
        <MainSlider/>
        </div>
    );
}

export default App;
