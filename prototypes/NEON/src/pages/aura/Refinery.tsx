import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Refinery() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>Refinery</h1>
        <p>Distill raw thoughts into clarity.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        
        {/* Input Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="aura-card" style={{ padding: '0', overflow: 'hidden' }}>
            <textarea 
              placeholder="Paste text, URLs, or type your thoughts here..."
              style={{
                width: '100%', height: '200px', border: 'none', background: 'transparent',
                padding: '32px', fontSize: '1.1rem', color: 'var(--aura-text)',
                resize: 'none', outline: 'none', fontFamily: 'inherit'
              }}
            />
            <div style={{ padding: '16px 32px', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid var(--aura-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--aura-text-muted)', fontSize: '0.85rem' }}>Ready for processing</span>
              <button className="aura-btn">Synthesize</button>
            </div>
          </div>

          <div className="aura-card" style={{ background: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '24px', color: 'var(--aura-purple)' }}>Synthesized Output</h3>
            <div style={{ lineHeight: 1.8, color: 'var(--aura-text)' }}>
              <p>The core concept revolves around utilizing <strong>liquid gradients</strong> and <strong>glassmorphism</strong> to create a sense of breathing space.</p>
              <ul style={{ paddingLeft: '20px', marginTop: '16px', color: 'var(--aura-text-muted)' }}>
                <li>Reduce cognitive load via whitespace.</li>
                <li>Use subtle animations for state changes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="aura-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--aura-blue)' }}>✦</span> AI Assistant
          </h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', padding: '16px', borderRadius: '12px', borderBottomLeftRadius: '0' }}>
              I've extracted the main points. Would you like me to format this as a Zettelkasten note?
            </div>
          </div>

          <div style={{ marginTop: '24px', position: 'relative' }}>
             <input type="text" placeholder="Ask follow-up..." style={{ width: '100%', padding: '12px 16px', borderRadius: '99px', border: '1px solid var(--aura-border)', background: 'white', outline: 'none', fontSize: '0.9rem' }} />
             <button style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', background: 'var(--aura-blue)', color: 'white', border: 'none', borderRadius: '99px', padding: '0 16px', cursor: 'pointer' }}>Ask</button>
          </div>
        </div>

      </div>
    </div>
  );
}
