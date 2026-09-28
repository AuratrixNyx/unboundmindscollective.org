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
                <Link to="/contributor-programme" className="text-sm text-text-secondary hover:text-accent transition-colors">Contributor Programme</Link>
                <Link to="/professional-directory" className="text-sm text-text-secondary hover:text-accent transition-colors">Professional Directory</Link>
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
            <div className="flex items-center gap-4 mt-4">
              <p className="text-text-muted text-xs uppercase tracking-widest">Follow us</p>
              <a href="https://www.facebook.com/profile.php?id=61594948702506" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-muted hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://chat.whatsapp.com/CSPQJe0azjk6SZKXDKD7TY" target="_blank" rel="noopener noreferrer" aria-label="Join our WhatsApp Community" className="text-text-muted hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
              {/* Instagram — add when ready */}
              {/* <a href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-muted hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
