import { useState, useEffect } from 'react';
import { Save, AlertCircle, X, Sparkles, Key } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface IASettingsManagerProps {
  companyId?: number;
  companyName?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export default function IASettingsManager({ companyId, companyName, isModal = false, onClose }: IASettingsManagerProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const url = companyId ? `/ia_settings.php?company_id=${companyId}` : '/ia_settings.php';
        const data = await fetchWithAuth(url);
        if (data && data.gemini_api_key) {
          setGeminiKey(data.gemini_api_key);
        }
      } catch (err: any) {
        // Just ignore if not found
        console.log("No IA settings found yet or error loading them", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        gemini_api_key: geminiKey,
        ...(companyId ? { company_id: companyId } : {})
      };

      await fetchWithAuth('/ia_settings.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      if (isModal && onClose) {
         setTimeout(onClose, 1500);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div className={`space-y-6 ${!isModal ? 'max-w-2xl' : ''}`}>
      {!isModal && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              IA Engine API Settings
            </h3>
            <p className="text-slate-400">Configure connection to Google Gemini for content generation</p>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{message.text}</p>
        </div>
      )}

      <div className={`${!isModal ? 'glass-panel p-8' : ''}`}>
        {loading ? (
          <div className="text-slate-400 text-center py-4">Cargando llaves...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Google Gemini API Key
              </label>
              <input
                type="text"
                required
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSyB..."
                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm shadow-inner"
              />
              <p className="text-xs text-slate-500 mt-2">
                This key will be used for both `gemini-1.5-pro` text generation and `imagen-3.0-generate` for images.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3">
              {isModal && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="glass-panel w-full max-w-lg p-6 border border-white/10 shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              IA Settings
            </h3>
            {companyName && (
               <p className="text-sm text-slate-400 mt-1">Configuring Gemini API for: <span className="text-primary font-medium">{companyName}</span></p>
            )}
          </div>
          
          {content}
        </div>
      </div>
    );
  }

  return content;
}
