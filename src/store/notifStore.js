import { create } from 'zustand';
import { notifApi } from '../services/api';

export const useNotifStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,

  fetch: async (params = {}) => {
    set({ isLoading: true });
    try {
      const { data } = await notifApi.list(params);
      console.log(data)
      set({
        items: data.data || [],
        unreadCount: data.meta?.unreadCount ?? 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  markRead: async (id) => {
    try {
      await notifApi.markRead(id);
      set((s) => ({
        items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch { /* ignore */ }
  },

  markAllRead: async () => {
    try {
      await notifApi.markAllRead();
      set((s) => ({
        items: s.items.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch { /* ignore */ }
  },
  deleteOne: async (id) => {
    try {
      await notifApi.deleteOne(id);
      set((s) => ({
        items: s.items.map((n) => (n.id === id ? { ...n, deleted: true } : n)),
      }));
    } catch { /* ignore */ }
  },
  deleteAll: async () => {
    try {
      await notifApi.deleteAll();
      set((s) => ({
        items: [],
        unreadCount: 0,
      }));
    } catch { /* ignore */ }
  },
}));
