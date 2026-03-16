import { useEffect, useRef, useState } from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  icon: React.ReactNode;
  color: 'cyan' | 'purple' | 'amber' | 'rose' | 'emerald';
  delay?: number;
}

const colorMap = {
  cyan: 'text-cyan border-cyan/30 bg-cyan/5',
  purple: 'text-purple border-purple/30 bg-purple/5',
  amber: 'text-amber border-amber/30 bg-amber/5',
  rose: 'text-rose border-rose/30 bg-rose/5',
  emerald: 'text-emerald border-emerald/30 bg-emerald/5',
};

const glowMap = {
  cyan: 'shadow-glow-cyan',
  purple: 'shadow-glow-purple',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  rose: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
  emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
};

export function StatCard({ label, value, suffix = '', trend, icon, color, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = window.setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        window.clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => window.clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative rounded-xl border bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg',
        colorMap[color],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn('pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100', glowMap[color])} />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-lg bg-current/10 p-2">{icon}</div>
          {trend !== undefined ? (
            <div className={cn('flex items-center gap-1 text-xs', trend > 0 ? 'text-emerald' : trend < 0 ? 'text-rose' : 'text-star-dust')}>
              {trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : trend < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
            </div>
          ) : null}
        </div>

        <div className="font-display text-4xl font-bold tracking-tight">{displayValue.toLocaleString()}{suffix}</div>
        <div className="mt-1 text-sm text-star-dust">{label}</div>
      </div>
    </div>
  );
}
