import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="forge-page">
      <div className="forge-page-header">
        <h1>淬火池</h1>
        <p>Quenching Pool / Organizer</p>
      </div>

      <div className="forge-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <p style={{ color: 'var(--text-ash)', marginBottom: '32px' }}>刚出炉的想法需要在这里冷却定型，归入武器库。</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {MOCK_INBOX.map((item, index) => (
             <div key={item.id} style={{ 
               background: 'var(--forge-charcoal)',
               border: '2px solid var(--heat-quenched)',
               padding: '20px',
               position: 'relative'
             }}>
               <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 8px', background: 'var(--heat-quenched)', color: '#000', fontSize: '0.75rem', fontFamily: 'Share Tech Mono', fontWeight: 'bold' }}>
                 COOLING
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-ash)', marginBottom: '12px', fontFamily: 'Share Tech Mono' }}>{item.time}</div>
               <div style={{ color: 'var(--text-ember)', lineHeight: 1.6 }}>{item.content}</div>
               
               <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                 <button className="forge-btn" style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}>打磨标签</button>
                 <button className="forge-btn" style={{ flex: 1, padding: '8px', fontSize: '0.9rem', borderColor: 'var(--heat-quenched)', color: 'var(--heat-quenched)' }}>入库归档</button>
               </div>
             </div>
          ))}
        </div>

      </div>
    </div>
  );
}
