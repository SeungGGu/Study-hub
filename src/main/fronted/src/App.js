import './App.css';
import './DarkMode.css';
import {useEffect, useState} from "react";
import axios from "axios";
import Routers from './Main/Router';
import {useNavigate} from "react-router-dom";


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
            <Routers/>
            {/*백엔드 데이터 : {hello}*/}
        </div>
    );
}

export default App;
