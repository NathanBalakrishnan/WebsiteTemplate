// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import AuthPopup from "../components/AuthPopup";

export default function Dashboard() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingTemplate, setPendingTemplate] = useState(null);

  useEffect(() => {
    // Check if there's a pending action after login redirect
    const pendingActionFromStorage = localStorage.getItem('pendingAction');
    const pendingTemplateIdFromStorage = localStorage.getItem('pendingTemplateId');
    
    if (isAuthenticated && pendingActionFromStorage && pendingTemplateIdFromStorage) {
      console.log('Executing pending action after login:', pendingActionFromStorage);
      
      // Clear pending items from storage
      localStorage.removeItem('pendingAction');
      localStorage.removeItem('pendingTemplateId');
      
      // Execute the pending action
      if (pendingActionFromStorage === 'preview') {
        navigate('/preview', { state: { templateId: parseInt(pendingTemplateIdFromStorage) } });
      } else if (pendingActionFromStorage === 'customize') {
        navigate('/customize', { state: { templateId: parseInt(pendingTemplateIdFromStorage) } });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleProtectedAction = (action, template) => {
    console.log('Protected action clicked:', action, template);
    
    if (!isAuthenticated) {
      // Save the pending action to state and localStorage
      setPendingAction(action);
      setPendingTemplate(template);
      setShowAuthPopup(true);
      console.log('Showing auth popup');
      return;
    }
    
    // If authenticated, proceed with action
    if (action === 'preview') {
      console.log('Navigating to preview');
      navigate('/preview', { state: { templateId: template.templateId } });
    } else if (action === 'customize') {
      console.log('Navigating to customize');
      navigate('/customize', { state: { templateId: template.templateId } });
    }
  };

  const handlePopupConfirm = () => {
    console.log('Popup confirmed - redirecting to login');
    setShowAuthPopup(false);
    
    // Save the intended action to localStorage before redirecting
    if (pendingAction && pendingTemplate) {
      localStorage.setItem('pendingAction', pendingAction);
      localStorage.setItem('pendingTemplateId', pendingTemplate.templateId.toString());
      console.log('Saved pending action:', pendingAction, pendingTemplate.templateId);
    }
    
    // Navigate to login page
    navigate('/login');
  };

  const handlePopupClose = () => {
    console.log('Popup closed');
    setShowAuthPopup(false);
    setPendingAction(null);
    setPendingTemplate(null);
  };

  return (
    <>
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        message="You need to login first to customize templates. Please login to continue."
      />
      <DashboardLayout 
        onProtectedAction={handleProtectedAction}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </>
  );
}