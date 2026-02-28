import { 
  LayoutDashboard, 
  FlaskConical, 
  FolderTree, 
  Scale, 
  Map, 
  Target,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'dashboard', label: '指挥舱', icon: LayoutDashboard, color: 'cyan' },
  { id: 'refinery', label: '精炼厂', icon: FlaskConical, color: 'purple' },
  { id: 'organizer', label: '整理器', icon: FolderTree, color: 'cyan' },
  { id: 'evaluator', label: '评估局', icon: Scale, color: 'amber' },
  { id: 'blueprint', label: '认知蓝图', icon: Map, color: 'purple' },
  { id: 'planner', label: '指挥室', icon: Target, color: 'emerald' },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-18 bg-panel border-r border-white/5 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-cyan-purple flex items-center justify-center glow-cyan">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group",
                isActive 
                  ? "bg-cyan/10 text-cyan" 
                  : "text-star-dust hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan rounded-r-full" />
              )}
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-elevated border border-white/10 rounded-lg text-sm text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {module.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-elevated border-l border-b border-white/10 rotate-45" />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <button className="w-12 h-12 rounded-xl flex items-center justify-center text-star-dust hover:text-white hover:bg-white/5 transition-all duration-300">
        <Settings className="w-5 h-5" />
      </button>
    </aside>
  );
}
