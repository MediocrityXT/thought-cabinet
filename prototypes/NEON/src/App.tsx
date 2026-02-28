import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { Dashboard } from '@/pages/Dashboard';
import { Refinery } from '@/pages/Refinery';
import { Organizer } from '@/pages/Organizer';
import { Evaluator } from '@/pages/Evaluator';
import { Blueprint } from '@/pages/Blueprint';
import { Planner } from '@/pages/Planner';
import { cn } from '@/lib/utils';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'refinery':
        return <Refinery />;
      case 'organizer':
        return <Organizer />;
      case 'evaluator':
        return <Evaluator />;
      case 'blueprint':
        return <Blueprint />;
      case 'planner':
        return <Planner />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-deep text-white">
      {/* Sidebar */}
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

      {/* Status Bar */}
      <StatusBar />

      {/* Main Content */}
      <main 
        className={cn(
          "fixed top-12 left-18 right-0 bottom-0 overflow-hidden",
          "transition-all duration-300"
        )}
      >
        <div className="h-full overflow-auto custom-scrollbar">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

export default App;
