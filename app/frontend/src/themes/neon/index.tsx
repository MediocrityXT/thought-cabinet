import { Database, Layers3, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function NeonTheme() {
  const { setTheme, error } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="tc-grid-overlay absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,229,255,0.18),transparent_30%),radial-gradient(circle_at_70%_10%,rgba(179,107,255,0.16),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-100">
          <Sparkles className="h-4 w-4" />
          NEON Runtime
        </div>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Frontend core is wired. Next step is binding every NEON module to live data.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
          Theme switching, API transport, proxying, shared types, and loading states are now in place.
          The next commit will replace this staging shell with the full command-center interface.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Theme config', value: 'Synced via /api/config/theme', icon: Layers3 },
            { label: 'Data channel', value: 'Axios client + typed contracts', icon: Database },
            { label: 'Fallback state', value: error ?? 'Healthy', icon: Sparkles },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="tc-panel rounded-[24px] p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5">
                <Icon className="h-5 w-5 text-cyan-200" />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void setTheme('ZEN')}
            className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-5 py-2 text-sm font-medium text-fuchsia-100 transition hover:bg-fuchsia-300/20"
          >
            切到 ZEN
          </button>
          <button
            type="button"
            onClick={() => void setTheme('NEON')}
            className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
          >
            保持 NEON
          </button>
        </div>
      </div>
    </div>
  );
}
