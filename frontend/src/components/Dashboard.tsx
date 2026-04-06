import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings, Users, Building2, Activity } from 'lucide-react';
import CompaniesManager from './companies/CompaniesManager';
import UsersManager from './users/UsersManager';
import GlobalSettings from './settings/GlobalSettings';
import MetricoolSettingsManager from './settings/MetricoolSettingsManager';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilterCompanyId, setUserFilterCompanyId] = useState<number | null>(null);
  
  const [metricoolModalCompany, setMetricoolModalCompany] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    const handleOpenSettings = (e: Event) => {
      const customEvent = e as CustomEvent;
      setMetricoolModalCompany(customEvent.detail);
    };

    const handleNavigateUsers = (e: Event) => {
      const customEvent = e as CustomEvent;
      setUserFilterCompanyId(customEvent.detail);
      setActiveTab('users');
    };

    window.addEventListener('OPEN_METRICOOL_SETTINGS', handleOpenSettings);
    window.addEventListener('NAVIGATE_TO_USERS', handleNavigateUsers);
    
    return () => {
      window.removeEventListener('OPEN_METRICOOL_SETTINGS', handleOpenSettings);
      window.removeEventListener('NAVIGATE_TO_USERS', handleNavigateUsers);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-panel border-r border-white/5 hidden md:flex flex-col">
        <div className="h-16 flex flex-col justify-center px-6 border-b border-white/5">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-[-2px]">Tampateks</span>
          <span className="text-xl font-bold text-white tracking-tight leading-none">Socials<span className="text-primary">Control</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          
          {user.role === 'SUPERADMIN' && (
            <button 
              onClick={() => setActiveTab('companies')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'companies' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Building2 className="w-5 h-5" />
              Companies
            </button>
          )}
          
          {(user.role === 'SUPERADMIN' || user.role === 'ADMIN') && (
            <button 
              onClick={() => {
                setActiveTab('users');
                setUserFilterCompanyId(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Users className="w-5 h-5" />
              User Management
            </button>
          )}

          {(user.role === 'SUPERADMIN' || user.role === 'ADMIN') && (
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Settings className="w-5 h-5" />
              Settings
            </button>
          )}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-danger hover:bg-danger/10 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 glass-panel rounded-none flex-shrink-0">
          <div className="text-xl font-medium text-white flex items-center gap-3">
            {activeTab === 'overview' && (
              <>
                 <span>Welcome back, <span className="font-bold">{user.name}</span></span>
                 {user.role !== 'SUPERADMIN' ? (
                   <span className="px-4 py-1.5 ml-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center gap-2">
                     <Building2 className="w-4 h-4" />
                     {user.company_name || 'Organization Workspace'}
                   </span>
                 ) : (
                   <span className="px-4 py-1.5 ml-2 bg-gradient-to-r from-danger/20 to-danger/10 text-danger border border-danger/30 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-2">
                     <Activity className="w-4 h-4" />
                     Superadmin Portal
                   </span>
                 )}
              </>
            )}
            {activeTab === 'companies' && 'Organizations Directory'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'settings' && 'Global Configurations'}
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full text-xs font-semibold tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              {user.role}
            </span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border-l-4 border-l-primary relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors blur-xl"></div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Active Profiles</p>
                  <h3 className="text-3xl font-bold text-white">24</h3>
                </div>
                
                <div className="glass-panel p-6 border-l-4 border-l-accent relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors blur-xl"></div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Scheduled Posts</p>
                  <h3 className="text-3xl font-bold text-white">1,248</h3>
                </div>
                
                <div className="glass-panel p-6 border-l-4 border-l-blue-500 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors blur-xl"></div>
                  <p className="text-slate-400 text-sm font-medium mb-1">System Health</p>
                  <h3 className="text-3xl font-bold text-white">99.9%</h3>
                </div>
              </div>
              
              <div className="mt-8 glass-panel p-6 min-h-[400px]">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
                {user.role === 'SUPERADMIN' ? (
                  <p className="text-slate-400">You are logged in as a Superadmin. You can manage all companies from the sidebar.</p>
                ) : (
                  <p className="text-slate-400">You have organizational access to {user.company_id ? `Company #${user.company_id}` : 'your workspace'}.</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'companies' && <CompaniesManager />}

          {activeTab === 'users' && <UsersManager companyFilter={userFilterCompanyId} onClearFilter={() => setUserFilterCompanyId(null)} />}

          {activeTab === 'settings' && <GlobalSettings />}

        </div>
      </main>

      {metricoolModalCompany && (
        <MetricoolSettingsManager 
          companyId={metricoolModalCompany.id} 
          companyName={metricoolModalCompany.name} 
          isModal={true} 
          onClose={() => setMetricoolModalCompany(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
