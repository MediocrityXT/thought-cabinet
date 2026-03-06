import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './EpochApp.css';

export default function EpochLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '地层 / Dashboard', path: '/epoch' },
    { name: '冶炼 / Refinery', path: '/epoch/refinery' },
    { name: '发掘 / Organizer', path: '/epoch/organizer' },
    { name: '铭文 / Evaluator', path: '/epoch/evaluator' },
    { name: '考察 / Planner', path: '/epoch/planner' },
    { name: '遗址 / Blueprint', path: '/epoch/blueprint' },
  ];

  return (
    <div className="epoch-theme">
      {/* Hidden Sidebar Area (Hover to open) */}
      <div 
        className={`epoch-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="epoch-sidebar-trigger">
          <span className="epoch-sidebar-line"></span>
          <span className="epoch-sidebar-line"></span>
          <span className="epoch-sidebar-line"></span>
        </div>
        
        <div className="epoch-sidebar-content">
          <div className="epoch-sidebar-header">
            <h2>纪</h2>
            <p>ThoughtCabinet</p>
          </div>
          
          <nav className="epoch-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `epoch-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/epoch'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="epoch-sidebar-footer">
            <button onClick={() => navigate('/')} className="epoch-nav-item">
              ← 返回画廊
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="epoch-main-content">
        <Outlet />
      </main>
    </div>
  );
}
