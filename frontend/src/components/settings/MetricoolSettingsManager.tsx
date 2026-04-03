import { useState, useEffect } from 'react';
import { Settings2, Save, X } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface MetricoolSettingsProps {
  companyId?: number; 
  companyName?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function MetricoolSettingsManager({ companyId, companyName, onClose, isModal = false }: MetricoolSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    company_id: companyId || '',
    metricool_user_id: '',
    metricool_token: '',
    facebook_active: false,
    instagram_active: false,
    linkedin_active: false,
    gmb_active: false,
    twitter_active: false,
    youtube_active: false,
    tiktok_active: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const url = companyId ? `/metricool_settings.php?company_id=${companyId}` : '/metricool_settings.php';
        const data = await fetchWithAuth(url);
        if (data) {
          setFormData({
            company_id: data.company_id || companyId || '',
            metricool_user_id: data.metricool_user_id || '',
            metricool_token: data.metricool_token || '',
            facebook_active: data.facebook_active || false,
            instagram_active: data.instagram_active || false,
            linkedin_active: data.linkedin_active || false,
            gmb_active: data.gmb_active || false,
            twitter_active: data.twitter_active || false,
            youtube_active: data.youtube_active || false,
            tiktok_active: data.tiktok_active || false,
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await fetchWithAuth('/metricool_settings.php', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ label, field }: { label: string, field: keyof typeof formData }) => (
    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => setFormData({ ...formData, [field]: !formData[field] })}
        className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${formData[field] ? 'bg-primary' : 'bg-slate-600'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData[field] ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  const Content = (
    <div className={isModal ? "" : "max-w-3xl"}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-primary" />
            Metricool Settings {companyName && <span className="text-slate-400 font-normal ml-2">({companyName})</span>}
          </h3>
          <p className="text-slate-400">Configure API connectivity and active platforms</p>
        </div>
        {isModal && onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6">{success}</div>}

      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
          <div className="glass-panel p-6 space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Credentials</h4>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Metricool User ID</label>
              <input
                type="text"
                value={formData.metricool_user_id}
                onChange={e => setFormData({ ...formData, metricool_user_id: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="USER_XXXXXXXXXXXX"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Metricool Token / API Key</label>
              <input
                type="password"
                value={formData.metricool_token}
                onChange={e => setFormData({ ...formData, metricool_token: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••••••••••••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="glass-panel p-6">
            <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Active Social Platforms</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Toggle label="Facebook" field="facebook_active" />
              <Toggle label="Instagram" field="instagram_active" />
              <Toggle label="LinkedIn" field="linkedin_active" />
              <Toggle label="Google My Business" field="gmb_active" />
              <Toggle label="Twitter/X" field="twitter_active" />
              <Toggle label="YouTube" field="youtube_active" />
              <Toggle label="TikTok" field="tiktok_active" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
        <div className="glass-panel w-full max-w-3xl p-6 border border-white/10 shadow-2xl relative my-8">
          {Content}
        </div>
      </div>
    );
  }

  return Content;
}
