import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Refinery() {
  return (
    <div className="prism-page">
      <div className="prism-page-header">
        <h1>透镜折射</h1>
        <p>The Lens / Refinery</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        
        {/* Input: White Light */}
        <div className="prism-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>白光输入 (Raw Data)</h3>
          <textarea 
            placeholder="粘贴待处理信息..."
            style={{
              flex: 1, width: '100%', minHeight: '300px',
              background: 'transparent', border: 'none',
              color: 'var(--text-primary)', outline: 'none', resize: 'none',
              fontFamily: 'Inter', lineHeight: 1.6
            }}
          />
          <button className="prism-btn" style={{ marginTop: '24px', background: 'white', color: 'black', fontWeight: 'bold' }}>通过棱镜分解</button>
        </div>

        {/* The Prism Graphic */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* White light entering */}
            <path d="M 0 100 L 90 100" stroke="white" strokeWidth="4" opacity="0.8" />
            
            {/* Prism Triangle */}
            <polygon points="100,50 150,150 50,150" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            
            {/* Spectrum exiting */}
            <path d="M 125 100 L 200 60" stroke="var(--spectrum-red)" strokeWidth="2" />
            <path d="M 130 110 L 200 80" stroke="var(--spectrum-orange)" strokeWidth="2" />
            <path d="M 135 120 L 200 100" stroke="var(--spectrum-yellow)" strokeWidth="2" />
            <path d="M 135 130 L 200 120" stroke="var(--spectrum-green)" strokeWidth="2" />
            <path d="M 130 140 L 200 140" stroke="var(--spectrum-blue)" strokeWidth="2" />
            <path d="M 125 150 L 200 160" stroke="var(--spectrum-purple)" strokeWidth="2" />
          </svg>
        </div>

        {/* Output: Spectrum */}
        <div className="prism-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>光谱提炼 (Insights)</h3>
          
          <div className="spectrum-bg-red" style={{ padding: '12px', borderRadius: '4px', fontSize: '0.85rem' }}>
            [行动] 需要在今天之内完成此架构设计。
          </div>
          <div className="spectrum-bg-yellow" style={{ padding: '12px', borderRadius: '4px', fontSize: '0.85rem' }}>
            [知识] Prism 隐喻可以极大增强信息的维度感。
          </div>
          <div className="spectrum-bg-blue" style={{ padding: '12px', borderRadius: '4px', fontSize: '0.85rem' }}>
            [分析] 这种分解模式适合长文本的处理，不适合短笔记。
          </div>
        </div>

      </div>
    </div>
  );
}
