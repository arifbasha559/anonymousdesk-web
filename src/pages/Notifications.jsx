import { useEffect } from 'react';
import { useNotifStore } from '../store/notifStore';
import { timeAgo } from '../utils/format';
import { HiOutlineCheck, HiOutlineBell } from 'react-icons/hi';

export default function Notifications() {
  const { items, unreadCount, isLoading, fetch, markRead, markAllRead } = useNotifStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-on-surface">Notifications</h1>
          {unreadCount > 0 && (
            <p className="font-label-sm text-text-secondary">{unreadCount} unread signals</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 font-label-md text-primary hover:underline">
            <HiOutlineCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </header>

      {isLoading && items.length === 0 && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center py-20 gap-2">
          <HiOutlineBell className="w-10 h-10 text-text-tertiary" />
          <p className="font-body-md text-text-secondary">No notifications yet</p>
        </div>
      )}

      {items.map((n) => (
        <button
          key={n.id || n.notificationId}
          onClick={() => !n.read && markRead(n.id || n.notificationId)}
          className={`w-full text-left px-4 py-4 border-b border-outline-variant/15 hover:bg-surface-container-low/40 transition-colors ${
            !n.read ? 'bg-primary/5' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
            <div className={`flex-1 min-w-0 ${n.read ? 'ml-5' : ''}`}>
              <p className="font-body-md text-on-surface leading-snug">
                {n.message || n.body || n.title}
              </p>
              <p className="font-label-sm text-text-secondary mt-1">
                {timeAgo(n.createdAt)} ago
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
