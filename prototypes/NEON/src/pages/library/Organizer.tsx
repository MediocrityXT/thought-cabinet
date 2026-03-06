import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="library-page">
      <div className="library-page-header">
        <h1>卡片盒</h1>
        <p>Zettelkasten / Organizer</p>
      </div>

      <div className="library-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button className="library-btn">整理新卡片</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {MOCK_INBOX.map((item, index) => (
            <div 
              key={item.id} 
              style={{
                background: 'white',
                border: '1px solid #d3d3d3',
                borderTop: '8px solid var(--library-wood-light)',
                padding: '16px',
                position: 'relative',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                fontFamily: 'Courier Prime, monospace',
                fontSize: '0.875rem',
                minHeight: '150px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '8px', marginBottom: '12px' }}>
                <span style={{ color: 'var(--library-accent)' }}>#Z-{item.id}</span>
                <span style={{ color: 'var(--library-text-muted)' }}>{item.time}</span>
              </div>
              <div style={{ lineHeight: 1.6 }}>
                {item.content}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
