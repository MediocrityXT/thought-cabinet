import { useEffect, useState } from 'react';
import { Brain, CheckCircle2, Database, Download, RefreshCw } from 'lucide-react';

interface StatusBarProps {
  vaultName: string;
  vaultPath: string;
  health: number;
  refreshing: boolean;
  onRefresh: () => void;
  onAnalyze: () => Promise<void> | void;
}

export function StatusBar({
  vaultName,
  vaultPath,
  health,
  refreshing,
  onRefresh,
  onAnalyze,
}: StatusBarProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setProgress(8);
    const interval = window.setInterval(() => {
      setProgress((value) => Math.min(value + Math.random() * 18, 92));
    }, 220);
    try {
      await onAnalyze();
      setProgress(100);
    } finally {
      window.clearInterval(interval);
      window.setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(0);
      }, 500);
    }
  }

  return (
    <header className="fixed left-20 right-0 top-0 z-40 flex h-12 items-center justify-between border-b border-white/5 bg-deep px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4 text-cyan" />
          <span className="text-star-dust">Vault:</span>
          <span className="max-w-[20rem] truncate font-mono text-white">{vaultName}</span>
          <div className="ml-2 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-xs text-emerald">{vaultPath ? '已连接' : '未连接'}</span>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="ml-6 flex items-center gap-3">
            <span className="text-xs text-purple">AI 分析中...</span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-cyan-purple transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-mono text-xs text-star-dust">{Math.round(progress)}%</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-xs text-star-dust transition-all hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>扫描</span>
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 rounded-md bg-purple/10 px-3 py-1.5 text-xs text-purple transition-all hover:bg-purple/20 disabled:opacity-50"
          >
            <Brain className="h-3.5 w-3.5" />
            <span>分析</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-xs text-star-dust transition-all hover:bg-white/10 hover:text-white">
            <Download className="h-3.5 w-3.5" />
            <span>导出</span>
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald" />
            <span className="text-star-dust">系统健康:</span>
            <span className="font-mono text-emerald">{health}%</span>
          </div>
          <div className="font-mono text-xs text-star-dust">
            {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </header>
  );
}
