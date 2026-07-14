import { useState } from 'react';
import { Zap, Image as ImageIcon, Layers, Video, MapPin, Users, Camera, Bot } from 'lucide-react';
import SimplePostConfig from './SimplePostConfig';

export default function AutomationsManager() {
  const [activeView, setActiveView] = useState<'hub' | 'simple-post'>('hub');

  if (activeView === 'simple-post') {
    return <SimplePostConfig onBack={() => setActiveView('hub')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
             <Zap className="w-6 h-6 text-amber-400" />
             Automations Hub
          </h3>
          <p className="text-slate-400">Manage and orchestrate your AI workflows and scheduled tasks.</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Socials</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div 
            onClick={() => setActiveView('simple-post')}
            className="glass-panel p-6 hover:border-primary/50 transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden ring-1 ring-primary/20"
          >
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-colors"></div>
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(124,58,237,0.3)] z-10">
                <Bot className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
             </div>
             <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-primary transition-colors z-10">Generador Simple</h4>
             <p className="text-sm text-slate-400 leading-relaxed font-medium z-10">
               Automatización con IA para redes sociales.
             </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 hover:border-accent/50 transition-all cursor-pointer group flex flex-col items-center text-center">
             <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-accent" />
             </div>
             <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">Carruseles</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Generar Carruseles para redes sociales
             </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col items-center text-center">
             <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-blue-500" />
             </div>
             <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-500 transition-colors">Video Content</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Video con contenido para Redes sociales
             </p>
          </div>

        </div>
      </div>

      {/* Section 2: Data & Scraping */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-white mb-4">Scraping</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 4 */}
          <div className="glass-panel p-6 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col items-center text-center">
             <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-emerald-500" />
             </div>
             <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-500 transition-colors">Google Maps</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Scraping Google Maps Places
             </p>
          </div>

          {/* Card 5 */}
          <div className="glass-panel p-6 hover:border-sky-500/50 transition-all cursor-pointer group flex flex-col items-center text-center">
             <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-sky-500" />
             </div>
             <h4 className="text-lg font-bold text-white mb-2 group-hover:text-sky-500 transition-colors">LinkedIn</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Scraping Linkedin Contacts
             </p>
          </div>

          {/* Card 6 */}
          <div className="glass-panel p-6 hover:border-pink-500/50 transition-all cursor-pointer group flex flex-col items-center text-center">
             <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-pink-500" />
             </div>
             <h4 className="text-lg font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">Instagram</h4>
             <p className="text-sm text-slate-400 leading-relaxed">
               Instagram Accounts Content
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}

