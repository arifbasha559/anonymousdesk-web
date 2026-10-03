import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch, HiOutlineBell, HiOutlinePencilAlt, HiOutlineCog } from 'react-icons/hi';
import { useNotifStore } from '../store/notifStore';

const items = [
  { to: '/', icon: HiOutlineHome, label: 'Home' },
  { to: '/search', icon: HiOutlineSearch, label: 'Search' },
  { to: '/compose', icon: HiOutlinePencilAlt, label: 'Post' },
  { to: '/notifications', icon: HiOutlineBell, label: 'Alerts', badge: true },
  { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
];

export default function MobileNav() {
  const unread = useNotifStore((s) => s.unreadCount);
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-container-low border-t border-outline-variant/20 safe-bottom">
      <div className="flex items-center justify-around py-2">
        {items.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 relative ${isActive ? 'text-primary' : 'text-text-secondary'}`
            }>
            <span className="relative">
              <Icon className="w-6 h-6" />
              {badge && unread > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
