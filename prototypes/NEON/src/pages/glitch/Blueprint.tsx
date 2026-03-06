import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="glitch-page">
      <div className="glitch-page-header">
        <h1 className="glitch-text" data-text="NEURAL_NETWORK">NEURAL_NETWORK</h1>
        <p style={{ color: 'var(--channel-red)', textTransform: 'uppercase' }}>Cognitive Topology / Blueprint</p>
      </div>

      <div className="glitch-module" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(var(--glitch-muted) 1px, transparent 1px), linear-gradient(90deg, var(--glitch-muted) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}></div>

        {/* Glitch Connections (SVG) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M 30% 30% L 50% 50%" stroke="var(--channel-cyan)" strokeWidth="2" fill="none" />
          <path d="M 30% 30% L 50% 50%" stroke="var(--channel-red)" strokeWidth="1" fill="none" transform="translate(2, -2)" opacity="0.5" />
          
          <path d="M 70% 30% L 50% 50%" stroke="var(--channel-magenta)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <path d="M 70% 70% L 50% 50%" stroke="var(--glitch-dim)" strokeWidth="1" fill="none" />
        </svg>

        {/* Nodes */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
          <div className="glitch-click" style={{ 
            width: '60px', height: '60px', 
            background: 'var(--glitch-black)', 
            border: '2px solid var(--channel-cyan)',
            boxShadow: '0 0 10px var(--channel-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            cursor: 'pointer'
          }}>
            <div style={{ width: '30px', height: '30px', background: 'var(--channel-cyan)', animation: 'blink 2s infinite' }}></div>
          </div>
          <div style={{ color: 'var(--channel-cyan)', fontFamily: 'Orbitron', fontSize: '0.875rem' }}>CORE_CONCEPT</div>
        </div>

        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '30%', left: '30%' },
            { top: '30%', left: '70%' },
            { top: '70%', left: '70%' },
            { top: '70%', left: '30%' }
          ];
          const pos = positions[index % positions.length];
          const color = node.status === 'mastered' ? 'var(--channel-green)' : (node.status === 'learning' ? 'var(--channel-magenta)' : 'var(--glitch-dim)');
          const isGlitching = index % 2 === 0;

          return (
            <div key={node.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
               <div style={{ 
                  width: '40px', height: '40px', 
                  background: 'var(--glitch-black)', 
                  border: `2px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px',
                  cursor: 'crosshair',
                  animation: isGlitching ? 'border-glitch 3s infinite' : 'none'
                }}>
                  <div style={{ width: '10px', height: '10px', background: color }}></div>
                </div>
                <div className={isGlitching ? 'glitch-hover' : ''} style={{ color: color, fontSize: '0.75rem', maxWidth: '120px' }}>
                  [{node.label.toUpperCase()}]
                </div>
            </div>
          );
        })}

        <div style={{ position: 'absolute', bottom: '24px', left: '24px', color: 'var(--channel-red)', fontSize: '0.75rem', border: '1px solid var(--channel-red)', padding: '8px' }}>
          ERROR: SECTOR 7 UNREACHABLE. <br/>
          ATTEMPTING TO RECONNECT...
        </div>

      </div>
    </div>
  );
}
