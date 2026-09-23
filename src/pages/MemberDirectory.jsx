import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import UsersIcon from 'icon:users';
import ShieldIcon from 'icon:shield';
import UserIcon from 'icon:user';

const FILTERS = ['All', 'LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'Ally'];

function getInterests(member) {
  const raw = member.identity_interests;
  if (!raw) return [];
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw || '[]');
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
}

function MemberCard({ member }) {
  const interests = getInterests(member);
  const displayName = member.display_name || member.name || 'Anonymous Member';
  const bio = member.bio || '';
  const excerpt = bio.length > 100 ? bio.slice(0, 100) + '…' : bio;

  const since = member.created
    ? new Date(member.created).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 hover:bg-raised transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="font-display text-lg text-text-primary leading-tight">{displayName}</p>
          {since && (
            <p className="font-body text-xs text-text-muted">Member since {since}</p>
          )}
        </div>
      </div>

      {interests.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {interests.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-accent/15 text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {excerpt && (
        <p className="font-body text-sm text-text-secondary leading-relaxed">{excerpt}</p>
      )}
    </div>
  );
}

export default function MemberDirectory() {
  usePageMeta('Member Directory', 'Connect with community members of The Unbound Minds Collective who have opted in to be found — filter by shared identity interests and find your people.');
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const userInterests = user ? getInterests(user) : [];
  const userHasNoInterests = user && userInterests.length === 0;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchMembers() {
      setLoading(true);
      setError(null);
      try {
        const result = await pb.collection('members').getList(1, 100, {
          filter: 'identity_interests != null',
          sort: 'display_name',
          signal: controller.signal,
        });

        const filtered = result.items.filter((m) => {
          const interests = getInterests(m);
          return interests.length > 0;
        });

        setMembers(filtered);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('We had trouble loading the directory. Please try refreshing.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();

    return () => controller.abort();
  }, [user]);

  const visibleMembers =
    activeFilter === 'All'
      ? members
      : members.filter((m) => getInterests(m).includes(activeFilter));

  return (
    <div className="min-h-screen bg-bg font-body">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
              <UsersIcon className="w-7 h-7 text-accent" />
            </div>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-text-primary mb-3">
            Member Directory
          </h1>
          <p className="font-body text-text-secondary max-w-xl mx-auto leading-relaxed">
            A warm, opt-in space for members of the Unbound Minds Collective to find and connect
            with one another. Everyone listed here has chosen to be visible.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
            <ShieldIcon className="w-4 h-4 shrink-0" />
            <span>Only display name and identity interests are shown — no email, no personal details.</span>
          </div>
        </div>

        {/* Not logged in */}
        {!user && (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center max-w-lg mx-auto">
            <p className="font-display text-2xl text-text-primary mb-2">Members only</p>
            <p className="font-body text-text-secondary mb-6 leading-relaxed">
              This directory is a private space for Collective members. Join us to see who else
              is here and to add yourself.
            </p>
            <Link
              to="/auth"
              className="inline-block bg-accent text-bg font-body font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Join the Collective
            </Link>
          </div>
        )}

        {/* Logged-in content */}
        {user && (
          <>
            {/* Opt-in notice */}
            {userHasNoInterests && (
              <div className="bg-surface border border-border rounded-xl px-5 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-body text-text-secondary text-sm leading-relaxed">
                  <span className="text-text-primary font-medium">You're not in the directory yet</span>
                  {' '}— add your identity interests in your profile to appear here.
                </p>
                <Link
                  to="/profile"
                  className="shrink-0 text-sm font-body font-medium text-accent hover:underline"
                >
                  Go to your profile →
                </Link>
              </div>
            )}

            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-8">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-body font-medium border transition-colors duration-150 ${
                    activeFilter === f
                      ? 'bg-accent text-bg border-accent'
                      : 'bg-surface border-border text-text-secondary hover:border-accent hover:text-text-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="bg-surface border border-border rounded-xl p-6 text-center text-text-secondary">
                {error}
              </div>
            )}

            {/* Grid */}
            {!loading && !error && visibleMembers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && visibleMembers.length === 0 && (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-text-primary mb-2">
                  No members here yet
                </p>
                <p className="font-body text-text-secondary max-w-sm mx-auto leading-relaxed">
                  {activeFilter === 'All'
                    ? 'Be the first to add your identity interests and show up in the directory.'
                    : `No members have listed "${activeFilter}" yet — check back soon.`}
                </p>
                {activeFilter !== 'All' && (
                  <button
                    onClick={() => setActiveFilter('All')}
                    className="mt-4 text-sm font-body text-accent hover:underline"
                  >
                    View all members
                  </button>
                )}
              </div>
            )}

            {/* Privacy footer */}
            {!loading && !error && (
              <p className="mt-12 text-center font-body text-xs text-text-muted leading-relaxed max-w-md mx-auto">
                Only members who have added identity interests to their profile appear here.
                You can update your visibility at any time in your{' '}
                <Link to="/profile" className="text-accent hover:underline">
                  profile settings
                </Link>
                .
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
