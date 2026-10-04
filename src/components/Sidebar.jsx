import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlinePencilAlt,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiHome,
  HiBell,
  HiCog,
  HiShieldCheck,
} from 'react-icons/hi';
import { useAuthStore } from '../store/authStore';
import { useNotifStore } from '../store/notifStore';
import Logo from './Logo';

const navItems = [
  { to: '/', label: 'Home', icon: HiOutlineHome, activeIcon: HiHome },
  { to: '/search', label: 'Search', icon: HiOutlineSearch, activeIcon: HiOutlineSearch },
  { to: '/notifications', label: 'Notifications', icon: HiOutlineBell, activeIcon: HiBell, badge: true },
  { to: '/compose', label: 'Create Post', icon: HiOutlinePencilAlt, activeIcon: HiOutlinePencilAlt },
  { to: '/profile', label: 'Profile', icon: HiOutlineShieldCheck, activeIcon: HiShieldCheck },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog, activeIcon: HiCog },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const unread = useNotifStore((s) => s.unreadCount);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-2 mb-4">
        <Logo className="w-9 h-9" />
        <div className="flex items-center gap-2">
          <span className="font-headline-lg text-on-surface tracking-tight">AnonymousDesk</span>
          <span className="font-label-xs text-primary border border-primary/40 rounded-full px-1.5 py-0.5 leading-none">
            CONFIDENTIAL
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ to, label, icon: Icon, activeIcon: ActiveIcon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-full transition-colors group focus-ring ${
                isActive
                  ? 'bg-surface-container-high text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  {isActive ? (
                    <ActiveIcon className="w-[26px] h-[26px]" />
                  ) : (
                    <Icon className="w-[26px] h-[26px]" />
                  )}
                  {badge && unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </span>
                <span className="font-body-lg">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Post Dilemma CTA */}
      <button
        onClick={() => navigate('/compose')}
        className="btn-primary w-full py-3.5 rounded-full text-white font-body-lg-bold mt-4 mb-4 focus-ring"
      >
        Post Dilemma
      </button>

      {/* User chip */}
      {user && (
        <div className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-surface-container-low cursor-pointer transition-colors mt-auto">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
            <HiOutlineShieldCheck className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-body-md-medium text-on-surface truncate">
                {user.anonId || 'anon'}
              </span>
              {user.industryVerified && (
                <span className="text-tertiary text-sm">✓</span>
              )}
            </div>
            <p className="font-label-sm text-text-secondary truncate">
              {user.jobTitle || 'Member'} · {user.industry || '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}