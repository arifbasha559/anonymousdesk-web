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
import { GoDotFill } from 'react-icons/go';
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

export default function Sidebar({ left, setLeft }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const unread = useNotifStore((s) => s.unreadCount);

  const expanded = left.hover || left.value;

  // Collapsible label: always mounted, animated via max-width / opacity / margin.
  // Margin replaces `gap-*` so no leftover space remains when collapsed.
  const label = (margin = 'ml-4') =>
    `block overflow-hidden whitespace-nowrap transition-all duration-200 ease-out ${
      expanded ? `max-w-[220px] opacity-100 ${margin}` : 'max-w-0 opacity-0 ml-0'
    }`;

  return (
    <div
      className="flex flex-col h-full w-full relative z-10"
      onMouseEnter={() => setLeft((prev) => ({ ...prev, hover: true }))}
      onMouseLeave={() => setLeft((prev) => ({ ...prev, hover: false }))}
    >
      {/* Logo */}
      <div className="flex items-center px-3 py-2 mb-4">
        <Logo className="w-9 h-9 shrink-0" />
        <div className={`${label('ml-2.5')} flex flex-col items-start gap-1`}>
          <span className="font-headline-lg text-on-surface tracking-tight">AnonymousDesk</span>
          <span className="font-label-xs text-primary flex items-center border border-primary/40 rounded-full px-1.5 py-0.5 leading-none">
            <GoDotFill className="size-3 animate-pulse" />
            CONFIDENTIAL
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ to, label: text, icon: Icon, activeIcon: ActiveIcon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-full transition-colors group focus-ring ${
                isActive
                  ? 'bg-surface-container-high text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative shrink-0">
                  {isActive ? (
                    <ActiveIcon className="w-6.5 h-6.5" />
                  ) : (
                    <Icon className="w-6.5 h-6.5" />
                  )}
                  {badge && unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </span>
                <span className={`${label()} font-body-lg`}>{text}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Post Dilemma CTA */}
      <button
        onClick={() => navigate('/compose')}
        className="flex btn-primary items-center w-full px-3 py-3 rounded-full transition-colors group focus-ring"
      >
        <HiOutlinePencilAlt className="w-6.5 h-6.5 shrink-0" />
        <span className={`${label()} font-body-lg`}>Create Dilemma</span>
      </button>

      {/* User chip */}
      {user && (
        <NavLink
          to="/profile"
          className="flex items-center mt-2 rounded-full w-full hover:bg-surface-container-low cursor-pointer transition-colors"
        >
          <div className="shrink-0 px-3 py-3 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
            <HiOutlineShieldCheck className="w-6.5 h-6.5 text-on-surface-variant" />
          </div>
          <div className={`${label('ml-3')} min-w-0`}>
            <div className="flex items-center gap-1">
              <span className="font-body-md-medium text-on-surface truncate">
                {user.anonId?.slice(0, 20) || 'anon'}
              </span>
              {user.industryVerified && <span className="text-tertiary text-sm">✓</span>}
            </div>
            <p className="font-label-sm text-text-secondary truncate">
              {user.jobTitle || 'Member'} · {user.industry || '—'}
            </p>
          </div>
        </NavLink>
      )}
    </div>
  );
}