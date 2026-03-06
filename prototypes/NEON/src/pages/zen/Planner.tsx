import React from 'react';

export default function Planner() {
  return (
    <div className="zen-page zen-page-transition">
      <div className="zen-page-header">
        <h1>今 · 指挥室</h1>
        <p>The Planner / Ichi-go ichi-e</p>
      </div>

      <div className="zen-modules" style={{ display: 'block' }}>
        <div className="zen-module full" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="ichi-container" style={{ padding: '0' }}>
            <div className="now-indicator" style={{ fontSize: '6rem', marginBottom: '40px' }}>今</div>
            
            <div className="focus-task" style={{ maxWidth: '600px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--ink-mist)', letterSpacing: '0.2em', marginBottom: '24px', textTransform: 'uppercase' }}>
                Ichi-go ichi-e · 一期一会
              </div>
              
              <h2 style={{ fontSize: '2rem', fontWeight: 300, lineHeight: 1.6, marginBottom: '40px', fontFamily: 'Noto Serif JP, serif' }}>
                在此刻，放下所有执念。<br/>
                如同茶道中的每一杯茶，都是独一无二的相遇。
              </h2>
              
              <div style={{ background: 'var(--ink-void)', padding: '32px', borderRadius: '8px', border: '1px solid var(--ink-light)', marginBottom: '40px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '16px' }}>当前唯一要务</div>
                <div style={{ fontSize: '1.25rem' }}>实现 ZEN 主题的 6 个完整页面体系</div>
              </div>

              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                <button className="zen-btn" style={{ padding: '16px 48px', fontSize: '1rem', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }}>
                  进入心流 (25:00)
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
