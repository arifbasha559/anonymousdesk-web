import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, usersApi, setTokens, clearAuth, getAccessToken } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: !!getAccessToken(),
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.login({ email, password });
          const d = data.data;
          setTokens(d.accessToken, d.refreshToken, d.expiresAt);
          set({
            user: {
              anonId: d.anonId,
              industry: d.industry,
              jobTitle: d.jobTitle,
              experienceYears: d.experienceYears,
              industryVerified: d.industryVerified,
              karma: d.karma,
              trustLevel: d.trustLevel,
              isNewUser: d.isNewUser,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return d;
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Login failed';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authApi.register(payload);
          const d = data.data;
          setTokens(d.accessToken, d.refreshToken, d.expiresAt);
          set({
            user: {
              anonId: d.anonId,
              industry: d.industry,
              jobTitle: d.jobTitle,
              experienceYears: d.experienceYears,
              industryVerified: d.industryVerified,
              karma: d.karma,
              trustLevel: d.trustLevel,
              isNewUser: d.isNewUser,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return d;
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          const refreshToken = document.cookie
            .split('; ')
            .find((r) => r.startsWith('ad_refresh_token='))
            ?.split('=')[1];
          if (refreshToken) await authApi.revoke(refreshToken);
        } catch {
          /* ignore */
        }
        clearAuth();
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        if (!getAccessToken()) return;
        try {
          const { data } = await usersApi.profile();
          console.log(data);

          set({ user: { ...get().user, ...data.data }, isAuthenticated: true });
        } catch(err) {
          console.log(err,'Failed to fetch profile');
          /* token may be invalid */
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ad-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
