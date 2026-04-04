import {
  Map,
  PackagePlus,
  Scale,
  Settings,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModuleId = 'hopper' | 'blueprint' | 'committee' | 'war-room';

interface SidebarProps {
  activeModule: ModuleId;
  onModuleChange: (module: ModuleId) => void;
  onOpenSettings: () => void;
}

const modules: { id: ModuleId; label: string; icon: typeof Map }[] = [
  { id: 'hopper', label: '投料口', icon: PackagePlus },
  { id: 'blueprint', label: '认知蓝图', icon: Map },
  { id: 'committee', label: '评估委员会', icon: Scale },
  { id: 'war-room', label: '战术指挥室', icon: Target },
];

export function Sidebar({ activeModule, onModuleChange, onOpenSettings }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-20 flex-col items-center border-r border-white/5 bg-panel py-6">
      <div className="mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-cyan-purple shadow-glow-cyan">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300',
                isActive ? 'bg-cyan/10 text-cyan' : 'text-star-dust hover:bg-white/5 hover:text-white',
              )}
              title={module.label}
            >
              {isActive ? <div className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-cyan" /> : null}
              <Icon className={cn('h-5 w-5 transition-transform duration-300', isActive ? 'scale-110' : '')} />
              <div className="invisible absolute left-full ml-3 whitespace-nowrap rounded-lg border border-white/10 bg-elevated px-3 py-1.5 text-sm text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {module.label}
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 border-b border-l border-white/10 bg-elevated" />
              </div>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onOpenSettings}
        className="flex h-12 w-12 items-center justify-center rounded-xl text-star-dust transition-all duration-300 hover:bg-white/5 hover:text-white"
        title="设置"
      >
        <Settings className="h-5 w-5" />
      </button>
    </aside>
  );
}
