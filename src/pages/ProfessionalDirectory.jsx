import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import usePageMeta from '../hooks/usePageMeta.js';
import MapPin from 'icon:map-pin';
import Monitor from 'icon:monitor';
import ExternalLink from 'icon:external-link';
import ArrowRight from 'icon:arrow-right';
import Star from 'icon:star';
import Users from 'icon:users';

const communityFilters = ['All', 'LGBTQ+', 'Kink/BDSM', 'ENM/Poly', 'Queer', 'Trans', 'Non-binary'];

export default function ProfessionalDirectory() {
  usePageMeta(
    'Professional Directory',
    'Find subculture-informed therapists, coaches, and professionals who respect and accurately reflect your lived experience. LGBTQ+, kink, and ENM-aware practitioners.',
  );

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const controller = new AbortController();
    pb.collection('professional_listings').getList(1, 100, {
      filter: 'active=true && approved=true',
      sort: '-listing_tier,name',
      signal: controller.signal,
    })
      .then(r => setListings(r.items))
      .catch(e => { if (!e?.isAbort) setListings([]); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = filter === 'All'
    ? listings
    : listings.filter(l => l.communities_served?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-surface border-b border-border py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-body font-semibold text-sm uppercase tracking-widest mb-3">Professional Directory</p>
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-5 leading-tight">
            Practitioners who see you fully.
          </h1>
          <p className="font-body text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            Every listing here is sent in by the practitioner and read by a person before it appears.
            They bring subculture-informed, non-pathologizing practice to the communities we serve.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-bg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {communityFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-sm text-sm font-body font-medium transition-colors ${
                filter === f
                  ? 'bg-accent text-bg'
                  : 'bg-surface text-text-secondary border border-border hover:bg-raised'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="font-body text-text-muted">Loading practitioners...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <Users className="w-10 h-10 text-text-muted mx-auto mb-4" />
              <h2 className="font-display text-xl text-text-primary mb-3">
                {listings.length === 0 ? 'Directory launching soon' : 'No practitioners match this filter'}
              </h2>
              <p className="font-body text-text-secondary mb-6">
                {listings.length === 0
                  ? 'This directory is new and we\'re opening it to subculture-informed practitioners now. Check back soon — or if you\'re a professional who\'d like to be listed, we\'d love to hear from you.'
                  : 'Try a different filter, or browse all practitioners.'}
              </p>
              {listings.length === 0 ? (
                <Link
                  to="/listing-application"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body font-semibold px-5 py-2.5 rounded-sm transition-colors text-sm"
                >
                  Apply to be listed <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setFilter('All')}
                  className="font-body text-sm text-accent hover:underline"
                >
                  Show all practitioners
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map(listing => (
                <div
                  key={listing.id}
                  className={`bg-surface border rounded-sm p-6 flex flex-col gap-4 ${
                    listing.listing_tier === 'featured' ? 'border-accent' : 'border-border'
                  }`}
                >
                  {listing.listing_tier === 'featured' && (
                    <div className="flex items-center gap-1.5 text-accent text-xs font-body font-semibold uppercase tracking-wider">
                      <Star className="w-3.5 h-3.5" />
                      Featured practitioner
                    </div>
                  )}
                  <div>
                    <h2 className="font-display text-xl text-text-primary">{listing.name}</h2>
                    <p className="font-body text-sm text-accent mt-0.5">{listing.title}</p>
                  </div>
                  <p className="font-body text-sm text-text-secondary leading-relaxed line-clamp-4">{listing.bio}</p>

                  {listing.specialties && (
                    <div className="flex flex-wrap gap-1.5">
                      {listing.specialties.split(',').map(s => (
                        <span key={s} className="bg-raised border border-border text-text-secondary text-xs font-body px-2.5 py-1 rounded-sm">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm font-body text-text-muted">
                    {listing.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {listing.location}
                      </span>
                    )}
                    {listing.virtual_available && (
                      <span className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5" /> Virtual available
                      </span>
                    )}
                  </div>

                  {listing.website && (
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-accent hover:underline mt-auto"
                    >
                      Visit website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA for professionals */}
      <section className="py-12 px-4 bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl text-text-primary mb-3">Are you a subculture-informed practitioner?</h2>
          <p className="font-body text-text-secondary mb-6 max-w-xl mx-auto">
            A listing in this directory is for LGBTQ+, kink-aware, and ENM-informed people looking for a
            practitioner who already understands the terrain. Listings are $35/month. The directory is new
            and has no listings yet — we'd rather say that plainly than imply otherwise.
          </p>
          <Link
            to="/listing-application"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body font-semibold px-6 py-3 rounded-sm transition-colors"
          >
            Apply for a listing <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="font-body text-xs text-text-muted mt-4">
            The application form takes no payment. Send it first — a person reads it and replies, and the
            $35/month listing is arranged with you directly afterwards.
          </p>
        </div>
      </section>
    </div>
  );
}
