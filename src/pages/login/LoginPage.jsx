// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser } from 'react-icons/fi';
import '../../assets/css/Login.css'; // Import the CSS file

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, dummyUsers } = useSelector((state) => state.auth);

  // Redirect if already authenticated and handle pending action
  useEffect(() => {
    if (isAuthenticated) {
      const pendingAction = localStorage.getItem('pendingAction');
      const pendingTemplateId = localStorage.getItem('pendingTemplateId');
      
      console.log('Login successful - checking pending action:', pendingAction, pendingTemplateId);
      
      if (pendingAction && pendingTemplateId) {
        localStorage.removeItem('pendingAction');
        localStorage.removeItem('pendingTemplateId');
        
        if (pendingAction === 'preview') {
          navigate('/preview', { state: { templateId: parseInt(pendingTemplateId) } });
        } else if (pendingAction === 'customize') {
          navigate('/customize', { state: { templateId: parseInt(pendingTemplateId) } });
        }
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ username, password }));
    }
  };

  const handleDemoLogin = (demoUser) => {
    setUsername(demoUser.username);
    setPassword(demoUser.password);
    setErrors({});
    setTimeout(() => {
      dispatch(loginUser({ username: demoUser.username, password: demoUser.password }));
    }, 100);
  };

  const getTemplateIcon = (templateId) => {
    switch(templateId) {
      case 1: return '🏫';
      case 2: return '🎨';
      case 3: return '🛒';
      default: return '📄';
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-bg-animation">
        <div className="login-bg-circle-1"></div>
        <div className="login-bg-circle-2"></div>
        <div className="login-bg-circle-3"></div>
      </div>

      <div className="login-content">
        <div className="login-grid">
          {/* Left Side - Login Form */}
          <div className="login-form-card">
            <div className="login-form-header">
              <div className="login-logo">
                <span className="login-logo-icon">🎨</span>
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to access your templates</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`form-input ${errors.username ? 'input-error' : ''}`}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <div className="demo-badges">
                <span className="demo-badge">admin / admin123</span>
                <span className="demo-badge">demo / demo123</span>
                <span className="demo-badge">horizon / horizon123</span>
              </div>
            </div>
          </div>

          {/* Right Side - Demo Users */}
          <div className="demo-users-section">
            <div className="demo-users-card">
              <h3 className="demo-users-title">
                <span className="demo-users-icon">👥</span>
                Quick Demo Access
              </h3>
              <p className="demo-users-subtitle">
                Try different user accounts to see different template access
              </p>
              
              <div className="demo-users-list">
                {dummyUsers && dummyUsers.length > 0 ? (
                  dummyUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleDemoLogin(user)}
                      className="demo-user-btn"
                    >
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="demo-user-avatar" 
                      />
                      <div className="demo-user-info">
                        <p className="demo-user-name">{user.name}</p>
                        <p className="demo-user-username">@{user.username}</p>
                      </div>
                      <div className="demo-user-templates">
                        {user.templates && user.templates.map(tid => (
                          <div key={tid} className="template-icon" title={`Template ${tid}`}>
                            {getTemplateIcon(tid)}
                          </div>
                        ))}
                      </div>
                      <FiArrowRight className="demo-user-arrow" size={16} />
                    </button>
                  ))
                ) : (
                  <p className="no-users">No demo users available</p>
                )}
              </div>
            </div>

            <div className="features-card">
              <h3 className="features-title">
                <span className="features-icon">✨</span>
                Features
              </h3>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  Multi-template support
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  Real-time customization
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  Save to localStorage
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  Export JSON
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  Persistent login
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  Responsive design
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}