// src/App.jsx (modified)
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage } from "./redux/slices/authSlice";
import { useCrossTabSync } from "./hooks/useCrossTabSync";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Login from "./pages/login/LoginPage";
import Dashboard from "./pages/Dashboard";
import CustomizedParent from "./pages/customized/CustomizedParent";
import PreviewTemplate from "./pages/preview/PreviewParent";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useCrossTabSync();

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(loadUserFromStorage());
      setInitialLoadComplete(true);
    };
    loadUser();
  }, [dispatch]);

  if (!initialLoadComplete || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />{" "}
      {/* ← no ProtectedRoute */}
      <Route
        path="/customize"
        element={
          <ProtectedRoute>
            <CustomizedParent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview"
        element={
          <ProtectedRoute>
            <PreviewTemplate />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
