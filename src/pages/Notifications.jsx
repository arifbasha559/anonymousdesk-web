import { useEffect } from 'react';
import { useNotifStore } from '../store/notifStore';
import { timeAgo } from '../utils/format';
import { HiOutlineCheck, HiOutlineBell, HiOutlineTrash, HiOutlineClipboardCheck } from 'react-icons/hi';
import { FaListCheck } from 'react-icons/fa6';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { items, unreadCount, isLoading, fetch, markRead, markAllRead, deleteOne, deleteAll } = useNotifStore();

  useEffect(() => { fetch(); }, [fetch]);
  
  const navigate = useNavigate();
  return (
    <div>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between">

        <div>
          <h1 className="font-headline-lg text-on-surface">Notifications</h1>
          {unreadCount > 0 && (
            <p className="font-label-sm text-text-secondary">{unreadCount} unread signals</p>
          )}
        </div>
        <div className="flex item-center justify-end gap-4">
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 cursor-pointer font-label-md text-primary hover:underline">
              <FaListCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          {items.length > 0 && (
            <button onClick={deleteAll}
              className="flex items-center gap-1.5 cursor-pointer font-label-md text-primary hover:underline">
              <HiOutlineTrash className="w-4 h-4" />
              Delete All
            </button>
          )}
        </div>
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
      {console.log(items)}
      {items.map((n) => (
        <button
          key={n.id || n.notificationId}
          className={`w-full text-left px-4 py-4 border-b border-outline-variant/15 hover:bg-surface-container-low/40 transition-colors ${!n.read ? 'bg-primary/5' : ''
            }`}
        >
          <div className="flex items-start gap-3">
            {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
            <div className={`flex-1 min-w-0 ${n.read ? 'ml-5' : ''}`}>
              <p className="font-body-md text-on-surface leading-snug">
                {n.message || n.body || n.title}
              </p>
              <p className="font-label-sm text-text-secondary mt-1">
                {timeAgo(n.createdAt)} ago
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 hover:text-primary transition-colors">
              <BsBoxArrowUpRight

                onClick={() => navigate(`/posts/${n.refPostId}` || '/')}
                className='w-4 h-4 text-text-secondary shrink-0' />
              {!n.isRead && (
                <HiOutlineCheck
                  onClick={() =>  markRead(n.id || n.notificationId)}
                  className="w-4 h-4 text-primary shrink-0" />
              )}
              <HiOutlineTrash
                onClick={(e) => {
                  e.stopPropagation();
                  deleteOne(n.id || n.notificationId);
                }}
                className="w-4 h-4 text-text-secondary shrink-0 hover:text-error cursor-pointer"
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
