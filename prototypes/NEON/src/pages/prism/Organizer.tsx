import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="prism-page">
      <div className="prism-page-header">
        <h1>折射分类</h1>
        <p>Refraction / Organizer</p>
      </div>

      <div className="prism-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
          {['全部', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣'].map((color, i) => (
             <button key={i} className="prism-btn" style={{ 
               padding: '8px 16px', 
               background: i === 0 ? 'white' : 'transparent',
               color: i === 0 ? 'black' : 'white'
             }}>
               {color}
             </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {MOCK_INBOX.map((item, index) => {
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className={`prism-card spectrum-bg-${color}`} style={{ cursor: 'pointer', padding: '20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                   <div className={`spectrum-text-${color}`} style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                     [ SPECTRUM_{color.toUpperCase()} ]
                   </div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.time}</div>
                 </div>
                 <div style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                   {item.content}
                 </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
