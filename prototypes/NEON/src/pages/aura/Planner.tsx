import React, { useState } from 'react';

export default function Planner() {
  const [active, setActive] = useState(false);

  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>Planner</h1>
        <p>Your 30-minute focus capsule.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Flow State Control */}
        <div className="aura-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Animated rings for timer state */}
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: active ? '300px' : '200px', height: active ? '300px' : '200px',
            border: '2px solid rgba(139, 92, 246, 0.2)', borderRadius: '50%',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: active ? 'pulse 2s infinite alternate' : 'none'
          }}></div>
          
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: active ? '250px' : '150px', height: active ? '250px' : '150px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            borderRadius: '50%', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}></div>

          <div style={{ zIndex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', fontWeight: 300, marginBottom: '24px', color: 'var(--aura-text)' }}>
              {active ? '29:59' : '30:00'}
            </div>
            <button 
              className={`aura-btn ${active ? 'secondary' : ''}`} 
              onClick={() => setActive(!active)}
              style={{ width: '160px' }}
            >
              {active ? 'Pause' : 'Enter Flow'}
            </button>
          </div>
          
          <style>{`
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(1); border-color: rgba(139, 92, 246, 0.2); }
              100% { transform: translate(-50%, -50%) scale(1.05); border-color: rgba(236, 72, 153, 0.4); }
            }
          `}</style>
        </div>

        {/* Task Selection */}
        <div className="aura-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '24px' }}>Active Focus</h2>
          
          <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--aura-purple)' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--aura-purple)', fontWeight: 500 }}>CURRENT</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5 }}>
              Refactor AURA theme to Liquid Minimal style.
            </div>
          </div>
          
          <h3 style={{ fontSize: '0.9rem', color: 'var(--aura-text-muted)', marginBottom: '16px', marginTop: '32px' }}>Skill Progression (Next)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ padding: '16px', background: 'var(--aura-bg-base)', borderRadius: '12px', color: 'var(--aura-text-muted)', fontSize: '0.9rem' }}>
               Implement Glassmorphism Dashboard Layout
             </div>
             <div style={{ padding: '16px', background: 'var(--aura-bg-base)', borderRadius: '12px', color: 'var(--aura-text-muted)', fontSize: '0.9rem' }}>
               Fine-tune CSS variable inheritance
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
