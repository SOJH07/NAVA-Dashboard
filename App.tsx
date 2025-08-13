import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import KioskPage from './pages/KioskPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/admin/*" element={<AdminDashboard />} />
    <Route path="/kiosk" element={<KioskPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
