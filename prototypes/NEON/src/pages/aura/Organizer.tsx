import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>Organizer</h1>
        <p>Defragment your mind space.</p>
      </div>

      <div className="aura-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500 }}>Unsorted Fragments</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="aura-btn secondary">Filter</button>
            <button className="aura-btn">Auto-Sort AI</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {MOCK_INBOX.map((item, i) => (
            <div key={item.id} style={{ 
              background: 'white', padding: '24px', borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              cursor: 'grab', transition: 'all 0.3s',
              position: 'relative', overflow: 'hidden'
            }} className="hover:-translate-y-1 hover:shadow-lg">
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: i % 2 === 0 ? 'var(--aura-purple)' : 'var(--aura-blue)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--aura-text-muted)', textTransform: 'uppercase' }}>{item.type}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--aura-text-muted)' }}>{item.time}</span>
              </div>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{item.content}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
