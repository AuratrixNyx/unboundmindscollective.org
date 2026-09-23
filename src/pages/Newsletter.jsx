import { useState } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import CheckCircle from 'icon:check-circle';
import Mail from 'icon:mail';
import Calendar from 'icon:calendar';
import Star from 'icon:star';
import BookOpen from 'icon:book-open';
import Users from 'icon:users';

const INTERESTS = ['LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'General'];

export default function Newsletter() {
  usePageMeta('Monthly Digest', 'Sign up for The Unbound Minds Collective monthly digest — community updates, upcoming sessions, and resources for LGBTQ+, kink, and polyamory communities delivered to your inbox.');
  const [form, setForm] = useState({ email: '', first_name: '', interests: [] });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (interest) =>
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await pb.collection('newsletter_subscribers').create({
        email: form.email.trim().toLowerCase(),
        first_name: form.first_name.trim() || null,
        interests: form.interests,
        subscribed: true,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.message || '';
      if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate') || err?.status === 400) {
        setError("It looks like that email is already subscribed — you're all set!");
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <Mail className="text-accent shrink-0 mt-1" size={28} />
        <div>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
            Monthly Digest
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Once a month, straight to your inbox — upcoming sessions, fresh resources, and warm highlights from the community. No spam, ever.
          </p>
        </div>
      </div>

      {/* What you'll receive */}
      <div className="bg-surface border border-border rounded-sm p-5 mb-8">
        <h2 className="font-display text-xl font-semibold text-text-primary mb-4">What's inside each digest</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <Calendar className="text-accent shrink-0 mt-0.5" size={18} />
            <div>
              <span className="text-text-primary text-sm font-medium">Upcoming sessions</span>
              <p className="text-text-muted text-xs mt-0.5">A preview of the month's gatherings so you can save the date.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="text-accent shrink-0 mt-0.5" size={18} />
            <div>
              <span className="text-text-primary text-sm font-medium">New resources</span>
              <p className="text-text-muted text-xs mt-0.5">Handpicked guides, directories, and educational pieces added to the library.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Users className="text-sage shrink-0 mt-0.5" size={18} />
            <div>
              <span className="text-text-primary text-sm font-medium">Community highlights</span>
              <p className="text-text-muted text-xs mt-0.5">Moments, conversations, and spotlights from the collective.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Star className="text-sage shrink-0 mt-0.5" size={18} />
            <div>
              <span className="text-text-primary text-sm font-medium">Once a month — that's it</span>
              <p className="text-text-muted text-xs mt-0.5">We respect your inbox. One email per month, unsubscribe any time.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Success state */}
      {success ? (
        <div className="bg-surface border border-sage/30 rounded-sm p-8 text-center">
          <CheckCircle className="mx-auto text-sage mb-4" size={36} />
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">You're in!</h2>
          <p className="text-text-secondary mb-1">Look out for your first digest — it'll feel like a warm letter from friends.</p>
          <p className="text-text-muted text-sm">You can unsubscribe any time from within any email we send.</p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2.5 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors text-sm"
          >
            Back to home
          </Link>
        </div>
      ) : (
        /* Form */
        <div className="bg-surface border border-border rounded-sm p-6">
          {error && (
            <div role="alert" className="mb-5 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="nl-email" className="block text-sm text-text-secondary mb-1.5">
                Email address <span className="text-danger">*</span>
              </label>
              <input
                id="nl-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
                placeholder="you@example.com"
              />
            </div>

            {/* First name */}
            <div>
              <label htmlFor="nl-firstname" className="block text-sm text-text-secondary mb-1.5">
                First name <span className="text-text-muted">(optional — so we can say hi properly)</span>
              </label>
              <input
                id="nl-firstname"
                type="text"
                autoComplete="given-name"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
                placeholder="How shall we greet you?"
              />
            </div>

            {/* Interests */}
            <div>
              <p className="block text-sm text-text-secondary mb-2">
                What are you most interested in? <span className="text-text-muted">(select all that apply)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map(interest => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                      className="accent-[#c4956a]"
                    />
                    <span className="text-text-secondary text-sm">{interest}</span>
                  </label>
                ))}
              </div>
              <p className="text-text-muted text-xs mt-2">
                We'll use this to make each digest feel more relevant to you. Leaving it blank is totally fine too.
              </p>
            </div>

            {/* Privacy note */}
            <p className="text-text-muted text-xs border-t border-border pt-4">
              No account required. Your email is used only for this digest and will never be shared. Unsubscribe any time using the link in any email we send.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Subscribing…' : 'Subscribe to the Digest'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
