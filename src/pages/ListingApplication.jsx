import { useState } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import CheckCircle from 'icon:check-circle';
import ArrowRight from 'icon:arrow-right';
import ArrowLeft from 'icon:arrow-left';

export default function ListingApplication() {
  usePageMeta({
    title: 'Professional Listing Application — The Unbound Minds Collective',
    description: 'Apply to be listed in our subculture-informed professional directory. $35/month after review. LGBTQ+, kink, and ENM-aware practitioners welcome.',
  });

  const [form, setForm] = useState({
    name: '',
    title: '',
    contact_email: '',
    website: '',
    phone: '',
    location: '',
    virtual_available: false,
    in_person_available: false,
    communities_served: '',
    credentials: '',
    credentials_detail: '',
    bio: '',
    specialties: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.contact_email || !form.bio || !form.communities_served) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await pb.collection('professional_listings').create({
        ...form,
        status: 'pending',
        approved: false,
        active: false,
        listing_tier: 'standard',
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-sage" />
          </div>
          <h1 className="font-display text-3xl text-text-primary mb-4">Application received</h1>
          <p className="font-body text-text-secondary mb-6 leading-relaxed">
            Thank you for applying. We'll review your application and be in touch within a few days.
            Once approved, you'll receive next steps for getting your listing live.
          </p>
          <Link
            to="/professional-directory"
            className="inline-flex items-center gap-2 text-accent font-body font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to the directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-surface border-b border-border py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/professional-directory" className="inline-flex items-center gap-1.5 text-accent font-body text-sm font-semibold hover:underline mb-6 block">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to directory
          </Link>
          <p className="text-accent font-body font-semibold text-sm uppercase tracking-widest mb-3">Professional Listing</p>
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
            Apply to be listed
          </h1>
          <p className="font-body text-text-secondary text-lg leading-relaxed">
            Listings are $35/month and put you in front of LGBTQ+, kink-aware, and ENM-informed people
            looking for practitioners who understand their lives. We review every application before approval.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="bg-surface border border-border rounded-sm p-6 space-y-5">
              <h2 className="font-display text-xl text-text-primary">Your details</h2>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Full name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Professional title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Licensed Therapist, Life Coach, Sexologist"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Contact email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://yoursite.com"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="City, State or Country"
                />
              </div>

              <div>
                <p className="font-body text-sm font-semibold text-text-primary mb-2">Availability</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 font-body text-sm text-text-secondary cursor-pointer">
                    <input type="checkbox" name="virtual_available" checked={form.virtual_available} onChange={handleChange} className="accent-accent" />
                    Virtual / online
                  </label>
                  <label className="flex items-center gap-2 font-body text-sm text-text-secondary cursor-pointer">
                    <input type="checkbox" name="in_person_available" checked={form.in_person_available} onChange={handleChange} className="accent-accent" />
                    In person
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-sm p-6 space-y-5">
              <h2 className="font-display text-xl text-text-primary">Your practice</h2>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Communities you serve <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="communities_served"
                  value={form.communities_served}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. LGBTQ+, Kink/BDSM, ENM, Polyamory, Trans"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">Specialties</label>
                <input
                  type="text"
                  name="specialties"
                  value={form.specialties}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. trauma, relationship dynamics, identity exploration"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Credentials / licensure
                </label>
                <input
                  type="text"
                  name="credentials"
                  value={form.credentials}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. LCSW, LPC, Certified Coach, Lived Experience"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Tell us more about your credentials or lived experience
                </label>
                <textarea
                  name="credentials_detail"
                  value={form.credentials_detail}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Any additional context about your training, lived experience, or community involvement"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold text-text-primary mb-1.5">
                  Your bio for the directory <span className="text-danger">*</span>
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-bg border border-border rounded-sm px-3 py-2 font-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Write a short bio (2–4 sentences) that would appear in your directory listing. Plain language — speak directly to the people you want to reach."
                />
                <p className="font-body text-xs text-text-muted mt-1">This is what members will read when they find your listing.</p>
              </div>
            </div>

            {error && (
              <p className="font-body text-sm text-danger bg-danger/10 border border-danger/20 rounded-sm px-4 py-3">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <Link to="/professional-directory" className="font-body text-sm text-text-muted hover:text-text-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body font-semibold px-6 py-3 rounded-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting…' : 'Submit application'} {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <p className="font-body text-xs text-text-muted text-center">
              We review every application personally. Once approved, you'll receive next steps for your $35/month listing.
              This platform does not provide therapy, crisis intervention, or professional mental health services.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
