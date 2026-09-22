import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import RoleBadge from '../components/RoleBadge.jsx';
import Save from 'icon:save';
import CheckCircle from 'icon:check-circle';

const identityOptions = ['LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'Ally/Supporter'];
const notificationOptions = [
  { key: 'announcements', label: 'Announcements' },
  { key: 'sessions', label: 'Upcoming Sessions' },
  { key: 'replies', label: 'Replies to my posts' },
];

const roleDescriptions = {
  member: 'As a member, you can participate in discussions, submit questions, and engage with the full community.',
  moderator: 'As a moderator, you help keep the community safe and supportive — you can review content and support community guidelines.',
  facilitator: 'As a facilitator, you can host and manage community sessions, moderate discussions, and manage your spotlight profile.',
  guest_facilitator: 'As a guest facilitator, you can host a session and manage a spotlight profile on a limited basis.',
  admin: 'As an admin, you have full access to all platform features, moderation tools, and administrative settings.',
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName: '', bio: '', identityInterests: [], notifications: {} });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    setForm({
      displayName: user.display_name || user.name || '',
      bio: user.bio || '',
      identityInterests: user.identity_interests || [],
      notifications: user.notification_preferences || { announcements: true, sessions: true, replies: true },
    });
  }, [user, navigate]);

  if (!user) return null;

  const toggleIdentity = (val) => {
    setForm(f => ({
      ...f,
      identityInterests: f.identityInterests.includes(val)
        ? f.identityInterests.filter(v => v !== val)
        : [...f.identityInterests, val],
    }));
  };

  const toggleNotif = (key) => {
    setForm(f => ({ ...f, notifications: { ...f.notifications, [key]: !f.notifications[key] } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await pb.collection('members').update(user.id, {
        display_name: form.displayName,
        name: form.displayName,
        bio: form.bio,
        identity_interests: form.identityInterests,
        notification_preferences: form.notifications,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Could not save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-2">My Profile</h1>
        <div className="flex items-center gap-3">
          <span className="text-text-secondary text-sm">{user.email}</span>
          <RoleBadge role={user.role} />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-sm p-4 mb-6">
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-accent font-medium">Your role: </span>
          {roleDescriptions[user.role] || roleDescriptions.member}
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">{error}</div>
      )}
      {success && (
        <div role="status" className="mb-4 p-3 bg-sage/10 border border-sage/30 rounded-sm text-sage text-sm flex items-center gap-2">
          <CheckCircle size={16} /> Changes saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-surface border border-border rounded-sm p-6 space-y-5">
          <h2 className="font-display text-xl font-semibold text-text-primary">About You</h2>
          <div>
            <label htmlFor="profile-name" className="block text-sm text-text-secondary mb-1.5">Display Name</label>
            <input id="profile-name" type="text" value={form.displayName}
              onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden" />
          </div>
          <div>
            <label htmlFor="profile-bio" className="block text-sm text-text-secondary mb-1.5">Bio <span className="text-text-muted">(optional)</span></label>
            <textarea id="profile-bio" rows={4} value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
              placeholder="Share a little about yourself…" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-sm p-6">
          <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Identity Interests</h2>
          <p className="text-text-muted text-xs mb-4">This helps us surface relevant content for you. Select all that apply.</p>
          <div className="flex flex-wrap gap-3">
            {identityOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.identityInterests.includes(opt)} onChange={() => toggleIdentity(opt)}
                  className="accent-[#c4956a]" />
                <span className="text-text-secondary text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-sm p-6">
          <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {notificationOptions.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">{label}</span>
                <button
                  type="button"
                  onClick={() => toggleNotif(key)}
                  role="switch"
                  aria-checked={!!form.notifications[key]}
                  className={`w-10 h-5 rounded-full transition-colors ${form.notifications[key] ? 'bg-accent' : 'bg-border'} relative`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${form.notifications[key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
          <Save size={16} />
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
