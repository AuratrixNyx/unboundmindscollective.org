import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { pb } from '../lib/pb.js';
import Heart from 'icon:heart';
import Users from 'icon:users';
import BookOpen from 'icon:book-open';
import AlertCircle from 'icon:alert-circle';
import Calendar from 'icon:calendar';
import ArrowRight from 'icon:arrow-right';

const pillars = [
  {
    icon: <Heart size={28} />,
    title: 'LGBTQ+ Community',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
    desc: 'Affirming space for queer, trans, non-binary, and questioning folks. From identity exploration to navigating systems that weren\'t built with us in mind — you\'re held here.',
  },
  {
    icon: <Users size={28} />,
    title: 'BDSM / Kink',
    color: 'text-sage',
    bg: 'bg-sage/10 border-sage/20',
    desc: 'Peer advocacy for kink practitioners. We discuss consent frameworks, stigma in healthcare, community ethics, and the intersection of kink identity with wellbeing.',
  },
  {
    icon: <BookOpen size={28} />,
    title: 'ENM / Polyamory',
    color: 'text-accent-hover',
    bg: 'bg-accent/10 border-accent/30',
    desc: 'A home for ethical non-monogamy in all its forms. Relationship structures, navigating jealousy, communication tools, and finding affirming support.',
  },
];

export default function Home() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    pb.collection('sessions').getList(1, 3, {
      filter: 'published=true && status="upcoming"',
      sort: 'session_date',
    })
      .then(r => setSessions(r.items))
      .catch(() => {});
  }, []);

  return (
    <div className="font-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <img
            src="/static/logo.png"
            alt="The Unbound Minds Collective"
            className="h-32 sm:h-40 w-auto mx-auto mb-6"
          />
          <p className="text-accent text-sm uppercase tracking-widest mb-4 font-medium">Peer Advocacy Hub</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-primary leading-tight mb-6">
            Authentic peer advocacy for all the ways we live, love, and thrive.
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            The Unbound Minds Collective is a community-driven space offering peer support, psychoeducation, and affirming discussion for LGBTQ+, kink/BDSM, and ENM/polyamory communities.
          </p>
          <div className="bg-raised border border-border rounded-sm px-5 py-3 text-sm text-text-muted max-w-xl mx-auto mb-8">
            <span className="text-accent font-medium">Not therapy.</span> We're a peer community, not a clinical service. We don't diagnose, treat, or provide crisis support — but we show up for each other with honesty and care.
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="px-6 py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors flex items-center gap-2">
              Join the Collective <ArrowRight size={16} />
            </Link>
            <Link to="/resources" className="px-6 py-3 bg-raised border border-border text-text-secondary font-medium rounded-sm hover:text-text-primary hover:border-accent/40 transition-colors">
              Explore Resources
            </Link>
            <Link to="/sessions" className="px-6 py-3 bg-raised border border-border text-text-secondary font-medium rounded-sm hover:text-text-primary hover:border-accent/40 transition-colors">
              Browse Sessions
            </Link>
          </div>
        </div>
      </section>

      {/* Community pillars */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-semibold text-center text-text-primary mb-2">Three communities, one collective</h2>
        <p className="text-text-secondary text-center mb-10">We hold space for the full spectrum of how you identify and love.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map(p => (
            <div key={p.title} className={`p-6 border rounded-sm bg-surface ${p.bg}`}>
              <div className={`mb-4 ${p.color}`}>{p.icon}</div>
              <h3 className={`font-display text-xl font-semibold mb-3 ${p.color}`}>{p.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming sessions */}
      {sessions.length > 0 && (
        <section className="bg-surface border-t border-b border-border py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-semibold text-text-primary">Upcoming Sessions</h2>
                <p className="text-text-secondary mt-1">Live conversations and peer-led discussions</p>
              </div>
              <Link to="/sessions" className="text-accent text-sm hover:text-accent-hover flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {sessions.map(s => (
                <div key={s.id} className="bg-raised border border-border rounded-sm p-5">
                  <div className="flex items-center gap-2 text-sage text-xs mb-3">
                    <Calendar size={12} />
                    <span>{s.session_date ? new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBA'}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">{s.description}</p>
                  {s.facilitator_name && <p className="text-text-muted text-xs mt-3">with {s.facilitator_name}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What we are not */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-surface border border-border rounded-sm p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-accent shrink-0 mt-1" size={24} />
            <div>
              <h2 className="font-display text-2xl font-semibold text-text-primary mb-4">What we are — and what we're not</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-sage font-medium mb-2">We are:</p>
                  <ul className="text-text-secondary space-y-1.5 leading-relaxed">
                    <li>✓ A peer advocacy community</li>
                    <li>✓ A psychoeducation resource hub</li>
                    <li>✓ A space for affirming discussion</li>
                    <li>✓ Community-driven and non-clinical</li>
                    <li>✓ A place to connect and belong</li>
                  </ul>
                </div>
                <div>
                  <p className="text-danger font-medium mb-2">We are not:</p>
                  <ul className="text-text-secondary space-y-1.5 leading-relaxed">
                    <li>✗ A therapy or counseling service</li>
                    <li>✗ A crisis intervention platform</li>
                    <li>✗ A diagnostic or medical resource</li>
                    <li>✗ A substitute for professional care</li>
                    <li>✗ Bound by clinical confidentiality</li>
                  </ul>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-5 border-t border-border pt-4">
                If you're in crisis or need immediate support, please visit our <Link to="/crisis" className="text-danger/80 hover:text-danger underline">Crisis Resources page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
