import { Link } from 'react-router-dom';

const prototypes = [
  { name: 'NEON', path: '/neon', category: 'Cyberpunk', icon: '🌃', isCompleted: true },
  { name: 'ZEN', path: '/zen', category: 'Zen', icon: '🍃', isCompleted: true },
  { name: 'EPOCH', path: '/epoch', category: 'History', icon: '📜', isCompleted: true },
  { name: 'GLITCH', path: '/glitch', category: 'Cyberpunk', icon: '⚡', isCompleted: true },
  { name: 'SKY', path: '/sky', category: 'Nature', icon: '☁️', isCompleted: true },
  { name: 'AURA', path: '/aura', category: 'Liquid', icon: '✨', isCompleted: true },
  { name: 'AUGURY', path: '/augury', category: 'Magic', icon: '🔮', isCompleted: true },
  { name: 'LIBRARY', path: '/library', category: 'Academic', icon: '📚', isCompleted: true },
  { name: 'ATELIER', path: '/atelier', category: 'Art', icon: '🎨', isCompleted: true },
  
  { name: 'PRISM', path: '/prism', category: 'Science', icon: '🌈', isCompleted: true },
  { name: 'FORGE', path: '/forge', category: 'Industrial', icon: '🔥', isCompleted: false },
  { name: 'VOID', path: '/void', category: 'Mystery', icon: '🌌', isCompleted: false },
  { name: 'HOME', path: '/home', category: 'Life', icon: '🏠', isCompleted: false },
  { name: 'WARROOM', path: '/warroom', category: 'Strategy', icon: '🎯', isCompleted: false },
];

export default function Home() {
  const completed = prototypes.filter(p => p.isCompleted);
  const pending = prototypes.filter(p => !p.isCompleted);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 py-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/20 to-transparent border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,119,198,0.3),transparent)] pointer-events-none"></div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-white/60 bg-clip-text text-transparent mb-4 tracking-tight">
            ThoughtCabinet
          </h1>
          <p className="text-lg text-slate-400 font-light tracking-widest uppercase">Design Systems Gallery</p>
          
          <div className="flex justify-center gap-12 mt-10">
            <div className="text-center">
              <div className="text-4xl font-light text-indigo-300">{prototypes.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-2">Total Concepts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-emerald-400">{completed.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-2">Full Modules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-amber-400">{pending.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-2">In Pipeline</div>
            </div>
          </div>
        </header>

        {/* Section 1: Completed Themes */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              Deployed
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {completed.map((proto) => (
              <Link
                key={proto.name}
                to={proto.path}
                className="group relative block bg-white/[0.02] border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20">
                    {proto.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-medium tracking-tight text-white group-hover:text-emerald-300 transition-colors">{proto.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Status: Fully Operational</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Pending Themes */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 bg-white/5 px-3 py-1 rounded-full">
              In Development
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pending.map((proto) => (
              <Link
                key={proto.name}
                to={proto.path}
                className="group block bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/5 grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">{proto.icon}</div>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{proto.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-32 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All systems nominal · Cluster 60005
          </div>
        </footer>
      </div>
    </div>
  );
}
