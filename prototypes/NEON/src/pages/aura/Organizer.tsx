import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>🔮 调频 · 整理器</h1>
        <p>Frequencies / Organizer</p>
      </div>

      <div className="aura-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <p style={{ color: 'var(--aura-text-dim)', marginBottom: '40px', letterSpacing: '0.1em' }}>倾听碎片的频率，将它们引导至正确的能量轨道。</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '40px', flex: 1 }}>
          
          {/* Left: Chaos Field (Inbox) */}
          <div style={{ flex: 1, position: 'relative', border: '1px dashed rgba(138,43,226,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ position: 'absolute', top: '-30px', color: 'var(--aura-text-dim)' }}>混沌共振 (Unsorted)</div>
             {MOCK_INBOX.map((item, i) => (
                <div key={item.id} className="glowing-orb" style={{
                  position: 'absolute',
                  top: `${20 + i * 20}%`, left: `${20 + i * 15}%`,
                  width: '60px', height: '60px',
                  background: 'radial-gradient(circle, var(--aura-purple) 0%, transparent 80%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', textAlign: 'center', cursor: 'grab',
                  animationDelay: `${i * 0.5}s`
                }}>
                  {item.id}
                </div>
             ))}
          </div>

          {/* Right: Harmonized Tracks */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
            <div style={{ padding: '24px', border: '1px solid var(--aura-cyan)', borderRadius: '16px', background: 'rgba(0,240,255,0.05)', textAlign: 'center' }}>
              <div style={{ color: 'var(--aura-cyan)', marginBottom: '8px' }}>高频启示 (Idea)</div>
            </div>
            <div style={{ padding: '24px', border: '1px solid var(--aura-magenta)', borderRadius: '16px', background: 'rgba(224,36,195,0.05)', textAlign: 'center' }}>
              <div style={{ color: 'var(--aura-magenta)', marginBottom: '8px' }}>显化使命 (Task)</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
