import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="sky-page">
      <div className="sky-page-header">
        <h1>✨ 星图 · 认知蓝图</h1>
        <p>Constellation / Knowledge Blueprint</p>
      </div>

      <div className="sky-card" style={{ minHeight: '600px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(2,132,199,0.05) 0%, transparent 60%)' }}></div>

        {/* Constellation lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M 20% 30% L 50% 50%" stroke="var(--sky-text-muted)" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
          <path d="M 80% 30% L 50% 50%" stroke="var(--sky-primary)" strokeWidth="2" opacity="0.6" />
          <path d="M 30% 70% L 50% 50%" stroke="var(--sky-text-muted)" strokeWidth="1" opacity="0.3" />
        </svg>

        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '30%', left: '20%' },
            { top: '50%', left: '50%' },
            { top: '30%', left: '80%' },
            { top: '70%', left: '30%' }
          ];
          const pos = positions[index % positions.length];
          const isMastered = node.status === 'mastered';
          
          return (
            <div key={node.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div 
                className="float-anim"
                style={{ 
                  width: isMastered ? '24px' : '16px', 
                  height: isMastered ? '24px' : '16px', 
                  background: isMastered ? 'var(--sky-primary)' : 'white', 
                  borderRadius: '50%', 
                  margin: '0 auto 8px',
                  boxShadow: isMastered ? '0 0 15px var(--sky-primary)' : '0 0 10px rgba(0,0,0,0.1)',
                  animationDelay: `${index * 0.5}s`,
                  border: isMastered ? 'none' : '2px solid var(--sky-text-muted)'
                }}
              ></div>
              <div style={{ color: 'var(--sky-text)', fontSize: '0.875rem', fontWeight: isMastered ? 600 : 400 }}>
                {node.label}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
