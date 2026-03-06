import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NeonApp from './NeonApp';
import Home from './pages/Home';
import ZenApp from './pages/zen/ZenApp';
import EpochApp from './pages/epoch/EpochApp';
import GlitchApp from './pages/glitch/GlitchApp';
import SkyApp from './pages/sky/SkyApp';
import AuraApp from './pages/aura/AuraApp';
import AuguryApp from './pages/augury/AuguryApp';
import LibraryApp from './pages/library/LibraryApp';
import AtelierApp from './pages/atelier/AtelierApp';

// Placeholder component for unmigrated themes
const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
    <h1 className="text-4xl font-bold mb-4">{name} Theme</h1>
    <p className="text-slate-400 mb-8">This theme is currently being migrated to React + Tailwind CSS.</p>
    <Link to="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
      Return to Gallery
    </Link>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neon/*" element={<NeonApp />} />
        <Route path="/epoch/*" element={<EpochApp />} />
        <Route path="/zen/*" element={<ZenApp />} />
        <Route path="/glitch/*" element={<GlitchApp />} />
        <Route path="/sky/*" element={<SkyApp />} />
        <Route path="/aura/*" element={<AuraApp />} />
        <Route path="/augury/*" element={<AuguryApp />} />
        <Route path="/library/*" element={<LibraryApp />} />
        <Route path="/atelier/*" element={<AtelierApp />} />
        
        {/* Placeholders for other themes for now */}
        <Route path="/prism/*" element={<Placeholder name="PRISM" />} />
        <Route path="/forge/*" element={<Placeholder name="FORGE" />} />
        <Route path="/void/*" element={<Placeholder name="VOID" />} />
        <Route path="/home/*" element={<Placeholder name="HOME" />} />
        <Route path="/warroom/*" element={<Placeholder name="WARROOM" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
