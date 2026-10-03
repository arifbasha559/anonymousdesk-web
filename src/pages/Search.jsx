import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsApi } from '../services/api';
import PostCard from '../components/PostCard';
import { HiOutlineSearch } from 'react-icons/hi';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || params.get('tag') || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async (query) => {
    if (!query.trim()) { setPosts([]); return; }
    setLoading(true);
    try {
      const { data } = await postsApi.list({
        search: query,
        tag: params.get('tag') || undefined,
        limit: 30,
      });
      setPosts(data.data || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = params.get('q') || params.get('tag');
    if (initial) runSearch(initial);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setParams(q ? { q } : {});
    runSearch(q);
  };

  return (
    <div>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3">
        <form onSubmit={onSubmit} className="relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dilemmas, tags, sectors..."
            autoFocus
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-full py-3 pl-12 pr-4 font-body-md text-on-surface placeholder:text-text-tertiary focus:outline-none focus:border-primary/50"
          />
        </form>
      </header>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && posts.length === 0 && q && (
        <p className="text-center py-16 font-body-md text-text-secondary">No results for “{q}”</p>
      )}

      {posts.map((p) => (
        <PostCard key={p.id || p.postId} post={p} />
      ))}
    </div>
  );
}
