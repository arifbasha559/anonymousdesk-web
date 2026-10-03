import { useEffect, useState } from 'react';
import { usersApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { formatCount } from '../utils/format';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [karma, setKarma] = useState(null);

  useEffect(() => {
    fetchProfile();
    usersApi.karma().then((r) => setKarma(r.data.data)).catch(() => {});
  }, [fetchProfile]);

  return (
    <div>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3">
        <h1 className="font-headline-lg text-on-surface">Profile</h1>
        <p className="font-label-sm text-text-secondary">Verified anonymous identity</p>
      </header>

      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
            <HiOutlineShieldCheck className="w-8 h-8 text-on-surface-variant" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-lg text-on-surface">{user?.anonId || '—'}</h2>
              {user?.industryVerified && (
                <span className="font-label-xs text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            <p className="font-body-md text-text-secondary">
              {user?.jobTitle} · {user?.industry}
            </p>
            <p className="font-label-sm text-text-tertiary mt-0.5">
              {user?.experienceYears ?? '—'} yrs experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface-container rounded-xl p-4 text-center border border-outline-variant/15">
            <p className="font-headline-md text-on-surface">{formatCount(user?.karma ?? 0)}</p>
            <p className="font-label-sm text-text-secondary">Karma</p>
          </div>
          <div className="bg-surface-container rounded-xl p-4 text-center border border-outline-variant/15">
            <p className="font-headline-md text-on-surface capitalize">{user?.trustLevel || 'member'}</p>
            <p className="font-label-sm text-text-secondary">Trust</p>
          </div>
          <div className="bg-surface-container rounded-xl p-4 text-center border border-outline-variant/15">
            <p className="font-headline-md text-on-surface">{user?.industryVerified ? 'Yes' : 'No'}</p>
            <p className="font-label-sm text-text-secondary">Verified</p>
          </div>
        </div>

        {karma && Array.isArray(karma) && karma.length > 0 && (
          <section>
            <h3 className="font-headline-md text-on-surface mb-3">Karma history</h3>
            <div className="space-y-2">
              {karma.slice(0, 20).map((k, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                  <span className="font-body-md text-on-surface-variant">{k.reason || k.action || 'Activity'}</span>
                  <span className={`font-body-md-medium ${k.delta > 0 ? 'text-tertiary' : 'text-error'}`}>
                    {k.delta > 0 ? '+' : ''}{k.delta ?? k.amount ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
