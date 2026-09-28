import { useState, useEffect } from 'react';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import RoleBadge from '../components/RoleBadge.jsx';
import ShieldOff from 'icon:shield-off';
import Plus from 'icon:plus';
import CheckCircle from 'icon:check-circle';
import X from 'icon:x';

const TABS = ['Members', 'Moderation Queue', 'Invite Codes', 'Audit Log', 'Supporters', 'Suggestions', 'Contributors', 'Listing Applications'];
const STRIPE_CHECKOUT = 'https://buy.stripe.com/9B6dR92bJ6Lf5lK9dDbMQ00';
const ROLES = ['member', 'moderator', 'facilitator', 'guest_facilitator', 'admin'];

function formatDate(str) {
  return str ? new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Members');

  // Data state
  const [members, setMembers] = useState([]);
  const [hiddenPosts, setHiddenPosts] = useState([]);
  const [pendingQA, setPendingQA] = useState([]);
  const [inviteCodes, setInviteCodes] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [supporters, setSupporters] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [contributorApps, setContributorApps] = useState([]);
  const [volunteerApps, setVolunteerApps] = useState([]);
  const [listingApps, setListingApps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Password reset modal
  const [resetTarget, setResetTarget] = useState(null); // { id, name }
  const [resetPw, setResetPw] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  // Invite code form
  const [newCode, setNewCode] = useState({ code: '', role_grant: 'moderator' });
  const [codeSuccess, setCodeSuccess] = useState(false);

  // Supporter form
  const [supporterForm, setSupporterForm] = useState({ name: '', description: '', tier: '', website: '', active: true });
  const [supporterSuccess, setSupporterSuccess] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShieldOff className="mx-auto text-text-muted mb-4" size={48} />
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Access Denied</h1>
        <p className="text-text-secondary">This area is restricted to administrators only.</p>
      </div>
    );
  }

  const fetchTab = async (t) => {
    setLoading(true);
    try {
      if (t === 'Members') {
        const r = await pb.collection('members').getList(1, 100, { sort: '-created' });
        setMembers(r.items);
      } else if (t === 'Moderation Queue') {
        const [posts, qa] = await Promise.all([
          pb.collection('posts').getList(1, 50, { filter: 'hidden=true', sort: '-created' }),
          pb.collection('qa_submissions').getList(1, 50, { filter: 'status="pending"', sort: '-created' }),
        ]);
        setHiddenPosts(posts.items);
        setPendingQA(qa.items);
      } else if (t === 'Invite Codes') {
        const r = await pb.collection('invite_codes').getList(1, 50, { sort: '-created' });
        setInviteCodes(r.items);
      } else if (t === 'Audit Log') {
        const r = await pb.collection('audit_log').getList(1, 100, { sort: '-created' });
        setAuditLog(r.items);
      } else if (t === 'Supporters') {
        const r = await pb.collection('supporters').getList(1, 50, { sort: 'name' });
        setSupporters(r.items);
      } else if (t === 'Suggestions') {
        const r = await pb.collection('suggestions').getList(1, 100, { sort: '-created' });
        setSuggestions(r.items);
      } else if (t === 'Contributors') {
        const [ca, va] = await Promise.all([
          pb.collection('contributor_applications').getList(1, 200, { sort: '-created' }),
          pb.collection('volunteer_signups').getList(1, 200, { sort: '-created' }),
        ]);
        setContributorApps(ca.items);
        setVolunteerApps(va.items);
      } else if (t === 'Listing Applications') {
        const r = await pb.collection('professional_listings').getList(1, 200, { sort: '-created' });
        setListingApps(r.items);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchTab(tab); }, [tab]);

  const handleResetPassword = async () => {
    if (!resetPw || resetPw.length < 8) { setResetMsg('Password must be at least 8 characters.'); return; }
    try {
      await pb.collection('members').update(resetTarget.id, { password: resetPw, passwordConfirm: resetPw });
      await pb.collection('audit_log').create({ action: 'password_reset', target_id: resetTarget.id, performed_by: user.id, new_value: 'reset' });
      setResetMsg('');
      setResetTarget(null);
      setResetPw('');
    } catch (e) {
      setResetMsg(e?.data?.message || 'Could not reset password. Please try again.');
    }
  };

  const changeRole = async (memberId, role) => {
    try {
      await pb.collection('members').update(memberId, { role });
      await pb.collection('audit_log').create({ action: 'role_change', target_id: memberId, new_value: role, performed_by: user.id });
      fetchTab('Members');
    } catch (_) {}
  };

  const memberAction = async (memberId, action) => {
    try {
      await pb.collection('member_actions').create({ member_id: memberId, action, performed_by: user.id });
      await pb.collection('audit_log').create({ action, target_id: memberId, performed_by: user.id });
    } catch (_) {}
  };

  const unhidePost = async (postId) => {
    try {
      await pb.collection('posts').update(postId, { hidden: false });
      fetchTab('Moderation Queue');
    } catch (_) {}
  };

  const handleQA = async (qaId, status) => {
    try {
      await pb.collection('qa_submissions').update(qaId, { status, reviewed_by: user.id });
      await pb.collection('audit_log').create({ action: `qa_${status}`, target_id: qaId, performed_by: user.id });
      fetchTab('Moderation Queue');
    } catch (_) {}
  };

  const createInviteCode = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('invite_codes').create({ ...newCode, used: false, created_by: user.id });
      setNewCode({ code: '', role_grant: 'moderator' });
      setCodeSuccess(true);
      setTimeout(() => setCodeSuccess(false), 3000);
      fetchTab('Invite Codes');
    } catch (_) {}
  };

  const createSupporter = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('supporters').create(supporterForm);
      setSupporterForm({ name: '', description: '', tier: '', website: '', active: true });
      setSupporterSuccess(true);
      setTimeout(() => setSupporterSuccess(false), 3000);
      fetchTab('Supporters');
    } catch (_) {}
  };

  const toggleSupporterActive = async (id, active) => {
    try {
      await pb.collection('supporters').update(id, { active: !active });
      fetchTab('Supporters');
    } catch (_) {}
  };

  const updateSuggestionStatus = async (id, status) => {
    try {
      await pb.collection('suggestions').update(id, { status });
      fetchTab('Suggestions');
    } catch (_) {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">Manage the community, moderate content, and keep things running smoothly.</p>
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-border pb-3">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${tab === t ? 'bg-accent text-bg' : 'text-text-secondary hover:text-text-primary hover:bg-raised'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <div className="text-text-muted text-center py-8">Loading…</div>}

      {!loading && tab === 'Members' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-border">
                <th className="text-left pb-3 pr-4">Name</th>
                <th className="text-left pb-3 pr-4">Email</th>
                <th className="text-left pb-3 pr-4">Role</th>
                <th className="text-left pb-3 pr-4">Joined</th>
                <th className="text-left pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map(m => (
                <tr key={m.id} className="py-3">
                  <td className="py-3 pr-4 text-text-primary">{m.display_name || m.name}</td>
                  <td className="py-3 pr-4 text-text-secondary">{m.email}</td>
                  <td className="py-3 pr-4">
                    <select value={m.role || 'member'} onChange={e => changeRole(m.id, e.target.value)}
                      className="bg-raised border border-border rounded-sm px-2 py-1 text-text-primary text-xs outline-hidden">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="py-3 pr-4 text-text-muted">{formatDate(m.created)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {['warn', 'timeout', 'ban'].map(action => (
                        <button key={action} onClick={() => memberAction(m.id, action)}
                          className="px-2 py-1 text-xs rounded-sm bg-raised border border-border text-text-muted hover:text-danger hover:border-danger/30 transition-colors capitalize">
                          {action}
                        </button>
                      ))}
                      <button onClick={() => { setResetTarget({ id: m.id, name: m.display_name || m.name }); setResetPw(''); setResetMsg(''); }}
                        className="px-2 py-1 text-xs rounded-sm bg-raised border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                        Reset PW
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Moderation Queue' && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Hidden Posts</h2>
            {hiddenPosts.length === 0 ? <p className="text-text-muted text-sm">No hidden posts.</p> : (
              <div className="space-y-3">
                {hiddenPosts.map(p => (
                  <div key={p.id} className="bg-surface border border-border rounded-sm p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-text-primary font-medium text-sm">{p.title}</p>
                      <p className="text-text-muted text-xs mt-1">{p.category} · {formatDate(p.created)}</p>
                    </div>
                    <button onClick={() => unhidePost(p.id)}
                      className="shrink-0 px-3 py-1.5 text-xs bg-sage/10 border border-sage/30 text-sage rounded-sm hover:bg-sage/20">
                      Unhide
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Pending Q&A Questions</h2>
            {pendingQA.length === 0 ? <p className="text-text-muted text-sm">No pending questions.</p> : (
              <div className="space-y-3">
                {pendingQA.map(q => (
                  <div key={q.id} className="bg-surface border border-border rounded-sm p-4 flex items-start justify-between gap-4">
                    <p className="text-text-secondary text-sm flex-1">{q.question}</p>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleQA(q.id, 'approved')}
                        className="px-3 py-1.5 text-xs bg-sage/10 border border-sage/30 text-sage rounded-sm hover:bg-sage/20 flex items-center gap-1">
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => handleQA(q.id, 'rejected')}
                        className="px-3 py-1.5 text-xs bg-danger/10 border border-danger/30 text-danger rounded-sm hover:bg-danger/20 flex items-center gap-1">
                        <X size={12} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && tab === 'Invite Codes' && (
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-sm p-5">
            <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Create New Invite Code</h2>
            {codeSuccess && <div role="status" className="mb-3 p-3 bg-sage/10 border border-sage/30 rounded-sm text-sage text-sm flex items-center gap-2"><CheckCircle size={14} /> Code created!</div>}
            <form onSubmit={createInviteCode} className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-text-muted mb-1">Code string</label>
                <input type="text" required value={newCode.code} onChange={e => setNewCode(n => ({ ...n, code: e.target.value }))}
                  className="bg-raised border border-border rounded-sm px-3 py-2 text-text-primary text-sm focus:border-accent outline-hidden" placeholder="e.g. WELCOME2025" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Grants role</label>
                <select value={newCode.role_grant} onChange={e => setNewCode(n => ({ ...n, role_grant: e.target.value }))}
                  className="bg-raised border border-border rounded-sm px-3 py-2 text-text-primary text-sm outline-hidden">
                  {ROLES.filter(r => r !== 'member').map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors">
                <Plus size={14} /> Create Code
              </button>
            </form>
          </div>
          <div className="space-y-2">
            {inviteCodes.map(code => (
              <div key={code.id} className="bg-surface border border-border rounded-sm p-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-accent text-sm">{code.code}</span>
                  <span className="ml-3 text-text-muted text-xs">→ {code.role_grant}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-sm border ${code.used ? 'bg-raised text-text-muted border-border' : 'bg-sage/10 text-sage border-sage/20'}`}>
                  {code.used ? 'Used' : 'Available'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === 'Audit Log' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-border">
                <th className="text-left pb-3 pr-4">Action</th>
                <th className="text-left pb-3 pr-4">Target ID</th>
                <th className="text-left pb-3 pr-4">Performed By</th>
                <th className="text-left pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLog.map(entry => (
                <tr key={entry.id}>
                  <td className="py-3 pr-4 text-accent font-mono text-xs">{entry.action}</td>
                  <td className="py-3 pr-4 text-text-muted font-mono text-xs">{entry.target_id}</td>
                  <td className="py-3 pr-4 text-text-muted text-xs">{entry.performed_by}</td>
                  <td className="py-3 text-text-muted text-xs">{formatDate(entry.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Supporters' && (
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-sm p-5">
            <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Add Community Partner</h2>
            {supporterSuccess && <div role="status" className="mb-3 p-3 bg-sage/10 border border-sage/30 rounded-sm text-sage text-sm flex items-center gap-2"><CheckCircle size={14} /> Partner added!</div>}
            <form onSubmit={createSupporter} className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Name', required: true, type: 'text' },
                { key: 'tier', label: 'Tier', required: false, type: 'text' },
                { key: 'website', label: 'Website URL', required: false, type: 'url' },
                { key: 'description', label: 'Description', required: false, type: 'text' },
              ].map(({ key, label, required, type }) => (
                <div key={key}>
                  <label className="block text-xs text-text-muted mb-1">{label}</label>
                  <input type={type} required={required} value={supporterForm[key]}
                    onChange={e => setSupporterForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2 text-text-primary text-sm focus:border-accent outline-hidden" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors">
                  <Plus size={14} /> Add Partner
                </button>
              </div>
            </form>
          </div>
          <div className="space-y-2">
            {supporters.map(s => (
              <div key={s.id} className="bg-surface border border-border rounded-sm p-4 flex items-center justify-between">
                <div>
                  <span className="text-text-primary text-sm font-medium">{s.name}</span>
                  {s.tier && <span className="ml-2 text-text-muted text-xs">{s.tier}</span>}
                  {s.website && <a href={s.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-accent text-xs hover:text-accent-hover">{s.website}</a>}
                </div>
                <button onClick={() => toggleSupporterActive(s.id, s.active)}
                  className={`text-xs px-2 py-0.5 rounded-sm border transition-colors ${s.active ? 'bg-sage/10 text-sage border-sage/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20' : 'bg-raised text-text-muted border-border hover:bg-sage/10 hover:text-sage hover:border-sage/20'}`}>
                  {s.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === 'Suggestions' && (
        <div className="space-y-3">
          {suggestions.map(s => (
            <div key={s.id} className="bg-surface border border-border rounded-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-text-primary font-medium mb-1">{s.topic}</p>
                  {s.details && <p className="text-text-secondary text-sm mb-2">{s.details}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    {s.community_focus && s.community_focus.map(f => (
                      <span key={f} className="text-xs px-1.5 py-0.5 rounded-sm bg-accent/10 text-accent border border-accent/20">{f}</span>
                    ))}
                    <span className="text-text-muted text-xs">{formatDate(s.created)}</span>
                    {s.anonymous && <span className="text-text-muted text-xs italic">anonymous</span>}
                  </div>
                </div>
                <select value={s.status || 'pending'} onChange={e => updateSuggestionStatus(s.id, e.target.value)}
                  className="shrink-0 bg-raised border border-border rounded-sm px-2 py-1 text-text-secondary text-xs outline-hidden">
                  {['pending', 'reviewed', 'planned', 'implemented', 'declined'].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'Contributors' && (
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-lg text-text-primary mb-4">Paid & Volunteer Contributor Applications ({contributorApps.length})</h3>
            {contributorApps.length === 0 ? (
              <p className="text-text-muted text-sm">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {contributorApps.map(a => (
                  <div key={a.id} className="bg-surface border border-border rounded-sm p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-text-primary font-medium">{a.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-sm border ${a.contributor_type === 'paid' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-sage/10 text-sage border-sage/20'}`}>
                            {a.contributor_type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-sm border ${
                            a.status === 'approved' ? 'bg-sage/10 text-sage border-sage/20' :
                            a.status === 'declined' ? 'bg-danger/10 text-danger border-danger/20' :
                            'bg-raised text-text-muted border-border'
                          }`}>{a.status || 'pending'}</span>
                        </div>
                        <p className="text-text-muted text-xs mb-2">{a.email} · {formatDate(a.created)}</p>
                        {a.lived_experience && <p className="text-text-secondary text-sm mb-1"><strong className="text-text-primary">Lived experience:</strong> {a.lived_experience}</p>}
                        {a.credentials && <p className="text-text-secondary text-sm mb-1"><strong className="text-text-primary">Credentials:</strong> {a.credentials}</p>}
                        {a.topic_areas && <p className="text-text-secondary text-sm mb-1"><strong className="text-text-primary">Topics:</strong> {a.topic_areas}</p>}
                        {a.availability && <p className="text-text-secondary text-sm mb-1"><strong className="text-text-primary">Availability:</strong> {a.availability}</p>}
                        {a.sample_work && <a href={a.sample_work} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline">View sample work →</a>}
                      </div>
                      <select
                        value={a.status || 'pending'}
                        onChange={async e => {
                          await pb.collection('contributor_applications').update(a.id, { status: e.target.value });
                          fetchTab('Contributors');
                        }}
                        className="shrink-0 bg-raised border border-border rounded-sm px-2 py-1 text-text-secondary text-xs outline-hidden"
                      >
                        {['pending', 'approved', 'declined'].map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display text-lg text-text-primary mb-4">Volunteer Sign-ups ({volunteerApps.length})</h3>
            {volunteerApps.length === 0 ? (
              <p className="text-text-muted text-sm">No volunteer sign-ups yet.</p>
            ) : (
              <div className="space-y-3">
                {volunteerApps.map(v => (
                  <div key={v.id} className="bg-surface border border-border rounded-sm p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium mb-0.5">{v.name}</p>
                        <p className="text-text-muted text-xs mb-2">{v.email} · {formatDate(v.created)}</p>
                        {v.interests && <p className="text-text-secondary text-sm mb-1"><strong className="text-text-primary">Interests:</strong> {v.interests}</p>}
                        {v.skills && <p className="text-text-secondary text-sm mb-1"><strong className="text-text-primary">Skills:</strong> {v.skills}</p>}
                        {v.availability && <p className="text-text-secondary text-sm"><strong className="text-text-primary">Availability:</strong> {v.availability}</p>}
                      </div>
                      <select
                        value={v.status || 'pending'}
                        onChange={async e => {
                          await pb.collection('volunteer_signups').update(v.id, { status: e.target.value });
                          fetchTab('Contributors');
                        }}
                        className="shrink-0 bg-raised border border-border rounded-sm px-2 py-1 text-text-secondary text-xs outline-hidden"
                      >
                        {['pending', 'active', 'inactive'].map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Listing Applications Tab */}
      {!loading && tab === 'Listing Applications' && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-sm p-6">
            <h3 className="font-display text-lg text-text-primary mb-1">Professional Listing Applications ({listingApps.length})</h3>
            <p className="font-body text-xs text-text-muted mb-4">Once you approve an application, send the practitioner the Stripe payment link so they can activate their $35/month listing.</p>
            {listingApps.length === 0 ? (
              <p className="font-body text-sm text-text-muted">No applications yet.</p>
            ) : (
              <div className="space-y-4">
                {listingApps.map(a => (
                  <div key={a.id} className="bg-raised border border-border rounded-sm p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-text-primary">{a.name}</p>
                        {a.title && <p className="font-body text-sm text-text-secondary">{a.title}</p>}
                        {a.contact_email && <p className="font-body text-xs text-text-muted mt-0.5">{a.contact_email}</p>}
                        {a.communities_served && <p className="font-body text-xs text-text-muted mt-1">Communities: {a.communities_served}</p>}
                        {a.credentials && <p className="font-body text-xs text-text-muted">Credentials: {a.credentials}</p>}
                        {a.bio && <p className="font-body text-xs text-text-secondary mt-2 line-clamp-3">{a.bio}</p>}
                      </div>
                      <div className="flex flex-col gap-2 items-end shrink-0">
                        <select
                          value={a.status || 'pending'}
                          onChange={async e => {
                            await pb.collection('professional_listings').update(a.id, {
                              status: e.target.value,
                              approved: e.target.value === 'approved',
                            });
                            fetchTab('Listing Applications');
                          }}
                          className="bg-raised border border-border rounded-sm px-2 py-1 text-text-secondary text-xs outline-hidden"
                        >
                          {['pending', 'approved', 'declined'].map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                        {(a.status === 'approved' || a.approved) && (
                          <a
                            href={STRIPE_CHECKOUT}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-accent text-bg px-3 py-1.5 rounded-sm font-body font-semibold hover:bg-accent-hover transition-colors"
                          >
                            Send payment link →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true" aria-labelledby="reset-pw-title">
          <div className="bg-surface border border-border rounded-sm shadow-sm w-full max-w-sm p-6">
            <h2 id="reset-pw-title" className="font-display text-xl font-semibold text-text-primary mb-1">Reset Password</h2>
            <p className="text-text-secondary text-sm mb-4">Set a new password for <strong>{resetTarget.name}</strong>. They'll need to use this to sign in.</p>
            {resetMsg && <p className="mb-3 text-danger text-sm">{resetMsg}</p>}
            <label htmlFor="reset-pw-input" className="block text-sm text-text-secondary mb-1.5">New Password</label>
            <input
              id="reset-pw-input"
              type="text"
              value={resetPw}
              onChange={e => setResetPw(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden mb-4"
            />
            <div className="flex gap-2">
              <button onClick={handleResetPassword}
                className="flex-1 py-2.5 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors">
                Set Password
              </button>
              <button onClick={() => { setResetTarget(null); setResetPw(''); setResetMsg(''); }}
                className="flex-1 py-2.5 bg-raised border border-border text-text-secondary text-sm rounded-sm hover:bg-border transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
