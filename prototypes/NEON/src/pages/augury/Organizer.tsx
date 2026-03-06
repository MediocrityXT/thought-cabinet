import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="augury-page">
      <div className="augury-page-header">
        <h1>牌阵 · 整理器</h1>
        <p>Tarot Spread / Organizer</p>
      </div>

      <div className="augury-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: 'var(--augury-gold-dim)', fontStyle: 'italic', marginBottom: '24px' }}>"命运的碎片已洗牌，翻开它们，找寻内在的联系。"</p>
          <button className="augury-btn">洗牌 (Shuffle)</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', perspective: '1000px' }}>
          {MOCK_INBOX.map((item, index) => (
            <div 
              key={item.id} 
              style={{
                width: '180px', height: '280px',
                background: 'linear-gradient(135deg, var(--augury-night), var(--augury-void))',
                border: '2px solid var(--augury-gold-dim)',
                borderRadius: '8px',
                padding: '16px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.5s',
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 20px rgba(0,0,0,0.8)'
              }}
              className="tarot-card hover:translate-y-[-10px] hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)]"
            >
              {/* Card Back (simulated) - we'll just show the front for the mock */}
              <div style={{
                position: 'absolute', inset: '4px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <div style={{ fontSize: '2rem', color: 'var(--augury-gold-dim)', margin: '16px 0' }}>✧</div>
                <div style={{ 
                  flex: 1, width: '100%', padding: '0 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', fontSize: '0.875rem', color: 'var(--augury-starlight)',
                  overflow: 'hidden'
                }}>
                  {item.content}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--augury-gold-dim)', marginBottom: '16px', fontFamily: 'Courier Prime, monospace' }}>
                  NO. {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
          <div style={{ width: '120px', height: '160px', border: '2px dashed rgba(212, 175, 55, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--augury-gold-dim)' }}>过去 / 理念</div>
          <div style={{ width: '120px', height: '160px', border: '2px dashed rgba(212, 175, 55, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--augury-gold-dim)' }}>现在 / 行动</div>
          <div style={{ width: '120px', height: '160px', border: '2px dashed rgba(212, 175, 55, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--augury-gold-dim)' }}>未来 / 结果</div>
        </div>

      </div>
    </div>
  );
}
