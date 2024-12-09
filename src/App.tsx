import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CampaignList from './components/CampaignList';
import CampaignForm from './components/CampaignForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Simulate login success
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Login route (landing page) */}
        <Route path="/login" element={!isAuthenticated ? <LoginForm onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />

        {/* Protected routes with layout (only accessible after login) */}
        <Route element={<Layout />}>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/create" element={<CampaignForm />} />
          <Route path="/campaigns/edit/:id" element={<CampaignForm />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
