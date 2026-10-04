import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineSparkles, HiOutlineShieldCheck } from 'react-icons/hi';
import { useState } from 'react';

const TRENDING = [
  { tag: '#TechLayoffs', category: 'Severance & Equity', count: '1.4k', status: 'Trending' },
  { tag: '#NonCompeteFTC', category: 'Enforcement rulings', count: '890', status: 'Trending' },
  { tag: '#CSuiteClawbacks', category: 'Boardroom disputes', count: '642', status: 'Trending' },
  { tag: '#LLMTrainingDataLeak', category: 'Whistleblowing', count: '412', status: 'Active' },
];


export default function RightRail() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <form onSubmit={onSearch} className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search dilemmas, tags, sectors..."
          className="w-full bg-surface-container-low border border-outline-variant/20 rounded-full py-3 pl-12 pr-4 font-body-md text-on-surface placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors" />
      </form>
      <div className="flex flex-col h-full justify-between">

        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-auto ">
          <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-surface-container rounded-t-2xl border-b border-outline-variant/15">
            <h2 className="font-headline-md text-on-surface">Trending Dilemmas</h2>
            <HiOutlineSparkles className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="divide-y divide-outline-variant/15">
            {TRENDING.map((t) => (
              <Link key={t.tag} to={`/search?tag=${encodeURIComponent(t.tag.slice(1))}`}
                className="block px-4 py-3 hover:bg-surface-container-low transition-colors">
                <p className="font-label-sm text-text-secondary">{t.category} · {t.status}</p>
                <p className="font-body-lg-bold text-on-surface mt-0.5">{t.tag}</p>
                <p className="font-label-sm text-text-secondary mt-0.5">{t.count} dilemmas</p>
              </Link>
            ))}
          </div>
        </div>



        <div className="px-0 py-2">
          <p className="font-label-sm text-text-tertiary leading-relaxed text-center">ZK Whitepaper · Privacy Protocol · Terms</p>
          <p className="font-label-sm text-text-tertiary mt-1 text-center">© 2025 AnonymousDesk Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}