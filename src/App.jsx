import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { getAccessToken } from './services/api';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Compose from './pages/Compose';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Search from './pages/Search';

function AuthInit({ children }) {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const setUser = useAuthStore((s) => s.setUser);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    initTheme();
    if (getAccessToken()) {
      fetchProfile();
    } else {
      setUser(null);
    }
  }, [fetchProfile, setUser, initTheme]);

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInit>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="posts/:postId" element={<PostDetail />} />
            <Route path="compose" element={<Compose />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search" element={<Search />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInit>
    </BrowserRouter>
  );
}
