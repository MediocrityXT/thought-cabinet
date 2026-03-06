import React from 'react';

export default function Refinery() {
  return (
    <div className="sky-page">
      <div className="sky-page-header">
        <h1>🌧️ 凝结 · 精炼厂</h1>
        <p>Condensation / Refinery</p>
      </div>

      <div className="sky-card" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="让思绪如同水汽般汇聚于此..." 
          style={{
            width: '80%', padding: '16px 24px', fontSize: '1.25rem',
            border: 'none', borderRadius: '30px',
            background: 'rgba(255,255,255,0.8)',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
            outline: 'none', color: 'var(--sky-text)'
          }}
        />
        <div style={{ marginTop: '24px' }}>
          <button className="sky-btn">凝结为雨 (Process)</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="sky-card float-anim" style={{ animationDelay: '0.2s' }}>
          <h3 style={{ color: 'var(--sky-primary)', marginBottom: '16px', fontWeight: 500 }}>积雨云 (Raw Text)</h3>
          <p style={{ opacity: 0.6, lineHeight: 1.8 }}>等待被提炼的原始信息，它们就像天空中未经整理的水汽，充满潜力但也混沌不清...</p>
        </div>
        <div className="sky-card float-anim" style={{ animationDelay: '0.6s' }}>
          <h3 style={{ color: 'var(--sky-primary)', marginBottom: '16px', fontWeight: 500 }}>甘霖 (Refined Note)</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.8 }}>通过 AI 提炼后的核心洞察，如同滋润万物的春雨，清晰、纯粹且具有极高的价值。</p>
        </div>
      </div>
    </div>
  );
}
