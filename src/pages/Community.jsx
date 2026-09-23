import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import EyeOff from 'icon:eye-off';
import Eye from 'icon:eye';
import MessageSquare from 'icon:message-square';
import Plus from 'icon:plus';
import Pin from 'icon:pin';
import Shield from 'icon:shield';

const CATEGORIES = ['General', 'LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'Announcements'];

const categoryColors = {
  'General': 'text-text-muted bg-raised border-border',
  'LGBTQ+': 'text-accent bg-accent/10 border-accent/20',
  'Kink/BDSM': 'text-sage bg-sage/10 border-sage/20',
  'ENM/Poly': 'text-accent-hover bg-accent/10 border-accent/30',
  'Announcements': 'text-danger bg-danger/10 border-danger/20',
};

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Shown once per browser session before first post
function AgreementsModal({ onAccept, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog" aria-modal="true" aria-labelledby="agreements-title">
      <div className="bg-bg border border-border rounded-sm max-w-lg w-full p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-accent shrink-0" />
          <h2 id="agreements-title" className="font-display text-2xl text-text-primary">Before you post</h2>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          By posting in the community you're agreeing to hold this space with care. A quick reminder of what matters most:
        </p>
        <ul className="space-y-2 text-text-secondary text-sm mb-6">
          {[
            'Treat every member with dignity and respect.',
            'Use content warnings (CW:) for potentially sensitive topics.',
            'This is a peer space — not therapy. No clinical advice or crisis support here.',
            'Hate, stigma, and conversion-based language are never welcome.',
            'Moderators may hide content that violates these principles.',
          ].map(rule => (
            <li key={rule} className="flex gap-2 items-start">
              <span className="text-accent shrink-0 mt-0.5">✦</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <button onClick={onAccept}
            className="px-5 py-2.5 bg-accent text-bg text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">
            I understand — let me post
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 bg-raised border border-border text-text-secondary text-sm rounded-sm hover:text-text-primary">
            Cancel
          </button>
        </div>
        <p className="text-text-muted text-xs mt-4">
          <Link to="/guidelines" className="underline hover:text-text-secondary">Read the full community guidelines →</Link>
        </p>
      </div>
    </div>
  );
}

function PostCard({ post, isMod, onToggleHide, onTogglePin }) {
  return (
    <div className={`bg-surface border rounded-sm p-5 transition-colors ${
      post.pinned ? 'border-accent/40 bg-accent/5' : post.hidden ? 'border-danger/20 opacity-60' : 'border-border hover:border-accent/30'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {post.pinned && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm bg-accent/10 border border-accent/20 text-accent">
                <Pin size={10} /> Pinned
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-sm border ${categoryColors[post.category] || categoryColors.General}`}>
              {post.category}
            </span>
            {post.hidden && (
              <span className="text-xs px-2 py-0.5 rounded-sm bg-danger/10 border border-danger/20 text-danger">Hidden</span>
            )}
          </div>
          <h3 className="font-display text-lg font-semibold text-text-primary mb-1">{post.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{post.content}</p>
          <div className="flex items-center gap-3 mt-3 text-text-muted text-xs">
            <span>{post.author_name || 'Anonymous'}</span>
            <span>·</span>
            <span>{formatDate(post.created)}</span>
          </div>
        </div>
        {isMod && (
          <div className="shrink-0 flex flex-col gap-1">
            <button onClick={() => onToggleHide(post)} title={post.hidden ? 'Show post' : 'Hide post'}
              className="p-2 text-text-muted hover:text-text-secondary transition-colors">
              {post.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => onTogglePin(post)} title={post.pinned ? 'Unpin post' : 'Pin post'}
              className={`p-2 transition-colors ${post.pinned ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
              <Pin size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();
  const [category, setCategory] = useState('General');
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAgreements, setShowAgreements] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'General', pinned: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const isMod = user && ['moderator', 'admin'].includes(user.role);
  const hasAgreed = () => sessionStorage.getItem('umc_agreed') === '1';
  const markAgreed = () => sessionStorage.setItem('umc_agreed', '1');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const filter = isMod
        ? `category="${category}"`
        : `category="${category}" && hidden=false`;
      const result = await pb.collection('posts').getList(1, 50, { filter, sort: '-created' });
      setPinnedPosts(result.items.filter(p => p.pinned));
      setPosts(result.items.filter(p => !p.pinned));
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [category, user]);

  const handleNewPostClick = () => {
    if (hasAgreed()) {
      setShowForm(o => !o);
    } else {
      setShowAgreements(true);
    }
  };

  const handleAgreementsAccept = () => {
    markAgreed();
    setShowAgreements(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await pb.collection('posts').create({
        title: form.title,
        content: form.content,
        category: form.category,
        author_id: user.id,
        author_name: user.display_name || user.name,
        hidden: false,
        pinned: isMod ? form.pinned : false,
      });
      setForm({ title: '', content: '', category: 'General', pinned: false });
      setFormSuccess(true);
      setShowForm(false);
      setTimeout(() => setFormSuccess(false), 3000);
      fetchPosts();
    } catch (err) {
      setFormError('Could not submit post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHide = async (post) => {
    try {
      await pb.collection('posts').update(post.id, { hidden: !post.hidden });
      fetchPosts();
    } catch (_) {}
  };

  const togglePin = async (post) => {
    try {
      await pb.collection('posts').update(post.id, { pinned: !post.pinned });
      fetchPosts();
    } catch (_) {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {showAgreements && (
        <AgreementsModal
          onAccept={handleAgreementsAccept}
          onClose={() => setShowAgreements(false)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-text-primary">Community</h1>
          <p className="text-text-secondary mt-1">Peer discussions, shared experiences, and collective wisdom.</p>
        </div>
        {user && (
          <button onClick={handleNewPostClick}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors">
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-sm text-sm font-medium border transition-colors ${
              category === cat ? 'bg-accent text-bg border-accent' : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-accent/40'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* New post form */}
      {showForm && user && (
        <div className="bg-surface border border-border rounded-sm p-6 mb-6">
          <h2 className="font-display text-xl font-semibold mb-4">Share with the community</h2>
          {formError && <div role="alert" className="mb-3 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">{formError}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="post-title" className="block text-sm text-text-secondary mb-1.5">Title</label>
              <input id="post-title" type="text" required value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden" />
            </div>
            <div>
              <label htmlFor="post-content" className="block text-sm text-text-secondary mb-1.5">
                Content <span className="text-text-muted">(tip: start with "CW: [topic]" for sensitive content)</span>
              </label>
              <textarea id="post-content" rows={5} required value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none" />
            </div>
            <div>
              <label htmlFor="post-category" className="block text-sm text-text-secondary mb-1.5">Category</label>
              <select id="post-category" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {isMod && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.pinned}
                  onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))}
                  className="accent-[#c4956a]" />
                <span className="text-sm text-text-secondary flex items-center gap-1">
                  <Pin size={13} className="text-accent" /> Pin this post to the top
                </span>
              </label>
            )}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="px-5 py-2 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
                {submitting ? 'Posting…' : 'Post'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-raised border border-border text-text-secondary text-sm rounded-sm hover:text-text-primary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {formSuccess && (
        <div role="status" className="mb-4 p-3 bg-sage/10 border border-sage/30 rounded-sm text-sage text-sm">
          Your post has been shared with the community.
        </div>
      )}

      {/* Pinned posts */}
      {!loading && pinnedPosts.length > 0 && (
        <div className="mb-4 space-y-3">
          {pinnedPosts.map(post => (
            <PostCard key={post.id} post={post} isMod={isMod} onToggleHide={toggleHide} onTogglePin={togglePin} />
          ))}
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="text-text-muted text-center py-12">Loading…</div>
      ) : posts.length === 0 && pinnedPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto text-text-muted mb-3" size={32} />
          <p className="text-text-secondary">No posts in this category yet. Be the first to share!</p>
          {!user && <Link to="/auth" className="mt-4 inline-block text-accent hover:text-accent-hover underline text-sm">Join to participate</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} isMod={isMod} onToggleHide={toggleHide} onTogglePin={togglePin} />
          ))}
        </div>
      )}

      {!user && (
        <div className="mt-8 bg-surface border border-border rounded-sm p-6 text-center">
          <p className="text-text-secondary mb-3">Want to share your thoughts and connect with the community?</p>
          <Link to="/auth" className="px-5 py-2.5 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors inline-block">
            Join to Participate
          </Link>
        </div>
      )}
    </div>
  );
}
