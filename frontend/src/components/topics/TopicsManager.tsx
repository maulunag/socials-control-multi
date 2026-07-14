import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileText, CheckCircle, Clock } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface Topic {
  id: number;
  id_company: number;
  company_name?: string;
  title: string;
  description: string | null;
  keywords: string | null;
  category: string | null;
  status: 'draft' | 'ready' | 'used';
  created_at: string;
}

interface Company {
  id: number;
  name: string;
}

export default function TopicsManager({ companyFilter, onClearFilter }: { companyFilter?: number | null, onClearFilter?: () => void }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    category: '',
    status: 'draft',
    id_company: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = currentUser.role === 'SUPERADMIN';

  const loadData = async () => {
    try {
      setLoading(true);
      const url = companyFilter ? `/topics.php?company_id=${companyFilter}` : '/topics.php';
      const topicsData = await fetchWithAuth(url);
      setTopics(topicsData);
      
      if (isSuperAdmin) {
        const companiesData = await fetchWithAuth('/companies.php');
        setCompanies(companiesData);
      }
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...formData };
      
      if (!isSuperAdmin) {
        payload.id_company = currentUser.company_id;
      }

      if (editingTopic) {
        payload.id = editingTopic.id;
        await fetchWithAuth('/topics.php', {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithAuth('/topics.php', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await fetchWithAuth(`/topics.php?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openCreateModal = () => {
    setEditingTopic(null);
    setFormData({ 
      title: '', 
      description: '', 
      keywords: '', 
      category: '', 
      status: 'draft', 
      id_company: companyFilter ? companyFilter.toString() : '' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({ 
      title: topic.title, 
      description: topic.description || '', 
      keywords: topic.keywords || '', 
      category: topic.category || '', 
      status: topic.status,
      id_company: topic.id_company?.toString() || '' 
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400"><CheckCircle className="w-3.5 h-3.5" /> Ready</span>;
      case 'used':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400"><FileText className="w-3.5 h-3.5" /> Used</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400"><Clock className="w-3.5 h-3.5" /> Draft</span>;
    }
  };

  const filteredTopics = companyFilter 
    ? topics.filter(t => t.id_company === companyFilter)
    : topics;

  const currentFilteredCompany = companyFilter 
    ? companies.find(c => c.id === companyFilter)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
             Gen Topics
             {currentFilteredCompany && (
                <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full flex items-center gap-2">
                   Filtered by: {currentFilteredCompany.name}
                   <button onClick={onClearFilter} className="hover:text-white"><X className="w-3 h-3"/></button>
                </span>
             )}
          </h3>
          <p className="text-slate-400">Manage ideas, articles, and topics for social media generation.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Topic
        </button>
      </div>

      {error && <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="glass-panel p-8 text-center text-slate-400">Loading topics...</div>
      ) : filteredTopics.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-400">
           {companyFilter ? 'No topics found for this company.' : 'No topics found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTopics.map(topic => (
            <div key={topic.id} className="bg-panel/50 backdrop-blur-none border border-white/10 rounded-xl p-5 flex flex-col hover:-translate-y-1 hover:bg-white/5 transition-all duration-300 relative group shadow-lg">
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-semibold text-slate-300 truncate max-w-[50%]">
                  {topic.category || 'General'}
                </span>
                <div className="shrink-0">
                  {getStatusBadge(topic.status)}
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 line-clamp-3 leading-snug">
                {topic.title}
              </h4>
              
              <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-1">
                {topic.description || <span className="italic opacity-50">No description provided</span>}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                {topic.keywords && (
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold truncate hover:text-center transition-all cursor-default">
                    {topic.keywords}
                  </p>
                )}
                {isSuperAdmin && (
                  <p className="text-xs text-slate-400 font-medium truncate">
                    🏢 {topic.company_name || 'System'}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(topic)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-primary hover:bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(topic.id)}
                    className="flex items-center justify-center p-2 text-danger hover:bg-danger/10 border border-danger/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto pt-[10vh]">
          <div className="glass-panel w-full max-w-2xl p-6 border border-white/10 shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">
              {editingTopic ? 'Edit Topic' : 'Create Topic'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 5 rules of AI use in your business"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                  placeholder="A short summary of what this topic entails..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Keywords</label>
                   <input
                     type="text"
                     value={formData.keywords}
                     onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                     placeholder="AI, innovation, business..."
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                   <input
                     type="text"
                     value={formData.category}
                     onChange={e => setFormData({ ...formData, category: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                     placeholder="Technology"
                   />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="ready">Ready for AI</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                
                {isSuperAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                    <select
                      required
                      value={formData.id_company}
                      onChange={e => setFormData({ ...formData, id_company: e.target.value })}
                      className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select Company</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
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
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
                >
                  {editingTopic ? 'Save Changes' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
