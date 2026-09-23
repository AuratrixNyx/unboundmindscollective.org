import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ExternalLink from 'icon:external-link';
import Edit from 'icon:edit';
import CheckCircle from 'icon:check-circle';
import Plus from 'icon:plus';

const specialtyOptions = [
  'LGBTQ+ Affirming', 'Kink-Aware', 'ENM/Poly Specialist', 'Trauma-Informed',
  'CBT', 'DBT', 'Somatic', 'Peer Advocacy',
];

function ProfileCard({ profile }) {
  return (
    <div className="bg-surface border border-border rounded-sm p-6">
      <h3 className="font-display text-xl font-semibold text-text-primary mb-1">{profile.display_name}</h3>
      {profile.specialty_tags && profile.specialty_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {profile.specialty_tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-sm bg-accent/10 border border-accent/20 text-accent">{tag}</span>
          ))}
        </div>
      )}
      {profile.bio && <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-4">{profile.bio}</p>}
      <div className="flex flex-wrap gap-3">
        {profile.website && (
          <a href={profile.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
            <ExternalLink size={12} /> Website
          </a>
        )}
        {profile.podcast_url && (
          <a href={profile.podcast_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
            <ExternalLink size={12} /> Podcast
          </a>
        )}
        {profile.book_url && (
          <a href={profile.book_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
            <ExternalLink size={12} /> Book
          </a>
        )}
        {profile.practice_url && (
          <a href={profile.practice_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
            <ExternalLink size={12} /> Practice
          </a>
        )}
        {profile.twitter && (
          <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent">
            <ExternalLink size={12} /> Twitter/X
          </a>
        )}
        {profile.instagram && (
          <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-accent">
            <ExternalLink size={12} /> Instagram
          </a>
        )}
      </div>
    </div>
  );
}

export default function FacilitatorSpotlight() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myProfile, setMyProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    display_name: '', bio: '', specialty_tags: [],
    website: '', podcast_url: '', book_url: '', practice_url: '',
    twitter: '', instagram: '', linkedin: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isFacilitator = user && ['facilitator', 'guest_facilitator', 'admin'].includes(user.role);

  useEffect(() => {
    pb.collection('facilitator_profiles').getList(1, 50, { filter: 'approved=true', sort: 'display_name' })
      .then(r => setProfiles(r.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isFacilitator || !user) return;
    pb.collection('facilitator_profiles').getList(1, 1, { filter: `member_id="${user.id}"` })
      .then(r => {
        if (r.items.length > 0) {
          const p = r.items[0];
          setMyProfile(p);
          setForm({
            display_name: p.display_name || '',
            bio: p.bio || '',
            specialty_tags: p.specialty_tags || [],
            website: p.website || '',
            podcast_url: p.podcast_url || '',
            book_url: p.book_url || '',
            practice_url: p.practice_url || '',
            twitter: p.twitter || '',
            instagram: p.instagram || '',
            linkedin: p.linkedin || '',
          });
        } else {
          setForm(f => ({ ...f, display_name: user.display_name || user.name || '' }));
        }
      })
      .catch(() => {});
  }, [user, isFacilitator]);

  const toggleTag = (tag) => setForm(f => ({
    ...f,
    specialty_tags: f.specialty_tags.includes(tag)
      ? f.specialty_tags.filter(t => t !== tag)
      : [...f.specialty_tags, tag],
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      if (myProfile) {
        await pb.collection('facilitator_profiles').update(myProfile.id, form);
      } else {
        const p = await pb.collection('facilitator_profiles').create({
          ...form, member_id: user.id, approved: false,
        });
        setMyProfile(p);
      }
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (_) {
      setSaveError('Could not save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-text-primary mb-3">Facilitator Directory</h1>
            <p className="text-text-secondary">Meet the facilitators who guide our community conversations and sessions.</p>
          </div>
          <Link to="/facilitator-application"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">
            Apply to Facilitate →
          </Link>
        </div>
      </div>

      {/* Facilitator's own profile management */}
      {isFacilitator && (
        <div className="mb-10 bg-surface border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-text-primary">
              {myProfile ? 'My Facilitator Profile' : 'Create My Profile'}
            </h2>
            {myProfile && !editMode && (
              <button onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-accent border border-border rounded-sm hover:border-accent/40 transition-colors">
                <Edit size={14} /> Edit
              </button>
            )}
          </div>

          {saveSuccess && (
            <div role="status" className="mb-4 p-3 bg-sage/10 border border-sage/30 rounded-sm text-sage text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Profile saved! It will appear once approved by a moderator.
            </div>
          )}
          {saveError && <div role="alert" className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">{saveError}</div>}

          {(editMode || !myProfile) && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Display Name</label>
                  <input type="text" required value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Website URL</label>
                  <input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
                    placeholder="https://…" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Bio</label>
                <textarea rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none" />
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {specialtyOptions.map(tag => (
                    <label key={tag} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.specialty_tags.includes(tag)} onChange={() => toggleTag(tag)} className="accent-[#c4956a]" />
                      <span className="text-text-secondary text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'podcast_url', label: 'Podcast URL', type: 'url' },
                  { key: 'book_url', label: 'Book URL', type: 'url' },
                  { key: 'practice_url', label: 'Practice URL', type: 'url' },
                  { key: 'twitter', label: 'Twitter/X handle', type: 'text' },
                  { key: 'instagram', label: 'Instagram handle', type: 'text' },
                  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-sm text-text-secondary mb-1.5">{label} <span className="text-text-muted">(optional)</span></label>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-bg text-sm font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
                  <Plus size={14} /> {saving ? 'Saving…' : myProfile ? 'Save Changes' : 'Submit Profile'}
                </button>
                {myProfile && <button type="button" onClick={() => setEditMode(false)}
                  className="px-5 py-2.5 bg-raised border border-border text-text-secondary text-sm rounded-sm hover:text-text-primary">
                  Cancel
                </button>}
              </div>
            </form>
          )}

          {myProfile && !editMode && (
            <div>
              <ProfileCard profile={myProfile} />
              {!myProfile.approved && (
                <p className="text-text-muted text-xs mt-3">Your profile is pending moderator approval and isn't publicly visible yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Public profiles */}
      {loading ? (
        <div className="text-text-muted text-center py-12">Loading…</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">No facilitator profiles yet. Check back soon!</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  );
}
