import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Settings2, X } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface Company {
  id: number;
  name: string;
  user_count?: number;
  created_at: string;
}

export default function CompaniesManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/companies.php');
      setCompanies(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await fetchWithAuth('/companies.php', {
          method: 'PUT',
          body: JSON.stringify({ id: editingCompany.id, name: formData.name }),
        });
      } else {
        await fetchWithAuth('/companies.php', {
          method: 'POST',
          body: JSON.stringify({ name: formData.name }),
        });
      }
      setIsModalOpen(false);
      setEditingCompany(null);
      setFormData({ name: '' });
      loadCompanies();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this company? All users and settings will be removed.')) return;
    try {
      await fetchWithAuth(`/companies.php?id=${id}`, { method: 'DELETE' });
      loadCompanies();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setFormData({ name: company.name });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Companies Directory</h3>
          <p className="text-slate-400">Manage multitenant enterprises</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      {error && <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-white text-center py-8">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {companies.map(company => (
            <div key={company.id} className="glass-panel p-6 flex flex-col group hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(company)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(company.id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">{company.name}</h4>
              <p className="text-sm text-slate-400 mb-4">{company.user_count} User{company.user_count !== 1 && 's'}</p>
              
              <div className="mt-auto pt-4 border-t border-white/5">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('OPEN_METRICOOL_SETTINGS', { detail: company }))}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium transition-colors"
                >
                  <Settings2 className="w-4 h-4" />
                  Metricool API
                </button>
              </div>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-12 glass-panel">
              No companies found. Create one to get started.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">
              {editingCompany ? 'Edit Company' : 'Create Company'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/25 transition-all"
                >
                  {editingCompany ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
