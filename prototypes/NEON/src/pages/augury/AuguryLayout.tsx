import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AuguryApp.css';

export default function AuguryLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '观星 Dashboard', path: '/augury' },
    { name: '启示 Refinery', path: '/augury/refinery' },
    { name: '牌阵 Organizer', path: '/augury/organizer' },
    { name: '审判 Evaluator', path: '/augury/evaluator' },
    { name: '祭坛 Planner', path: '/augury/planner' },
    { name: '生命树 Blueprint', path: '/augury/blueprint' },
  ];

  return (
    <div className="augury-theme">
      <div 
        className={`augury-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="augury-sidebar-trigger">
          <div className="star">✦</div><div className="star">✧</div><div className="star">✦</div>
        </div>
        
        <div className="augury-sidebar-content">
          <div style={{ padding: '0 32px', marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ 
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: '2.5rem', color: 'var(--augury-gold)',
              textShadow: '0 0 10px var(--augury-shadow-glow)'
            }}>AUGURY</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--augury-gold-dim)', letterSpacing: '0.2em' }}>Divine Guidance</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `augury-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/augury'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px' }}>
            <button onClick={() => navigate('/')} className="augury-nav-item" style={{ width: 'calc(100% - 32px)' }}>
              返回尘世 (Exit)
            </button>
          </div>
        </div>
      </div>

      <main className="augury-main-content">
        <Outlet />
      </main>
    </div>
  );
}
