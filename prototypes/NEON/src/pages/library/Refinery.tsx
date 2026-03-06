import React from 'react';

export default function Refinery() {
  return (
    <div className="library-page">
      <div className="library-page-header">
        <h1>阅览室</h1>
        <p>Reading Room / Refinery</p>
      </div>

      <div className="library-card" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="在此放置待阅卷宗..." 
          style={{
            width: '80%', padding: '16px', fontSize: '1.25rem',
            border: 'none', borderBottom: '2px solid var(--library-wood)',
            background: 'transparent', color: 'var(--library-text)',
            outline: 'none', fontFamily: 'inherit', textAlign: 'center'
          }}
        />
        <div style={{ marginTop: '32px' }}>
          <button className="library-btn">开始研读 (Read)</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px', color: 'var(--library-text-muted)' }}>原始文献</h3>
          <div style={{ padding: '24px', background: 'rgba(0,0,0,0.02)', border: '1px solid #eee', minHeight: '200px', fontStyle: 'italic', color: 'var(--library-text-muted)' }}>
            未经批注的原始资料...
          </div>
        </div>
        <div>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px', color: 'var(--library-accent)' }}>提炼笔记</h3>
          <div style={{ padding: '24px', background: 'white', border: '1px solid #ddd', minHeight: '200px', boxShadow: 'inset 4px 0 0 rgba(139,0,0,0.2)' }}>
            通过严谨阅读后留下的高密度知识点。
          </div>
        </div>
      </div>
    </div>
  );
}
