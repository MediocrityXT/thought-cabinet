import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './LibraryApp.css';

export default function LibraryLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '目录 Dashboard', path: '/library' },
    { name: '阅览 Refinery', path: '/library/refinery' },
    { name: '卡片 Organizer', path: '/library/organizer' },
    { name: '批注 Evaluator', path: '/library/evaluator' },
    { name: '沙漏 Planner', path: '/library/planner' },
    { name: '图谱 Blueprint', path: '/library/blueprint' },
  ];

  return (
    <div className="library-theme">
      {/* Hidden Sidebar Area */}
      <div 
        className={`library-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="library-sidebar-trigger">
          <div style={{ width: '2px', height: '16px', background: 'var(--library-wood)' }}></div>
          <div style={{ width: '2px', height: '16px', background: 'var(--library-wood)', marginTop: '4px' }}></div>
        </div>
        
        <div className="library-sidebar-content">
          <div style={{ padding: '0 32px', marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'normal', color: 'var(--library-bg)', marginBottom: '8px' }}>馆</h2>
            <p style={{ fontSize: '0.75rem', color: 'rgba(244, 241, 234, 0.7)', letterSpacing: '0.2em' }}>ThoughtCabinet</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `library-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/library'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px' }}>
            <button onClick={() => navigate('/')} className="library-nav-item" style={{ width: 'calc(100% - 32px)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              ← 离开阅览室
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="library-main-content">
        <Outlet />
      </main>
    </div>
  );
}
