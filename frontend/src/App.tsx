import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BrandSetup from './pages/BrandSetup';
import TemplateGallery from './pages/TemplateGallery';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brand-setup" element={<BrandSetup />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/create" element={<TemplateGallery />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;