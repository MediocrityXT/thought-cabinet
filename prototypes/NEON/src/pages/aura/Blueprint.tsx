import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>🌌 脉络 · 认知蓝图</h1>
        <p>Neural Network / Blueprint</p>
      </div>

      <div className="aura-card" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Connection Lines (Synapses) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M 30% 30% Q 50% 10% 70% 30% T 50% 60% T 30% 30%" fill="none" stroke="var(--aura-purple)" strokeWidth="2" opacity="0.3" />
          <path d="M 50% 60% Q 70% 80% 30% 80% T 30% 30%" fill="none" stroke="var(--aura-cyan)" strokeWidth="1" opacity="0.4" strokeDasharray="5,5" />
        </svg>

        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '30%', left: '30%' },
            { top: '30%', left: '70%' },
            { top: '60%', left: '50%' },
            { top: '80%', left: '30%' },
          ];
          const pos = positions[index % positions.length];
          const isMastered = node.status === 'mastered';
          
          return (
            <div key={node.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
               <div className="glowing-orb" style={{
                 width: isMastered ? '40px' : '20px',
                 height: isMastered ? '40px' : '20px',
                 background: isMastered ? 'radial-gradient(circle, var(--aura-cyan) 0%, transparent 80%)' : 'rgba(138,43,226,0.3)',
                 margin: '0 auto 8px',
                 animationDelay: `${index * 0.7}s`
               }}></div>
               <div style={{ color: isMastered ? 'var(--aura-cyan)' : 'var(--aura-text-dim)', fontSize: '0.875rem' }}>
                 {node.label}
               </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
