import { cn } from '@/lib/utils';
import { Brain, CheckCircle2, Zap } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'cognitive' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: Date;
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
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const config = typeConfig[event.type];
        const Icon = config.icon;
        
        return (
          <div 
            key={event.id}
            className={cn(
              "relative flex gap-4 animate-slide-up",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div className="absolute left-5 top-10 w-px h-[calc(100%+16px)] bg-white/10" />
            )}
            
            {/* Node */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2",
              config.bgColor,
              config.borderColor
            )}>
              <Icon className={cn("w-4 h-4", config.color)} />
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-star-dust">{formatTime(event.timestamp)}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full border", config.bgColor, config.borderColor, config.color)}>
                  {config.label}
                </span>
              </div>
              <h4 className="text-white font-medium mb-1">{event.title}</h4>
              <p className="text-sm text-star-dust">{event.description}</p>
              {event.score && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-star-dust">影响力得分:</span>
                  <span className={cn("text-sm font-medium", config.color)}>+{event.score}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
