import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsApi, repliesApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { timeAgo, formatCount } from '../utils/format';
import {
  HiOutlineArrowLeft, HiOutlineArrowUp, HiOutlineChatAlt2,
  HiOutlineBookmark, HiOutlineShare, HiOutlineDotsHorizontal,
  HiOutlineFlag, HiOutlineTrash,
} from 'react-icons/hi';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pRes, rRes] = await Promise.all([
          postsApi.get(postId),
          postsApi.replies(postId),
        ]);
        setPost(pRes.data.data);
        setReplies(Array.isArray(rRes.data.data) ? rRes.data.data : rRes.data.data?.replies || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim() || !isAuth) return;
    setSubmitting(true);
    try {
      const { data } = await postsApi.createReply(postId, { body: replyBody.trim() });
      setReplies((prev) => [
        ...prev,
        { id: data.data.replyId, body: replyBody, createdAt: new Date().toISOString(), author: { anonId: 'you' } },
      ]);
      setReplyBody('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async () => {
    if (!isAuth) return;
    try {
      await postsApi.upvote(postId);
      setPost((p) => p ? { ...p, upvotes: (p.upvotes || 0) + 1, upvoted: true } : p);
    } catch { /* ignore */ }
  };

  const handleHelpful = async (replyId) => {
    if (!isAuth) return;
    try {
      await repliesApi.helpful(replyId);
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
      );
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-8 text-center">
        <p className="font-headline-md text-on-surface mb-2">{error || 'Not found'}</p>
        <Link to="/" className="text-primary font-body-md hover:underline">← Back to feed</Link>
      </div>
    );
  }

  const tags = post.tags || [];

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-headline-md text-on-surface">Dilemma</h1>
          <p className="font-label-sm text-text-secondary">Confidential peer counsel</p>
        </div>
      </header>

      {/* Post body */}
      <article className="px-4 py-5 border-b border-outline-variant/20">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {(post.category?.name || post.industry) && (
            <span className="font-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {post.category?.name || post.industry}
            </span>
          )}
          <span className="font-label-sm text-text-secondary">
            {timeAgo(post.createdAt)} ago
          </span>
        </div>

        <h1 className="font-headline-lg text-on-surface mb-3 leading-snug">{post.title}</h1>
        <p className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-4">
          {post.body}
        </p>
        {console.log(tags)}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((t) => {
              return < span key={typeof t === 'string' ? t : t.tag.name}
                className="font-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md" >
                #{typeof t === 'string' ? t : t.tag.name}
              </span>
            }
            )}
          </div>
        )
        }

        <div className="flex items-center gap-6 text-text-secondary">
          <button onClick={handleUpvote} className={`flex items-center gap-1.5 hover:text-tertiary ${post.upvoted ? 'text-tertiary' : ''}`}>
            <HiOutlineArrowUp className="w-5 h-5" />
            <span className="font-label-md font-semibold">{formatCount(post.upvotes || 0)}</span>
          </button>
          <span className="flex items-center gap-1.5">
            <HiOutlineChatAlt2 className="w-5 h-5" />
            <span className="font-label-md">{formatCount(replies.length)}</span>
          </span>
          <button className="hover:text-primary"><HiOutlineBookmark className="w-5 h-5" /></button>
          <button className="hover:text-primary"><HiOutlineShare className="w-5 h-5" /></button>
          <button className="hover:text-error ml-auto"><HiOutlineFlag className="w-5 h-5" /></button>
        </div>
      </article >

      {/* Reply form */}
      {
        isAuth && (
          <form onSubmit={handleReply} className="px-4 py-4 border-b border-outline-variant/20">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={3}
              placeholder="Share confidential counsel…"
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 font-body-md text-on-surface placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={submitting || !replyBody.trim()}
                className="btn-primary px-5 py-2 rounded-full text-white font-body-md-medium disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Reply Anonymously'}
              </button>
            </div>
          </form>
        )
      }

      {/* Replies */}
      <div className="px-4 py-2 border-b border-outline-variant/15">
        <p className="font-label-md text-text-secondary">
          Ordered by Consensus & Legal Stature
        </p>
      </div>

      {
        replies.length === 0 && (
          <p className="px-4 py-8 text-center font-body-md text-text-secondary">No replies yet. Be the first.</p>
        )
      }

      {
        replies.map((r) => (
          <div key={r.id || r.replyId} className="px-4 py-4 border-b border-outline-variant/15 hover:bg-surface-container-low/30">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-sm">
                {(r.author?.jobTitle || r.authorTitle || 'A')[0]}
              </div>
              <div>
                <span className="font-body-md-medium text-on-surface">
                  {r.author?.jobTitle || r.authorTitle || r.author?.anonId || 'Anonymous'}
                </span>
                {r.author?.industryVerified && (
                  <span className="ml-1.5 font-label-xs text-tertiary">Verified</span>
                )}
                <span className="ml-2 font-label-sm text-text-secondary">
                  {timeAgo(r.createdAt)} ago
                </span>
              </div>
            </div>
            <p className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap ml-10 mb-2">
              {r.body}
            </p>
            <div className="ml-10 flex items-center gap-4 text-text-secondary">
              <button onClick={() => handleHelpful(r.id || r.replyId)}
                className="flex items-center gap-1 hover:text-tertiary font-label-sm">
                <HiOutlineArrowUp className="w-4 h-4" />
                {formatCount(r.helpfulCount || r.upvotes || 0)}
              </button>
              <button className="font-label-sm hover:text-primary">Reply</button>
            </div>
          </div>
        ))
      }
    </div >
  );
}
