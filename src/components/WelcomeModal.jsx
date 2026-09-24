import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import X from 'icon:x';
import Heart from 'icon:heart';
import Shield from 'icon:shield';
import Users from 'icon:users';
import BookOpen from 'icon:book-open';

const STORAGE_KEY = 'umc_welcomed';

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-sm shadow-sm overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 w-full bg-accent" />

        <div className="p-6 sm:p-8">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close welcome message"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <img
              src="/static/logo.png"
              alt="The Unbound Minds Collective"
              className="h-20 w-auto mx-auto mb-4"
            />
            <h2 id="welcome-title" className="font-display text-3xl font-bold text-text-primary mb-2">
              Welcome home.
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              You've found a space built on radical acceptance, peer support, and the belief that every way of living, loving, and thriving deserves respect.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                <Heart size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Peer advocacy, not therapy</p>
                <p className="text-xs text-text-muted">We provide education, lived-experience validation, and community support — never diagnosis or treatment.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">A moderated, radically welcoming space</p>
                <p className="text-xs text-text-muted">Stigma, moralization, and conversion frameworks are not welcome here. Our guidelines exist to protect everyone.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                <Users size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Community-centered</p>
                <p className="text-xs text-text-muted">LGBTQ+, BDSM/kink, and ENM/polyamory communities are centered here — not accommodated, centered.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Start by reading our guidelines</p>
                <p className="text-xs text-text-muted">Our community guidelines explain what we welcome, what we don't, and how moderation works.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              to="/start-here"
              onClick={dismiss}
              className="flex-1 py-2.5 text-center text-sm font-medium border border-accent text-accent hover:bg-accent/10 rounded-sm transition-colors"
            >
              Start Here →
            </Link>
            <button
              onClick={dismiss}
              className="flex-1 py-2.5 text-sm font-medium bg-accent text-bg hover:bg-accent-hover rounded-sm transition-colors"
            >
              Enter the Collective
            </button>
          </div>

          <p className="text-center text-text-muted text-xs mt-4">
            In crisis right now?{' '}
            <Link to="/crisis" onClick={dismiss} className="text-danger/80 hover:text-danger underline">
              Get immediate support here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
