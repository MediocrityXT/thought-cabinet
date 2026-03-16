import { Brain, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'cognitive' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

interface ProgressTimelineProps {
  events: TimelineEvent[];
}

const typeConfig = {
  cognitive: {
    icon: Brain,
    color: 'text-purple',
    bgColor: 'bg-purple/10',
    borderColor: 'border-purple/30',
    label: '认知解锁',
  },
  task: {
    icon: CheckCircle2,
    color: 'text-emerald',
    bgColor: 'bg-emerald/10',
    borderColor: 'border-emerald/30',
    label: '任务完成',
  },
  system: {
    icon: Zap,
    color: 'text-cyan',
    bgColor: 'bg-cyan/10',
    borderColor: 'border-cyan/30',
    label: '系统更新',
  },
};

export function ProgressTimeline({ events }: ProgressTimelineProps) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const config = typeConfig[event.type];
        const Icon = config.icon;
        const date = new Date(event.timestamp);
        const formatted = Number.isNaN(date.getTime())
          ? event.timestamp
          : date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        return (
          <div key={event.id} className="relative flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            {index < events.length - 1 ? <div className="absolute left-5 top-10 h-[calc(100%+16px)] w-px bg-white/10" /> : null}
            <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2', config.bgColor, config.borderColor)}>
              <Icon className={cn('h-4 w-4', config.color)} />
            </div>
            <div className="flex-1 pb-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs text-star-dust">{formatted}</span>
                <span className={cn('rounded-full border px-2 py-0.5 text-xs', config.bgColor, config.borderColor, config.color)}>
                  {config.label}
                </span>
              </div>
              <h4 className="mb-1 font-medium text-white">{event.title}</h4>
              <p className="text-sm text-star-dust">{event.description}</p>
              {event.score ? (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-star-dust">影响力得分:</span>
                  <span className={cn('text-sm font-medium', config.color)}>+{event.score}</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
