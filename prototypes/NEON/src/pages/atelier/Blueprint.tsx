import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="atelier-page">
      <div className="atelier-page-header">
        <h1>手稿与蓝图</h1>
        <p className="ink-text">The Blueprint / Knowledge Graph</p>
      </div>

      <div className="atelier-card" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden', background: '#F5F5F0' }}>
        
        {/* Grid Background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#D4D2CD 1px, transparent 1px), linear-gradient(90deg, #D4D2CD 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3, zIndex: 0 }}></div>

        {/* Hand-drawn Connections (SVG) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <path d="M 30% 30% Q 50% 20% 70% 30%" fill="none" stroke="var(--atelier-ink)" strokeWidth="2" strokeLinecap="round" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }} />
          <path d="M 50% 60% Q 60% 45% 70% 30%" fill="none" stroke="var(--atelier-accent-main)" strokeWidth="2" strokeDasharray="8,8" strokeLinecap="round" />
          <path d="M 30% 30% Q 40% 45% 50% 60%" fill="none" stroke="var(--atelier-ink)" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Nodes */}
        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '30%', left: '30%' },
            { top: '30%', left: '70%' },
            { top: '60%', left: '50%' },
            { top: '80%', left: '30%' }
          ];
          const pos = positions[index % positions.length];
          const isMastered = node.status === 'mastered';
          
          return (
            <div key={node.id} style={{ 
              position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', 
              textAlign: 'center', zIndex: 10,
              background: 'white', border: '2px solid var(--atelier-border)',
              padding: '12px 24px', borderRadius: '4px',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.05)',
              fontFamily: 'Libre Franklin', fontWeight: 600,
              color: isMastered ? 'var(--atelier-text-dark)' : 'var(--atelier-text-muted)',
              borderColor: isMastered ? 'var(--atelier-accent-main)' : 'var(--atelier-border)'
            }}>
               {node.label}
               {isMastered && <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'var(--atelier-accent-green)', fontSize: '1.2rem', fontFamily: 'Caveat', background: 'white', borderRadius: '50%', width: '24px', height: '24px', border: '1px solid var(--atelier-border)' }}>✓</div>}
            </div>
          );
        })}

        {/* Marginalia */}
        <div style={{ position: 'absolute', bottom: '40px', right: '40px', fontFamily: 'Caveat', color: 'var(--atelier-red)', fontSize: '1.5rem', transform: 'rotate(-5deg)', maxWidth: '200px' }}>
          * 需要在这一块建立更强的连接...
        </div>

      </div>
    </div>
  );
}
