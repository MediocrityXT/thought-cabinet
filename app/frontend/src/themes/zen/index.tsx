import { useTheme } from '@/context/ThemeContext';

export default function ZenTheme() {
  const { setTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4efe4] px-6 text-[#1d2424]">
      <div className="max-w-2xl rounded-[32px] border border-[#d6cfbf] bg-[#faf7ef] p-10 shadow-[0_24px_80px_rgba(42,48,54,0.14)]">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#7d8572]">ZEN Placeholder</p>
        <h1 className="mb-4 text-5xl font-light tracking-[-0.05em]">Zone of Essential Notation</h1>
        <p className="text-base leading-7 text-[#52605f]">
          Theme switching now uses the shared backend config. ZEN remains a placeholder while NEON is being implemented as the primary production shell.
        </p>
        <button
          type="button"
          onClick={() => void setTheme('NEON')}
          className="mt-8 rounded-full border border-[#1d2424]/15 px-5 py-2 text-sm font-medium transition hover:border-[#1d2424]/40"
        >
          Activate NEON
        </button>
      </div>
    </div>
  );
}
