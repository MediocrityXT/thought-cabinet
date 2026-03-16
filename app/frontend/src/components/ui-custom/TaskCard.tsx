import { Clock, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  title: string;
  domain: string;
  timeEstimate: number;
  priority: 'high' | 'medium' | 'low';
  onClick?: () => void;
}

const priorityColors = {
  high: 'border-l-rose',
  medium: 'border-l-amber',
  low: 'border-l-cyan',
};

const priorityBadges = {
  high: 'tc-badge-rose',
  medium: 'tc-badge-amber',
  low: 'tc-badge-cyan',
};

export function TaskCard({ title, domain, timeEstimate, priority, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg border border-l-4 border-white/5 bg-elevated p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-surface',
        priorityColors[priority],
      )}
    >
      <h4 className="mb-3 line-clamp-2 font-medium text-white">{title}</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-star-dust">
            <Folder className="h-3.5 w-3.5" />
            <span>{domain}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-star-dust">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeEstimate}min</span>
          </div>
        </div>
        <div className={cn('tc-badge', priorityBadges[priority])}>{priority === 'high' ? '高优' : priority === 'medium' ? '中优' : '低优'}</div>
      </div>
    </div>
  );
}
