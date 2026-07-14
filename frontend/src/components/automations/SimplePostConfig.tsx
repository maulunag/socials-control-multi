import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Sparkles, Bot, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

const XIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.045z"/></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>;
const InstaIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.2c3.2 0 3.6.01 4.9.07 1.2.05 1.8.25 2.2.4.5.2.9.5 1.3.9s.7.8.9 1.3c.1.4.3 1 .4 2.2.06 1.3.07 1.7.07 4.9s-.01 3.6-.07 4.9c-.05 1.2-.25 1.8-.4 2.2-.2.5-.5.9-.9 1.3s-.8.7-1.3.9c-.4.1-1 .3-2.2.4-1.3.06-1.7.07-4.9.07s-3.6-.01-4.9-.07c-1.2-.05-1.8-.25-2.2-.4-.5-.2-.9-.5-1.3-.9s-.7-.8-.9-1.3c-.1-.4-.3-1-.4-2.2C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.9c.05-1.2.25-1.8.4-2.2.2-.5.5-.9.9-1.3s.8-.7 1.3-.9c.4-.1 1-.3 2.2-.4 1.3-.06 1.7-.07 4.9-.07zm0-2.2c-3.3 0-3.7.01-5 .07-1.3.06-2.2.3-3 .6-.8.3-1.4.8-2 1.4-.6.6-1.1 1.2-1.4 2-.3.8-.5 1.7-.6 3-.06 1.3-.07 1.7-.07 5s.01 3.7.07 5c.06 1.3.3 2.2.6 3 .3.8.8 1.4 1.4 2 .6.6 1.2 1.1 2 1.4.8.3 1.7.5 3 .6 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c1.3-.06 2.2-.3 3-.6.8-.3 1.4-.8 2-1.4.6-.6 1.1-1.2 1.4-2 .3-.8.5-1.7.6-3 .06-1.3.07-1.7.07-5s-.01-3.7-.07-5c-.06-1.3-.3-2.2-.6-3-.3-.8-.8-1.4-1.4-2-.6-.6-1.2-1.1-2-1.4-.8-.3-1.7-.5-3-.6-1.3-.06-1.7-.07-5-.07zm0 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm0 10.2c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.4-10.7c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4.6-1.4 1.4-1.4 1.4.6 1.4 1.4z"/></svg>;
const LinkedInIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

interface Topic {
  id: number;
  id_company: number;
  title: string;
  description: string | null;
  category: string | null;
}

interface SimplePostConfigProps {
  onBack: () => void;
}

