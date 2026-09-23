import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { pb } from '../lib/pb.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirmPassword: '', inviteCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/community');
    return null;
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await pb.collection('members').authWithPassword(form.email, form.password);
      navigate('/community');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      // Do NOT include role in the create payload — the createRule rejects it
      const data = {
        name: form.displayName,
        display_name: form.displayName,
        email: form.email,
        password: form.password,
        passwordConfirm: form.confirmPassword,
        invite_code_used: form.inviteCode.trim() || '',
      };
      const member = await pb.collection('members').create(data);

      // Log in immediately so we can use the auth token for invite code lookup
      await pb.collection('members').authWithPassword(form.email, form.password);

      // Check invite code after login (viewRule requires auth)
      if (form.inviteCode.trim()) {
        try {
          const codes = await pb.collection('invite_codes').getList(1, 1, {
            filter: `code="${form.inviteCode.trim()}" && used=false`,
          });
          if (codes.items.length > 0) {
            const code = codes.items[0];
            // Mark code as used
            await pb.collection('invite_codes').update(code.id, { used: true, used_by: member.id });
            // Role grant is applied by admin after reviewing used codes
            // Store the granted role on the member record via admin-permitted update
            if (code.role_grant) {
              await pb.collection('members').update(member.id, { invite_code_used: form.inviteCode.trim() });
            }
          }
        } catch (_) {}
      }

      navigate('/community');
    } catch (err) {
      setError(err?.data?.message || 'Something went wrong. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/static/logo.png" alt="The Unbound Minds Collective" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="font-display text-4xl font-bold text-text-primary mb-2">Welcome home.</h1>
          <p className="text-text-secondary">Join a community built on acceptance and peer support.</p>
        </div>

        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'login' ? 'text-accent border-b-2 border-accent bg-raised' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'signup' ? 'text-accent border-b-2 border-accent bg-raised' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div role="alert" className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-sm text-danger text-sm">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              showForgot ? (
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 border border-accent/30 rounded-sm">
                    <p className="text-text-primary text-sm font-medium mb-2">Need to reset your password?</p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Password resets are handled by our team. Please reach out and we'll get you back in as quickly as possible.
                    </p>
                    <a
                      href="mailto:amber@unboundmindscollective.org?subject=Password%20Reset%20Request"
                      className="inline-block mt-3 text-sm font-medium text-accent hover:text-accent-hover underline"
                    >
                      Email amber@unboundmindscollective.org
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="w-full py-3 bg-raised border border-border text-text-secondary font-medium rounded-sm hover:bg-border transition-colors text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm text-text-secondary mb-1.5">Email</label>
                  <input id="login-email" type="email" required value={form.email} onChange={set('email')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-sm text-text-secondary">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs text-accent hover:text-accent-hover underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input id="login-password" type="password" required value={form.password} onChange={set('password')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <p className="text-center text-text-muted text-xs">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setTab('signup')} className="text-accent hover:text-accent-hover underline">Create one here</button>
                </p>
              </form>
              )
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm text-text-secondary mb-1.5">Display Name</label>
                  <input id="signup-name" type="text" required value={form.displayName} onChange={set('displayName')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="How you'd like to be known" />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm text-text-secondary mb-1.5">Email</label>
                  <input id="signup-email" type="email" required value={form.email} onChange={set('email')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm text-text-secondary mb-1.5">Password</label>
                  <input id="signup-password" type="password" required value={form.password} onChange={set('password')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="At least 8 characters" />
                </div>
                <div>
                  <label htmlFor="signup-confirm" className="block text-sm text-text-secondary mb-1.5">Confirm Password</label>
                  <input id="signup-confirm" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="Repeat your password" />
                </div>
                <div>
                  <label htmlFor="signup-invite" className="block text-sm text-text-secondary mb-1.5">
                    Invite Code <span className="text-text-muted">(optional)</span>
                  </label>
                  <input id="signup-invite" type="text" value={form.inviteCode} onChange={set('inviteCode')}
                    className="w-full bg-raised border border-border rounded-sm px-3 py-2.5 text-text-primary text-sm focus:border-accent transition-colors outline-hidden"
                    placeholder="Have a moderator invite code? Enter it here" />
                  <p className="text-text-muted text-xs mt-1">If you received an invite code from a moderator, enter it here to access additional features.</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-accent text-bg font-medium rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
                <p className="text-center text-text-muted text-xs">
                  Already a member?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-accent hover:text-accent-hover underline">Sign in here</button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-text-muted text-xs text-center mt-4 leading-relaxed">
          By joining, you acknowledge that this platform provides peer advocacy only — not therapy or clinical services.
          <br />In crisis? <Link to="/crisis" className="text-danger/80 hover:text-danger underline">Get immediate support here.</Link>
        </p>
      </div>
    </div>
  );
}
