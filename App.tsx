import React, { useState, useCallback } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import KioskPage from './pages/KioskPage';
import LoginPage from './pages/LoginPage';

type View = 'login' | 'admin' | 'kiosk';

const App: React.FC = () => {
    const [view, setView] = useState<View>('login');

    const handleLoginSuccess = useCallback(() => {
        setView('admin');
    }, []);
    
    const handleLogout = useCallback(() => {
        setView('login');
    }, []);

    const handleSwitchToKiosk = useCallback(() => {
        setView('kiosk');
    }, []);

    switch (view) {
        case 'admin':
            return <AdminDashboard onLogout={handleLogout} />;
        case 'kiosk':
            return <KioskPage onExitKiosk={handleLogout} />;
        case 'login':
        default:
            return <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToKiosk={handleSwitchToKiosk} />;
    }
}

export default App;