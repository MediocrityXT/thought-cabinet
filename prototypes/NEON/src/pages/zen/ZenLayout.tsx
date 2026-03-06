import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './ZenApp.css';

export default function ZenLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '庭 / Dashboard', path: '/zen' },
    { name: '墨 / Refinery', path: '/zen/refinery' },
    { name: '理 / Organizer', path: '/zen/organizer' },
    { name: '判 / Evaluator', path: '/zen/evaluator' },
    { name: '今 / Planner', path: '/zen/planner' },
    { name: '円 / Blueprint', path: '/zen/blueprint' },
  ];

  return (
    <div className="zen-theme">
      {/* Hidden Sidebar Area (Hover to open) */}
      <div 
        className={`zen-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="zen-sidebar-trigger">
          <span className="zen-sidebar-line"></span>
          <span className="zen-sidebar-line"></span>
          <span className="zen-sidebar-line"></span>
        </div>
        
        <div className="zen-sidebar-content">
          <div className="zen-sidebar-header">
            <h2>禅</h2>
            <p>ThoughtCabinet</p>
          </div>
          
          <nav className="zen-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `zen-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/zen'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="zen-sidebar-footer">
            <button onClick={() => navigate('/')} className="zen-nav-item">
              ← 返回画廊
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="zen-main-content">
        <Outlet />
      </main>
    </div>
  );
}
