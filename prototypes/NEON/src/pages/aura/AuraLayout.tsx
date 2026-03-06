import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AuraApp.css';

export default function AuraLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '👁️ 灵核 Dashboard', path: '/aura' },
    { name: '✨ 冥想 Refinery', path: '/aura/refinery' },
    { name: '🔮 调频 Organizer', path: '/aura/organizer' },
    { name: '⚖️ 共振 Evaluator', path: '/aura/evaluator' },
    { name: '⏳ 潮汐 Planner', path: '/aura/planner' },
    { name: '🌌 脉络 Blueprint', path: '/aura/blueprint' },
  ];

  return (
    <div className="aura-theme">
      {/* Hidden Sidebar Area */}
      <div 
        className={`aura-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="aura-sidebar-trigger">
          <div className="spark"></div><div className="spark"></div><div className="spark"></div>
        </div>
        
        <div className="aura-sidebar-content">
          <div style={{ padding: '0 32px', marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '2rem', fontWeight: 300, 
              background: 'linear-gradient(90deg, var(--aura-cyan), var(--aura-magenta))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>灵光</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--aura-text-dim)', letterSpacing: '0.1em' }}>Aura Space</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `aura-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/aura'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px' }}>
            <button onClick={() => navigate('/')} className="aura-nav-item" style={{ width: 'calc(100% - 16px)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              ← 脱离灵境 (Exit)
            </button>
          </div>
        </div>
      </div>

      <main className="aura-main-content">
        <Outlet />
      </main>
    </div>
  );
}
