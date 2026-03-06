import React from 'react';

export default function Refinery() {
  return (
    <div className="zen-page zen-page-transition">
      <div className="zen-page-header">
        <h1>墨 · 精炼厂</h1>
        <p>The Refinery / Sumi-e</p>
      </div>

      <div className="zen-modules" style={{ display: 'block' }}>
        <div className="zen-module full" style={{ minHeight: '500px' }}>
          <div className="module-kanji">墨</div>
          <div className="module-name">Sumi-e</div>
          <div className="module-desc">墨绘 · 流动的思绪与知识萃取</div>
          
          <div className="sumie-canvas" style={{ height: '300px', marginBottom: '40px' }}>
            <div className="ink-wash"></div>
            <div className="ink-wash" style={{ width: '200px', height: '200px', top: '20%', left: '40%' }}></div>
            <div className="ink-wash" style={{ width: '150px', height: '150px', top: '50%', left: '70%' }}></div>
            <div className="brush-stroke" style={{ top: '30%', left: '20%' }}></div>
            <div className="brush-stroke" style={{ top: '60%', left: '40%', animationDelay: '-2s' }}></div>
            
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <input 
                type="text" 
                placeholder="在此滴入思绪 (输入网址或文本)..." 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: '1px solid var(--ink-mist)', 
                  color: 'var(--paper-raw)', 
                  fontFamily: 'inherit',
                  fontSize: '1.25rem',
                  padding: '12px 24px',
                  width: '60%',
                  textAlign: 'center',
                  outline: 'none',
                  letterSpacing: '0.1em'
                }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '0 40px' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 300, marginBottom: '24px', color: 'var(--ink-mist)' }}>原石</h3>
              <div style={{ lineHeight: 1.8, fontSize: '0.875rem', opacity: 0.7 }}>
                等待提炼的原始信息会如水墨般在此呈现其全貌...
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 300, marginBottom: '24px', color: 'var(--ink-mist)' }}>精粹</h3>
              <div style={{ lineHeight: 1.8, fontSize: '0.875rem', opacity: 0.7 }}>
                AI 将如研墨般为你萃取出核心洞察，去芜存菁...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
