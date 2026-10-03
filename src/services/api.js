import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('ad_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 + token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('ad_refresh_token');
      if (!refreshToken) {
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE}/auth/token/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefresh, expiresAt } = data.data;
        setTokens(accessToken, newRefresh, expiresAt);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function setTokens(accessToken, refreshToken, expiresAt) {
  const secure = window.location.protocol === 'https:';
  Cookies.set('ad_access_token', accessToken, {
    expires: expiresAt ? new Date(expiresAt) : 1,
    secure,
    sameSite: 'strict',
  });
  if (refreshToken) {
    Cookies.set('ad_refresh_token', refreshToken, {
      expires: 30,
      secure,
      sameSite: 'strict',
    });
  }
}

export function clearAuth() {
  Cookies.remove('ad_access_token');
  Cookies.remove('ad_refresh_token');
}

export function getAccessToken() {
  return Cookies.get('ad_access_token');
}

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (body) => api.post('/auth/register', body),
  login: (body) => api.post('/auth/login', body),
  refresh: (refreshToken) => api.post('/auth/token/refresh', { refreshToken }),
  revoke: (refreshToken) => api.post('/auth/token/revoke', { refreshToken }),
  updateIndustry: (body) => api.patch('/auth/profile/industry', body),
};

// ── Posts ─────────────────────────────────────────────
export const postsApi = {
  list: (params) => api.get('/posts', { params }),
  get: (postId) => api.get(`/posts/${postId}`),
  create: (body) => api.post('/posts', body),
  upvote: (postId) => api.post(`/posts/${postId}/upvote`),
  remove: (postId) => api.delete(`/posts/${postId}`),
  report: (postId, body) => api.post(`/posts/${postId}/report`, body),
  replies: (postId) => api.get(`/posts/${postId}/replies`),
  createReply: (postId, body) => api.post(`/posts/${postId}/replies`, body),
};

// ── Replies ───────────────────────────────────────────
export const repliesApi = {
  helpful: (replyId) => api.post(`/replies/${replyId}/helpful`),
  remove: (replyId) => api.delete(`/replies/${replyId}`),
  report: (replyId, body) => api.post(`/replies/${replyId}/report`, body),
};

// ── Notifications ─────────────────────────────────────
export const notifApi = {
  list: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  deleteOne: (id) => api.delete(`/notifications/${id}/delete`),
  deleteAll: () => api.delete(`/notifications/delete-all`)
};

// ── Users ─────────────────────────────────────────────
export const usersApi = {
  karma: () => api.get('/users/me/karma'),
  profile: () => api.get('/users/me/profile'),
};

// ── Admin ─────────────────────────────────────────────
export const adminApi = {
  reports: (params) => api.get('/admin/reports', { params }),
  resolveReport: (id, body) => api.patch(`/admin/reports/${id}/resolve`, body),
  banUser: (anonId, body) => api.post(`/admin/users/${anonId}/ban`, body),
};

export default api;
