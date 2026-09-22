import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ShieldOff from 'icon:shield-off';
import Plus from 'icon:plus';
import CheckCircle from 'icon:check-circle';
import X from 'icon:x';
import Eye from 'icon:eye';
import EyeOff from 'icon:eye-off';
import Edit from 'icon:edit';

function formatDate(str) {
  return str ? new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

export default function FacilitatorConsole() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('My Sessions');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', session_date: '', topic_tags: '', status: 'upcoming' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [qaMap, setQaMap] = useState({});

  const isAllowed = user && ['facilitator', 'guest_facilitator', 'admin', 'moderator'].includes(user.role);

  if (!user) { navigate('/auth'); return null; }
  if (!isAllowed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShieldOff className="mx-auto text-text-muted mb-4" size={48} />
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Access Restricted</h1>
        <p className="text-text-secondary">This area is for facilitators and moderators only.</p>
      </div>
    );
  }

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const filter = user.role === 'admin' || user.role === 'moderator'
        ? ''
        : `facilitator_id="${user.id}"`;
      const r = await pb.collection('sessions').getList(1, 50, { filter, sort: '-created' });
      setSessions(r.items);

      // Fetch Q&A for each session
      const qaResults = {};
      await Promise.all(r.items.map(async (s) => {
        try {
          const qa = await pb.collection('qa_submissions').getList(1, 100, {
            filter: `session_id="${s.id}"`,
            sort: '-created',
          });
          qaResults[s.id] = qa.items;
        } catch (_) {}
      }));
      setQaMap(qaResults);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, [user]);

  const startCreate = () => {
    setEditSession(null);
    setForm({ title: '', description: '', session_date: '', topic_tags: '', status: 'upcoming' });
    setShowForm(true);
  };

  const startEdit = (s) => {
    setEditSession(s);
    setForm({
      title: s.title || '',
      description: s.description || '',
      session_date: s.session_date ? s.session_date.split('T')[0] : '',
      topic_tags: Array.isArray(s.topic_tags) ? s.topic_tags.join(', ') : (s.topic_tags || ''),
      status: s.status || 'upcoming',
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        title: form.title,
        description: form.description,
        session_date: form.session_date,
        topic_tags: form.topic_tags.split(',').map(t => t.trim()).filter(Boolean),
        status: form.status,
        facilitator_id: user.id,
        facilitator_name: user.display_name || user.name,
        published: false,
      };
      if (editSession) {
        await pb.collection('sessions').update(editSession.id, data);
      } else {
        await pb.collection('sessions').create(data);
      }
      setSaveSuccess(true);
      setShowForm(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchSessions();
    } catch (_) {}
    setSaving(false);
  };

  const togglePublish = async (session) => {
    try {
      await pb.collection('sessions').update(session.id, { published: !session.published });
      fetchSessions();
    } catch (_) {}
  };

  const handleQA = async (qaId, status, sessionId) => {
    try {
      await pb.collection('qa_submissions').update(qaId, { status, reviewed_by: user.id });
      await pb.collection('audit_log').create({ action: `qa_${status}`, target_id: qaId, performed_by: user.id }).catch(() => {});
      const qa = await pb.collection('qa_submissions').getList(1, 100, { filter: `session_id="${sessionId}"`, sort: '-created' });
      setQaMap(m => ({ ...m, [sessionId]: qa.items }));
    } catch (_) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary">Facilitator Console</h1>
        <p className="text-text-secondary mt-1">Manage your sessions and moderate community questions.</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-8 border-b border-border pb-3">
        {['My Sessions', 'Q&A Management'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${tab === t ? 'bg-accent text-bg' : 'text-text-secondary hover:text-text-primary hover:bg-raised'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'My Sessions' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-text-primary">Sessions</h2>
            <button onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors">
              <Plus size={16} /> New Session
            </button>
          </div>

          {saveSuccess && <div role="status" className="mb-4 p-3 bg-sage/10 border border-sage/30 rounded-sm text-sage text-sm flex items-center gap-2"><CheckCircle size={14} /> Session saved!</div>}

          {showForm && (
            <div className="bg-surface border border-border rounded-sm p-6 mb-6">
              <h3 className="font-display text-xl font-semibold text-text-primary mb-4">{editSession ? 'Edit Session' : 'New Session'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Session Title</label>
                  <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Description</label>
                  <textarea rows={4} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Session Date</label>
                    <input type="date" value={form.session_date} onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))}
                      className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm outline-hidden">
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                      <option value="live">Live</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Topic Tags <span className="text-text-muted">(comma-separated)</span></label>
                  <input type="text" value={form.topic_tags} onChange={e => setForm(f => ({ ...f, topic_tags: e.target.value }))}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
                    placeholder="LGBTQ+, Relationships, Burnout" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving}
                    className="px-5 py-2.5 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
                    {saving ? 'Saving…' : editSession ? 'Save Changes' : 'Create Session'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 bg-raised border border-border text-text-secondary text-sm rounded-sm hover:text-text-primary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? <div className="text-text-muted text-center py-8">Loading…</div> : (
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="bg-surface border border-border rounded-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">{s.title}</h3>
                      <p className="text-text-muted text-sm">{formatDate(s.session_date)} · {s.status}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => startEdit(s)} className="p-2 text-text-muted hover:text-accent transition-colors" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => togglePublish(s)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                          s.published
                            ? 'bg-sage/10 border-sage/20 text-sage hover:bg-danger/10 hover:border-danger/20 hover:text-danger'
                            : 'bg-raised border-border text-text-muted hover:bg-sage/10 hover:border-sage/20 hover:text-sage'
                        }`}>
                        {s.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Q&A Management' && (
        <div className="space-y-8">
          {sessions.map(s => {
            const questions = qaMap[s.id] || [];
            return (
              <div key={s.id} className="bg-surface border border-border rounded-sm p-5">
                <h3 className="font-display text-lg font-semibold text-text-primary mb-4">{s.title}</h3>
                {questions.length === 0 ? (
                  <p className="text-text-muted text-sm">No questions submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {questions.map(q => (
                      <div key={q.id} className="flex items-start justify-between gap-4 bg-raised border border-border rounded-sm p-4">
                        <div className="flex-1">
                          <p className="text-text-secondary text-sm">{q.question}</p>
                          <span className={`text-xs mt-1 inline-block ${q.status === 'approved' ? 'text-sage' : q.status === 'rejected' ? 'text-danger' : 'text-text-muted'}`}>
                            {q.status}
                          </span>
                        </div>
                        {q.status === 'pending' && (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleQA(q.id, 'approved', s.id)}
                              className="px-3 py-1.5 text-xs bg-sage/10 border border-sage/30 text-sage rounded-sm hover:bg-sage/20 flex items-center gap-1">
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button onClick={() => handleQA(q.id, 'rejected', s.id)}
                              className="px-3 py-1.5 text-xs bg-danger/10 border border-danger/30 text-danger rounded-sm hover:bg-danger/20 flex items-center gap-1">
                              <X size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
