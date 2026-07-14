import { useState, useEffect } from 'react';
import { Save, Globe, FileText } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface CompanyDetailsProps {
  companyId: number;
}

export default function CompanyDetailsManager({ companyId }: CompanyDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    website_url: '',
    description: ''
  });

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchWithAuth(`/company_details.php?company_id=${companyId}`);
      if (data) {
        setFormData({
          website_url: data.website_url || '',
          description: data.description || ''
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadDetails();
    }
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');
      
      const payload = {
        company_id: companyId,
        website_url: formData.website_url,
        description: formData.description
      };

      const result = await fetchWithAuth('/company_details.php', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      // Auto-retry once logic just in case the table had to auto-create initially
      if (result.message && result.message.includes('Tabla creada')) {
          await fetchWithAuth('/company_details.php', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
      }

      setSuccessMsg('Detalles de la empresa guardados correctamente.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 flex justify-center items-center h-64 border border-white/5 shadow-xl">
        <p className="text-slate-400 font-medium">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 border border-white/5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          Company Details
        </h3>
        <p className="text-slate-400 text-sm max-w-xl">
          Provide detailed information about your organization to inform the AI regarding your business context, tone, and online presence.
        </p>
      </div>

      {error ? (
        <div className="mb-6 bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          {error}
        </div>
      ) : null}

      {successMsg ? (
        <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium">
          {successMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Website URL
          </label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="https://www.yourcompany.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Company Description (Markdown)
            </label>
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">Supports standard MD</span>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={12}
            className="w-full bg-background border border-white/10 rounded-lg px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y font-mono text-sm leading-relaxed"
            placeholder="# About Us&#10;Write a comprehensive description of your company, target audience, and primary products/services here. You can use markdown to format this document."
          />
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 px-8 rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Description'}
          </button>
        </div>
      </form>
    </div>
  );
}
