import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>Blueprint</h1>
        <p>Your knowledge architecture.</p>
      </div>

      <div className="aura-card" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Soft connection lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d="M 30% 30% Q 50% 10% 70% 30% T 50% 60% T 30% 30%" fill="none" stroke="url(#gradient-line)" strokeWidth="2" opacity="0.5" />
          <path d="M 50% 60% Q 70% 80% 30% 80% T 30% 30%" fill="none" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="2" strokeDasharray="6,6" />
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
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
            <div key={node.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
               
               <div style={{
                 width: isMastered ? '64px' : '48px',
                 height: isMastered ? '64px' : '48px',
                 background: isMastered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                 backdropFilter: 'blur(10px)',
                 border: isMastered ? 'none' : '1px solid var(--aura-border)',
                 borderRadius: '50%',
                 margin: '0 auto 12px',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 boxShadow: isMastered ? '0 10px 30px rgba(139, 92, 246, 0.15)' : 'none',
                 transition: 'all 0.3s ease', cursor: 'pointer'
               }} className="hover:scale-110">
                 {isMastered && <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aura-purple) 0%, var(--aura-pink) 100%)' }}></div>}
               </div>

               <div style={{ 
                 color: isMastered ? 'var(--aura-text)' : 'var(--aura-text-muted)', 
                 fontSize: '0.85rem', fontWeight: isMastered ? 500 : 400,
                 background: 'rgba(255,255,255,0.6)', padding: '4px 12px', borderRadius: '99px',
                 backdropFilter: 'blur(4px)'
               }}>
                 {node.label}
               </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
