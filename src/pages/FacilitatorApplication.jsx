import { useState } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import CheckCircle from 'icon:check-circle';
import ClipboardList from 'icon:clipboard-list';
import Info from 'icon:info';
import ChevronDown from 'icon:chevron-down';

const FORMATS = [
  'Peer Discussion',
  'Psychoeducation Talk',
  'Q&A Panel',
  'Workshop',
  'Other',
];

const COMMUNITY_FOCUSES = ['LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'All Communities'];

const initialForm = {
  name: '',
  email: '',
  credentials: '',
  proposed_topic: '',
  proposed_format: '',
  community_focus: [],
  brief_description: '',
  has_lived_experience: false,
  understands_role: false,
};

export default function FacilitatorApplication() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleFocus = (f) =>
    setForm(prev => ({
      ...prev,
      community_focus: prev.community_focus.includes(f)
        ? prev.community_focus.filter(x => x !== f)
        : [...prev.community_focus, f],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.understands_role) {
      setError('Please confirm that you understand the facilitator role before submitting.');
      return;
    }
    setLoading(true);
    try {
      await pb.collection('facilitator_applications').create({
        name: form.name.trim(),
        email: form.email.trim(),
        credentials: form.credentials.trim(),
        proposed_topic: form.proposed_topic.trim(),
        proposed_format: form.proposed_format,
        community_focus: form.community_focus,
        brief_description: form.brief_description.trim(),
        has_lived_experience: form.has_lived_experience,
        understands_role: form.understands_role,
        status: 'pending',
      });
      setSuccess(true);
    } catch (_) {
      setError('Something went wrong submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-surface border border-sage/30 rounded-sm p-10">
          <CheckCircle className="mx-auto text-sage mb-5" size={40} />
          <h2 className="font-display text-3xl font-semibold text-text-primary mb-3">
            Application Received
          </h2>
          <p className="text-text-secondary leading-relaxed mb-2">
            Thank you for putting yourself forward as a facilitator. Your proposal has been sent to the admin team and we'll be in touch once we've had a chance to review it.
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            We read every application carefully and reach out by email, so keep an eye on your inbox.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm(initialForm); }}
            className="mt-8 text-accent hover:text-accent-hover text-sm underline"
          >
            Submit another proposal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* ── Header ── */}
      <div className="mb-8 flex items-start gap-4">
        <ClipboardList className="text-accent shrink-0 mt-1" size={30} />
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-2">
            Facilitate a Session
          </h1>
          <p className="text-text-secondary leading-relaxed text-lg">
            Propose a session for The Unbound Minds Collective — and help shape the conversations our community needs.
          </p>
        </div>
      </div>

      {/* ── Info panel ── */}
      <div className="bg-surface border border-border rounded-sm p-6 mb-10 space-y-5">
        <div className="flex items-start gap-3">
          <Info className="text-accent shrink-0 mt-0.5" size={18} />
          <div>
            <h2 className="font-body font-semibold text-text-primary text-sm mb-1">Who can apply?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We welcome proposals from licensed professionals (therapists, counselors, social workers), credentialed educators, and community advocates who hold relevant lived or professional experience in LGBTQ+, kink/BDSM, and/or ENM/polyamory spaces. You do not need clinical credentials — meaningful lived experience and a thoughtful proposal are equally valued here.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Info className="text-accent shrink-0 mt-0.5" size={18} />
          <div>
            <h2 className="font-body font-semibold text-text-primary text-sm mb-1">What does facilitation look like?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Sessions are time-limited community gatherings — typically 60–90 minutes — with a moderated Q&amp;A format. The focus is psychoeducation, peer advocacy, and shared reflection. Formats include peer discussions, educational talks, panels, and structured workshops. All sessions are held in a supportive, non-clinical environment.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-raised rounded-sm p-4">
          <Info className="text-text-muted shrink-0 mt-0.5" size={16} />
          <p className="text-text-muted text-xs leading-relaxed">
            <span className="font-semibold text-text-secondary">Important: </span>
            Facilitating a session here does not establish a therapeutic or clinical relationship between you and any participant. This is a peer advocacy and education space, not a treatment setting.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="bg-surface border border-border rounded-sm p-6 sm:p-8">
        {error && (
          <div role="alert" className="mb-5 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Name */}
          <div>
            <label htmlFor="fa-name" className="block text-sm text-text-secondary mb-1.5">
              Your name <span className="text-danger">*</span>
            </label>
            <input
              id="fa-name"
              type="text"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="How you'd like to be addressed"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="fa-email" className="block text-sm text-text-secondary mb-1.5">
              Email address <span className="text-danger">*</span>
            </label>
            <input
              id="fa-email"
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="We'll use this to follow up with you"
            />
          </div>

          {/* Credentials */}
          <div>
            <label htmlFor="fa-credentials" className="block text-sm text-text-secondary mb-1.5">
              Background &amp; experience <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              What is your professional background or lived experience relevant to this community?
            </p>
            <textarea
              id="fa-credentials"
              rows={4}
              required
              value={form.credentials}
              onChange={e => set('credentials', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
              placeholder="e.g. Licensed therapist specializing in kink-affirming care; 10 years in LGBTQ+ advocacy; polyamorous community organizer for 6 years…"
            />
          </div>

          {/* Proposed topic */}
          <div>
            <label htmlFor="fa-topic" className="block text-sm text-text-secondary mb-1.5">
              Proposed session topic <span className="text-danger">*</span>
            </label>
            <input
              id="fa-topic"
              type="text"
              required
              value={form.proposed_topic}
              onChange={e => set('proposed_topic', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="e.g. Navigating consent conversations in kink dynamics"
            />
          </div>

          {/* Proposed format */}
          <div>
            <label htmlFor="fa-format" className="block text-sm text-text-secondary mb-1.5">
              Proposed format
            </label>
            <div className="relative">
              <select
                id="fa-format"
                value={form.proposed_format}
                onChange={e => set('proposed_format', e.target.value)}
                className="w-full appearance-none bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden pr-8"
              >
                <option value="">Select a format…</option>
                {FORMATS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            </div>
          </div>

          {/* Community focus */}
          <div>
            <p className="block text-sm text-text-secondary mb-2">
              Community focus <span className="text-text-muted">(select all that apply)</span>
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {COMMUNITY_FOCUSES.map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.community_focus.includes(f)}
                    onChange={() => toggleFocus(f)}
                    className="accent-[#c4956a]"
                  />
                  <span className="text-text-secondary text-sm">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brief description */}
          <div>
            <label htmlFor="fa-description" className="block text-sm text-text-secondary mb-1.5">
              Session description <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              In 2–3 sentences, describe what this session would cover and what participants might take away.
            </p>
            <textarea
              id="fa-description"
              rows={4}
              required
              value={form.brief_description}
              onChange={e => set('brief_description', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
              placeholder="A short, clear description of your proposed session…"
            />
          </div>

          {/* Lived experience */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.has_lived_experience}
                onChange={e => set('has_lived_experience', e.target.checked)}
                className="accent-[#c4956a] mt-0.5 shrink-0"
              />
              <span className="text-text-secondary text-sm leading-relaxed">
                I have personal lived experience in one or more of these communities
              </span>
            </label>
          </div>

          {/* Understands role */}
          <div className="bg-raised border border-border rounded-sm p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.understands_role}
                onChange={e => set('understands_role', e.target.checked)}
                className="accent-[#c4956a] mt-0.5 shrink-0"
              />
              <span className="text-text-secondary text-sm leading-relaxed">
                <span className="text-danger mr-0.5">*</span>
                I understand that facilitators act as educators, not treating clinicians, and that this is a peer advocacy space. Facilitating a session here does not create a therapeutic relationship with any participant.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>

          <p className="text-text-muted text-xs text-center leading-relaxed">
            Applications are reviewed by the admin team. We'll follow up by email with next steps.
            Questions? Visit{' '}
            <Link to="/community" className="underline hover:text-text-secondary">
              the community forum
            </Link>{' '}
            or check the{' '}
            <Link to="/guidelines" className="underline hover:text-text-secondary">
              community guidelines
            </Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
