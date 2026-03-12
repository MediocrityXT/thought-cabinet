import { Suspense, lazy } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const NeonTheme = lazy(() => import('./themes/neon'));
const ZenTheme = lazy(() => import('./themes/zen'));

function BootScreen({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#12233e_0%,#06070a_55%,#030406_100%)] px-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 text-left shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200">
          ThoughtCabinet Core
        </div>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-white">Booting cognitive shell</h1>
        <p className="text-sm leading-6 text-slate-300">{label}</p>
      </div>
    </div>
  );
}

function UnsupportedTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06070a] px-6">
      <div className="max-w-xl rounded-[32px] border border-white/10 bg-slate-950/80 p-10 shadow-[0_24px_120px_rgba(0,0,0,0.55)]">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-fuchsia-300">Theme Fallback</p>
        <h1 className="mb-3 text-3xl font-semibold text-white">{theme} 尚未在新核心中实现</h1>
        <p className="mb-8 text-sm leading-6 text-slate-300">
          前端底座已经支持主题配置和 API 联调。当前默认切回 NEON，后续可以在同一套数据层上继续扩展其它视觉主题。
        </p>
        <button
          type="button"
          onClick={() => void setTheme('NEON')}
          className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
        >
          切回 NEON
        </button>
      </div>
    </div>
  );
}

function ThemeRouter() {
  const { theme, loading } = useTheme();

  if (loading) {
    return <BootScreen label="Synchronizing theme config and preparing module registry." />;
  }

  return (
    <Suspense fallback={<BootScreen label="Loading theme bundle." />}>
      {theme === 'NEON' && <NeonTheme />}
      {theme === 'ZEN' && <ZenTheme />}
      {!['NEON', 'ZEN'].includes(theme) && <UnsupportedTheme />}
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeRouter />
    </ThemeProvider>
  );
}
