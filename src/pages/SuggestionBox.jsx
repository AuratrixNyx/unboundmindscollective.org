import { useState } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import CheckCircle from 'icon:check-circle';
import Lightbulb from 'icon:lightbulb';

const focuses = ['LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'General/All'];

export default function SuggestionBox() {
  usePageMeta('Suggestion Box', 'Have an idea for a future session or community topic? Share it with The Unbound Minds Collective — your voice shapes what we explore together.');
  const { user } = useAuth();
  const [form, setForm] = useState({ topic: '', details: '', focuses: [], anonymous: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleFocus = (f) => setForm(prev => ({
    ...prev,
    focuses: prev.focuses.includes(f) ? prev.focuses.filter(x => x !== f) : [...prev.focuses, f],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await pb.collection('suggestions').create({
        topic: form.topic,
        details: form.details,
        community_focus: form.focuses,
        submitter_id: form.anonymous ? null : user.id,
        anonymous: form.anonymous,
        status: 'pending',
      });
      setSuccess(true);
      setForm({ topic: '', details: '', focuses: [], anonymous: false });
    } catch (_) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-start gap-4">
        <Lightbulb className="text-accent shrink-0 mt-1" size={28} />
        <div>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-2">Suggestion Box</h1>
          <p className="text-text-secondary leading-relaxed">
            Your ideas shape this community. Tell us what topics you'd love to explore, what conversations feel missing, or what you'd find most valuable.
          </p>
        </div>
      </div>

      {!user ? (
        <div className="bg-surface border border-border rounded-sm p-8 text-center">
          <p className="text-text-secondary mb-4">You'll need to be a member to share suggestions — so we can follow up and keep the conversation going.</p>
          <Link to="/auth" className="px-6 py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors inline-block">
            Join to Share Ideas
          </Link>
        </div>
      ) : success ? (
        <div className="bg-surface border border-sage/30 rounded-sm p-8 text-center">
          <CheckCircle className="mx-auto text-sage mb-4" size={32} />
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">Thank you!</h2>
          <p className="text-text-secondary">Your idea has been received — thank you for helping shape this community.</p>
          <button onClick={() => setSuccess(false)} className="mt-6 text-accent hover:text-accent-hover text-sm underline">
            Submit another suggestion
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-sm p-6">
          {error && <div role="alert" className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="suggest-topic" className="block text-sm text-text-secondary mb-1.5">
                What topic would you love to explore? <span className="text-danger">*</span>
              </label>
              <input id="suggest-topic" type="text" required value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden"
                placeholder="e.g. Navigating kink and ADHD, coming out later in life…" />
            </div>

            <div>
              <label htmlFor="suggest-details" className="block text-sm text-text-secondary mb-1.5">
                More context or details <span className="text-text-muted">(optional)</span>
              </label>
              <textarea id="suggest-details" rows={4} value={form.details}
                onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
                className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent outline-hidden resize-none"
                placeholder="Any additional context that might help us understand what you're looking for…" />
            </div>

            <div>
              <p className="block text-sm text-text-secondary mb-2">Community focus <span className="text-text-muted">(select all that apply)</span></p>
              <div className="flex flex-wrap gap-3">
                {focuses.map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.focuses.includes(f)} onChange={() => toggleFocus(f)} className="accent-[#c4956a]" />
                    <span className="text-text-secondary text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.anonymous} onChange={e => setForm(f => ({ ...f, anonymous: e.target.checked }))} className="accent-[#c4956a]" />
                <span className="text-text-secondary text-sm">Submit anonymously</span>
              </label>
              <p className="text-text-muted text-xs mt-1 ml-5">If checked, your name won't be linked to this suggestion.</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
              {loading ? 'Submitting…' : 'Share Your Idea'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
