import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './GlitchApp.css';

export default function GlitchLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '[STATUS] Dashboard', path: '/glitch' },
    { name: '[DECODE] Refinery', path: '/glitch/refinery' },
    { name: '[DEFRAG] Organizer', path: '/glitch/organizer' },
    { name: '[DIAGNOSE] Evaluator', path: '/glitch/evaluator' },
    { name: '[EXECUTE] Planner', path: '/glitch/planner' },
    { name: '[NETWORK] Blueprint', path: '/glitch/blueprint' },
  ];

  return (
    <div className="glitch-theme">
      <div 
        className={`glitch-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="glitch-sidebar-trigger"></div>
        
        <div className="glitch-sidebar-content">
          <div className="glitch-sidebar-header">
            <h2 className="glitch-text" data-text="GLITCH">GLITCH</h2>
            <p style={{ color: 'var(--channel-cyan)', fontSize: '0.75rem' }}>v2.0.7 [UNSTABLE]</p>
          </div>
          
          <nav className="glitch-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `glitch-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/glitch'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px' }}>
            <button onClick={() => navigate('/')} className="glitch-nav-item" style={{ width: '100%' }}>
              &lt; SYS_EXIT &gt;
            </button>
          </div>
        </div>
      </div>

      <main className="glitch-main-content">
        <Outlet />
      </main>
    </div>
  );
}
