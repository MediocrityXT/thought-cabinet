import React from 'react';

export default function Refinery() {
  return (
    <div className="atelier-page">
      <div className="atelier-page-header">
        <h1>草稿本与打字机</h1>
        <p className="ink-text">Refinery / The Typewriter</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        
        {/* Input Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="atelier-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ background: 'var(--atelier-bg-input)', padding: '12px 24px', borderBottom: '1px solid var(--atelier-border)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--atelier-text-muted)' }}>
              &gt; INSERT RAW TEXT BELOW
            </div>
            <textarea 
              placeholder="在此起草你的粗糙想法..."
              style={{
                width: '100%', height: '250px', border: 'none', background: 'transparent',
                padding: '24px', fontSize: '1.1rem', color: 'var(--atelier-text-body)',
                resize: 'none', outline: 'none', fontFamily: 'Source Serif 4, serif',
                lineHeight: 1.8
              }}
            />
            <div style={{ padding: '16px 24px', borderTop: '1px dashed var(--atelier-border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="atelier-btn-primary">精炼 (Refine)</button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="atelier-card" style={{ display: 'flex', flexDirection: 'column', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'Libre Franklin, sans-serif', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid #FCD34D', paddingBottom: '12px', color: 'var(--atelier-accent-main)' }}>
            精炼手稿
          </h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Source Serif 4, serif', fontSize: '1.05rem', lineHeight: 1.8 }}>
            <p>
              知识的沉淀需要时间的打磨。
            </p>
            <p>
              在这里，我们用<span style={{ color: 'var(--atelier-red)', fontWeight: 'bold' }}>打字机的严谨</span>去结构化信息，用<span className="ink-text" style={{ fontSize: '1.2rem' }}>手写的温度</span>去保留思考的痕迹。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
