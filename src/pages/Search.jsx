import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import SearchIcon from 'icon:search';
import FileText from 'icon:file-text';
import Calendar from 'icon:calendar';
import BookOpen from 'icon:book-open';

const DEBOUNCE_MS = 350;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function highlight(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-accent/20 text-text-primary rounded-[2px] px-0.5">{part}</mark>
      : part
  );
}

export default function Search() {
  usePageMeta('Search', 'Search posts, sessions, and resources across The Unbound Minds Collective community platform.');
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const [results, setResults] = useState({ posts: [], sessions: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      setResults({ posts: [], sessions: [] });
      setSearched(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const q = debouncedQuery.trim();
    const encoded = encodeURIComponent(q);

    Promise.allSettled([
      user
        ? pb.collection('posts').getList(1, 20, {
            filter: `hidden=false && (title~"${q}" || content~"${q}")`,
            sort: '-created',
            signal: controller.signal,
          })
        : Promise.resolve({ items: [] }),
      pb.collection('sessions').getList(1, 10, {
        filter: `published=true && (title~"${q}" || description~"${q}")`,
        sort: '-session_date',
        signal: controller.signal,
      }),
    ]).then(([postsRes, sessionsRes]) => {
      if (controller.signal.aborted) return;
      setResults({
        posts: postsRes.status === 'fulfilled' ? postsRes.value.items : [],
        sessions: sessionsRes.status === 'fulfilled' ? sessionsRes.value.items : [],
      });
      setSearched(true);
      setLoading(false);
    });

    return () => controller.abort();
  }, [debouncedQuery, user]);

  const total = results.posts.length + results.sessions.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-2">Search</h1>
        <p className="text-text-secondary">Find posts, sessions, and resources across the Collective.</p>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <label htmlFor="search-input" className="sr-only">Search the Collective</label>
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          id="search-input"
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search posts, sessions…"
          className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-sm text-text-primary text-base focus:border-accent outline-hidden transition-colors placeholder:text-text-muted"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
        )}
      </div>

      {/* Results */}
      {!debouncedQuery.trim() && (
        <div className="text-center py-16 text-text-muted">
          <SearchIcon size={40} className="mx-auto mb-4 opacity-30" />
          <p>Start typing to search across the Collective.</p>
          {!user && (
            <p className="text-xs mt-2">
              <Link to="/auth" className="text-accent underline hover:text-accent-hover">Sign in</Link> to search community posts.
            </p>
          )}
        </div>
      )}

      {searched && !loading && total === 0 && debouncedQuery.trim() && (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg mb-2">No results for "<strong className="text-text-secondary">{debouncedQuery}</strong>"</p>
          <p className="text-sm">Try different keywords, or browse the <Link to="/community" className="text-accent underline">Community</Link> or <Link to="/resources" className="text-accent underline">Resources</Link> pages.</p>
        </div>
      )}

      {searched && total > 0 && (
        <div className="space-y-8">
          <p className="text-sm text-text-muted">
            {total} result{total !== 1 ? 's' : ''} for "<strong className="text-text-secondary">{debouncedQuery}</strong>"
          </p>

          {/* Sessions */}
          {results.sessions.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-accent" />
                Sessions
              </h2>
              <div className="space-y-3">
                {results.sessions.map(session => (
                  <Link
                    key={session.id}
                    to="/sessions"
                    className="block bg-surface border border-border rounded-sm p-4 hover:border-accent/50 transition-colors group"
                  >
                    <p className="font-medium text-text-primary group-hover:text-accent transition-colors mb-1">
                      {highlight(session.title, debouncedQuery)}
                    </p>
                    {session.description && (
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {highlight(session.description.slice(0, 150), debouncedQuery)}
                      </p>
                    )}
                    {session.session_date && (
                      <p className="text-xs text-text-muted mt-2">
                        {new Date(session.session_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Posts */}
          {results.posts.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileText size={20} className="text-accent" />
                Community Posts
              </h2>
              <div className="space-y-3">
                {results.posts.map(post => (
                  <Link
                    key={post.id}
                    to="/community"
                    className="block bg-surface border border-border rounded-sm p-4 hover:border-accent/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-text-primary group-hover:text-accent transition-colors">
                        {highlight(post.title, debouncedQuery)}
                      </p>
                      {post.category && (
                        <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent capitalize">
                          {post.category}
                        </span>
                      )}
                    </div>
                    {post.content && (
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {highlight(post.content.slice(0, 150), debouncedQuery)}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-2">
                      by {post.author_name || 'Anonymous'} · {post.created ? new Date(post.created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
