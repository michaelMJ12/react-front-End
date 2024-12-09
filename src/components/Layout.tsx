import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Import Outlet for nested routing and useNavigate for redirects
import Sidebar from './Sidebar';
import '../styles/Main.css';

const Layout: React.FC = () => {
  const navigate = useNavigate(); 

  // Define the onLogout function
  const handleLogout = () => {
    // Clear the authentication token (or other session data)
    localStorage.removeItem('authToken'); // Or use sessionStorage, cookies;
    // Redirect to the login page after logging out
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Pass the handleLogout function to the Sidebar component */}
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Outlet />  {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default Layout;
