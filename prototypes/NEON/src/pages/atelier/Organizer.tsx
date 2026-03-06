import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="atelier-page">
      <div className="atelier-page-header">
        <h1>灵感墙与软木板</h1>
        <p className="ink-text">Corkboard / Organizer</p>
      </div>

      <div className="atelier-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', background: '#e5e0d8', border: '12px solid #8B7355', borderRadius: '4px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'Libre Franklin', fontWeight: 600 }}>未整理的碎片</h2>
          <button className="atelier-btn-secondary" style={{ background: 'rgba(255,255,255,0.5)' }}>自动分类</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '20px' }}>
          {MOCK_INBOX.map((item, i) => {
            const colors = ['#FEF3C7', '#D1FAE5', '#DBEAFE', '#FCE7F3'];
            const bg = colors[i % colors.length];
            const rotation = (Math.random() * 4 - 2).toFixed(1);
            
            return (
              <div key={item.id} className="sticky-note" style={{ 
                background: bg, 
                width: '220px', 
                transform: `rotate(${rotation}deg)`,
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 2px 2px 2px rgba(0,0,0,0.1)' }}></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--atelier-text-muted)', marginBottom: '8px', fontFamily: 'Libre Franklin, sans-serif' }}>{item.time}</div>
                <div style={{ lineHeight: 1.4 }}>{item.content}</div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
