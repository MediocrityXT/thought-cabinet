import { Link } from 'react-router-dom';

const prototypes = [
  { name: 'NEON', path: '/neon', category: 'Cyberpunk', icon: '🌃', isNew: false },
  { name: 'EPOCH', path: '/epoch', category: 'History', icon: '📜', isNew: true },
  { name: 'ZEN', path: '/zen', category: 'Zen', icon: '🍃', isNew: true },
  { name: 'PRISM', path: '/prism', category: 'Science', icon: '🔮', isNew: true },
  { name: 'FORGE', path: '/forge', category: 'Industrial', icon: '🔥', isNew: true },
  { name: 'GLITCH', path: '/glitch', category: 'Cyberpunk', icon: '⚡', isNew: true },
  { name: 'AUGURY', path: '/augury', category: 'Magic', icon: '✨', isNew: true },
  { name: 'SKY', path: '/sky', category: 'Nature', icon: '☁️', isNew: false },
  { name: 'VOID', path: '/void', category: 'Mystery', icon: '🌌', isNew: false },
  { name: 'HOME', path: '/home', category: 'Life', icon: '🏠', isNew: false },
  { name: 'LIBRARY', path: '/library', category: 'Knowledge', icon: '📚', isNew: false },
  { name: 'ATELIER', path: '/atelier', category: 'Art', icon: '🎨', isNew: false },
  { name: 'AURA', path: '/aura', category: 'Spiritual', icon: '✨', isNew: false },
  { name: 'WARROOM', path: '/warroom', category: 'Strategy', icon: '🎯', isNew: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 py-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            ThoughtCabinet
          </h1>
          <p className="text-xl text-slate-400 font-light">Design Prototypes Gallery</p>
          
          <div className="flex justify-center gap-10 mt-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400">21</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">Total Designs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400">5</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">New Themes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400">105</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest mt-1">Total Modules</div>
            </div>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 pl-4 border-l-4 border-indigo-500">
            🎨 New Designs (2025)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prototypes.filter(p => p.isNew).map((proto) => (
              <Link
                key={proto.name}
                to={proto.path}
                className="block bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-transparent border border-indigo-500/30 flex items-center justify-center text-3xl">
                    {proto.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{proto.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{proto.category}</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                    New
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 pl-4 border-l-4 border-indigo-500">
            📚 Classic Designs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prototypes.filter(p => !p.isNew).map((proto) => (
              <Link
                key={proto.name}
                to={proto.path}
                className="block bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-transparent border border-indigo-500/30 flex items-center justify-center text-3xl">
                    {proto.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{proto.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{proto.category}</p>
                  </div>
                  <span className="px-3 py-1 bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Classic
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="text-center py-10 text-sm text-slate-500">
          <p>ThoughtCabinet Design System · Consolidated Vite Prototype Environment</p>
        </footer>
      </div>
    </div>
  );
}
