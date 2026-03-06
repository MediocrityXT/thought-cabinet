import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="prism-page">
      <div className="prism-page-header">
        <h1>晶体图谱</h1>
        <p>Crystal Lattice / Blueprint</p>
      </div>

      <div className="prism-card" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Geometric Network Background */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3 }}>
           <path d="M 0 300 L 1200 300" stroke="var(--spectrum-blue)" strokeWidth="1" strokeDasharray="4 4" />
           <path d="M 600 0 L 600 600" stroke="var(--spectrum-blue)" strokeWidth="1" strokeDasharray="4 4" />
           
           {/* Lattice connections */}
           <path d="M 30% 30% L 50% 50% L 70% 30% Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
           <path d="M 30% 70% L 50% 50% L 70% 70% Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>

        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '30%', left: '30%' },
            { top: '30%', left: '70%' },
            { top: '50%', left: '50%' },
            { top: '70%', left: '30%' },
            { top: '70%', left: '70%' },
          ];
          const pos = positions[index % positions.length];
          const isMastered = node.status === 'mastered';
          
          return (
            <div key={node.id} style={{ 
              position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', 
              textAlign: 'center', zIndex: 10 
            }}>
              <div style={{
                width: '60px', height: '60px',
                background: 'var(--bg-lab-card)',
                border: `2px solid ${isMastered ? 'var(--spectrum-green)' : 'rgba(255,255,255,0.2)'}`,
                transform: 'rotate(45deg)',
                margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isMastered ? '0 0 20px rgba(107, 203, 119, 0.2)' : 'none',
                transition: 'all 0.3s ease', cursor: 'pointer'
              }} className="hover:scale-110 hover:shadow-[0_0_30px_rgba(77,150,255,0.4)] hover:border-[var(--spectrum-blue)]">
                <div style={{ transform: 'rotate(-45deg)', width: '30px', height: '30px', background: isMastered ? 'var(--spectrum-green)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
              </div>
              <div style={{ 
                color: isMastered ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontFamily: 'Space Grotesk', textTransform: 'uppercase',
                letterSpacing: '0.1em', background: 'rgba(13,17,23,0.8)', padding: '4px 8px', borderRadius: '4px'
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
