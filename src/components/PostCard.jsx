import { Link } from 'react-router-dom';
import {
  HiOutlineChatAlt2,
  HiOutlineArrowUp,
  HiOutlineBookmark,
  HiOutlineShare,
  HiOutlineDotsHorizontal,
  HiOutlineEye,
} from 'react-icons/hi';
import { timeAgo, formatCount } from '../utils/format';
import { postsApi } from '../services/api';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function PostCard({ post, compact = false }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const [upvotes, setUpvotes] = useState(post.upvotes || post.voteCount || 0);
  const [upvoted, setUpvoted] = useState(post.upvoted || false);
  const [busy, setBusy] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuth || busy) return;
    setBusy(true);
    try {
      await postsApi.upvote(post.id || post.postId);
      setUpvoted(true);
      setUpvotes((n) => n + 1);
    } catch { /* ignore */ }
    setBusy(false);
  };

  const author = post.author || {};
  const tags = post.tags || [];
  const category = post.category?.name || post.categoryName || post.industry || '';

  return (
    <article className="border-b border-outline-variant/20 px-4 py-4 hover:bg-surface-container-low/40 transition-colors cursor-pointer">
      <Link to={`/posts/${post.id || post.postId}`} className="block">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {category && (
            <span className="font-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {category}
            </span>
          )}
          {post.tier && (
            <span className="font-label-xs text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-md">
              {post.tier}
            </span>
          )}
          <span className="font-label-sm text-text-secondary">
            {timeAgo(post.createdAt || post.created_at)} ago
          </span>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="ml-auto p-1 rounded-full hover:bg-surface-container-high text-text-secondary"
          >
            <HiOutlineDotsHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-headline-md text-on-surface mb-1.5 leading-snug">
          {post.title}
        </h3>

        {/* Body preview */}
        {!compact && post.body && (
          <p className="font-body-lg text-on-surface-variant mb-2 line-clamp-3 leading-relaxed">
            {post.body}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((t, i) => (
              <span
                key={i}
                className="font-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md"
              >
                #{typeof t === 'string' ? t : t.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Highlighted reply / expert insight */}
        {post.topReply && (
          <div className="p-3 mb-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2.5">
            <span className="text-secondary text-lg shrink-0 mt-0.5">✓</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-body-md-medium text-on-surface font-semibold">
                  {post.topReply.authorTitle || 'Verified Counsel'}
                </span>
                <span className="font-label-xs text-tertiary">Verified</span>
              </div>
              <p className="font-label-sm text-on-surface-variant leading-normal line-clamp-2">
                {post.topReply.body}
              </p>
            </div>
          </div>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between max-w-[460px] text-text-secondary pt-1">
        <Link
          to={`/posts/${post.id || post.postId}`}
          className="flex items-center gap-1.5 hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-primary/10">
            <HiOutlineChatAlt2 className="w-[18px] h-[18px]" />
          </div>
          <span className="font-label-sm">{formatCount(post.replyCount || post.replies || 0)}</span>
        </Link>
        {console.log(user, post)}
        <button
          onClick={post.authorId == user.anonId ? () => { console.log(user.anonId, post.authorId) } : handleUpvote}
          disabled={!isAuth || busy}
          className={`flex items-center gap-1.5 transition-colors group ${upvoted ? 'text-tertiary' : 'hover:text-tertiary'
            }`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-tertiary/10">
            <HiOutlineArrowUp className="w-[19px] h-[19px]" />
          </div>
          <span className={`font-label-sm font-semibold ${upvoted ? 'text-tertiary' : ''}`}>
            {formatCount(upvotes)}
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-text-secondary">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <HiOutlineEye className="w-[18px] h-[18px]" />
          </div>
          <span className="font-label-sm">{formatCount(post.views || post.viewCount || 0)}</span>
        </div>

        <button className="flex items-center gap-1.5 hover:text-primary transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-primary/10">
            <HiOutlineBookmark className="w-[18px] h-[18px]" />
          </div>
        </button>

        <button className="flex items-center gap-1.5 hover:text-primary transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-primary/10">
            <HiOutlineShare className="w-[18px] h-[18px]" />
          </div>
        </button>
      </div>
    </article>
  );
}
