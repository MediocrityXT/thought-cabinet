import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="sky-page">
      <div className="sky-page-header">
        <h1>🌬️ 气流 · 整理器</h1>
        <p>Wind Currents / Organizer</p>
      </div>

      <div className="sky-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px', zIndex: 10 }}>
          <button className="sky-btn">吹散全部</button>
          <button className="sky-btn">按风向聚拢</button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          {MOCK_INBOX.map((item, i) => {
            const positions = [
              { top: '10%', left: '20%' },
              { top: '40%', left: '60%' },
              { top: '70%', left: '30%' },
            ];
            const pos = positions[i % positions.length];
            return (
              <div 
                key={item.id} 
                className="float-anim"
                style={{ 
                  position: 'absolute', ...pos, 
                  background: 'rgba(255,255,255,0.9)', 
                  padding: '16px 24px', borderRadius: '30px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  animationDelay: `${i * 1.5}s`,
                  cursor: 'move', maxWidth: '250px'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--sky-primary)', marginBottom: '4px' }}>{item.time}</div>
                <div style={{ fontSize: '0.875rem' }}>{item.content}</div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
