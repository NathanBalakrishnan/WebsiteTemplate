// src/components/AuthPopup.jsx
import { useEffect } from 'react';
import { FiLogIn, FiX, FiAlertCircle } from 'react-icons/fi';

const AuthPopup = ({ isOpen, onClose, onConfirm, message }) => {
  // Close popup on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-popup-overlay" onClick={onClose}>
      <div className="auth-popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-popup-close" onClick={onClose}>
          <FiX size={24} />
        </button>
        
        <div className="auth-popup-icon">
          <FiAlertCircle size={48} />
        </div>
        
        <h3 className="auth-popup-title">Authentication Required</h3>
        
        <p className="auth-popup-message">{message}</p>
        
        <div className="auth-popup-buttons">
          <button className="auth-popup-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="auth-popup-confirm" onClick={onConfirm}>
            <FiLogIn size={18} />
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;