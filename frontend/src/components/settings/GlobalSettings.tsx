import { useState } from 'react';
import { Settings, Image, FileText, Sparkles } from 'lucide-react';
import MetricoolSettingsManager from './MetricoolSettingsManager';
import CompanyDetailsManager from './CompanyDetailsManager';
import IASettingsManager from './IASettingsManager';

export default function GlobalSettings() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = currentUser.role === 'SUPERADMIN';
  
  const [activeAdminTab, setActiveAdminTab] = useState<'details' | 'metricool' | 'ia_api'>('details');

  return (
    <div className="space-y-6">
      
      {!isSuperAdmin ? (
        <div className="space-y-6">
            {/* Tabs Navigation for Admin */}
            <div className="flex border-b border-white/10 gap-2 mb-6">
              <button
                onClick={() => setActiveAdminTab('details')}
                className={`py-3 px-6 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeAdminTab === 'details' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Company Details
              </button>
              <button
                onClick={() => setActiveAdminTab('metricool')}
                className={`py-3 px-6 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeAdminTab === 'metricool' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Image className="w-4 h-4" />
                Metricool API
              </button>
              <button
                onClick={() => setActiveAdminTab('ia_api')}
                className={`py-3 px-6 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeAdminTab === 'ia_api' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                IA Engine API
              </button>
            </div>

            {/* Tab Render */}
            {activeAdminTab === 'details' && (
              <CompanyDetailsManager companyId={currentUser.company_id} />
            )}
            
            {activeAdminTab === 'metricool' && (
              <MetricoolSettingsManager companyId={currentUser.company_id} />
            )}

            {activeAdminTab === 'ia_api' && (
              <IASettingsManager companyId={currentUser.company_id} />
            )}
        </div>
      ) : (
        <div className="glass-panel p-8 min-h-[400px] flex flex-col items-center justify-center text-center border border-white/5 shadow-xl">
          <Settings className="w-16 h-16 text-primary/50 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Global Settings</h3>
          <p className="text-slate-400 max-w-md">System-wide configurations will go here.</p>
        </div>
      )}
    </div>
  );
}
