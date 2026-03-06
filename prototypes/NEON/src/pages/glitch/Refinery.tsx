import React from 'react';
import { MOCK_PROJECTS } from '../../data/mock';

export default function Refinery() {
  return (
    <div className="glitch-page">
      <div className="glitch-page-header">
        <h1 className="glitch-text" data-text="DECODING">DECODING</h1>
        <p style={{ color: 'var(--channel-red)', textTransform: 'uppercase' }}>In Progress... / Refinery</p>
      </div>

      <div className="glitch-module" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ color: 'var(--channel-cyan)' }}>Source:</div>
          <input 
            type="text" 
            placeholder="[████████████████████] Awaiting input..." 
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--glitch-muted)',
              color: 'var(--glitch-white)',
              padding: '12px 16px',
              fontFamily: 'Courier Prime, monospace',
              outline: 'none'
            }}
          />
          <button className="glitch-btn">Decrypt</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glitch-module" style={{ borderTop: '4px solid var(--channel-red)' }}>
          <h3 style={{ color: 'var(--glitch-dim)', marginBottom: '16px' }}>RAW_DATA</h3>
          <div style={{ fontFamily: 'Courier Prime, monospace', color: 'var(--channel-red)', opacity: 0.7, wordBreak: 'break-all', lineHeight: 1.6 }}>
            {Array.from({ length: 200 }).map(() => String.fromCharCode(33 + Math.random() * 94)).join('')}
          </div>
        </div>

        <div className="glitch-module" style={{ borderTop: '4px solid var(--channel-cyan)' }}>
          <h3 style={{ color: 'var(--glitch-dim)', marginBottom: '16px' }}>DECODED_OUTPUT</h3>
          <div style={{ color: 'var(--glitch-white)', lineHeight: 1.8, marginBottom: '24px' }}>
            System ready for structural analysis. Awaiting raw data feed to synthesize core arguments and identify potential paradigm shifts.
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--channel-magenta)' }}>
              Decryption Quality: 87% [▓▓▓▓▓▓▓▓▓░]
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="glitch-btn" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Extract</button>
              <button className="glitch-btn" style={{ padding: '8px 16px', fontSize: '0.75rem', borderColor: 'var(--channel-red)', color: 'var(--channel-red)' }}>Corrupt?</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
