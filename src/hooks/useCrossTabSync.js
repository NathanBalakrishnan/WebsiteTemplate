// src/hooks/useCrossTabSync.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { syncAuthState, logout } from '../redux/slices/authSlice';

export const useCrossTabSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Handle storage events (triggered when localStorage changes in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        console.log('Storage changed in another tab:', e.key);
        
        // Check if token still exists
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          // User logged in/updated in another tab
          try {
            const user = JSON.parse(userData);
            dispatch(syncAuthState({
              isAuthenticated: true,
              user: user
            }));
            console.log('✅ Synced authentication from another tab');
          } catch (error) {
            console.error('Error syncing user data:', error);
          }
        } else {
          // User logged out in another tab
          dispatch(logout());
          console.log('❌ User logged out in another tab');
        }
      }
    };

    // Handle beforeunload to clear sync flag
    const handleBeforeUnload = () => {
      sessionStorage.setItem('tab_closing', 'true');
    };

    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, check if user data is still valid
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (!token && !userData) {
          dispatch(logout());
        }
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);
};