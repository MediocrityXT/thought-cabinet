import { Database, RefreshCw, Brain, Download, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StatusBar() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsAnalyzing(false), 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 300);
  };

  return (
    <header className="fixed top-0 left-18 right-0 h-12 bg-deep border-b border-white/5 flex items-center justify-between px-6 z-40">
      {/* Left: Vault Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Database className="w-4 h-4 text-cyan" />
          <span className="text-star-dust">Vault:</span>
          <span className="text-white font-mono">~/thoughts/main</span>
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-emerald text-xs">已连接</span>
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="flex items-center gap-3 ml-6">
            <span className="text-xs text-purple">AI 分析中...</span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-cyan-purple rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-xs text-star-dust font-mono">{Math.min(Math.round(progress), 100)}%</span>
          </div>
        )}
      </div>

      {/* Right: Actions & Time */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-star-dust hover:text-white transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>扫描</span>
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple/10 hover:bg-purple/20 text-xs text-purple transition-all disabled:opacity-50"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>分析</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-star-dust hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>导出</span>
          </button>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Time & Health */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald" />
            <span className="text-star-dust">系统健康:</span>
            <span className="text-emerald font-mono">98%</span>
          </div>
          <div className="text-xs text-star-dust font-mono">
            {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </header>
  );
}
