import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate('/');
    } catch { /* error in store */ }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-14 h-14 mb-4" />
          <h1 className="font-headline-xl text-on-surface">AnonymousDesk</h1>
          <p className="font-body-md text-text-secondary mt-1">Confidential professional discourse</p>
          <span className="mt-2 font-label-xs text-primary border border-primary/40 rounded-full px-2 py-0.5">
            END-TO-END ENCRYPTED
          </span>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container rounded-2xl border border-outline-variant/20 p-6 space-y-4">
          <h2 className="font-headline-md text-on-surface mb-2">Sign in</h2>

          {error && (
            <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error font-label-md">
              {error}
            </div>
          )}

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 font-body-md text-on-surface placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 rounded-full text-white font-body-lg-bold disabled:opacity-60 focus-ring"
          >
            {isLoading ? 'Authenticating…' : 'Enter Vault'}
          </button>

          <p className="text-center font-label-md text-text-secondary">
            No account?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Register anonymously
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center font-label-sm text-text-tertiary leading-relaxed px-4">
          Passwords never leave your device unhashed. Real names & corporate emails are purged post-OAuth. Only cryptographic zk-SNARK remains.
        </p>
      </div>
    </div>
  );
}
