import { useTheme } from '../ThemeContext';

function Layout({ children }) {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <div className={`app-container ${theme}`}>
            {children}
            <button 
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
        </div>
    );
}