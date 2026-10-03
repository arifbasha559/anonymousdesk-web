import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';

const INDUSTRIES = [
  'Technology', 'Finance', 'Legal', 'Healthcare', 'Consulting',
  'Manufacturing', 'Media', 'Government', 'Education', 'Other',
];

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    industry: '',
    jobTitle: '',
    yearsExp: '',
  });
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        email: form.email,
        password: form.password,
        industry: form.industry,
        jobTitle: form.jobTitle,
        yearsExp: Number(form.yearsExp) || 0,
      });
      navigate('/');
    } catch { /* store handles */ }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-12 h-12 mb-3" />
          <h1 className="font-headline-xl text-on-surface">Create anonymous identity</h1>
          <p className="font-body-md text-text-secondary mt-1 text-center">
            Your real identity is scrubbed. Only industry credentials remain.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container rounded-2xl border border-outline-variant/20 p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error font-label-md">
              {error}
            </div>
          )}

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Email</label>
            <input type="email" required autoComplete="email" value={form.email} onChange={set('email')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="you@company.com" />
          </div>

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Password</label>
            <input type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="Min. 8 characters" />
          </div>

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Industry</label>
            <select required value={form.industry} onChange={set('industry')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary/50">
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Job title</label>
            <input type="text" required value={form.jobTitle} onChange={set('jobTitle')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="e.g. Staff Engineer, General Counsel" />
          </div>

          <div>
            <label className="font-label-md text-on-surface-variant mb-1.5 block">Years of experience</label>
            <input type="number" min={0} max={50} required value={form.yearsExp} onChange={set('yearsExp')}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="5" />
          </div>

          <button type="submit" disabled={isLoading}
            className="btn-primary w-full py-3.5 rounded-full text-white font-body-lg-bold disabled:opacity-60 focus-ring">
            {isLoading ? 'Creating identity…' : 'Create Anonymous Identity'}
          </button>

          <p className="text-center font-label-md text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
