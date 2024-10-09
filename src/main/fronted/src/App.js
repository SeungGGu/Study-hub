import './App.css';
import Routers from './Main/Router';
import {UserProvider} from "./context/UserContext";

function App() {
    return (
        <div className="App">
            <UserProvider>
                <Routers/>
            </UserProvider>
        </div>
    );
}

export default App;
