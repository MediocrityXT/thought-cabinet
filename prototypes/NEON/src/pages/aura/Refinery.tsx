import React from 'react';

export default function Refinery() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>✨ 冥想 · 精炼厂</h1>
        <p>Meditation / Refinery</p>
      </div>

      <div className="aura-card" style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
        <div className="glowing-orb" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '100px', background: 'radial-gradient(ellipse, rgba(0, 240, 255, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
        <input 
          type="text" 
          placeholder="在此注入需要冥想的信息..." 
          style={{
            width: '80%', padding: '16px 24px', fontSize: '1.25rem',
            border: '1px solid rgba(138,43,226,0.5)', borderRadius: '30px',
            background: 'rgba(10,5,16,0.6)', color: 'var(--aura-text)',
            outline: 'none', position: 'relative', zIndex: 1,
            boxShadow: '0 0 20px rgba(138,43,226,0.2)'
          }}
        />
        <div style={{ marginTop: '32px', position: 'relative', zIndex: 1 }}>
          <button className="aura-btn">开启灵视 (Channel)</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="aura-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--aura-purple)' }}></div>
          <h3 style={{ color: 'var(--aura-text-dim)', marginBottom: '16px', letterSpacing: '0.1em' }}>[ 凡人视界 / Raw Data ]</h3>
          <p style={{ opacity: 0.6, lineHeight: 1.8 }}>表面复杂的文字、链接和碎片化的记录。充满噪音与无序的杂念。</p>
        </div>
        <div className="aura-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--aura-cyan)', boxShadow: '0 0 10px var(--aura-cyan)' }}></div>
          <h3 style={{ color: 'var(--aura-cyan)', marginBottom: '16px', letterSpacing: '0.1em' }}>[ 灵光启示 / Insight ]</h3>
          <p style={{ opacity: 0.9, lineHeight: 1.8 }}>透过表象看到的本质规律。直指核心的灵感与行动指南。</p>
        </div>
      </div>
    </div>
  );
}
