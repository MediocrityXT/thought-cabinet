import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="forge-page">
      <div className="forge-page-header">
        <h1>成品陈列架</h1>
        <p>The Armory / Blueprint</p>
      </div>

      <div className="forge-card" style={{ minHeight: '600px', position: 'relative' }}>
        
        {/* Iron Grid Background */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'linear-gradient(var(--forge-steel) 2px, transparent 2px), linear-gradient(90deg, var(--forge-steel) 2px, transparent 2px)',
          backgroundSize: '100px 100px',
          opacity: 0.2, zIndex: 0
        }}></div>

        {/* Heavy Chains / Connections */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
           <path d="M 30% 30% L 50% 50% L 70% 30%" fill="none" stroke="var(--forge-iron)" strokeWidth="8" />
           <path d="M 30% 30% L 50% 50% L 70% 30%" fill="none" stroke="var(--forge-steel)" strokeWidth="4" />
           
           <path d="M 50% 50% L 50% 80%" fill="none" stroke="var(--forge-iron)" strokeWidth="8" />
           <path d="M 50% 50% L 50% 80%" fill="none" stroke="var(--forge-steel)" strokeWidth="4" />
        </svg>

        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '30%', left: '30%' },
            { top: '30%', left: '70%' },
            { top: '50%', left: '50%' },
            { top: '80%', left: '50%' },
          ];
          const pos = positions[index % positions.length];
          const isMastered = node.status === 'mastered';
          
          return (
            <div key={node.id} style={{ 
              position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', 
              textAlign: 'center', zIndex: 10 
            }}>
               <div style={{
                 width: '120px', padding: '16px',
                 background: isMastered ? 'var(--forge-iron)' : 'var(--forge-charcoal)',
                 border: `2px solid ${isMastered ? 'var(--heat-forged)' : 'var(--forge-steel)'}`,
                 borderRadius: '4px',
                 boxShadow: isMastered ? '0 0 20px rgba(246, 173, 85, 0.2), inset 0 0 10px rgba(246, 173, 85, 0.1)' : '4px 4px 0 rgba(0,0,0,0.5)',
                 fontFamily: 'Oswald', fontSize: '1rem', color: isMastered ? 'var(--heat-forged)' : 'var(--text-ash)',
                 textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s'
               }} className="hover:-translate-y-1">
                 {/* Rivets */}
                 <div style={{ position: 'absolute', top: '4px', left: '4px', width: '4px', height: '4px', background: 'var(--forge-steel)', borderRadius: '50%' }}></div>
                 <div style={{ position: 'absolute', top: '4px', right: '4px', width: '4px', height: '4px', background: 'var(--forge-steel)', borderRadius: '50%' }}></div>
                 <div style={{ position: 'absolute', bottom: '4px', left: '4px', width: '4px', height: '4px', background: 'var(--forge-steel)', borderRadius: '50%' }}></div>
                 <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '4px', height: '4px', background: 'var(--forge-steel)', borderRadius: '50%' }}></div>
                 
                 {node.label}
               </div>
               {!isMastered && <div style={{ fontSize: '0.75rem', color: 'var(--forge-rust)', marginTop: '8px', fontFamily: 'Share Tech Mono' }}>[需继续打磨]</div>}
            </div>
          );
        })}

      </div>
    </div>
  );
}
