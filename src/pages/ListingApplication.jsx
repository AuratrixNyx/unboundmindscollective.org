import { useState } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import CheckCircle from 'icon:check-circle';
import ClipboardList from 'icon:clipboard-list';
import Info from 'icon:info';
import ChevronDown from 'icon:chevron-down';

// Credential options — "None / not applicable" is a real, respected answer here.
// Lived and community experience stand on their own in this directory.
const CREDENTIAL_OPTIONS = [
  'None / not applicable',
  'Licensed therapist, counsellor, or social worker',
  'Medical or psychiatric professional',
  'Credentialed coach, educator, or researcher',
  'Peer or community practitioner without a formal credential',
  'Other — described below',
];

const COMMUNITY_FOCUSES = ['LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'Queer', 'Trans', 'Non-binary'];

const initialForm = {
  name: '',
  title: '',
  credentials: '',
  credentials_detail: '',
  website: '',
  contact_email: '',
  communities_served: [],
  location: '',
  virtual_available: false,
  bio: '',
  listing_tier: 'standard',
};

export default function ListingApplication() {
  usePageMeta('Apply for a Listing', 'Apply for a $35/month listing in The Unbound Minds Collective professional directory. Subculture-informed practitioners, reviewed by a person — and free community care stays free.');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleCommunity = (c) =>
    setForm(prev => ({
      ...prev,
      communities_served: prev.communities_served.includes(c)
        ? prev.communities_served.filter(x => x !== c)
        : [...prev.communities_served, c],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.communities_served.length === 0) {
      setError('Please select at least one community your practice serves.');
      return;
    }
    setLoading(true);
    try {
      await pb.collection('professional_listings').create({
        name: form.name.trim(),
        title: form.title.trim(),
        credentials: form.credentials,
        credentials_detail: form.credentials_detail.trim(),
        website: form.website.trim(),
        contact_email: form.contact_email.trim(),
        communities_served: form.communities_served.join(', '),
        location: form.location.trim(),
        virtual_available: form.virtual_available,
        bio: form.bio.trim(),
        // Tier: standard (non-featured) is the only tier available today.
        listing_tier: 'standard',
        // Nothing is published or live until a person reviews it.
        status: 'pending',
        approved: false,
        active: false,
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
            Thank you — your application is with us. Amber reads these herself, so a real person has it,
            and she'll reply to the email address you gave us.
          </p>
          <p className="text-text-secondary leading-relaxed mb-2">
            Nothing was charged: sending this form costs nothing and takes no payment. Nothing about your
            practice is published until you've heard back and you're happy with how the listing reads.
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            If you change your mind, or you'd rather not be listed after all, just say so in your reply —
            there's nothing to cancel.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm(initialForm); }}
            className="mt-8 text-accent hover:text-accent-hover text-sm underline"
          >
            Submit another application
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
            Apply for a Listing
          </h1>
          <p className="text-text-secondary leading-relaxed text-lg">
            A listing in our professional directory is $35 per month. Send your details here first —
            this form takes no payment.
          </p>
        </div>
      </div>

      {/* ── Info panel ── */}
      <div className="bg-surface border border-border rounded-sm p-6 mb-10 space-y-5">
        <div className="flex items-start gap-3">
          <Info className="text-accent shrink-0 mt-0.5" size={18} />
          <div>
            <h2 className="font-body font-semibold text-text-primary text-sm mb-1">What happens after you apply</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Your application goes to a person at The Unbound Minds Collective — not a queue that decides by itself —
              and she'll reply by email. Nothing appears in the directory until it has been read and you've agreed
              the wording. The directory is new and still small, so we'd rather you know that than guess it.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Info className="text-accent shrink-0 mt-0.5" size={18} />
          <div>
            <h2 className="font-body font-semibold text-text-primary text-sm mb-1">What we ask — and what we never ask</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We ask about your practice: what you do, who you work with, and how people reach you. We do not ask
              about your own kink, relationship structure, gender, or identity, and a listing here does not require
              disclosing anything personal. Answer what you're comfortable with; leave the rest blank.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-raised rounded-sm p-4">
          <Info className="text-text-muted shrink-0 mt-0.5" size={16} />
          <p className="text-text-muted text-xs leading-relaxed">
            <span className="font-semibold text-text-secondary">Important: </span>
            A listing is a directory entry, not an endorsement of your services and not a clinical relationship with
            anyone who finds you here. The Unbound Minds Collective does not provide therapy, crisis intervention,
            or professional mental health services.
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

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Practitioner name */}
          <div>
            <label htmlFor="la-name" className="block text-sm text-text-secondary mb-1.5">
              Practitioner or practice name <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              How you'd like to appear in the directory. A practice name is fine if you'd rather not use your own.
            </p>
            <input
              id="la-name"
              type="text"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="e.g. Rowan Ellis, LCSW — or the name of your practice"
            />
          </div>

          {/* Discipline */}
          <div>
            <label htmlFor="la-title" className="block text-sm text-text-secondary mb-1.5">
              Discipline <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              The one line that sits under your name in the directory.
            </p>
            <input
              id="la-title"
              type="text"
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="e.g. Licensed clinical social worker · Relationship coach · Peer educator"
            />
          </div>

          {/* Credentials */}
          <div>
            <label htmlFor="la-credentials" className="block text-sm text-text-secondary mb-1.5">
              Credentials or licensure <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              Pick whichever fits. "None / not applicable" is a real answer here — community-grounded experience
              counts for a great deal in this directory.
            </p>
            <div className="relative">
              <select
                id="la-credentials"
                required
                value={form.credentials}
                onChange={e => set('credentials', e.target.value)}
                className="w-full appearance-none bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden pr-8"
              >
                <option value="">Select an option…</option>
                {CREDENTIAL_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            </div>
          </div>

          {/* Credential detail */}
          <div>
            <label htmlFor="la-credentials-detail" className="block text-sm text-text-secondary mb-1.5">
              Anything you'd like us to know about your training or background{' '}
              <span className="text-text-muted">(optional)</span>
            </label>
            <textarea
              id="la-credentials-detail"
              rows={2}
              value={form.credentials_detail}
              onChange={e => set('credentials_detail', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
              placeholder="e.g. Licence number and state, training in kink-aware or non-monogamy-competent practice, years working with these communities…"
            />
          </div>

          {/* Contact email */}
          <div>
            <label htmlFor="la-email" className="block text-sm text-text-secondary mb-1.5">
              Contact email <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              Used to reply to you and kept private. It is never shown in the directory or shared.
            </p>
            <input
              id="la-email"
              type="email"
              required
              value={form.contact_email}
              onChange={e => set('contact_email', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="Where we should write back to you"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="la-website" className="block text-sm text-text-secondary mb-1.5">
              Website <span className="text-text-muted">(optional)</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              The link people click to reach you. If you don't have a site yet, leave it blank and mention it in your reply.
            </p>
            <input
              id="la-website"
              type="url"
              value={form.website}
              onChange={e => set('website', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
              placeholder="https://"
            />
          </div>

          {/* Communities served */}
          <div>
            <p className="block text-sm text-text-secondary mb-2">
              Communities your practice serves <span className="text-danger">*</span>{' '}
              <span className="text-text-muted">(select all that apply)</span>
            </p>
            <p className="text-text-muted text-xs mb-2">
              This describes the people you work with, so it appears in the directory. It says nothing about
              how you live.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {COMMUNITY_FOCUSES.map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.communities_served.includes(c)}
                    onChange={() => toggleCommunity(c)}
                    className="accent-[#c4956a]"
                  />
                  <span className="text-text-secondary text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location / telehealth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="la-location" className="block text-sm text-text-secondary mb-1.5">
                Location <span className="text-text-muted">(optional)</span>
              </label>
              <input
                id="la-location"
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
                placeholder="e.g. San Antonio, TX — or Online only"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.virtual_available}
                  onChange={e => set('virtual_available', e.target.checked)}
                  className="accent-[#c4956a] shrink-0"
                />
                <span className="text-text-secondary text-sm leading-relaxed">
                  I see people remotely (telehealth / online)
                </span>
              </label>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="la-bio" className="block text-sm text-text-secondary mb-1.5">
              Short bio <span className="text-danger">*</span>
            </label>
            <p className="text-text-muted text-xs mb-2">
              Two to four sentences in your own voice — what you offer and how you work. We'll confirm the final
              wording with you before it goes anywhere.
            </p>
            <textarea
              id="la-bio"
              rows={5}
              required
              maxLength={600}
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
              placeholder="e.g. I work with people navigating kink, non-monogamy, and queer identity, without treating any of it as a problem to fix…"
            />
            <p className="text-text-muted text-xs mt-1">{form.bio.length}/600</p>
          </div>

          {/* Tier — standard only; nothing else is priced or offered yet */}
          <div>
            <label htmlFor="la-tier" className="block text-sm text-text-secondary mb-1.5">Listing tier</label>
            <select
              id="la-tier"
              value="standard"
              disabled
              className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-secondary text-sm outline-hidden disabled:opacity-70"
            >
              <option value="standard">Standard listing — $35/month</option>
            </select>
            <p className="text-text-muted text-xs mt-1">
              Standard is the only tier we offer today. If anything else becomes available, we'll tell you first —
              we won't upsell you here.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Sending…' : 'Send my listing application'}
          </button>

          <p className="text-text-muted text-xs text-center leading-relaxed">
            Applications are read by a person and answered by email. Questions in the meantime? Visit{' '}
            <Link to="/community" className="underline hover:text-text-secondary">
              the community forum
            </Link>{' '}
            or read{' '}
            <Link to="/guidelines" className="underline hover:text-text-secondary">
              the community guidelines
            </Link>.
          </p>
        </form>
      </div>

      {/* ── PAYMENT INTEGRATION POINT ──────────────────────────────────────────
          The $35/month checkout link exists in Stripe, but it deliberately is
          NOT on this page: a listing is only offered it after a person has read
          the application and approved it. The live link sits on approved
          listings in the admin Listings tab, for the owner to send to the
          practitioner by hand. If checkout is ever wired in here, keep it to
          this one place (never on a care-facing page) and, on a successful
          subscription, flip the listing to active=true — the admin approval
          path currently sets active itself.
          Nothing here collects payment details or can charge anyone.         */}
      <div
        data-umc-integration-point="listing-checkout"
        className="mt-10 bg-raised border border-border rounded-sm p-6"
      >
        <h2 className="font-display text-xl text-text-primary mb-2">How the $35/month works</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Applying costs nothing, and this page doesn't take a payment. The owner reads every application by hand
          — that's what makes this directory worth anything. If your application is approved, your listing goes
          into the public directory and we send you the $35/month checkout link, so you can subscribe whenever
          you're ready.
        </p>
        <p className="text-text-muted text-xs leading-relaxed">
          No payment details are collected here, and nothing on this page can charge you.
        </p>
      </div>

      {/* Keeping the two paid routes apart on purpose */}
      <p className="text-text-muted text-xs leading-relaxed mt-8">
        Not what you're after? A listing is $35/month for practitioners who want to be found in the directory.
        If you'd rather write for us, the{' '}
        <Link to="/contributor-programme" className="underline hover:text-text-secondary">
          contributor programme
        </Link>{' '}
        is a separate application — the paid contributor programme isn't open yet, and volunteering there is how
        people get involved today.
      </p>
    </div>
  );
}
