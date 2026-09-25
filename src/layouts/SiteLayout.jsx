import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import { pb } from '../lib/pb.js';
import LogoMark from '../components/LogoMark.jsx';
import WelcomeModal from '../components/WelcomeModal.jsx';
import Menu from 'icon:menu';
import X from 'icon:x';
import AlertTriangle from 'icon:alert-triangle';
import User from 'icon:user';
import LogOut from 'icon:log-out';
import ChevronDown from 'icon:chevron-down';
import SearchIcon from 'icon:search';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/community', label: 'Community' },
  { to: '/resources', label: 'Resources' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/ai-guide', label: 'AI Guide' },
  { to: '/facilitators', label: 'Facilitators' },
];

export default function SiteLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supporters, setSupporters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    pb.collection('supporters').getList(1, 10, { filter: 'active=true' })
      .then(r => setSupporters(r.items))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isElevated = user && ['moderator', 'facilitator', 'guest_facilitator', 'admin'].includes(user.role);



  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary font-body">
      <WelcomeModal />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="The Unbound Minds Collective — home">
            <LogoMark height={44} />
            <span className="font-display text-accent text-lg font-semibold leading-tight">
              The Unbound Minds<br /> Collective
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-raised'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/crisis"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-sm text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive ? 'text-danger bg-danger/10' : 'text-danger/80 hover:text-danger hover:bg-danger/10'
                }`
              }
            >
              <AlertTriangle size={14} />
              Crisis Help
            </NavLink>
          </nav>

          {/* Search */}
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `hidden lg:flex items-center justify-center w-9 h-9 rounded-sm transition-colors ${
                isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-raised'
              }`
            }
            aria-label="Search"
          >
            <SearchIcon size={18} />
          </NavLink>

          {/* Right side - auth */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm text-text-secondary hover:text-text-primary hover:bg-raised transition-colors"
                >
                  <User size={16} />
                  <span>{user.name || user.display_name || 'Profile'}</span>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-sm shadow-sm z-50">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-raised">My Profile</Link>
                    {isElevated && (
                      <Link to="/facilitator-console" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-raised">Moderator Console</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-raised">Admin Dashboard</Link>
                    )}
                    <Link to="/suggestion-box" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-raised">Suggestion Box</Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-danger/80 hover:text-danger hover:bg-raised">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="px-4 py-1.5 rounded-sm text-sm font-medium bg-accent text-bg hover:bg-accent-hover transition-colors">
                Join / Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-bg/95 flex flex-col pt-20 px-6 pb-6 overflow-y-auto">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-sm text-base font-medium ${
                    isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-raised'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/search"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-sm text-base font-medium flex items-center gap-2 ${
                  isActive ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary hover:bg-raised'
                }`
              }
            >
              <SearchIcon size={16} /> Search
            </NavLink>
            <NavLink
              to="/crisis"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-sm text-base font-medium flex items-center gap-2 ${
                  isActive ? 'text-danger bg-danger/10' : 'text-danger/80 hover:text-danger hover:bg-danger/10'
                }`
              }
            >
              <AlertTriangle size={16} /> Crisis Help
            </NavLink>
            <div className="border-t border-border my-2" />
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-sm text-base text-text-secondary hover:text-text-primary hover:bg-raised">My Profile</Link>
                {isElevated && <Link to="/facilitator-console" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-sm text-base text-text-secondary hover:text-text-primary hover:bg-raised">Moderator Console</Link>}
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-sm text-base text-text-secondary hover:text-text-primary hover:bg-raised">Admin Dashboard</Link>}
                <Link to="/suggestion-box" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-sm text-base text-text-secondary hover:text-text-primary hover:bg-raised">Suggestion Box</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-4 py-3 rounded-sm text-base text-danger/80 text-left hover:text-danger hover:bg-raised flex items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-sm text-base font-medium bg-accent text-bg text-center hover:bg-accent-hover">
                Join / Sign In
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {supporters.length > 0 && (
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-4">Community Partners</p>
              <div className="flex flex-wrap gap-4">
                {supporters.map(s => (
                  <a
                    key={s.id}
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LogoMark height={48} />
                <p className="font-display text-accent text-lg font-semibold leading-tight">The Unbound Minds Collective</p>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">A peer advocacy hub for LGBTQ+, BDSM/kink, and ENM/polyamory communities.</p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-3">Navigate</p>
              <div className="flex flex-col gap-1.5">
                {navLinks.map(l => <Link key={l.to} to={l.to} className="text-sm text-text-secondary hover:text-accent transition-colors">{l.label}</Link>)}
                <Link to="/crisis" className="text-sm text-danger/80 hover:text-danger transition-colors">Crisis Help</Link>
              </div>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-3">More</p>
              <div className="flex flex-col gap-1.5">
                <Link to="/start-here" className="text-sm text-text-secondary hover:text-accent transition-colors">Start Here</Link>
                <Link to="/guidelines" className="text-sm text-text-secondary hover:text-accent transition-colors">Community Guidelines</Link>
                <Link to="/members" className="text-sm text-text-secondary hover:text-accent transition-colors">Member Directory</Link>
                <Link to="/search" className="text-sm text-text-secondary hover:text-accent transition-colors">Search</Link>
                <Link to="/suggestion-box" className="text-sm text-text-secondary hover:text-accent transition-colors">Suggestion Box</Link>
                <Link to="/newsletter" className="text-sm text-text-secondary hover:text-accent transition-colors">Monthly Digest</Link>
                <Link to="/facilitators" className="text-sm text-text-secondary hover:text-accent transition-colors">Facilitator Directory</Link>
                <Link to="/facilitator-application" className="text-sm text-text-secondary hover:text-accent transition-colors">Facilitate a Session</Link>
                <Link to="/auth" className="text-sm text-text-secondary hover:text-accent transition-colors">Join the Collective</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-text-muted text-xs leading-relaxed max-w-3xl">
              <strong className="text-text-secondary">Important:</strong> This platform provides peer advocacy, psychoeducation, and community support only. We are not a therapy service and do not provide mental health treatment, diagnosis, or crisis intervention. If you are in crisis, please contact a professional service immediately — visit our{' '}
              <Link to="/crisis" className="text-danger/80 hover:text-danger underline">Crisis Resources page</Link>{' '}
              for immediate support options.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
              <p className="text-text-muted text-xs">© {new Date().getFullYear()} The Unbound Minds Collective. All rights reserved.</p>
              <Link to="/privacy" className="text-text-muted text-xs hover:text-accent transition-colors underline">Privacy Policy</Link>
              <Link to="/terms" className="text-text-muted text-xs hover:text-accent transition-colors underline">Terms of Use</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
