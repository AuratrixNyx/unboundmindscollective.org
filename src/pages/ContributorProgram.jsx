import { useState } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import Heart from 'icon:heart';
import Star from 'icon:star';
import Users from 'icon:users';
import BookOpen from 'icon:book-open';
import CheckCircle from 'icon:check-circle';
import ArrowRight from 'icon:arrow-right';

const paidRoles = [
  {
    icon: BookOpen,
    title: 'Article Contributor',
    description: 'Write in-depth pieces on lived experience, community knowledge, or topics relevant to LGBTQ+, kink, and ENM communities.',
    pay: 'Paid contributor — details on acceptance',
    length: '800–2,000 words',
  },
  {
    icon: Heart,
    title: 'Peer Guide Author',
    description: 'Create practical, community-grounded guides that help members navigate complex personal terrain with dignity.',
    pay: 'Paid contributor — details on acceptance',
    length: '1,000–2,000 words',
  },
  {
    icon: Star,
    title: 'Resource Reviewer',
    description: 'Evaluate and write up external resources — books, organisations, tools — through a subculture-informed lens.',
    pay: 'Paid contributor — details on acceptance',
    length: '500–800 words',
  },
  {
    icon: Users,
    title: 'Topic Leader',
    description: 'Own a recurring topic area, curate conversations, and shape how the community explores a subject over time.',
    pay: 'Paid contributor — details on acceptance',
    length: 'Ongoing',
  },
];

const volunteerRoles = [
  { title: 'Community Moderator', description: 'Help hold the forum space — welcoming new members, flagging concerns, keeping conversations grounded.' },
  { title: 'Resource Curator', description: 'Research and nominate external resources for the resource registry.' },
  { title: 'Peer Support Listener', description: 'Show up for members in discussion threads with presence, not advice — witnessing lived experience.' },
  { title: 'Events & Sessions Helper', description: 'Support facilitators with logistics, outreach, and follow-up for community sessions.' },
];

const qualities = [
  'Lived experience in LGBTQ+, kink/BDSM, ENM, or polyamory communities',
  'A non-pathologizing, strengths-based perspective',
  'Comfort working without clinical framing',
  'Willingness to be publicly credited (optional)',
  'Therapists, coaches, and credentialed professionals are warmly welcomed',
];

