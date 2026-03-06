import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AtelierApp.css';

export default function AtelierLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '工作台 Dashboard', path: '/atelier' },
    { name: '草稿本 Refinery', path: '/atelier/refinery' },
    { name: '灵感墙 Organizer', path: '/atelier/organizer' },
    { name: '鉴定室 Evaluator', path: '/atelier/evaluator' },
    { name: '沙漏 Planner', path: '/atelier/planner' },
    { name: '手稿图 Blueprint', path: '/atelier/blueprint' },
  ];

  return (
    <div className="atelier-theme">
      {/* Hidden Sidebar Area */}
      <div 
        className={`atelier-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="atelier-sidebar-trigger">
          <div className="stitch"></div><div className="stitch"></div><div className="stitch"></div>
        </div>
        
        <div className="atelier-sidebar-content">
          <div className="atelier-sidebar-header">
            <h2>ATELIER</h2>
            <p>Knowledge Workshop</p>
          </div>
          
          <nav className="atelier-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `atelier-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/atelier'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px', marginTop: 'auto' }}>
            <button onClick={() => navigate('/')} className="atelier-nav-item" style={{ width: '100%', textAlign: 'center', fontStyle: 'italic', color: 'var(--atelier-text-faint)' }}>
              ← 离开工坊
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="atelier-main-content">
        <Outlet />
      </main>
    </div>
  );
}
