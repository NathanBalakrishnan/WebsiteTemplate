// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Dummy users data
export const dummyUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    name: "John Admin",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    templates: [1, 2, 3]
  },
  {
    id: 2,
    username: "horizon",
    password: "horizon123",
    name: "Sarah Johnson",
    email: "sarah@horizon.com",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    templates: [1]
  },
  {
    id: 3,
    username: "slides",
    password: "slides123",
    name: "Mike Chen",
    email: "mike@slides.com",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    templates: [2]
  },
  {
    id: 4,
    username: "shopping",
    password: "shop123",
    name: "Emma Watson",
    email: "emma@organic.com",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    templates: [3]
  },
  {
    id: 5,
    username: "demo",
    password: "demo123",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    templates: [1, 2]
  }
];

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  dummyUsers: dummyUsers
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        ...action.payload,
        templates: action.payload.templates || []
      };
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    syncAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.loading = false;
    }
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError, 
  setLoading,
  syncAuthState 
} = authSlice.actions;

// Login user
export const loginUser = (credentials) => (dispatch) => {
  dispatch(loginStart());
  
  setTimeout(() => {
    const { username, password } = credentials;
    const user = dummyUsers.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      const userWithTemplates = {
        ...userWithoutPassword,
        templates: userWithoutPassword.templates || []
      };
      dispatch(loginSuccess(userWithTemplates));
      
      // Save to localStorage
      localStorage.setItem('auth_token', 'dummy_token_123');
      localStorage.setItem('user_data', JSON.stringify(userWithTemplates));
      localStorage.setItem('currentUserId', userWithTemplates.id.toString());
      
      // Dispatch custom event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'auth_token',
        newValue: 'dummy_token_123',
        oldValue: null
      }));
    } else {
      dispatch(loginFailure('Invalid username or password'));
    }
  }, 1000);
};

// Load user from localStorage on app start
export const loadUserFromStorage = () => (dispatch) => {
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      const userWithTemplates = {
        ...user,
        templates: user.templates || []
      };
      dispatch(loginSuccess(userWithTemplates));
      console.log('✅ User loaded from storage:', userWithTemplates.name);
      return true;
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('currentUserId');
      dispatch(setLoading(false));
    }
  } else {
    dispatch(setLoading(false));
  }
  return false;
};

// Logout user
export const logoutUser = () => (dispatch) => {
  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('currentUserId');
  
  // Dispatch logout action
  dispatch(logout());
  
  // Dispatch custom event for cross-tab communication
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'auth_token',
    newValue: null,
    oldValue: 'dummy_token_123'
  }));
};

export default authSlice.reducer;