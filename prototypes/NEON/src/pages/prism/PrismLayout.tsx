import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './PrismApp.css';

export default function PrismLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: '全景 Dashboard', path: '/prism' },
    { name: '透镜 Refinery', path: '/prism/refinery' },
    { name: '折射 Organizer', path: '/prism/organizer' },
    { name: '光谱 Evaluator', path: '/prism/evaluator' },
    { name: '聚焦 Planner', path: '/prism/planner' },
    { name: '矩阵 Blueprint', path: '/prism/blueprint' },
  ];

  return (
    <div className="prism-theme">
      {/* Hidden Sidebar Area */}
      <div 
        className={`prism-sidebar ${isSidebarOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="prism-sidebar-trigger">
          {/* Subtle spectrum gradient line as trigger */}
        </div>
        
        <div className="prism-sidebar-content">
          <div className="prism-sidebar-header">
            <h2>PRISM</h2>
            <p>Intelligence Matrix</p>
          </div>
          
          <nav className="prism-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `prism-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/prism'}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px', marginTop: 'auto' }}>
            <button onClick={() => navigate('/')} className="prism-nav-item" style={{ width: '100%', justifyContent: 'center' }}>
              &lt; 返回主系统 &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="prism-main-content">
        <Outlet />
      </main>
    </div>
  );
}
