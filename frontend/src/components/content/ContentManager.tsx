import { useState, useEffect } from 'react';
import { FileText, Edit, Trash2, CheckCircle, Clock, RefreshCw, Layers } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface GeneratedPost {
  id: number;
  id_company: number;
  action: string;
  titulo: string;
  resumen: string;
  contenido: string;
  hashtags: string;
  promt_idea_image: string;
  status: string;
  approval_status: string;
  platforms: string;
  created_at: string;
}

export default function ContentManager() {
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/automations/metricool_posts.php');
      setPosts(data || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await fetchWithAuth(`/automations/metricool_posts.php?id=${id}`, { method: 'DELETE' });
      loadPosts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Content IA <span className="text-sm font-normal text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Generated</span>
          </h2>
          <p className="text-slate-400 mt-2">Manage and review all your AI-generated posts ready for publishing.</p>
        </div>
        <button 
          onClick={loadPosts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Output
        </button>
      </div>

      {error && <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your AI content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <div className="glass-panel p-12 text-center border-dashed border-2 border-white/10">
              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Content Yet</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Head over to the Automations tab to start generating massive amounts of content with your AI Engine.
              </p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="glass-panel border border-white/5 hover:border-primary/30 group transition-transform hover:-translate-y-1 flex flex-col h-full overflow-hidden">
                {/* Image Header */}
                {post.url_image ? (
                  <div className="w-full h-40 bg-black/40 relative overflow-hidden border-b border-light/5">
                    <img 
                      src={post.url_image.startsWith('http') ? post.url_image : `https://www.tampateks.com/socials-control-multi${post.url_image}`} 
                      alt="Generated visual" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                       {post.status === 'draft' && post.titulo.startsWith('Generado:') ? (
                         <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-slate-900/90 text-amber-400 border border-amber-500/30 rounded flex items-center gap-1">
                           <Clock className="w-3 h-3" /> In AI Queue
                         </span>
                       ) : (
                         <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white rounded border border-emerald-400/50">
                           AI Ready
                         </span>
                       )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-12 bg-gradient-to-r from-primary/10 to-accent/5 border-b border-white/5 flex items-center px-4 relative">
                    {post.status === 'draft' && post.titulo.startsWith('Generado:') ? (
                         <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded flex items-center gap-1">
                           <Clock className="w-3 h-3" /> In AI Queue
                         </span>
                       ) : (
                         <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded">
                           Pending Review
                         </span>
                    )}
                  </div>
                )}
                
                {/* Body Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">{post.titulo}</h3>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-5 line-clamp-3 flex-1 mb-auto">
                    {post.resumen || 'Waiting for AI processing or description missing...'}
                  </p>
                  
                  {/* Footer Tags */}
                  <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {post.platforms && (() => { 
                          try { 
                            const p = JSON.parse(post.platforms); 
                            return (Array.isArray(p) ? p : [post.platforms]).map((plat: string) => (
                              <span key={plat} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300 font-medium capitalize">
                                {plat}
                              </span>
                            )); 
                          } catch { 
                            return <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">{post.platforms}</span>; 
                          } 
                      })()}
                      {post.hashtags && (
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary font-medium truncate max-w-[150px]">
                           {post.hashtags}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono">
                        #{post.id} • {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-primary hover:bg-primary/20 bg-primary/10 rounded transition-colors" title="Review & Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 bg-emerald-500/10 rounded transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-danger hover:bg-danger/20 bg-danger/10 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
