import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import Calendar from 'icon:calendar';
import CheckCircle from 'icon:check-circle';
import MessageSquare from 'icon:message-square';
import ChevronDown from 'icon:chevron-down';
import ChevronUp from 'icon:chevron-up';

function formatDate(str) {
  if (!str) return 'Date TBA';
  return new Date(str).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function StatusBadge({ status }) {
  const styles = {
    upcoming: 'bg-accent/10 text-accent border-accent/20',
    past: 'bg-raised text-text-muted border-border',
    live: 'bg-sage/10 text-sage border-sage/20',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-sm border ${styles[status] || styles.past}`}>
      {status || 'upcoming'}
    </span>
  );
}

function SessionCard({ session, user }) {
  const [expanded, setExpanded] = useState(false);
  const [qaForm, setQaForm] = useState('');
  const [qaSubmitting, setQaSubmitting] = useState(false);
  const [qaSuccess, setQaSuccess] = useState(false);
  const [qaError, setQaError] = useState('');
  const [approvedQA, setApprovedQA] = useState([]);

  useEffect(() => {
    pb.collection('qa_submissions').getList(1, 50, {
      filter: `session_id="${session.id}" && status="approved"`,
      sort: '-created',
    }).then(r => setApprovedQA(r.items)).catch(() => {});
  }, [session.id]);

  const submitQA = async (e) => {
    e.preventDefault();
    setQaError('');
    setQaSubmitting(true);
    try {
      await pb.collection('qa_submissions').create({
        session_id: session.id,
        question: qaForm,
        submitter_id: user.id,
        status: 'pending',
      });
      setQaForm('');
      setQaSuccess(true);
      setTimeout(() => setQaSuccess(false), 3000);
    } catch (_) {
      setQaError('Could not submit your question. Please try again.');
    } finally {
      setQaSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <StatusBadge status={session.status} />
            {session.topic_tags && session.topic_tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-sm bg-raised border border-border text-text-muted">{tag}</span>
            ))}
          </div>
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2">{session.title}</h3>
          {session.facilitator_name && (
            <p className="text-text-muted text-sm mb-2">with {session.facilitator_name}</p>
          )}
          <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
            <Calendar size={14} />
            <span>{formatDate(session.session_date)}</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{session.description}</p>
        </div>
      </div>

      {/* Q&A section */}
      <div className="mt-4 pt-4 border-t border-border">
        <button onClick={() => setExpanded(o => !o)}
          className="flex items-center gap-2 text-text-muted text-sm hover:text-text-secondary transition-colors">
          <MessageSquare size={14} />
          <span>Q&A {approvedQA.length > 0 ? `(${approvedQA.length} question${approvedQA.length > 1 ? 's' : ''})` : ''}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {approvedQA.length > 0 && (
              <div className="space-y-2">
                {approvedQA.map(q => (
                  <div key={q.id} className="bg-raised border border-border rounded-sm px-4 py-3">
                    <p className="text-text-secondary text-sm">{q.question}</p>
                  </div>
                ))}
              </div>
            )}
            {user ? (
              <form onSubmit={submitQA} className="space-y-3">
                <label htmlFor={`qa-${session.id}`} className="block text-sm text-text-secondary">Submit a question for this session</label>
                {qaError && <div role="alert" className="p-2 bg-danger/10 border border-danger/30 rounded-sm text-danger text-xs">{qaError}</div>}
                {qaSuccess && <div role="status" className="p-2 bg-sage/10 border border-sage/30 rounded-sm text-sage text-xs flex items-center gap-1"><CheckCircle size={12} /> Question submitted for review!</div>}
                <textarea id={`qa-${session.id}`} rows={2} required value={qaForm}
                  onChange={e => setQaForm(e.target.value)}
                  className="w-full bg-raised border border-border rounded-sm px-3 py-2 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
                  placeholder="What would you like to ask?" />
                <button type="submit" disabled={qaSubmitting}
                  className="px-4 py-2 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
                  {qaSubmitting ? 'Submitting…' : 'Submit Question'}
                </button>
              </form>
            ) : (
              <p className="text-text-muted text-sm">
                <Link to="/auth" className="text-accent hover:text-accent-hover underline">Join</Link> to submit a question.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sessions() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      pb.collection('sessions').getList(1, 20, { filter: 'published=true && status="upcoming"', sort: 'session_date' }),
      pb.collection('sessions').getList(1, 20, { filter: 'published=true && status="past"', sort: '-session_date' }),
    ])
      .then(([u, p]) => { setUpcoming(u.items); setPast(p.items); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-3">Community Sessions</h1>
        <p className="text-text-secondary">Peer-led discussions, education talks, and community conversations.</p>
      </div>

      {loading ? (
        <div className="text-text-muted text-center py-12">Loading sessions…</div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">Upcoming Sessions</h2>
            {upcoming.length === 0 ? (
              <div className="bg-surface border border-border rounded-sm p-8 text-center text-text-secondary">
                No upcoming sessions scheduled right now. Check back soon!
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map(s => <SessionCard key={s.id} session={s} user={user} />)}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-text-primary mb-6">Past Sessions</h2>
              <div className="space-y-4">
                {past.map(s => <SessionCard key={s.id} session={s} user={user} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
