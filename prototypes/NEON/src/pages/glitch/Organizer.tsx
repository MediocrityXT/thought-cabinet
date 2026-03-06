import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  return (
    <div className="glitch-page">
      <div className="glitch-page-header">
        <h1 className="glitch-text" data-text="FRAGMENT_REASSEMBLY">FRAGMENT_REASSEMBLY</h1>
        <p style={{ color: 'var(--channel-red)', textTransform: 'uppercase' }}>Memory Defragmentation / Organizer</p>
      </div>

      <div className="glitch-module" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', padding: '40px 0' }}>
          {MOCK_INBOX.map((item, index) => {
            const glitchClasses = ["glitch-hover", "glitch-click"];
            const borderColor = index % 2 === 0 ? 'var(--channel-magenta)' : 'var(--channel-cyan)';
            
            return (
              <div 
                key={item.id} 
                className={`glitch-module ${glitchClasses[index % 2]}`}
                style={{ 
                  width: '200px', 
                  borderTop: `4px solid ${borderColor}`,
                  cursor: 'crosshair'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--glitch-dim)', marginBottom: '8px' }}>[FRAG_{item.id}]</div>
                <div style={{ fontSize: '0.875rem', wordBreak: 'break-word' }}>{item.content}</div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--channel-cyan)', animation: 'blink 2s infinite' }}>
          ↕️ ↕️ ↕️ ↕️
        </div>

        <div className="glitch-module" style={{ borderLeft: '4px solid var(--channel-green)', background: 'rgba(0, 255, 128, 0.05)', textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: 'var(--channel-green)', fontWeight: 'bold', letterSpacing: '0.1em' }}>
            [DETECTED PATTERN: Chaotic Synchronization]
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: 'auto' }}>
          <button className="glitch-btn">MERGE</button>
          <button className="glitch-btn" style={{ borderColor: 'var(--glitch-dim)', color: 'var(--glitch-dim)' }}>IGNORE</button>
          <button className="glitch-btn" style={{ borderColor: 'var(--channel-red)', color: 'var(--channel-red)' }}>MARK AS NOISE</button>
        </div>

      </div>
    </div>
  );
}
