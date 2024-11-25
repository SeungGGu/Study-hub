import './App.css';
import './theme.css';
import Routers from './Main/Router';
import {UserProvider} from "./context/UserContext";
import TimeTracker from "./context/TimeTracker";
import { ThemeProvider } from './ThemeContext.jsx';
import { useTheme } from './ThemeContext.jsx';

function AppContent() {
    const { theme } = useTheme();

    return (
        <div className={`App ${theme}`}>
            <UserProvider>
                <TimeTracker>
                    <Routers/>
                </TimeTracker>
            </UserProvider>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
