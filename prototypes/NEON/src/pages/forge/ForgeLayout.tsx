import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './ForgeApp.css';

export default function ForgeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '工作台 Dashboard', path: '/forge', icon: '⚒️' },
    { name: '熔炉 Refinery', path: '/forge/refinery', icon: '🔥' },
    { name: '淬火池 Organizer', path: '/forge/organizer', icon: '💧' },
    { name: '铁砧 Evaluator', path: '/forge/evaluator', icon: '⚡' },
    { name: '调度 Planner', path: '/forge/planner', icon: '📋' },
    { name: '成品架 Blueprint', path: '/forge/blueprint', icon: '📦' },
  ];

  return (
    <div className="forge-theme">
      {/* Hidden Sidebar Area */}
      <div 
        className={`forge-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="forge-sidebar-trigger">
          <div className="rivet"></div><div className="rivet"></div><div className="rivet"></div>
        </div>
        
        <div className="forge-sidebar-content">
          <div className="forge-sidebar-header">
            <h2>FORGE</h2>
            <p style={{ fontFamily: 'Share Tech Mono', color: 'var(--forge-rust)', fontSize: '0.85rem' }}>Operations Room</p>
          </div>
          
          <nav className="forge-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `forge-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/forge'}
              >
                <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px', marginTop: 'auto' }}>
            <button onClick={() => navigate('/')} className="forge-nav-item" style={{ width: '100%', justifyContent: 'center' }}>
              &lt; 离开工坊 &gt;
            </button>
          </div>
        </div>
      </div>

      <main className="forge-main-content">
        <Outlet />
      </main>
    </div>
  );
}
