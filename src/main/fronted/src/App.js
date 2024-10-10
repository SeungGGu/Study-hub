import './App.css';
import Routers from './Main/Router';
import {UserProvider} from "./context/UserContext";
import TimeTracker from "./context/TimeTracker";

function App() {
    return (
        <div className="App">
            <UserProvider>
                <TimeTracker>
                    <Routers/>
                </TimeTracker>
            </UserProvider>
        </div>
    );
}

export default App;
