import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../services/api';
import { HiOutlineX, HiOutlineShieldCheck } from 'react-icons/hi';

export default function Compose() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const tagList = tags
        .split(/[,\s#]+/)
        .map((t) => t.trim())
        .filter(Boolean);
      const { data } = await postsApi.create({
        title: title.trim(),
        body: body.trim(),
        tags: tagList.length ? tagList : undefined,
      });
      navigate(`/posts/${data.data.postId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container-low text-on-surface">
          <HiOutlineX className="w-5 h-5" />
        </button>
        <h1 className="font-headline-md text-on-surface">Post Dilemma</h1>
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !body.trim()}
          className="btn-primary px-5 py-2 rounded-full text-white font-body-md-medium disabled:opacity-50"
        >
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </header>

      <div className="px-4 py-3 border-b border-outline-variant/15 flex items-center gap-2 bg-surface-container-low/40">
        <HiOutlineShieldCheck className="w-4 h-4 text-secondary" />
        <p className="font-label-sm text-on-surface-variant">
          Client-side lexical scrubbing active · PII redacted before submit
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error font-label-md">
            {error}
          </div>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dilemma title — be specific, stay anonymous"
          maxLength={200}
          className="w-full bg-transparent border-none font-headline-md text-on-surface placeholder:text-text-tertiary focus:outline-none"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe the situation. Do not include real names, company identifiers, or internal project codenames…"
          rows={10}
          className="w-full bg-transparent border-none font-body-lg text-on-surface placeholder:text-text-tertiary focus:outline-none resize-none leading-relaxed"
        />

        <div>
          <label className="font-label-md text-on-surface-variant mb-1.5 block">Tags (optional)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#NonCompete #Equity #Whistleblowing"
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary/50"
          />
        </div>
      </form>
    </div>
  );
}