export default function ContributorProgram() {
  usePageMeta({
    title: 'Contributor Programme — The Unbound Minds Collective',
    description: 'Join as a paid or volunteer contributor. We center lived experience and subculture-informed knowledge — therapists, coaches, and community members all welcome.',
  });

  const { user } = useAuth();
  const [tab, setTab] = useState('paid');
  const [form, setForm] = useState({
    name: user?.display_name || user?.name || '',
    email: user?.email || '',
    contributor_type: 'paid',
    lived_experience: '',
    credentials: '',
    topic_areas: '',
    availability: '',
    public_credit: false,
    sample_work: '',
    additional_info: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleTab = (t) => {
    setTab(t);
    setForm(f => ({ ...f, contributor_type: t }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError('Please include your name and email.'); return; }
    setLoading(true);
    setError('');
    try {
      await pb.collection('contributor_applications').create({ ...form, status: 'pending' });
      setSuccess(true);
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-surface border-b border-border py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-body font-semibold text-sm uppercase tracking-widest mb-3">Contributor Programme</p>
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-5 leading-tight">
            Your knowledge belongs here.
          </h1>
          <p className="font-body text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            The Unbound Minds Collective is built by and for the communities it serves. We pay people with lived experience
            and subculture-informed knowledge to create content that accurately reflects our communities — because that knowledge is real work.
          </p>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="py-10 px-4 bg-bg">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-sm p-6 text-center">
              <p className="font-body text-text-muted text-sm uppercase tracking-wider mb-2">Paid contributor piece</p>
              <p className="font-display text-4xl text-accent font-bold">$50</p>
              <p className="font-body text-text-secondary text-sm mt-2">per accepted article, guide, or review</p>
            </div>
            <div className="bg-surface border border-border rounded-sm p-6 text-center">
              <p className="font-body text-text-muted text-sm uppercase tracking-wider mb-2">Professional listing</p>
              <p className="font-display text-4xl text-accent font-bold">$35</p>
              <p className="font-body text-text-secondary text-sm mt-2">per month in our professional directory</p>
            </div>
          </div>
          <p className="font-body text-text-muted text-sm text-center mt-4">
            Revenue from professional listings funds contributor pay. Members always access peer support for free.
          </p>
        </div>
      </section>

      {/* What we're looking for */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl text-text-primary mb-6">What we're looking for</h2>
          <ul className="space-y-3">
            {qualities.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                <span className="font-body text-text-secondary">{q}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-5 bg-raised border border-border rounded-sm">
            <p className="font-body text-text-secondary text-sm leading-relaxed">
              <strong className="text-text-primary">Lived experience is not a lesser credential here.</strong> We explicitly center
              community knowledge alongside professional training. If you've navigated kink, polyamory, or queer identity from
              the inside, your perspective is exactly what this space is built for.
            </p>
          </div>
        </div>
      </section>

      {/* Paid roles */}
      <section className="py-12 px-4 bg-bg border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl text-text-primary mb-2">Paid contributor roles</h2>
          <p className="font-body text-text-secondary mb-8">Each accepted piece earns $50, regardless of type.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paidRoles.map((role) => (
              <div key={role.title} className="bg-surface border border-border rounded-sm p-5">
                <role.icon className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-body font-semibold text-text-primary mb-2">{role.title}</h3>
                <p className="font-body text-text-secondary text-sm leading-relaxed mb-3">{role.description}</p>
                <div className="flex gap-4 text-xs text-text-muted font-body">
                  <span>{role.pay}</span>
                  <span>·</span>
                  <span>{role.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer roles */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl text-text-primary mb-2">Volunteer roles</h2>
          <p className="font-body text-text-secondary mb-8">
            Unpaid volunteer roles are kept entirely separate from paid ones — no one is misled about compensation.
            Volunteering here is about showing up for the community, not replacing paid work.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteerRoles.map((role) => (
              <div key={role.title} className="bg-bg border border-border rounded-sm p-5">
                <h3 className="font-body font-semibold text-text-primary mb-2">{role.title}</h3>
                <p className="font-body text-text-secondary text-sm leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-16 px-4 bg-bg border-t border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-text-primary mb-2">Apply to contribute</h2>
          <p className="font-body text-text-secondary mb-8">
            Tell us about yourself. There's no wrong way to answer — we read every application with care.
          </p>

          {success ? (
            <div className="bg-surface border border-sage rounded-sm p-8 text-center">
              <CheckCircle className="w-10 h-10 text-sage mx-auto mb-4" />
              <h3 className="font-display text-xl text-text-primary mb-2">Thank you — we've got your application.</h3>
              <p className="font-body text-text-secondary">
                We read every one carefully and will be in touch. We're grateful you're here.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tab */}
              <div className="flex rounded-sm border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleTab('paid')}
                  className={`flex-1 py-2.5 text-sm font-body font-medium transition-colors ${tab === 'paid' ? 'bg-accent text-bg' : 'bg-surface text-text-secondary hover:bg-raised'}`}
                >
                  Paid contributor
                </button>
                <button
                  type="button"
                  onClick={() => handleTab('volunteer')}
                  className={`flex-1 py-2.5 text-sm font-body font-medium transition-colors ${tab === 'volunteer' ? 'bg-accent text-bg' : 'bg-surface text-text-secondary hover:bg-raised'}`}
                >
                  Volunteer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Your name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent"
                    placeholder="How you'd like to be known"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Email address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent"
                    placeholder="We'll use this to get back to you"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Lived experience</label>
                <textarea
                  value={form.lived_experience}
                  onChange={e => setForm(f => ({ ...f, lived_experience: e.target.value }))}
                  rows={3}
                  className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent resize-none"
                  placeholder="Share as much or as little as you're comfortable with — your community membership, identities, personal journey..."
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Credentials or professional background <span className="text-text-muted font-normal">(optional)</span></label>
                <textarea
                  value={form.credentials}
                  onChange={e => setForm(f => ({ ...f, credentials: e.target.value }))}
                  rows={2}
                  className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent resize-none"
                  placeholder="Therapist, coach, educator, researcher — or none at all. Lived experience stands on its own here."
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Topic areas you're drawn to</label>
                <textarea
                  value={form.topic_areas}
                  onChange={e => setForm(f => ({ ...f, topic_areas: e.target.value }))}
                  rows={2}
                  className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent resize-none"
                  placeholder="e.g. relationship anarchism, BDSM negotiation, queer grief, coming out later in life, ENM communication..."
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Availability</label>
                <input
                  type="text"
                  value={form.availability}
                  onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}
                  className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent"
                  placeholder="e.g. one piece per month, occasional, ongoing..."
                />
              </div>

              {tab === 'paid' && (
                <div>
                  <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Sample work <span className="text-text-muted font-normal">(optional)</span></label>
                  <input
                    type="url"
                    value={form.sample_work}
                    onChange={e => setForm(f => ({ ...f, sample_work: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent"
                    placeholder="A link to something you've written, if you have one"
                  />
                </div>
              )}

              <div>
                <label className="block font-body text-sm font-medium text-text-primary mb-1.5">Anything else you'd like us to know <span className="text-text-muted font-normal">(optional)</span></label>
                <textarea
                  value={form.additional_info}
                  onChange={e => setForm(f => ({ ...f, additional_info: e.target.value }))}
                  rows={3}
                  className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-accent resize-none"
                  placeholder="Questions, context, or anything that felt hard to fit above..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="public_credit"
                  checked={form.public_credit}
                  onChange={e => setForm(f => ({ ...f, public_credit: e.target.checked }))}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="public_credit" className="font-body text-sm text-text-secondary">
                  I'm comfortable being publicly credited for my contributions
                </label>
              </div>

              {error && <p className="font-body text-sm text-danger">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-bg font-body font-semibold py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Sending...' : <>Send my application <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="font-body text-xs text-text-muted text-center">
                Your application is saved securely. We read every one with care and will be in touch.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Professional listing CTA */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl text-text-primary mb-3">Are you a therapist, coach, or professional?</h2>
          <p className="font-body text-text-secondary mb-6 max-w-xl mx-auto">
            Get listed in our professional directory — $35/month to be visible to exactly the communities you serve.
            Apply first — once reviewed, we'll be in touch with next steps.
          </p>
          <Link
            to="/professional-directory"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body font-semibold px-6 py-3 rounded-sm transition-colors"
          >
            View the professional directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
