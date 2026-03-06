import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AuraApp.css';

export default function AuraLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/aura', icon: '◒' },
    { name: 'Refinery', path: '/aura/refinery', icon: '○' },
    { name: 'Organizer', path: '/aura/organizer', icon: '◑' },
    { name: 'Evaluator', path: '/aura/evaluator', icon: '●' },
    { name: 'Planner', path: '/aura/planner', icon: '◔' },
    { name: 'Blueprint', path: '/aura/blueprint', icon: '◎' },
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
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        </div>
        
        <div className="aura-sidebar-content">
          <div style={{ padding: '0 32px', marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--aura-purple) 0%, var(--aura-pink) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>AURA</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--aura-text-muted)', marginTop: '4px' }}>ThoughtCabinet</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({isActive}) => `aura-nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/aura'}
              >
                <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div style={{ padding: '0 16px' }}>
            <button onClick={() => navigate('/')} className="aura-nav-item" style={{ width: 'calc(100% - 24px)', background: 'transparent', border: 'none', cursor: 'pointer', justifyContent: 'center' }}>
              ← Gallery
            </button>
          </div>
        </div>
      </div>

      <main className="aura-main-content">
        <Outlet />
      </main>
      
      {/* Background decoration elements that move based on scroll/mouse might go here */}
      <div className="aura-blob-3"></div>
    </div>
  );
}
