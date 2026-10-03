import { useEffect, useState, useCallback } from 'react';
import { postsApi } from '../services/api';
import PostCard from '../components/PostCard';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaArrowUpRightDots, FaClockRotateLeft } from 'react-icons/fa6';
import { FaHotjar } from 'react-icons/fa';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, hasNext: false, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('recent');

  const load = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await postsApi.list({ page, limit: 20, sort });
      const list = data.data || [];
      setPosts((prev) => (append ? [...prev, ...list] : list));
      setMeta(data.meta || { page, hasNext: false, total: list.length });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed. Is the API running?');
      if (!append) setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => { load(1); }, [load]);

  return (
    <div>
      {/* Header */}

      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-on-surface">Home</h1>
          <p className="font-label-sm text-text-secondary">Encrypted zero-knowledge feed</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="recent"><FaClockRotateLeft />Recent</option>
            <option value="top"><FaArrowUpRightDots /> Top</option>
            <option value="Hot"><FaHotjar /> Hot</option>
          </select>
        </div>
      </header>

      {/* Security banner */}
      <div className="px-4 py-2.5 border-b border-outline-variant/15 flex items-center gap-2 bg-surface-container-low/50">
        <HiOutlineSparkles className="w-4 h-4 text-secondary shrink-0" />
        <p className="font-label-sm text-on-surface-variant">
          All posts are anonymized & scrubbed · SHA-256 · ZK-Proof Valid
        </p>
      </div>

      {/* Feed */}
      {error && (
        <div className="m-4 p-4 rounded-xl bg-error-container/20 border border-error/30 text-error font-body-md">
          {error}
        </div>
      )}

      {loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-label-md text-text-secondary">Syncing encrypted zero-knowledge feed…</p>
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 px-6 text-center">
          <p className="font-headline-md text-on-surface">No dilemmas yet</p>
          <p className="font-body-md text-text-secondary">Be the first to post a confidential professional dilemma.</p>
        </div>
      )}
      {console.log(posts)
      }
      {posts.map((p, i) => (
        <PostCard key={i || p.id || p.postId} post={p} />
      ))}

      {meta.hasNext && (
        <div className="py-6 flex justify-center">
          <button
            onClick={() => load(meta.page + 1, true)}
            disabled={loading}
            className="px-6 py-2.5 rounded-full border border-outline-variant/40 font-body-md text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