export default function SimplePostConfig({ onBack }: SimplePostConfigProps) {
  const [platformGroup, setPlatformGroup] = useState<'x_threads' | 'meta_linkedin_gmb'>('meta_linkedin_gmb');
  const [contentCount, setContentCount] = useState<number>(1);
  const [selectedTopicId, setSelectedTopicId] = useState<number | ''>('');
  const [isTopicModalOpen, setIsTopicModalOpen] = useState<boolean>(false);
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [workerErrors, setWorkerErrors] = useState<string[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        // Assuming current user company is handled by the backend or we just fetch all available to the user
        const topicsData = await fetchWithAuth('/topics.php');
        setTopics(topicsData);
      } catch (err) {
        console.error("Failed to load topics", err);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopicId) return;

    setGenerating(true);
    setSuccess(false);
    setWorkerErrors([]);

    try {
      const selectedTopic = topics.find(t => t.id === Number(selectedTopicId));
      if (!selectedTopic) throw new Error("Topic not found");

      const platformsValue = platformGroup === 'x_threads' 
        ? 'twitter,threads' 
        : 'facebook,instagram,linkedin,gmb';

      const actionValue = platformGroup === 'x_threads' 
        ? 'post_twitter' 
        : 'post_general';

      const generatedData = [];

      for (let i = 0; i < contentCount; i++) {
        // Estructura de datos alineada con mysql/metricool_posts.sql + id_company
        const postEntry = {
          id_company: selectedTopic.id_company,
          action: actionValue,
          blog_id: 0, // Placeholder, will be populated by backend or user settings
          titulo: `Generado: ${selectedTopic.title} - Variante ${i + 1}`,
          resumen: `Variante del resumen de: ${selectedTopic.description || 'Sin descripción'}`,
          contenido: `Contenido extenso generado por IA basado en el topic ID ${selectedTopic.id}. Variante #${i + 1}.`,
          hashtags: selectedTopic.category ? `#${selectedTopic.category.replace(/[^a-zA-Z0-9]/g, '')} #AI` : '#AI #SocialMedia',
          categoria: selectedTopic.category || 'General',
          url_image: '', 
          promt_idea_image: `Prompt para generar imagen sobre: ${selectedTopic.title}`,
          fecha_registro: new Date().toISOString(),
          status: 'draft',
          approval_status: 'pending',
          platforms: platformsValue,
          source_file: 'automation_simple_post_ui',
          fotos: '[]',
        };
        generatedData.push(postEntry);
      }

      console.log("PAYLOAD A ENVIAR AL BACKEND (metricool_posts format):", generatedData);

      // Enviamos el lote al nuevo endpoint PHP CRUD
      const response = await fetchWithAuth('/automations/metricool_posts.php', { 
        method: 'POST', 
        body: JSON.stringify({ posts: generatedData }) 
      });

      // Luego forzamos al backend a procesarlos sincrónicamente con IA
      const workerResponse = await fetchWithAuth('/workers/gemini_generator.php');
      
      if (workerResponse && workerResponse.errors && workerResponse.errors.length > 0) {
        console.error("Worker IA Errors:", workerResponse.errors);
        setWorkerErrors(workerResponse.errors);
        setGenerating(false);
        return; // Detener flujo para que el usuario vea el error modal
      }

      setSuccess(true);
      
      // Auto-navigamos a la pestaña Content IA
      window.dispatchEvent(new Event('NAVIGATE_TO_CONTENT_IA'));
    } catch (err: any) {
      console.error(err);
      setWorkerErrors([err.message || "Error catastrófico de red al conectar con el servidor."]);
    } finally {
      if (!workerErrors.length) {
         setGenerating(false);
      }
    }
  };

  return (
    <>
      {generating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(124,58,237,0.5)]"></div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Invocando el poder de Gemini...</h2>
          <p className="text-slate-400 max-w-sm text-center">Por favor espera un momento. Tu IA está destilando creatividad en {contentCount} variantes totalmente únicas en inglés.</p>
        </div>
      )}

      {/* Error Modal */}
      {workerErrors.length > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <div className="bg-panel w-full max-w-2xl rounded-2xl border border-danger/50 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4 text-danger">
                <div className="p-3 bg-danger/10 rounded-full">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold">Error en Generación de IA</h2>
              </div>
              <p className="text-slate-300 mb-6 font-medium">Uno o varios procesos chocaron contra la base de datos o Gemini. Verifique los detalles:</p>
              
              <div className="bg-black/50 border border-white/5 rounded-lg p-4 max-h-[300px] overflow-y-auto mb-6 text-sm text-red-300 font-mono space-y-2">
                {workerErrors.map((err, i) => (
                  <div key={i} className="pb-2 border-b border-white/5 last:border-0 last:pb-0">
                     • {err}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setWorkerErrors([]);
                    // Podemos enviarlos a ver el contenido de los que sí hayan pasado, o que se queden
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium border border-white/10"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setWorkerErrors([]);
                    window.dispatchEvent(new Event('NAVIGATE_TO_CONTENT_IA'));
                  }}
                  className="px-6 py-3 bg-danger hover:bg-red-500 text-white rounded-lg transition-colors font-bold shadow-lg"
                >
                  Ver Posts Recuperados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`space-y-6 max-w-4xl ${(generating || workerErrors.length > 0) ? 'pointer-events-none opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
             <Sparkles className="w-6 h-6 text-primary" />
             Configurar Post Simple
          </h3>
          <p className="text-slate-400">Preselección de canales, topics y volúmenes de generación.</p>
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow hero effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center justify-center mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] mb-5 transform rotate-3">
             <Bot className="w-10 h-10 text-primary -rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">AI Post Engine</h2>
          <p className="text-slate-400 mt-2 max-w-md">De la idea a publicaciones en masa. Configura tus lineamientos y empieza la automatización.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
          
          {/* Platform Group */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">1. Grupo de Plataformas Destino</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${platformGroup === 'x_threads' ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="platformGroup"
                  value="x_threads"
                  checked={platformGroup === 'x_threads'}
                  onChange={() => setPlatformGroup('x_threads')}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col items-center text-center justify-center space-y-3 w-full py-2">
                    <div className="flex justify-center gap-3 text-slate-300">
                      <XIcon />
                    </div>
                    <span className={`block text-lg font-bold ${platformGroup === 'x_threads' ? 'text-primary' : 'text-slate-300'}`}>
                      X & Threads
                    </span>
                    <span className="flex items-center text-xs text-slate-500 max-w-[80%] mx-auto">
                      Ideal para posts cortos y rápidos.
                    </span>
                  </span>
                </span>
                {platformGroup === 'x_threads' && <div className="absolute -inset-px rounded-lg border-2 border-primary pointer-events-none" aria-hidden="true" />}
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${platformGroup === 'meta_linkedin_gmb' ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="platformGroup"
                  value="meta_linkedin_gmb"
                  checked={platformGroup === 'meta_linkedin_gmb'}
                  onChange={() => setPlatformGroup('meta_linkedin_gmb')}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col items-center text-center justify-center space-y-3 w-full py-2">
                    <div className="flex justify-center gap-3 text-slate-300">
                      <FacebookIcon />
                      <InstaIcon />
                      <LinkedInIcon />
                    </div>
                    <span className={`block text-lg font-bold ${platformGroup === 'meta_linkedin_gmb' ? 'text-primary' : 'text-slate-300'}`}>
                      Meta, LinkedIn & GMB
                    </span>
                    <span className="flex items-center text-xs text-slate-500 max-w-[80%] mx-auto">
                      Redes visuales para contenido estructurado.
                    </span>
                  </span>
                </span>
                {platformGroup === 'meta_linkedin_gmb' && <div className="absolute -inset-px rounded-lg border-2 border-primary pointer-events-none" aria-hidden="true" />}
              </label>
            </div>
          </div>

          {/* Topic Selection */}
          <div className="pt-8 border-t border-white/10">
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">2. Seleccionar Tema (Topic)</label>
            {loading ? (
              <div className="h-12 flex items-center text-slate-400 text-sm italic">Cargando temas disponibles...</div>
            ) : (
              <div>
                {/* Custom Button to trigger Topic Modal */}
                <button
                  type="button"
                  onClick={() => setIsTopicModalOpen(true)}
                  className="w-full text-left bg-[#1e293b] hover:bg-[#27354c] border border-white/10 hover:border-primary/50 transition-colors rounded-lg px-4 py-4 text-white shadow-inner flex justify-between items-center group"
                >
                  {selectedTopicId ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-primary group-hover:text-white transition-colors">{topics.find(t => t.id === Number(selectedTopicId))?.title}</span>
                      <span className="text-xs text-slate-400 mt-1">{topics.find(t => t.id === Number(selectedTopicId))?.category || 'General'}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Click para explorar y elegir un Topic de la base de datos...</span>
                  )}
                  <span className="bg-white/5 p-2 rounded-md group-hover:bg-primary/20 group-hover:text-primary transition-colors">Ver Librería</span>
                </button>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">3. Volumen de Contenidos a Crear</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                required
                min={1}
                max={20}
                value={contentCount}
                onChange={(e) => setContentCount(Number(e.target.value))}
                className="w-24 bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-center font-bold text-lg shadow-inner"
              />
              <span className="text-slate-400 text-sm">Entre 1 y 20 posts generados por la IA en este tiraje.</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-between">
            <div>
               {success && <span className="text-emerald-400 font-medium text-sm flex items-center gap-2">✅ Payload de automatización generado! (Ver consola)</span>}
            </div>
            <button
              type="submit"
              disabled={generating || !selectedTopicId}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2 text-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Generar Lote
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Topic Selection Modal */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-panel w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                   <Lightbulb className="w-6 h-6 text-amber-500" />
                   Selección Rápida de Topic
                </h2>
                <p className="text-slate-400 mt-1">Navega por tus ideas maestras y selecciona la base del lote.</p>
              </div>
              <button 
                onClick={() => setIsTopicModalOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <XIcon />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map(topic => (
                  <div 
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setIsTopicModalOpen(false);
                    }}
                    className={`glass-panel p-6 border-2 transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-1 ${selectedTopicId === topic.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'border-transparent hover:border-primary/50 hover:bg-white/5'}`}
                  >
                    <div className="mb-auto">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold px-2 py-1 bg-white/10 text-slate-300 rounded-md">
                          {topic.category || 'General'}
                        </span>
                        {selectedTopicId === topic.id && <span className="text-primary"><CheckCircle className="w-5 h-5" /></span>}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors">{topic.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-3">{topic.description || "Sin descripción adicional."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
