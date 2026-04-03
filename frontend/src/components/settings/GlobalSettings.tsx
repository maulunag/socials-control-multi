import { Settings } from 'lucide-react';
import MetricoolSettingsManager from './MetricoolSettingsManager';

export default function GlobalSettings() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = currentUser.role === 'SUPERADMIN';

  return (
    <div className="space-y-6">
      {/* If it's a SuperAdmin, the global settings are just for their own profile for now. Wait, they might want to set global platform defaults? 
          If they are an ADMIN, we can render their Company's Metricool settings right here! */}
      
      {!isSuperAdmin ? (
        <MetricoolSettingsManager companyId={currentUser.company_id} />
      ) : (
        <div className="glass-panel p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
          <Settings className="w-16 h-16 text-primary/50 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Global Settings</h3>
          <p className="text-slate-400 max-w-md">System-wide configurations will go here.</p>
        </div>
      )}
    </div>
  );
}
