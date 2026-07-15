import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

const DEV_USERS = [
  { label: 'Super Admin', email: 'superadmin@tampateks.com', password: 'admin123', role: 'SUPERADMIN' },
];

const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fillCredentials = (user: typeof DEV_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left side: Premium Branding (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-panel flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
               <Activity className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-bold text-white tracking-tight">Socials<span className="text-primary">Control</span></span>
          </div>

          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Multi-Tenant <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Social Media</span><br/> Orchestration.
          </h2>
          <p className="text-lg text-slate-400 max-w-md font-light leading-relaxed">
            Manage brands, automate posts, and centralize the Metricool API for all your organizational tenants seamlessly.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
          <ShieldCheck className="w-5 h-5 text-accent" />
          Secure Enterprise Authentication
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your administration panel.</p>
          </div>

          <div className="glass-panel p-8 sm:p-10 !border-white/5 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-danger"></div>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all overflow-hidden group">
                  <div className="pl-4 pr-3 py-3 text-slate-500 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-slate-500 py-3 pr-4 focus:outline-none"
                    placeholder="admin@tampateks.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                </div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all overflow-hidden group">
                  <div className="pl-4 pr-3 py-3 text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-slate-500 py-3 pr-4 focus:outline-none tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-8 group h-12 text-base font-semibold shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              {/* DEV ONLY: Quick fill buttons */}
              {isDev && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500 mb-2 text-center font-mono">⚡ Dev autofill</p>
                  <div className="flex flex-col gap-2">
                    {DEV_USERS.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => fillCredentials(u)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 transition-all group flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-slate-300 group-hover:text-white">{u.label}</span>
                        <span className="text-xs text-slate-500 font-mono group-hover:text-primary">{u.email}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
          
          <div className="mt-10 text-center">
             <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">Powered by Tampateks</p>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Login;

