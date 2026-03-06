import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './SkyApp.css';

export default function SkyLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '☁️ 总览 Dashboard', path: '/sky' },
    { name: '🌧️ 凝结 Refinery', path: '/sky/refinery' },
    { name: '🌬️ 气流 Organizer', path: '/sky/organizer' },
    { name: '🌤️ 气象 Evaluator', path: '/sky/evaluator' },
    { name: '☀️ 日轨 Planner', path: '/sky/planner' },
    { name: '✨ 星图 Blueprint', path: '/sky/blueprint' },
  ];

  return (
    <div className="sky-theme">
      {/* Hidden Sidebar Area */}
      <div 
        className={`sky-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="sky-sidebar-trigger">
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        </div>
        
        <div className="sky-sidebar-content">
          <div style={{ padding: '0 32px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--sky-primary)' }}>空</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--sky-text-muted)' }}>ThoughtCabinet</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `sky-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/sky'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px' }}>
            <button onClick={() => navigate('/')} className="sky-nav-item" style={{ width: 'calc(100% - 32px)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              ← 返回画廊
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="sky-main-content">
        <Outlet />
      </main>
    </div>
  );
}
