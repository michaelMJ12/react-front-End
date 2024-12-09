import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/campaigns'; 
import '../styles/Sidebar.css';

interface SidebarProps {
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken'); // Retrieve token from storage (or use cookies/sessionStorage)
        if (token) {
            try {
                // Call the logout API with the token
                await logout(token);
                // Clear the token after successful logout
                localStorage.removeItem('authToken');
                // Call the onLogout function for any additional cleanup
                onLogout();
                navigate('/login');
            } catch (error) {
                console.error('Logout failed', error);
            }
        } else {
            console.error('No authentication token found');
        }
    };

    return (
        <div className="sidebar">
            <h2>Admin Dashboard</h2>
            <hr style={{ border: "none", borderTop: "6px solid gold", width: "calc(100% + 40px)", marginLeft: "-20px", marginRight: "-20px", marginTop: "20px", marginBottom: "20px" }} />
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <hr />
                <li><Link to="/campaigns">Campaigns List</Link></li>
                <hr />
                <li><Link to="/create">Create Campaign</Link></li>
                <hr />
                <li><Link to="/signup">Create Account</Link></li>
            </ul>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Sidebar;
