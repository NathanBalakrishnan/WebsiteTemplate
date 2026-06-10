// src/pages/DashboardLayout.jsx
import "../assets/css/DashboardLayout.css";
import "../assets/css/AuthPopup.css";
import Welcome from "./HomePage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";
import { 
  FiLogOut, 
  FiUser, 
  FiGrid, 
  FiHome, 
  FiSettings,
  FiPackage,
} from "react-icons/fi";
import { useState } from "react";

export default function DashboardLayout({ onProtectedAction, isAuthenticated, user: propUser }) {
  const { user: reduxUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = propUser || reduxUser;

  const handleLogout = () => {
    console.log('Logout clicked');
    dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/dashboard', icon: <FiGrid />, label: 'Templates' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">
              <FiPackage size={28} color="#8b5cf6" />
            </span>
            <h2>TemplateStudio</h2>
          </div>
        </div>
        
        <div className="header-right">
          {isAuthenticated && user ? (
            <div className="user-menu-container">
              <div 
                className="user-info" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img src={user?.avatar} alt={user?.name} className="user-avatar" />
                <span className="user-name">{user?.name}</span>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <img src={user?.avatar} alt={user?.name} className="dropdown-avatar" />
                    <div>
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => navigate('/settings')}>
                    <FiUser /> Profile Settings
                  </button>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn-header" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Section */}
      <div className="main-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}>
                <FiHome className="nav-icon" />
                <span>Dashboard</span>
              </li>
              <li onClick={() => navigate('/dashboard')}>
                <FiGrid className="nav-icon" />
                <span>Templates</span>
              </li>
              <li className={location.pathname === '/settings' ? 'active' : ''} onClick={() => navigate('/settings')}>
                <FiSettings className="nav-icon" />
                <span>Settings</span>
              </li>
            </ul>
          </nav>
          
          {isAuthenticated && (
            <button className="sidebar-logout" onClick={handleLogout}>
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          )}
        </aside>

        <main className="content">
          <Welcome 
            onProtectedAction={onProtectedAction}
            isAuthenticated={isAuthenticated}
          />
        </main>
      </div>

      <footer className="footer">
        <p>© 2026 TemplateStudio. All Rights Reserved.</p>
      </footer>
    </div>
  );
}