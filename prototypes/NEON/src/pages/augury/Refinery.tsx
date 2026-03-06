import React from 'react';

export default function Refinery() {
  return (
    <div className="augury-page">
      <div className="augury-page-header">
        <h1>启示 · 冥想盆</h1>
        <p>Scrying Pool / Refinery</p>
      </div>

      <div className="augury-card" style={{ marginBottom: '40px', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse, var(--augury-mystic-blue) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(20px)', animation: 'pulse-aura 4s infinite alternate' }}></div>
          
          <input 
            type="text" 
            placeholder="将世俗的喧嚣投入圣泉..." 
            style={{
              width: '100%',
              padding: '24px',
              background: 'rgba(10, 5, 16, 0.8)',
              border: '1px solid var(--augury-mystic-blue)',
              color: 'var(--augury-starlight)',
              fontSize: '1.25rem',
              fontFamily: 'Cormorant Garamond, serif',
              textAlign: 'center',
              boxShadow: 'inset 0 0 20px rgba(74, 144, 226, 0.2), 0 0 15px rgba(74, 144, 226, 0.1)',
              outline: 'none',
              position: 'relative',
              zIndex: 1,
              borderRadius: '8px'
            }}
          />
        </div>
        
        <button className="augury-btn" style={{ marginTop: '40px' }}>唤醒神谕 (Reveal Truth)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="augury-card" style={{ borderTop: '2px solid var(--augury-gold-dim)' }}>
          <h3 style={{ fontFamily: 'Cinzel Decorative, serif', color: 'var(--augury-gold-dim)', marginBottom: '16px' }}>混沌之音 (Raw)</h3>
          <p style={{ opacity: 0.6, lineHeight: 1.8, fontSize: '1.1rem' }}>投入水中的原石，携带着杂念与未解的谜题...</p>
        </div>
        <div className="augury-card" style={{ borderTop: '2px solid var(--augury-gold)', boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)' }}>
          <h3 style={{ fontFamily: 'Cinzel Decorative, serif', color: 'var(--augury-gold)', marginBottom: '16px', textShadow: '0 0 10px var(--augury-shadow-glow)' }}>真理之言 (Refined)</h3>
          <p style={{ opacity: 0.9, lineHeight: 1.8, fontSize: '1.1rem' }}>水面平静后浮现的神谕。AI 已为你剥离幻象，只留本质。</p>
        </div>
      </div>
    </div>
  );
}
