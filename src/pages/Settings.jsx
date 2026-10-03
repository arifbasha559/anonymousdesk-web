import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineLogout, HiOutlineMoon, HiOutlineSun, HiOutlineDesktopComputer } from 'react-icons/hi';

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3">
        <h1 className="font-headline-lg text-on-surface">Settings</h1>
        <p className="font-label-sm text-text-secondary">Cryptographic preferences</p>
      </header>

      <div className="p-4 space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="font-headline-md text-on-surface mb-3">Appearance</h2>
          <div className="flex gap-2">
            {[
              { id: 'dark', label: 'Dark', icon: HiOutlineMoon },
              { id: 'light', label: 'Light', icon: HiOutlineSun },
              { id: 'system', label: 'System', icon: HiOutlineDesktopComputer },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-label-md transition-colors ${
                  theme === id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Profile */}
        <section>
          <h2 className="font-headline-md text-on-surface mb-3">Identity</h2>
          <div className="bg-surface-container rounded-2xl border border-outline-variant/20 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                <HiOutlineShieldCheck className="w-6 h-6 text-on-surface-variant" />
              </div>
              <div>
                <p className="font-body-lg-bold text-on-surface">{user?.anonId || '—'}</p>
                <p className="font-label-sm text-text-secondary">
                  {user?.jobTitle} · {user?.industry}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-surface-container-low rounded-xl p-3">
                <p className="font-label-sm text-text-secondary">Karma</p>
                <p className="font-headline-md text-on-surface">{user?.karma ?? 0}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-3">
                <p className="font-label-sm text-text-secondary">Trust Level</p>
                <p className="font-headline-md text-on-surface capitalize">{user?.trustLevel || 'member'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy toggles (UI only — backend controlled) */}
        <section>
          <h2 className="font-headline-md text-on-surface mb-3">Privacy & Security</h2>
          <div className="bg-surface-container rounded-2xl border border-outline-variant/20 divide-y divide-outline-variant/15">
            {[
              { title: 'Disappearing Dilemmas', desc: 'Permanently scrub thread nodes after 7 days.', badge: 'AUTO-BURN', on: true },
              { title: 'Client-Side Lexical Scrubbing', desc: 'Pre-warn and redact internal jargon before publishing.', badge: 'ON-DEVICE', on: true },
              { title: 'EXIF & Screenshot Font Normalizer', desc: 'Strip camera models, timestamps, and raster artifacts.', badge: null, on: true },
            ].map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-body-md-medium text-on-surface">{item.title}</p>
                    {item.badge && (
                      <span className="font-label-xs text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-label-sm text-text-secondary mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${item.on ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.on ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security guarantees */}
        <section className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-4 space-y-3">
          <p className="font-body-md-medium text-on-surface flex items-center gap-2">
            <HiOutlineShieldCheck className="w-5 h-5 text-secondary" />
            Security Guarantees
          </p>
          {[
            'Passwords never stored. Client-side Argon2id salted auth computed locally.',
            'Real names & corporate emails purged immediately post-verification.',
            'IP & hardware telemetry stripped at edge proxy before entering the stream.',
          ].map((t) => (
            <p key={t} className="font-label-sm text-on-surface-variant flex gap-2">
              <span className="text-secondary">✓</span> {t}
            </p>
          ))}
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-error/40 text-error font-body-md-medium hover:bg-error/10 transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign out & clear session
        </button>
      </div>
    </div>
  );
}
